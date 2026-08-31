#!/usr/bin/env node
/**
 * Auditoria automática de acessibilidade (axe-core) nas rotas críticas.
 *
 * Falha o CI em violações `serious`/`critical` e reporta as demais.
 * Uso: node scripts/audit-accessibility.mjs [--all]
 */
import { chromium } from "playwright";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = readFileSync(axePath, "utf8");

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const clients = JSON.parse(readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"));
const routes = process.argv.includes("--all")
  ? ["/", "/servicos", "/portfolio", ...clients.map((c) => `/portfolio/${c.slug}`)]
  : ["/", "/servicos"];

const outDir = resolve(process.cwd(), "seo-reports");
mkdirSync(outDir, { recursive: true });

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

const report = [];
let blocking = 0;

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1200 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${route}?0web_preview=1`, { waitUntil: "domcontentloaded" });
  // Widgets flutuantes entram com fade-in atrasado. Medir contraste no meio da
  // transição gera falso positivo `color-contrast`, então esperamos as
  // animações em curso terminarem antes de rodar o axe.
  await page.waitForTimeout(1500);
  await page
    .evaluate(
      () =>
        Promise.race([
          Promise.allSettled(document.getAnimations().map((a) => a.finished)),
          new Promise((resolve) => setTimeout(resolve, 6000)),
        ]),
    )
    .catch(() => undefined);
  await page.waitForTimeout(500);
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => {
    // @ts-expect-error axe injetado em runtime
    return await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
  });

  const violations = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 4).map((n) => n.target.join(" ")),
  }));
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  blocking += serious.length;

  report.push({ route, violations });
  console.log(`[a11y] ${route}: ${violations.length} violação(ões), ${serious.length} bloqueante(s)`);
  for (const v of violations) {
    console.log(`   - [${v.impact}] ${v.id} (${v.nodes}x): ${v.help}`);
    for (const t of v.targets) console.log(`       ${t}`);
  }

  await context.close();
}

await browser.close();
writeFileSync(join(outDir, "a11y-report.json"), JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));

if (blocking > 0) {
  console.error(`\n[a11y] FAIL — ${blocking} violação(ões) serious/critical`);
  process.exit(1);
}
console.log("\n[a11y] OK — nenhuma violação serious/critical");
