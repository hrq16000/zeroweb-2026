#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = (process.env.E2E_BASE_URL || process.env.BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const slugs = ["studio-de-cilios", "refrigeracao-maresia", "lk-alvenaria", "paulo-mestre-de-obras"];
const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];
const outputDir = "seo-reports/visual-fixtures";
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const slug of slugs) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      const url = `${baseUrl}/portfolio/${slug}?0web_visual_fixture=v1`;
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      if (!response || response.status() !== 200) failures.push(`${slug}/${viewport.name}: HTTP ${response?.status() ?? "sem resposta"}`);
      try {
        await page.waitForFunction(() => {
          const images = Array.from(document.querySelectorAll('img[src*="/images/visual-fixtures/"]'));
          return images.length > 0 && images.every((img) => img.complete && img.naturalWidth > 0);
        }, { timeout: 20000 });
      } catch {
        failures.push(`${slug}/${viewport.name}: fixture de imagem ausente ou não carregada`);
      }
      const state = await page.evaluate(() => ({
        fixtureImages: Array.from(document.querySelectorAll('img[src*="/images/visual-fixtures/"]')).map((img) => ({ src: img.getAttribute("src"), width: img.naturalWidth, height: img.naturalHeight })),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") || "",
        width: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      if (!state.robots.includes("noindex")) failures.push(`${slug}/${viewport.name}: fixture sem noindex`);
      if (state.width > state.viewport + 1) failures.push(`${slug}/${viewport.name}: overflow horizontal ${state.width}>${state.viewport}`);
      if (state.fixtureImages.some((img) => img.width <= 0 || img.height <= 0)) failures.push(`${slug}/${viewport.name}: imagem fixture inválida`);
      if (pageErrors.length) failures.push(`${slug}/${viewport.name}: ${pageErrors.join(" | ")}`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${outputDir}/${slug}-${viewport.name}.png`, fullPage: true });
      console.log(`[visual-fixture] ${slug} ${viewport.name}: ${state.fixtureImages.length} imagens sintéticas, robots=${state.robots}, overflow=${Math.max(0, state.width - state.viewport)}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("[visual-fixture] FAIL");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log(`[visual-fixture] PASS — ${slugs.length * viewports.length} capturas sintéticas; sem dados reais e sem impacto na indexação.`);