#!/usr/bin/env node
/**
 * Regressão visual das rotas de /portfolio (desktop + mobile).
 *
 * Primeira execução cria as baselines em tests/visual/baseline/.
 * Execuções seguintes comparam pixel a pixel e falham acima do limiar,
 * gravando o diff em seo-reports/visual/.
 *
 * Uso:
 *   node scripts/playwright-visual-regression.mjs            # compara
 *   node scripts/playwright-visual-regression.mjs --update   # regrava baselines
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PNG } from "pngjs";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const update = process.argv.includes("--update");
const threshold = Number(process.env.VISUAL_THRESHOLD ?? 0.02); // 2% dos pixels
const baselineDir = resolve(process.cwd(), "tests/visual/baseline");
const outDir = resolve(process.cwd(), "seo-reports/visual");
mkdirSync(baselineDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const clients = JSON.parse(readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"));
const routes = [
  { path: "/portfolio", name: "portfolio-index" },
  ...clients.map((c) => ({ path: `/portfolio/${c.slug}`, name: c.slug })),
];
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 393, height: 852 },
];

const bundled = chromium.executablePath();
const root = "/opt/ms-playwright";
const installed = existsSync(root)
  ? readdirSync(root)
      .filter((n) => n.startsWith("chromium-") && !n.includes("headless"))
      .map((n) => join(root, n, "chrome-linux", "chrome"))
      .find((p) => existsSync(p))
  : undefined;

const browser = await chromium.launch({
  headless: true,
  executablePath: existsSync(bundled) ? bundled : installed,
});

const failures = [];
const created = [];

function diffRatio(a, b) {
  if (a.width !== b.width || a.height !== b.height) return 1;
  let diff = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
    const db = Math.abs(a.data[i + 2] - b.data[i + 2]);
    if (dr + dg + db > 30) diff += 1;
  }
  return diff / (a.width * a.height);
}

for (const route of routes) {
  for (const viewport of viewports) {
    const key = `${route.name}-${viewport.name}.png`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    try {
      // `0web_preview=1` silencia overlays da hospedagem: screenshots estáveis.
      await page.goto(`${baseUrl}${route.path}?0web_preview=1`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      const buffer = await page.screenshot();
      const baselinePath = join(baselineDir, key);

      if (update || !existsSync(baselinePath)) {
        writeFileSync(baselinePath, buffer);
        created.push(key);
      } else {
        const ratio = diffRatio(PNG.sync.read(readFileSync(baselinePath)), PNG.sync.read(buffer));
        if (ratio > threshold) {
          writeFileSync(join(outDir, key), buffer);
          failures.push(`${key}: ${(ratio * 100).toFixed(2)}% de pixels alterados (limite ${(threshold * 100).toFixed(0)}%)`);
        } else {
          console.log(`[visual] ${key} OK (${(ratio * 100).toFixed(2)}%)`);
        }
      }
    } catch (error) {
      failures.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await context.close();
    }
  }
}

await browser.close();

if (created.length) console.log(`[visual] baselines gravadas: ${created.length}`);
if (failures.length) {
  console.error(`\n[visual] FAIL — ${failures.length} diferença(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n[visual] OK — ${routes.length * viewports.length} captura(s) dentro do limiar`);
