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
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseUrl}/portfolio`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForFunction(() => Boolean(window.__0WEB_RENDER_MODE__), undefined, { timeout: 10_000 });
    const trigger = page.getByRole("button", { name: /^Filtrar por região/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Escolher região do portfólio" });
    const input = dialog.getByRole("combobox", { name: "Buscar região" });
    await input.waitFor({ state: "visible" });
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
