#!/usr/bin/env node
// QA factual para PR #542. Apenas captura/inspeciona; não aprova originalidade.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.FRAN_QA_URL ?? "http://127.0.0.1:4173";
const dest = "seo-reports/visual/fran-pr542";
mkdirSync(dest, { recursive: true });
const expected = "Salgados da Fran";
const slugs = ["salgados-da-fran", "mimo-salgados-doces", "manu-pasteis"];
const widths = [390, 768, 1440];
const report = { purpose: "evidência real, NÃO aprovação NO-BRAND", createdAt: new Date().toISOString(), source: "Playwright Chromium", screenshots: [], failures: [] };
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
try {
  for (const slug of slugs) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : width === 768 ? 1024 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
      try {
        const response = await page.goto(`${baseUrl}/portfolio/${slug}`, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.locator("body").waitFor({ state: "visible", timeout: 15000 });
        await page.evaluate(async () => { await document.fonts.ready; });
        const htmlStatus = response?.status() ?? 0;
        const h1 = await page.locator("h1").first().textContent().catch(() => "");
        const overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        const isFran = slug === "salgados-da-fran";
        const ownRoot = await page.locator('[data-portfolio-client="salgados-da-fran"]').count();
        const cta = isFran ? await page.locator("button, a").filter({ hasText: /Consultar uma encomenda|Consultar opções e valores|Quero consultar a Fran/i }).count() : null;
        const health = { slug, width, status: htmlStatus, h1: h1?.trim() ?? "", overflow, ownRoot, cta, errors: errors.slice(0, 15) };
        const branded = join(dest, `${slug}-${width}.png`);
        await page.screenshot({ path: branded, fullPage: true, animations: "disabled" });
        // Remove pistas de marca e cor sem alterar layout; documento revisável,
        // NÃO avaliação automática de similaridade.
        await page.addStyleTag({ content: `
          html { filter: grayscale(1) !important; }
          img[src*="/marca."], img[src*="/logo."] { opacity: 0 !important; }
          [data-portfolio-client="salgados-da-fran"] h1 { color: #555 !important; }
          *, *::before, *::after { animation: none !important; transition: none !important; }
        ` });
        const noBrand = join(dest, `${slug}-${width}-no-brand.png`);
        await page.screenshot({ path: noBrand, fullPage: true, animations: "disabled" });
        report.screenshots.push({ ...health, brand: branded, noBrand, noBrandResult: "PENDING_MANUAL_REVIEW" });
        if (htmlStatus !== 200) report.failures.push(`${slug} ${width}: HTTP ${htmlStatus}`);
        if (!h1?.trim()) report.failures.push(`${slug} ${width}: h1 ausente`);
        if (overflow.scroll > overflow.client + 2) report.failures.push(`${slug} ${width}: overflow ${overflow.scroll} > ${overflow.client}`);
        if (isFran && ownRoot !== 1) report.failures.push(`${slug} ${width}: root da Fran ausente`);
        if (isFran && !cta) report.failures.push(`${slug} ${width}: CTA de encomenda ausente`);
        if (isFran && !h1?.includes("Fran")) report.failures.push(`${slug} ${width}: h1 inesperado: ${h1}`);
        // Erros JS locais são evidência; falha se houver erro da página da Fran.
        if (isFran && errors.length > 0) report.failures.push(`${slug} ${width}: console/pageerror: ${errors[0]}`);
      } catch (e) {
        report.failures.push(`${slug} ${width}: ${String(e)}`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  writeFileSync(join(dest, "report.json"), JSON.stringify(report, null, 2) + "\n");
}
console.log("[fran-qa] screenshots capturados:", report.screenshots.length, "falhas:", report.failures.length);
if (report.failures.length) {
  for (const issue of report.failures) console.error("[fran-qa] FAIL", issue);
  process.exitCode = 1;
}
