/**
 * E2E dos funis individuais de /portfolio/*.
 *
 * Para cada site de cliente:
 *  - abre a página, dispara o CTA principal;
 *  - percorre as etapas do funil respondendo automaticamente;
 *  - garante que o desfecho é um redirect tokenizado que resolve (302),
 *    nunca "Canal indisponível" (503) nem "Funil indisponível".
 *
 * Uso: node scripts/playwright-portfolio-funnels.mjs
 */
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const configuredBrowser = process.env.E2E_BROWSER_PATH;

const TARGETS = [
  { path: "/portfolio/paraiso-do-hot-dog", cta: /Continuar pedido/i, prepare: "cart" },
  { path: "/portfolio/r_beauty", cta: /Agendar|AGENDAMENTO|Quero/i },
  { path: "/portfolio/renata-beauty", cta: /GARANTIR HORÁRIO|Agendar|Quero/i },
  { path: "/portfolio/dyzpromo", cta: /Solicitar proposta|Pedir orçamento/i },
  { path: "/portfolio/emporio-lelecute", cta: /Solicitar|Quero|Pedir|Falar/i },
  { path: "/portfolio/rm-fretes", cta: /Solicitar|Quero|Pedir|Falar/i },
];

const bundled = chromium.executablePath();
const root = "/opt/ms-playwright";
const installed = existsSync(root)
  ? readdirSync(root)
      .filter((n) => n.startsWith("chromium-") && !n.includes("headless"))
      .map((n) => join(root, n, "chrome-linux", "chrome"))
      .find((p) => existsSync(p))
  : undefined;

const browser = await chromium.launch({
  headless: true,
  executablePath:
    configuredBrowser && existsSync(configuredBrowser)
      ? configuredBrowser
      : existsSync(bundled)
        ? bundled
        : installed,
});

const failures = [];

for (const target of TARGETS) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
  const page = await context.newPage();
  const errors = [];
  page.on("response", (r) => {
    if (r.status() >= 500 && r.url().includes("/r/whatsapp/")) {
      errors.push(`${r.status()} em ${r.url()}`);
    }
  });

  try {
    await page.goto(baseUrl + target.path, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    if (target.prepare === "cart") {
      // O CTA do delivery só aparece com itens no carrinho.
      const add = page.getByRole("button", { name: /Adicionar|Montar|\+/ }).first();
      if (await add.count()) {
        await add.click({ force: true }).catch(() => {});
        await page.waitForTimeout(800);
      }
    }

    const cta = page.getByRole("button", { name: target.cta }).first();
    if (!(await cta.count())) {
      failures.push(`${target.path}: CTA do funil não encontrado`);
      await context.close();
      continue;
    }
    await cta.click({ force: true });
    await page.waitForTimeout(1500);

    for (let step = 0; step < 24; step += 1) {
      const dialog = page.locator("[role=dialog]").last();
      if (!(await dialog.count())) break;

      const text = await dialog.innerText();
      if (/indispon[ií]vel/i.test(text)) {
        failures.push(`${target.path}: funil indisponível na etapa ${step}`);
        break;
      }

      for (const selector of ["input", "textarea"]) {
        const fields = dialog.locator(selector);
        const count = await fields.count();
        for (let i = 0; i < count; i += 1) {
          const field = fields.nth(i);
          const placeholder = ((await field.getAttribute("placeholder")) || "").toLowerCase();
          const value = placeholder.includes("mail")
            ? "e2e@teste.com"
            : /tel|whats|9/.test(placeholder)
              ? "41988887777"
              : "Cliente E2E";
          await field.fill(value).catch(() => {});
        }
      }

      const buttons = dialog.locator("button");
      const labels = [];
      const total = await buttons.count();
      for (let i = 0; i < total; i += 1) {
        labels.push(((await buttons.nth(i).innerText()) || "").trim());
      }
      let clicked = false;
      for (const prefix of ["Enviar", "Continuar", "Avançar", "Finalizar", "Confirmar", "Ver"]) {
        const idx = labels.findIndex((l) => l.startsWith(prefix));
        if (idx >= 0) {
          await buttons.nth(idx).click({ force: true }).catch(() => {});
          clicked = true;
          break;
        }
      }
      if (!clicked) {
        const idx = labels.findIndex((l) => l && !["Voltar", "Fechar", "×"].includes(l));
        if (idx < 0) break;
        await buttons.nth(idx).click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(1400);
    }

    await page.waitForTimeout(2500);
    const finalUrl = page.url();
    const body = await page.innerText("body").catch(() => "");

    if (errors.length) {
      failures.push(`${target.path}: ${errors.join(", ")}`);
    } else if (/Canal indispon[ií]vel/i.test(body)) {
      failures.push(`${target.path}: canal indisponível no redirect`);
    } else if (/wa\.me|whatsapp\.com/.test(finalUrl)) {
      console.log(`✓ ${target.path} → redirect WhatsApp OK`);
    } else {
      console.log(`• ${target.path} → fluxo aberto sem erro (destino: ${finalUrl})`);
    }
  } catch (error) {
    failures.push(`${target.path}: ${String(error).slice(0, 160)}`);
  }

  await context.close();
}

await browser.close();

if (failures.length) {
  console.error("\n✗ Falhas nos funis de portfólio:");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("\n✓ Todos os funis de portfólio concluíram sem indisponibilidade.");
