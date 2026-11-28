import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const bundledExecutable = chromium.executablePath();
const browserRoot = "/opt/ms-playwright";
const installedExecutable = existsSync(browserRoot)
  ? readdirSync(browserRoot)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .map((name) => join(browserRoot, name, "chrome-linux", "chrome"))
      .find((path) => existsSync(path))
  : undefined;
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_EXECUTABLE || (existsSync(bundledExecutable) ? bundledExecutable : installedExecutable),
});

try {
  // Verifica a busca de região na vitrine já hidratada, sem envio de dados.
  for (const reducedMotion of ["reduce", "no-preference"]) {
    for (const width of [390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
      const page = await context.newPage();
      if (process.env.E2E_BLOCK_EXTERNAL === "1") {
        await page.route("**/*", (route) =>
          new URL(route.request().url()).origin === new URL(baseUrl).origin
            ? route.continue()
            : route.abort(),
        );
      }
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${baseUrl}/portfolio`, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForFunction(() => Boolean(window.__0WEB_RENDER_MODE__), undefined, { timeout: 60_000 });
      const trigger = page.getByRole("button", { name: /^Filtrar por região/ });
      const dialog = page.getByRole("dialog", { name: "Escolher região do portfólio" });
      const input = dialog.getByRole("combobox", { name: "Buscar região" });
      // The render marker is set before React attaches event handlers. Retry only
      // if the trigger is still closed, never toggle an already-open popover.
      for (let attempt = 0; attempt < 3; attempt++) {
        if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
        try {
          await input.waitFor({ state: "visible", timeout: 5_000 });
          break;
        } catch (error) {
          if (attempt === 2) throw error;
        }
      }
      await input.fill("sao jose");
      const options = dialog.getByRole("option");
      await options.first().waitFor({ state: "visible" });
      const label = (await options.first().innerText()).trim();
      if (!/são josé/i.test(label)) throw new Error(`Região não corresponde à busca sem acento: ${label}`);
      await input.press("ArrowDown");
      await input.press("Enter");
      await page.getByRole("button", { name: /^Filtrar por região: .*São José/i }).waitFor({ state: "visible" });
      await trigger.click();
      await input.fill("zzzzregiaoinexistente");
      await page.getByText("Nenhuma região encontrada.").waitFor({ state: "visible" });
      await input.press("Escape");
      await input.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label")?.startsWith("Filtrar por região"), undefined, { timeout: 5_000 });
      await trigger.click();
      await input.fill("todas");
      await dialog.getByRole("option", { name: /Todas as regiões/ }).click();
      await page.getByRole("button", { name: "Filtrar por região", exact: true }).waitFor({ state: "visible" });
      if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))) throw new Error(`Overflow horizontal em ${width}px`);
      if (errors.length) throw new Error(`/portfolio: ${errors.join(" | ")}`);
      console.log(`✓ /portfolio seletor de região ${width}px (${reducedMotion})`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
