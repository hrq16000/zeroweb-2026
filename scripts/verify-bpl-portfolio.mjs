#!/usr/bin/env node
// Visual QA BPL: evidencias reais; nao altera manifesto nem marca NO-BRAND PASS.
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";
const dir = "seo-reports/bpl-visual";
const slug = "bpl-locacoes-de-brinquedos";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
let failures = 0;

async function noBrand(context, candidate, width) {
  const page = await context.newPage();
  try {
    const response = await page.goto(base + "/portfolio/" + candidate + "?0web_preview=1", { waitUntil: "domcontentloaded", timeout: 30000 });
    assert.equal(response?.status(), 200, "Comparacao com pagina real " + candidate);
    await page.locator("h1").first().waitFor();
    await page.evaluate(() => document.fonts?.ready);
    const shape = await page.evaluate(() => {
      const root = document.querySelector("main") || document.body;
      return Array.from(root.children).filter(el => el.getBoundingClientRect().height > 50).slice(0, 9).map(el => ({
        h: Math.round(el.getBoundingClientRect().height),
        articles: el.querySelectorAll("article").length,
        images: el.querySelectorAll("img").length,
        details: el.querySelectorAll("details").length,
        h2: el.querySelectorAll("h2").length,
      }));
    });
    await page.addStyleTag({content: 'html { filter: grayscale(1) !important; } *, *::before, *::after { background-image:none!important; box-shadow:none!important; text-shadow:none!important; } img,svg,video,picture { visibility:hidden!important; } h1,h2,h3,h4,p,span,a,button,small,strong,address { color:transparent!important; }'});
    await page.screenshot({ path: dir + "/nobrand-" + candidate + "-" + width + ".png", fullPage: true, animations: "disabled", timeout: 30000 });
    console.log("[bpl-nobrand] " + width + "px " + candidate + " geometry=" + JSON.stringify(shape));
  } finally { await page.close(); }
}

try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : width === 768 ? 1024 : 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", err => errors.push(err.message));
    try {
      const response = await page.goto(base + "/portfolio/" + slug + "?0web_preview=1", { waitUntil: "domcontentloaded", timeout: 30000 });
      assert.equal(response?.status(), 200, "A pagina BPL precisa responder 200");
      await page.getByRole("heading", { level: 1 }).first().waitFor();
      assert.match(await page.getByRole("heading", { level: 1 }).first().innerText(), /sua festa pede/i);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://0web.com.br/portfolio/" + slug);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content") || "", /noindex/, "Draft precisa continuar noindex");
      const hero = page.locator('img[alt*="Ilustração editorial de uma cama elástica"]').first();
      await hero.waitFor();
      assert.ok(await hero.evaluate(el => el.complete && el.naturalWidth > 20), "Ilustracao principal carregada");
      assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true);
      await page.evaluate(() => document.fonts?.ready);
      await page.screenshot({ path: dir + "/" + width + ".png", fullPage: true, animations: "disabled", timeout: 30000 });
      const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
      assert.ok(overflow <= 2, "Overflow: " + overflow);
      const button = page.locator('button[data-funnel-cta="portfolio"][data-funnel-client="' + slug + '"]').first();
      assert.equal(await button.isVisible(), true, "Botao do funil isolado visivel");
      await button.click();
      await page.getByRole("dialog").waitFor();
      await page.getByRole("button", { name: "Fechar mini questionário" }).click();
      assert.equal(errors.length, 0, "JS: " + errors.join("; "));
      console.log("[bpl-qa] PASS " + width + "px SSR, SEO draft, assets, funil, reduced motion, overflow");
    } catch (e) {
      failures++;
      console.error("[bpl-qa] FAIL " + width + "px: " + (e instanceof Error ? e.message : String(e)));
      await page.screenshot({ path: dir + "/" + width + "-failure.png", fullPage: true }).catch(() => {});
    } finally { await page.close(); }

    if (width !== 768) {
      try {
        for (const candidate of [slug, "cantinho-da-tia-mari", "agropet-filt"]) await noBrand(context, candidate, width);
        console.log("[bpl-nobrand] EVIDENCE 390/1440; revisao perceptual independente obrigatoria antes de PASS");
      } catch (e) {
        failures++;
        console.error("[bpl-nobrand] FAIL " + width + "px: " + (e instanceof Error ? e.message : String(e)));
      }
    }
    await context.close();
  }
} finally { await browser.close(); }
process.exit(failures ? 1 : 0);
