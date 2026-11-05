#!/usr/bin/env node
/**
 * QA visual da Agropet Filt. Não envia dados pessoais, não cria leads.
 * Gera capturas reais em 390 e 1440 px para o gate de originalidade.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";
const out = "seo-reports/agropet-visual";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
let failure = 0;
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto(base + "/portfolio/agropet-filt?0web_preview=1", { waitUntil: "domcontentloaded", timeout: 30000 });
    try {
      assert.equal(response?.status(), 200, "página deve responder 200");
      await page.getByRole("heading", { level: 1 }).waitFor();
      assert.match(await page.getByRole("heading", { level: 1 }).innerText(), /Do bico ao focinho/i);
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      assert.match(robots || "", /noindex/, "não pode indexar antes de gates");
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://0web.com.br/portfolio/agropet-filt");
      await page.evaluate(() => document.fonts?.ready);
      await page.screenshot({ path: out + "/" + width + ".png", fullPage: true, animations: "disabled", timeout: 30000 });
      const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
      assert.ok(overflow <= 2, "overflow horizontal " + overflow + "px");
      const link = page.locator(".af-category").first();
      await link.click();
      await page.getByRole("dialog").waitFor();
      assert.match(await page.getByRole("dialog").innerText(), /Consulta guiada/);
      const iframe = page.locator('iframe[title="Agropet Filt — formulário de consulta"]');
      await iframe.waitFor({ state: "attached", timeout: 12000 });
      assert.equal(await iframe.getAttribute("src"), "https://form.jotform.com/263077233917057", "formulário persistente correto");
      assert.equal(await page.locator('[data-client-key="agropet-filt"][data-funnel-provider="jotform"]').count(), 1, "único formulário por clientKey");
      assert.equal(errors.length, 0, "nenhum erro JS: " + errors.join("; "));
      console.log("[agropet-qa] PASS " + width + "px; noindex, canonical, modal, no-overflow, JS clean");
    } catch (e) {
      failure++;
      console.error("[agropet-qa] FAIL " + width + "px: " + (e instanceof Error ? e.message : String(e)));
      await page.screenshot({ path: out + "/" + width + "-failure.png", fullPage: true }).catch(() => {});
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
process.exit(failure ? 1 : 0);
