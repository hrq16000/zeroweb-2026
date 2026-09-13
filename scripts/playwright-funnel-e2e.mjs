/**
 * E2E Funnel-first: CTA → modal → respostas → lead → token → redirect WhatsApp
 * + produto → carrinho → checkout + ProductActionGate.
 */
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const ROUTES = ["/", "/servicos/google-ads-299"];
const PRODUCT_SLUG = "google-ads-299";

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
  executablePath: existsSync(bundled) ? bundled : installed,
});

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.error(`✗ ${msg}`);
};
const ok = (msg) => console.log(`✓ ${msg}`);

async function waitHydrated(page) {
  await page
    .waitForFunction(() => Boolean(window.__0WEB_RENDER_MODE__ ?? window.__0web_hydrated ?? window.$_TSR), null, { timeout: 20_000 })
    .catch(() => {});
  await page.waitForTimeout(600);
}

async function answerCurrentStep(page) {
  const option = page.locator('[data-testid="funnel-option"]:visible').first();
  if (await option.count()) {
    await option.click({ timeout: 8000, force: true }).catch(() => {});
    return true;
  }
  const input = page.locator('[data-testid="funnel-input"]:visible').first();
  if (await input.count()) {
    const tag = await input.evaluate((el) => el.tagName.toLowerCase(), undefined, { timeout: 5000 }).catch(() => "input");
    if (tag === "select") {
      await input.selectOption({ index: 1 }).catch(async () => {
        await input.evaluate((el) => {
          const opt = Array.from(el.querySelectorAll("option")).find((o) => o.value);
          if (opt) {
            el.value = opt.value;
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
      });
      const nextSel = page.locator('[data-testid="funnel-next"]:visible').first();
      if (await nextSel.count()) await nextSel.click({ timeout: 8000, force: true }).catch(() => {});
      return true;
    }
    const type = (await input.getAttribute("type", { timeout: 5000 }).catch(() => "")) || "";
    const mode = (await input.getAttribute("inputmode", { timeout: 5000 }).catch(() => "")) || "";
    const value = type === "email" ? "teste-e2e@example.test" : mode === "tel" || type === "tel" ? "41999990000" : "Teste E2E 0WEB";
    await input.fill(value, { timeout: 8000 }).catch(() => {});
  }
  const next = page.locator('[data-testid="funnel-next"]:visible').first();
  if (await next.count()) {
    await next.click({ timeout: 8000, force: true }).catch(() => {});
    return true;
  }
  return false;
}

async function verifyPublicHtml(page, route) {
  const html = await page.content();
  for (const [re, name] of [
    [/wa\.me\/\d+/, "wa.me/<numero>"],
    [/mailto:[^"'\s]+@0web/i, "mailto 0web"],
    [/tel:\+?\d[\d\s().-]{7,}/i, "tel:"],
  ]) {
    if (re.test(html)) fail(`${route}: HTML expõe ${name}`);
  }
  ok(`${route}: HTML sem contatos operacionais públicos`);
}

async function runProductCommerceChecks() {
  // Compra direta → carrinho → checkout, sem obrigar funil.
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
    await context.addInitScript(() => localStorage.removeItem("0web_cart"));
    const page = await context.newPage();
    await page.goto(`${baseUrl}/servicos/${PRODUCT_SLUG}`, { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    const buy = page.locator(`[data-testid="product-buy"][data-product-slug="${PRODUCT_SLUG}"]`).first();
    if (!(await buy.count())) {
      fail("produto: CTA de compra não encontrado");
    } else {
      await buy.click();
      const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("0web_cart") || "[]"));
      const item = cart.find((x) => x.slug === "google-ads-299");
      if (!item) fail("produto: compra direta não adicionou google-ads-299 ao carrinho");
      else if (Number(item.price) !== 299) fail(`produto: preço no carrinho inesperado (${item.price})`);
      else ok("produto: compra direta adicionou google-ads-299 por R$ 299");

      await page.evaluate(() => window.dispatchEvent(new CustomEvent("0web:cart-open")));
      const drawerTitle = page.getByText("Seu carrinho", { exact: true });
      await drawerTitle.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
      if (!(await drawerTitle.count())) fail("produto: CartDrawer não abriu");
      if (!(await page.getByText("Campanhas Google Ads", { exact: true }).count())) {
        fail("produto: item não apareceu no CartDrawer");
      }

      const checkoutButton = page.getByRole("button", { name: "Finalizar compra" });
      if (!(await checkoutButton.count())) {
        fail("produto: botão Finalizar compra não encontrado");
      } else {
        await checkoutButton.click();
        await page.waitForURL(/\/checkout(?:\?|$)/, { timeout: 12_000 }).catch(() => {});
        if (!/\/checkout(?:\?|$)/.test(page.url())) fail(`produto: não navegou ao checkout (${page.url()})`);
        else {
          const body = await page.locator("body").innerText();
          if (!body.includes("Campanhas Google Ads")) fail("checkout: produto não consta no resumo");
          else if (!body.includes("R$ 299")) fail("checkout: preço R$ 299 não consta no resumo");
          else ok("produto: carrinho e checkout preservam produto/preço");
        }
      }
    }
    await context.close();
  }

  // Orientação → sugestão de carrinho → aceita → funil.
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
    await context.addInitScript(() => localStorage.removeItem("0web_cart"));
    const page = await context.newPage();
    await page.goto(`${baseUrl}/servicos/${PRODUCT_SLUG}`, { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    const orientation = page.locator(`[data-testid="product-orientation"][data-product-slug="${PRODUCT_SLUG}"]`).first();
    if (!(await orientation.count())) {
      fail("produto: ProductActionGate não encontrado");
    } else {
      await orientation.click();
      const suggestion = page.locator('[data-testid="cart-suggestion-dialog"]');
      await suggestion.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
      if (!(await suggestion.isVisible().catch(() => false))) {
        fail("produto: orientação não mostrou sugestão de carrinho");
      } else {
        await page.locator('[data-testid="cart-suggestion-accept"]').click();
        const modal = page.locator('[data-testid="funnel-modal"]');
        await modal.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
        const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("0web_cart") || "[]"));
        if (!cart.some((x) => x.slug === "google-ads-299")) fail("produto: aceitar sugestão não adicionou ao carrinho");
        else if (!(await modal.isVisible().catch(() => false))) fail("produto: aceitar sugestão não abriu o funil");
        else ok("produto: ProductActionGate adiciona ao carrinho e abre o funil");
      }
    }
    await context.close();
  }

  // Orientação → recusa → funil sem adicionar.
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
    await context.addInitScript(() => localStorage.removeItem("0web_cart"));
    const page = await context.newPage();
    await page.goto(`${baseUrl}/servicos/${PRODUCT_SLUG}`, { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    const orientation = page.locator(`[data-testid="product-orientation"][data-product-slug="${PRODUCT_SLUG}"]`).first();
    if (await orientation.count()) {
      await orientation.click();
      await page.locator('[data-testid="cart-suggestion-decline"]').click();
      const modal = page.locator('[data-testid="funnel-modal"]');
      await modal.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
      const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("0web_cart") || "[]"));
      if (cart.some((x) => x.slug === "google-ads-299")) fail("produto: recusar sugestão adicionou item indevidamente");
      else if (!(await modal.isVisible().catch(() => false))) fail("produto: recusar sugestão não abriu o funil");
      else ok("produto: recusa preserva carrinho vazio e abre o funil");
    }
    await context.close();
  }
}

try {
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
    page.on("pageerror", (e) => consoleErrors.push(String(e)));

    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});
    await waitHydrated(page);
    await verifyPublicHtml(page, route);

    const cta = page.locator('[data-testid="funnel-cta"]').first();
    if (!(await cta.count())) {
      fail(`${route}: nenhum [data-testid="funnel-cta"] encontrado`);
      await context.close();
      continue;
    }
    await cta.click();
    const modal = page.locator('[data-testid="funnel-modal"]');
    try {
      await modal.waitFor({ state: "visible", timeout: 8000 });
    } catch {
      fail(`${route}: CTA não abriu o modal do funil (URL atual ${page.url()})`);
      await context.close();
      continue;
    }
    if (/\/contato/.test(page.url())) fail(`${route}: CTA navegou para /contato`);
    ok(`${route}: CTA abriu o modal (${await modal.getAttribute("data-funnel-slug")})`);

    let steps = 0;
    while (steps < 25) {
      if (await page.locator('[data-testid="funnel-done"]').count()) break;
      const advanced = await answerCurrentStep(page);
      if (!advanced) break;
      steps += 1;
      await page.waitForTimeout(700);
    }
    const done = page.locator('[data-testid="funnel-done"]');
    try {
      await done.waitFor({ state: "visible", timeout: 20_000 });
    } catch {
      fail(`${route}: funil não concluiu após ${steps} passos`);
      await context.close();
      continue;
    }

    const protocol = (await page.locator('[data-testid="funnel-protocol"]').textContent().catch(() => null))?.trim();
    if (!protocol) fail(`${route}: conclusão sem protocolo`);
    else ok(`${route}: protocolo ${protocol}`);

    const link = page.locator('[data-testid="funnel-whatsapp-link"]');
    const hasRedirect = (await done.getAttribute("data-redirect")) === "1";
    if (!hasRedirect || !(await link.count())) {
      fail(`${route}: conclusão sem link de redirect tokenizado`);
      await context.close();
      continue;
    }
    const href = await link.getAttribute("href");
    if (!/^\/r\/whatsapp\/[A-Za-z0-9._-]+$/.test(href || "")) {
      fail(`${route}: href inesperado "${href}" (esperado /r/whatsapp/<token>)`);
    } else {
      ok(`${route}: link tokenizado ${href}`);
      const res = await context.request.get(`${baseUrl}${href}`, { maxRedirects: 0 });
      const location = res.headers()["location"] || "";
      if (res.status() >= 300 && res.status() < 400 && /wa\.me\/\d+/.test(location)) {
        ok(`${route}: token resolveu server-side (${res.status()} → wa.me)`);
      } else {
        fail(`${route}: token não redirecionou para wa.me (status ${res.status()}, location "${location.slice(0, 60)}")`);
      }
    }

    const relevant = consoleErrors.filter((e) => !/favicon|third-party|ResizeObserver/i.test(e));
    if (relevant.length) fail(`${route}: erros de console → ${relevant.slice(0, 3).join(" | ")}`);

    await context.close();
  }

  await runProductCommerceChecks();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n✗ E2E funil falhou com ${failures.length} problema(s).`);
  process.exit(1);
}
console.log("\n✓ E2E funil: CTA → modal → lead → token → redirect + produto/carrinho/checkout validados.");
