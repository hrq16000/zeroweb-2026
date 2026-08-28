#!/usr/bin/env node
/**
 * Regressão visual da Home, do índice e das rotas `/portfolio/:slug`
 * (desktop + tablet + mobile).
 *
 * Primeira execução cria as baselines em tests/visual/baseline/.
 * Execuções seguintes comparam pixel a pixel e falham acima do limiar,
 * gravando o diff em seo-reports/visual/.
 *
 * Robustez (motivo da correção): o script original abria um contexto novo por
 * captura e esperava `networkidle` + 2,5 s em ~93 combinações, estourando o
 * tempo do CI — o browser era encerrado no meio e o run falhava com erro de
 * `newContext`. Agora há um contexto por viewport, paralelismo controlado,
 * timeout por rota e animações desligadas para capturas determinísticas.
 *
 * Uso:
 *   node scripts/playwright-visual-regression.mjs            # compara
 *   node scripts/playwright-visual-regression.mjs --update   # regrava baselines
 *   VISUAL_ONLY=home,rm-fretes node scripts/playwright-visual-regression.mjs
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PNG } from "pngjs";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const update = process.argv.includes("--update");
const threshold = Number(process.env.VISUAL_THRESHOLD ?? 0.02); // 2% dos pixels
const routeTimeout = Number(process.env.VISUAL_ROUTE_TIMEOUT_MS ?? 20000);
const concurrency = Math.max(1, Number(process.env.VISUAL_CONCURRENCY ?? 3));
const only = (process.env.VISUAL_ONLY ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const baselineDir = resolve(process.cwd(), "tests/visual/baseline");
const outDir = resolve(process.cwd(), "seo-reports/visual");
mkdirSync(baselineDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const clients = JSON.parse(readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"));
const allRoutes = [
  { path: "/", name: "home" },
  { path: "/portfolio", name: "portfolio-index" },
  ...clients.map((c) => ({ path: `/portfolio/${c.slug}`, name: c.slug })),
];
const routes = only.length ? allRoutes.filter((r) => only.includes(r.name)) : allRoutes;
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 393, height: 852 },
];

/**
 * CSS injetado antes do primeiro paint.
 *  - elimina animações, transições e caret piscando;
 *  - oculta (sem tirar do fluxo) blocos legitimamente voláteis, que mudam por
 *    dados do banco ou por tempo: destaques/spotlight da home, banner de
 *    consentimento, chatbot e demais camadas fixas (CTAs flutuantes, toasts).
 *    Sem isso a home acusava ~20% de diferença entre duas execuções idênticas.
 */
const FREEZE_CSS = `
*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
  caret-color: transparent !important;
}
#servicos-destaque,
#spotlight,
[data-visual-volatile="true"] {
  visibility: hidden !important;
}
`;

/** Camadas fixas (chatbot, cookies, CTAs flutuantes) são removidas do paint. */
const HIDE_FIXED_LAYERS = `
  for (const el of document.querySelectorAll('body *')) {
    const pos = getComputedStyle(el).position;
    if (pos === 'fixed' || pos === 'sticky') el.style.visibility = 'hidden';
  }
`;


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
const compared = [];

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

/**
 * Overrides de A/B fixados na variante "A".
 * Sem isso a home sorteava hero/CTA/spotlight a cada execução e o diff
 * acusava até 20% de pixels alterados sem nenhuma regressão real.
 */
const AB_OVERRIDES = JSON.stringify({
  hero_copy: "A",
  hero_cta: "A",
  hero_primary_cta: "A",
  home_spotlight_copy: "A",
  testimonials_headline: "A",
});

async function capture(context, route, viewport) {
  const key = `${route.name}-${viewport.name}.png`;
  const page = await context.newPage();
  page.setDefaultTimeout(routeTimeout);
  try {
    await page.addInitScript(
      (ab) => {
        try {
          localStorage.setItem("0web_ab_winner_v1", ab);
        } catch {
          /* modo privado: segue com variante sorteada */
        }
      },
      AB_OVERRIDES,
    );
    // `0web_preview=1` silencia overlays da hospedagem: screenshots estáveis.
    await page.goto(`${baseUrl}${route.path}?0web_preview=1`, {
      waitUntil: "domcontentloaded",
      timeout: routeTimeout,
    });
    await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});
    // Estabiliza a captura: imagens decodificadas + fontes prontas, com teto de tempo.
    await page
      .waitForFunction(() => Array.from(document.images).every((img) => img.complete), undefined, {
        timeout: Math.min(8000, routeTimeout),
      })
      .catch(() => {});
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    await page.waitForTimeout(600);
    await page.evaluate(HIDE_FIXED_LAYERS).catch(() => {});
    const buffer = await page.screenshot({ timeout: routeTimeout });
    const baselinePath = join(baselineDir, key);

    if (update || !existsSync(baselinePath)) {
      writeFileSync(baselinePath, buffer);
      created.push(key);
      return;
    }
    const ratio = diffRatio(PNG.sync.read(readFileSync(baselinePath)), PNG.sync.read(buffer));
    compared.push(key);
    if (ratio > threshold) {
      writeFileSync(join(outDir, key), buffer);
      failures.push(
        `${key}: ${(ratio * 100).toFixed(2)}% de pixels alterados (limite ${(threshold * 100).toFixed(0)}%)`,
      );
    } else {
      console.log(`[visual] ${key} OK (${(ratio * 100).toFixed(2)}%)`);
    }
  } catch (error) {
    failures.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await page.close().catch(() => {});
  }
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
  });
  try {
    const queue = [...routes];
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      for (let route = queue.shift(); route; route = queue.shift()) {
        await capture(context, route, viewport);
      }
    });
    await Promise.all(workers);
  } finally {
    await context.close().catch(() => {});
  }
}

await browser.close();

if (created.length) console.log(`[visual] baselines gravadas: ${created.length}`);
if (failures.length) {
  console.error(`\n[visual] FAIL — ${failures.length} diferença(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n[visual] OK — ${compared.length} comparação(ões) dentro do limiar, ${created.length} baseline(s) nova(s)`);
