import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const add = readFileSync("src/components/site/AddToCartButton.tsx", "utf8");
const panel = readFileSync("src/components/site/ServicePurchasePanel.tsx", "utf8");
const drawer = readFileSync("src/components/site/CartDrawer.tsx", "utf8");
const checkout = readFileSync("src/routes/checkout.tsx", "utf8");
const stripeHook = readFileSync("src/routes/api/public/hooks/stripe.ts", "utf8");
const leads = readFileSync("src/routes/_authenticated/app.leads.index.tsx", "utf8");

describe("commercial telemetry contract", () => {
  test("add_to_cart carrega a sessão canônica nos dois pontos de compra", () => {
    expect(add).toMatch(/trackEvent\("add_to_cart"[\s\S]*cart_session:/);
    expect(panel).toMatch(/trackEvent\("add_to_cart"[\s\S]*cart_session:/);
  });

  test("eventos comerciais não fazem persistência duplicada no componente", () => {
    expect(drawer).not.toMatch(/persistEvent\("cart_checkout_click"/);
    expect(checkout).not.toMatch(/persistEvent\("checkout_assisted_guest"/);
    expect(checkout).not.toMatch(/persistEvent\("checkout_assisted_handoff"/);
    expect(checkout).not.toMatch(/persistEvent\("checkout_stripe_start"/);
  });

  test("checkout registra entrada e pagamento pendente com cart_session", () => {
    expect(checkout).toMatch(/trackEvent\("checkout_started"[\s\S]*cart_session:/);
    expect(checkout).toMatch(/step:\s*"payment_pending"[\s\S]*paymentRef:\s*res\.sessionId/);
    expect(checkout).toMatch(/trackConversion\("checkout_stripe_start"[\s\S]*cart_session:/);
  });

  test("webhook preserva metadata e registra payment_paid idempotente", () => {
    expect(stripeHook).toContain("checkout_session_key");
    expect(stripeHook).toMatch(/metadata:\s*\{[\s\S]*\.\.\.currentOrderMetadata/);
    expect(stripeHook).toMatch(/event_name:\s*"payment_paid"/);
    expect(stripeHook).toMatch(/id:\s*orderId/);
    expect(stripeHook).toMatch(/step:\s*"payment_paid"/);
  });

  test("admin separa distribuição atual do funil histórico real", () => {
    expect(leads).toContain("CommerceFunnelPanel");
    expect(leads).toContain("Distribuição atual por etapa");
    expect(leads).not.toContain("Funil de conversão por etapa");
  });
});
