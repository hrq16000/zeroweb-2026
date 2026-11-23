#!/usr/bin/env node
/** QA real; NO-BRAND gera evidência para revisão humana, não PASS automático. */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const base = (process.env.E2E_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
const slug = "panificadora-doce-coracao-santo-antonio";
const dest = "seo-reports/doce-coracao-visual";
mkdirSync(dest, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const report = { checks: [], noBrand: { status: "REVIEW_REQUIRED", captures: [] } };
let failures = 0;
const mask = [
  "html{filter:grayscale(1)!important}",
  "body *:not(script):not(style){color:transparent!important;text-shadow:none!important}",
  "body img,body svg,body video,body iframe{opacity:0!important}",
  "body [style*='background-image']{background-image:none!important}",
].join("\n");
try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : width === 768 ? 1000 : 900 },
      reducedMotion: "reduce", colorScheme: "light",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    let ok = false;
    try {
      const response = await page.goto(base + "/portfolio/" + slug + "?0web_preview=1",
        { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(response?.status(), 200, "HTTP 200 preview");
      await page.locator('[data-portfolio-composition="' + slug + '"]').waitFor({ timeout: 20000 });
      assert.match(await page.locator("h1").first().innerText(), /pão.*pausa.*coração/is);
      assert.match((await page.locator('meta[name="robots"]').getAttribute("content")) || "", /noindex/);
      assert.equal(await page.locator('link[rel="canonical"]').first().getAttribute("href"),
        "https://0web.com.br/portfolio/" + slug);
      assert.ok((await page.locator('meta[property="og:image"]').first().getAttribute("content") || "").includes(slug));
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      assert.ok(schemas.some(s => s.includes("Bakery")), "schema Bakery");
      for (const section of ["momentos","sabores","localizacao","redes","perguntas"])
        assert.equal(await page.locator("#" + section).count(), 1, "seção " + section);
      assert.ok(await page.locator('a[href*="google.com/maps"]').count() > 0);
      assert.ok(await page.locator('a[href*="instagram.com/docecoracao.mina"]').count() > 0);
      const hero = page.locator('img[src*="hero-ilustracao.svg"]');
      await hero.scrollIntoViewIfNeeded();
      assert.ok(await hero.evaluate(el => el.complete && el.naturalWidth > 100), "ilustração");
      const overflow = await page.evaluate(() => Math.max(0,document.documentElement.scrollWidth-innerWidth));
      assert.ok(overflow <= 2, "overflow horizontal " + overflow);
      await page.screenshot({ path: dest + "/" + width + ".png", fullPage: true, animations: "disabled" });
      const triggers = page.locator('[data-testid="doce-coracao-consulta-trigger"]');
      assert.equal(await triggers.count(), 4, "quatro CTAs registrados");
      for (let i=0;i<4;i++) {
        await triggers.nth(i).click();
        const dialog = page.getByRole("dialog", { name: /Consulta demonstrativa/ });
        await dialog.waitFor({ state: "visible" });
        const iframe = dialog.locator('iframe[data-funnel-provider="jotform"]');
        assert.equal(await iframe.getAttribute("src"), "https://form.jotform.com/263264367955065");
        assert.equal(await dialog.getByRole("link", { name: "Abrir formulário em outra aba" }).getAttribute("href"),
          "https://form.jotform.com/263264367955065");
        assert.match(await dialog.innerText(), /não são enviadas à padaria/i);
        if(i===0)await page.screenshot({path:dest+"/"+width+"-modal.png", animations:"disabled"});
        if(i%2===0)await page.keyboard.press("Escape");
        else await dialog.getByRole("button",{name:"Fechar formulário"}).click();
        await dialog.waitFor({state:"hidden"});
      }
      assert.deepEqual(errors, [], "erros JavaScript");
      ok = true;
      console.log("[doce-coracao] PASS "+width+": preview SEO, 4 CTAs, modal, overflow, JS");
    } catch(e) {
      failures++;
      console.error("[doce-coracao] FAIL "+width+": "+e);
      await page.screenshot({path:dest+"/"+width+"-failure.png",fullPage:true}).catch(()=>{});
    }
    report.checks.push({width,result:ok?"PASS":"FAIL"});
    for (const peer of [slug,"cantinho-da-tia-mari","agropet-filt"]) {
      if(width===768&&peer!==slug)continue;
      try {
        const response=await page.goto(base+"/portfolio/"+peer+"?0web_preview=1",
          {waitUntil:"domcontentloaded",timeout:30000});
        assert.equal(response?.status(),200);
        await page.addStyleTag({content:mask});
        const name=width+"-nobrand-"+peer+".png";
        await page.screenshot({path:dest+"/"+name,fullPage:true,animations:"disabled"});
        report.noBrand.captures.push({width,slug:peer,file:name});
      } catch(e) {
        failures++;console.error("[doce-coracao] NO-BRAND capture FAIL "+width+" "+peer+": "+e);
      }
    }
    await context.close();
  }
} finally {
  writeFileSync(dest+"/report.json",JSON.stringify(report,null,2)+"\n");
  await browser.close();
}
console.log("[doce-coracao] NO-BRAND: capturas para revisão; PASS não automático.");
process.exit(failures?1:0);
