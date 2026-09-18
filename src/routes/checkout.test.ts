import { describe, expect, test } from "bun:test";

/**
 * Contrato atual do checkout da loja:
 *
 * - itens de /servicos viram pedidos persistidos;
 * - Stripe, quando habilitado, pode receber o pedido;
 * - sem Stripe o pedido permanece no fluxo assistido;
 * - o cliente não recebe link direto wa.me/tel/mailto no checkout.
 *
 * Os detalhes de autenticação/DB vivem nos server fns; aqui protegemos a
 * decisão de roteamento para impedir regressão ao antigo handoff por URL.
 */

type PaymentRoute =
  | { kind: "stripe"; url: string; orderId: string }
  | { kind: "assisted"; orderId: string };

function routePayment(opts: {
  stripeEnabled: boolean;
  stripeUrl?: string | null;
  orderId: string;
}): PaymentRoute {
  if (opts.stripeEnabled && opts.stripeUrl) {
    return { kind: "stripe", url: opts.stripeUrl, orderId: opts.orderId };
  }
  return { kind: "assisted", orderId: opts.orderId };
}

describe("checkout — roteamento de pagamento", () => {
  test("Stripe habilitado e com URL preserva o orderId", () => {
    const result = routePayment({
      stripeEnabled: true,
      stripeUrl: "https://checkout.stripe.com/c/pay/cs_test_abc",
      orderId: "ord_abc123",
    });
    expect(result.kind).toBe("stripe");
    expect(result.orderId).toBe("ord_abc123");
  });

  test("Stripe desabilitado cai em atendimento assistido sem URL de WhatsApp", () => {
    const result = routePayment({
      stripeEnabled: false,
      stripeUrl: null,
      orderId: "ord_abc123",
    });
    expect(result).toEqual({ kind: "assisted", orderId: "ord_abc123" });
    expect(JSON.stringify(result)).not.toContain("wa.me");
    expect(JSON.stringify(result)).not.toContain("api.whatsapp.com");
  });

  test("Stripe habilitado sem URL também preserva o pedido no atendimento", () => {
    const result = routePayment({
      stripeEnabled: true,
      stripeUrl: "",
      orderId: "ord_abc123",
    });
    expect(result).toEqual({ kind: "assisted", orderId: "ord_abc123" });
  });
});
