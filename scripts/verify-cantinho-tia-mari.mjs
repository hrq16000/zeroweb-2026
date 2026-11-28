#!/usr/bin/env node
/**
 * Capturas reais, non-mutating. Sem dados reais de crianças, pais ou responsáveis.
 * Todo teste exercita a página, o pop-up da 0WEB e o formulário demonstrativo.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";
const dest = "seo-reports/cantinho-tia-mari-visual";
mkdirSync(dest, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
let failures = 0;
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", err => errors.push(err.message));
    try {
      const response = await page.goto(base + "/portfolio/cantinho-da-tia-mari?0web_preview=1", { waitUntil: "domcontentloaded", timeout: 30000 });
      assert.equal(response?.status(), 200);
      assert.match(await page.locator("h1").first().innerText(), /cantinho de carinho/i);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content") || "", /index,follow/);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://0web.com.br/portfolio/cantinho-da-tia-mari");
      await page.locator('img[alt*="fachada"]').waitFor();
      assert.ok(await page.locator('img[alt*="fachada"]').evaluate(el => el.complete && el.naturalWidth > 10), "foto real carregada");
      await page.screenshot({path:dest+"/"+width+".png",fullPage:true,animations:"disabled",timeout:30000});
      // Exercise the candidate branch's mobile menu, not only the first paint.
      const mobileTrigger = page.locator('button[aria-controls="tm-mobile-navigation"]');
      const mobileNav = page.locator('#tm-mobile-navigation');
      const share = page.getByRole("button",{name:"Copiar divulgação de Cantinho da Tia Mari"});
      assert.equal(await share.isVisible(), true, "share control remains available");
      const intersects = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;
      if (width === 390) {
        assert.equal(await mobileTrigger.isVisible(), true, "mobile menu trigger visible");
        const menuBox = await mobileTrigger.boundingBox();
        const shareBox = await share.boundingBox();
        const floatingCta = page.getByRole("button",{name:"Abrir formulário para consultar informações sobre vagas"});
        const ctaBox = await floatingCta.boundingBox();
        assert.ok(menuBox && shareBox && ctaBox, "mobile controls have visible geometry");
        assert.equal(intersects(menuBox,shareBox), false, "share must not block menu");
        assert.equal(intersects(ctaBox,shareBox), false, "share must not block consultation CTA");
        assert.equal(await mobileNav.isVisible(), false, "mobile menu initially collapsed");
        await mobileTrigger.click();
        assert.equal(await mobileTrigger.getAttribute("aria-expanded"), "true");
        assert.equal(await mobileNav.isVisible(), true, "mobile menu expanded");
        for (const link of await mobileNav.locator("a").all()) {
          const box = await link.boundingBox();
          assert.ok(box && box.height >= 44, "mobile menu link touch target >= 44px");
        }
        await page.screenshot({path:dest+"/390-menu.png",animations:"disabled",timeout:30000});
        await mobileNav.locator("a").first().focus();
        await page.keyboard.press("Escape");
        assert.equal(await mobileTrigger.getAttribute("aria-expanded"), "false", "Escape collapses menu");
        assert.equal(await mobileNav.isVisible(), false, "collapsed navigation hidden");
        assert.equal(await mobileTrigger.evaluate(el => document.activeElement === el), true, "Escape restores trigger focus");
        await mobileTrigger.click();
        await mobileNav.getByRole("link", {name:"Cuidados"}).click();
        assert.equal(await mobileNav.isVisible(), false, "link selection closes menu");
        assert.equal(new URL(page.url()).hash, "#cuidados", "menu navigation retains local anchor");
      } else {
        assert.equal(await mobileTrigger.isVisible(), false, "mobile menu hidden at 1440px");
        assert.equal(await mobileNav.isVisible(), false, "mobile navigation hidden at desktop width");
        assert.equal(await page.getByRole("navigation",{name:"Navegação",exact:true}).isVisible(), true, "desktop navigation intact");
      }
      const overflow = await page.evaluate(() => Math.max(0,document.documentElement.scrollWidth-window.innerWidth));
      assert.ok(overflow<=2,"overflow horizontal "+overflow);
      const float = page.getByRole("button",{name:"Abrir formulário para consultar informações sobre vagas"});
      assert.equal(await float.count(),1,"botão flutuante único");
      await float.click();
      const dialog = page.getByRole("dialog",{name:"Informações e vagas anunciadas"});
      await dialog.waitFor();
      assert.equal(await page.locator('iframe[data-funnel-provider="jotform"][data-client-key="cantinho-da-tia-mari"]').getAttribute("src"),"https://form.jotform.com/263096736127059");
      await page.getByRole("button",{name:"Fechar formulário"}).click();
      assert.equal(await page.locator('iframe[data-funnel-provider="jotform"]').count(),0);
      assert.equal(errors.length,0,"JS errors "+errors.join("; "));
      console.log("[cantinho] PASS "+width+": canonical, index on, genuine photo, CTA, modal, no-overflow");
    } catch(e) {
      failures++;
      console.error("[cantinho] FAIL "+width+": "+String(e));
      await page.screenshot({path:dest+"/"+width+"-failure.png",fullPage:true}).catch(()=>{});
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
process.exit(failures ? 1 : 0);
