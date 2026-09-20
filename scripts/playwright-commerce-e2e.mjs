#!/usr/bin/env node
/**
 * Browser E2E seguro da loja 0WEB.
 *
 * Modo padrão: NÃO conclui pedido, NÃO chama Stripe e NÃO cria lead.
 * Valida navegação real: /servicos → carrinho → /checkout, persistência do
 * carrinho, validação de contato e regra de plano recorrente.
 *
 * Para validar também sinais explícitos que persistem telemetria
 * (checkout_exit_store / payment_cancelled), habilite:
 *   E2E_COMMERCE_WRITE=1
 * Preferencialmente contra ambiente de QA/local. O script nunca conclui
 * atendimento assistido nem cria pagamento, mesmo nesse modo.
 */
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const allowTelemetryWrites = process.env.E2E_COMMERCE_WRITE === "1";
const bundled = chromium.executablePath();
const root = "/opt/ms-playwright";
const installed = existsSync(root)
  ? readdirSync(root)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .map((name) => join(root, name, "chrome-linux", "chrome"))
      .find((path) => existsSync(path))
  : undefined;

const browser = await chromium.launch({
  headless: true,
  executablePath: existsSync(bundled) ? bundled : installed,
});

const failures = [];
const fail = (message) => {
  failures.push(message);
  console.error(`✗ ${message}`);
};
const ok = (message) => console.log(`✓ ${message}`);

const CART_KEY = "0web_cart";
const CART_SESSION_KEY = "0web_cart_session";
const qaSession = `cart_e2e_${Date.now().toString(36)}`;

function recurringFixture() {
  return [{
    slug: "e2e-recurring",
    name: "Plano E2E recorrente",
    category: "QA",
    variantId: "pro",
    variantLabel: "PRO",
    price: 247,
    pricePeriod: "mês",
    imageUrl: null,
    qty: 1,
    addedAt: Date.now(),
  }];
}

async function seed(page, cart) {
  await page.evaluate(
    ({ cart, session, cartKey, sessionKey }) => {
      localStorage.setItem(cartKey, JSON.stringify(cart));
      localStorage.setItem(sessionKey, session);
    },
    { cart, session: qaSession, cartKey: CART_KEY, sessionKey: CART_SESSION_KEY },
  );
}

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${baseUrl}/servicos?qa=1`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await seed(page, []);
  await page.reload({ waitUntil: "domcontentloaded" });

  const add = page.getByRole("button", { name: /Adicionar .* ao carrinho/i }).first();
  if (!(await add.count())) {
    fail("/servicos: nenhum botão rápido de adicionar ao carrinho");
  } else {
    await add.click();
    const cart = JSON.parse(await page.evaluate((key) => localStorage.getItem(key) || "[]", CART_KEY));
    if (cart.length !== 1) fail("/servicos: clique não persistiu um item unitário");
    else ok(`produto adicionado: ${cart[0].slug}`);

    const cartButton = page.getByRole("button", { name: /Abrir carrinho/i }).first();
    await cartButton.click();
    const continueButton = page.getByRole("button", { name: "Continuar para checkout" });
    if (!(await continueButton.count())) {
      fail("drawer: CTA único para checkout ausente");
    } else {
      await continueButton.click();
      await page.waitForURL(/\/checkout/, { timeout: 15_000 });
      await page.getByRole("heading", { name: "Finalizar pedido" }).waitFor({ timeout: 10_000 });
      const checkoutCart = JSON.parse(
        await page.evaluate((key) => localStorage.getItem(key) || "[]", CART_KEY),
      );
      if (checkoutCart.length !== 1) fail("checkout: carrinho não foi preservado");
      else ok("carrinho preservado até o checkout");

      // Validação local: sem nome/WhatsApp o servidor não deve receber handoff.
      await page.getByRole("button", { name: "Finalizar com atendimento" }).click();
      await page.waitForTimeout(250);
      if (!/checkout/.test(page.url())) fail("checkout: contato inválido avançou a jornada");
      else ok("contato obrigatório bloqueia conclusão inválida");
      const afterValidation = JSON.parse(
        await page.evaluate((key) => localStorage.getItem(key) || "[]", CART_KEY),
      );
      if (afterValidation.length !== 1) fail("checkout: validação inválida limpou o carrinho");
    }
  }

  // Regra crítica: recorrência nunca cai no Stripe one-time.
  await seed(page, recurringFixture());
  await page.goto(`${baseUrl}/checkout?qa=1`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.waitForTimeout(500);
  if (!(await page.getByText("Plano recorrente", { exact: false }).count())) {
    fail("checkout recorrente: aviso de recorrência ausente");
  } else {
    ok("checkout reconhece plano recorrente");
  }
  const payNow = page.getByRole("button", { name: /Pagar agora|Entrar com Google para pagar/i });
  if (await payNow.count()) fail("checkout recorrente: Stripe one-time foi oferecido");
  else ok("plano recorrente não oferece Stripe one-time");
  if (!(await page.getByRole("button", { name: "Finalizar com atendimento" }).count())) {
    fail("checkout recorrente: atendimento assistido ausente");
  }

  if (allowTelemetryWrites) {
    // Saída explícita: persiste somente progresso/telemetria e mantém o carrinho.
    const exit = page.getByRole("button", { name: /Voltar à loja/i });
    await exit.click();
    await page.waitForURL(/\/servicos/, { timeout: 15_000 });
    const afterExit = JSON.parse(
      await page.evaluate((key) => localStorage.getItem(key) || "[]", CART_KEY),
    );
    if (afterExit.length !== 1) fail("saída explícita: carrinho perdido");
    else ok("saída explícita preserva carrinho");

    // Retorno de cancel_url: não cria pedido nem pagamento. O UUID é sintético;
    // a telemetria fica marcada pela sessão qaSession para limpeza em QA.
    const orderId = "00000000-0000-4000-8000-000000000001";
    await page.goto(
      `${baseUrl}/checkout?payment=cancelled&order_id=${orderId}&qa=1`,
      { waitUntil: "domcontentloaded", timeout: 30_000 },
    );
    await page.waitForTimeout(1200);
    const afterCancel = JSON.parse(
      await page.evaluate((key) => localStorage.getItem(key) || "[]", CART_KEY),
    );
    if (afterCancel.length !== 1) fail("cancelamento Stripe: carrinho perdido");
    else ok("cancelamento Stripe preserva carrinho");
    if (page.url().includes("payment=cancelled")) {
      fail("cancelamento Stripe: query operacional não foi normalizada");
    } else {
      ok("cancelamento Stripe normaliza a URL depois do processamento");
    }
  } else {
    ok("modo seguro: sinais que persistem telemetria não foram executados");
  }

  if (pageErrors.length) {
    fail(`erros de página: ${pageErrors.slice(0, 3).join(" | ")}`);
  }

  await page.evaluate(
    ({ cartKey, sessionKey }) => {
      localStorage.removeItem(cartKey);
      localStorage.removeItem(sessionKey);
    },
    { cartKey: CART_KEY, sessionKey: CART_SESSION_KEY },
  );
  await context.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n✗ E2E comercial falhou com ${failures.length} problema(s).`);
  process.exit(1);
}
console.log(`\n✓ E2E comercial concluído. telemetryWrites=${allowTelemetryWrites ? "on" : "off"}`);
