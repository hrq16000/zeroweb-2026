#!/usr/bin/env node
/**
 * QA da Lolipa nas três telas; não cria nem aprova baselines/hash visuais.
 * Requer o preview do build real, via ci-with-prod-preview.mjs.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = process.env.E2E_BASE_URL || "http://127.0.0.1:8080";
const output = "seo-reports/visual";
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 393, height: 852 },
];
const browser = await chromium.launch({ headless: true });
const report = [];
await mkdir(output, { recursive: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    try {
      await page.goto(baseUrl + "/portfolio/lolipa-arte-em-festas?0web_preview=1", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      const hero = page.locator("section#inicio");
      await hero.waitFor({ state: "visible", timeout: 20000 });
      const heading = hero.locator("h1");
      if (!(await heading.isVisible()) || (await heading.innerText()).trim().length < 15) {
        throw new Error("Título do hero invisível em " + viewport.name);
      }
      const photos = hero.locator(":scope > div.grid img");
      if ((await photos.count()) !== 4) {
        throw new Error("Mural não possui quatro fotografias em " + viewport.name);
      }
      const media = [];
      for (let i = 0; i < 4; i++) {
        const img = photos.nth(i);
        await img.scrollIntoViewIfNeeded({ timeout: 15000 });
        await img.evaluate(async (el) => { if (el.decode) await el.decode().catch(() => {}); });
        const result = await img.evaluate(el => ({
          currentSrc: el.currentSrc,
          srcSet: el.getAttribute("srcset"),
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          displayWidth: Math.round(el.getBoundingClientRect().width),
          complete: el.complete,
        }));
        if (!result.complete || !result.naturalWidth || !result.naturalHeight || !result.displayWidth) {
          throw new Error("Falha na fotografia " + i + " em " + viewport.name);
        }
        if (result.currentSrc.includes("/images/_generated/lolipa-arte-em-festas/") &&
            (!result.srcSet?.includes("-480.webp 480w") || !result.srcSet?.includes("-960.webp 960w"))) {
          throw new Error("srcSet incompleto na fotografia " + i + " em " + viewport.name);
        }
        media.push(result);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      if (overflow) throw new Error("Overflow horizontal em " + viewport.name);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
      await hero.screenshot({
        path: output + "/lolipa-hero-" + viewport.name + ".png",
        animations: "disabled",
        timeout: 20000,
      });
      report.push({ viewport: viewport.name, heroTitle: (await heading.innerText()).trim(), photos: media });
      console.log("[lolipa-hero] " + viewport.name + ": quatro fotos válidas, título visível, sem overflow");
    } finally {
      await page.close();
    }
  }
  await writeFile(output + "/lolipa-hero-report.json", JSON.stringify(report, null, 2) + "\n");
} finally {
  await browser.close();
}
