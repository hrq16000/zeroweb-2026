import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const checkout = readFileSync("src/routes/checkout.tsx", "utf8");
const funnel = readFileSync("src/lib/cart-funnel.functions.ts", "utf8");
const orders = readFileSync("src/lib/orders.functions.ts", "utf8");
const stripe = readFileSync("src/lib/stripe-checkout.functions.ts", "utf8");
const obrigado = readFileSync("src/routes/obrigado.tsx", "utf8");

describe("checkout reliability contract", () => {
  test("duplo clique é bloqueado antes de criar pedido ou handoff", () => {
    expect(checkout).toContain("if (submitLockRef.current) return;");
  });

  test("handoff anônimo verifica replay antes do rate limit", () => {
    const replay = funnel.indexOf('.eq("session_key", data.sessionKey)');
    const rateLimit = funnel.indexOf('rpc("check_and_record_rate_limit"');
    expect(replay).toBeGreaterThan(-1);
    expect(rateLimit).toBeGreaterThan(replay);
    expect(funnel).toContain("idempotent: true");
  });

  test("pedido autenticado usa chave estável da jornada", () => {
    expect(checkout.match(/checkoutSessionKey:\s*sessionKey/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(orders).toContain("deterministicCheckoutOrderId");
    expect(orders).toContain('error.code === "23505"');
  });

  test("Stripe é idempotente e cancelamento preserva o carrinho", () => {
    expect(stripe).toContain('"Idempotency-Key": `0web-checkout-${order.id}`');
    expect(checkout).not.toMatch(/clearCart\(\);\s*window\.location\.href\s*=\s*res\.url/);
    expect(obrigado).toContain('resolvedSource !== "checkout-stripe"');
    expect(obrigado).toContain("rotateCartSessionKey()");
  });

  test("plano recorrente continua no atendimento assistido", () => {
    expect(checkout).toMatch(/if \(hasRecurring\)[\s\S]*return handleAssistedCheckout\(\)/);
  });
});
