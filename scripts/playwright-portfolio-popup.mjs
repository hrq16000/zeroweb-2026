#!/usr/bin/env node
/**
 * E2E do pop-up de captação da 0WEB em /portfolio/<slug>.
 *
 * Garante, para todos os clientes registrados:
 *  - o pop-up aparece EXATAMENTE UMA VEZ (nunca duplicado pela rota + cliente);
 *  - aparece tanto em visita normal quanto em ambiente com `?preview=1`
 *    (parâmetro genérico não pode silenciar overlays da hospedagem);
 *  - continua silenciado no preview interno (`?0web_preview=1`);
 *  - dispara uma única vez por sessão;
 *  - captura screenshot do card para verificação visual.
 *
 * Uso: node scripts/playwright-portfolio-popup.mjs
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const shotDir = resolve(process.cwd(), "seo-reports/popup-shots");
mkdirSync(shotDir, { recursive: true });

const clients = JSON.parse(readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"));
const slugs = clients.map((c) => c.slug);

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

async function countPopups(url, { expect = 1, waitMs = 20000 } = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1200 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  if (expect > 0) {
    // Timer padrão do pop-up é 10s; espera orientada a evento com folga para
    // compilação a frio do dev server.
    await page
      .locator('[data-testid="portfolio-upsell"]')
      .first()
      .waitFor({ state: "visible", timeout: waitMs })
      .catch(() => {});
  } else {
    await page.waitForTimeout(waitMs);
  }
  const count = await page.locator('[data-testid="portfolio-upsell"]').count();
  return { context, page, count };
}

for (const slug of slugs) {
  const url = `${baseUrl}/portfolio/${slug}`;
  const before = failures.length;
  try {
    // Warm-up: primeira compilação da rota não deve contar como falha.
    const warm = await countPopups(url, { waitMs: 25000 });
    await warm.context.close();
    const { context, page, count } = await countPopups(url);
    if (count !== 1) {
      failures.push(`/portfolio/${slug}: esperado 1 pop-up, encontrado ${count}`);
    } else {
      await page
        .locator('[data-testid="portfolio-upsell"]')
        .screenshot({ path: join(shotDir, `${slug}.png`) });
      // Uma vez por sessão: recarregar não pode exibir de novo.
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(15000);
      const again = await page.locator('[data-testid="portfolio-upsell"]').count();
      if (again !== 0) failures.push(`/portfolio/${slug}: pop-up reapareceu na mesma sessão`);
    }
    await context.close();

    // Ambiente de preview externo (?preview=1) NÃO pode silenciar o pop-up.
    const previewRun = await countPopups(`${url}?preview=1`);
    if (previewRun.count !== 1) {
      failures.push(`/portfolio/${slug}?preview=1: esperado 1 pop-up, encontrado ${previewRun.count}`);
    }
    await previewRun.context.close();

    // Preview interno da 0WEB continua silencioso.
    const internal = await countPopups(`${url}?0web_preview=1`, { expect: 0, waitMs: 13000 });
    if (internal.count !== 0) {
      failures.push(`/portfolio/${slug}?0web_preview=1: overlay deveria estar silenciado`);
    }
    await internal.context.close();

    if (failures.length === before) console.log(`[popup] /portfolio/${slug} OK`);
    else console.error(`[popup] /portfolio/${slug} FALHOU`);
  } catch (error) {
    failures.push(`/portfolio/${slug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await browser.close();

if (failures.length) {
  console.error(`\n[popup] FAIL — ${failures.length} problema(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n[popup] OK — ${slugs.length} site(s) com pop-up único e consistente`);
