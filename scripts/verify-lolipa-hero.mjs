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
      // SSR/React hidrata e substitui nós do mosaico. Não segurar handles
      // nem rolar por imagem: isso gerava 'Element is not attached to the DOM'.
      // Aguardar todos os assets reais e então inspecionar o DOM atomicamente.
      await page.waitForFunction(() => {
        const root = document.querySelector("section#inicio");
        const photos = root?.querySelectorAll(":scope > div.grid img");
        const title = root?.querySelector("h1");
        return title?.textContent?.trim().length >= 15 &&
          photos?.length === 4 &&
          Array.from(photos).every((img) =>
            img.complete && img.naturalWidth > 0 && img.naturalHeight > 0 &&
            img.getBoundingClientRect().width > 0
          );
      }, undefined, { timeout: 30000 });
      await page.evaluate(() => new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done))
      ));

      const { media, heroTitle, overflow } = await page.evaluate(() => {
        const root = document.querySelector("section#inicio");
        const photos = Array.from(root.querySelectorAll(":scope > div.grid img"));
        return {
          heroTitle: root.querySelector("h1")?.textContent?.trim() ?? "",
          media: photos.map((img) => ({
            currentSrc: img.currentSrc,
            srcSet: img.getAttribute("srcset"),
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            displayWidth: Math.round(img.getBoundingClientRect().width),
            complete: img.complete,
          })),
          overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        };
      });
      if (heroTitle.length < 15 || media.length !== 4) {
        throw new Error("Título ou número de fotos inválidos em " + viewport.name);
      }
      for (const [i, result] of media.entries()) {
        if (!result.complete || !result.naturalWidth || !result.naturalHeight || !result.displayWidth) {
          throw new Error("Falha na fotografia " + i + " em " + viewport.name);
        }
        if (result.currentSrc.includes("/images/_generated/lolipa-arte-em-festas/") &&
            (!result.srcSet?.includes("-480.webp 480w") || !result.srcSet?.includes("-960.webp 960w"))) {
          throw new Error("srcSet incompleto na fotografia " + i + " em " + viewport.name);
        }
      }
      if (overflow) throw new Error("Overflow horizontal em " + viewport.name);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
      // page.screenshot com clip não mantém referência a um node React:
      // a hidratação pode substituir a seção durante o screenshot.
      const clip = await page.evaluate(() => {
        const root = document.querySelector("section#inicio");
        if (!root) throw new Error("Hero Lolipa ausente durante captura");
        const r = root.getBoundingClientRect();
        const x = Math.max(0, Math.floor(r.x + window.scrollX));
        const y = Math.max(0, Math.floor(r.y + window.scrollY));
        const width = Math.ceil(r.width);
        const height = Math.ceil(r.height);
        if (width <= 0 || height <= 0 || width > window.innerWidth + 2) {
          throw new Error("Geometria hero inválida para captura: " + width + "x" + height);
        }
        return { x, y, width, height };
      });
      await page.screenshot({
        path: output + "/lolipa-hero-" + viewport.name + ".png",
        clip,
        animations: "disabled",
        timeout: 20000,
      });
      report.push({ viewport: viewport.name, heroTitle, photos: media });
      console.log("[lolipa-hero] " + viewport.name + ": quatro fotos válidas, título visível, sem overflow");
    } finally {
      await page.close();
    }
  }
  await writeFile(output + "/lolipa-hero-report.json", JSON.stringify(report, null, 2) + "\n");
} finally {
  await browser.close();
}
