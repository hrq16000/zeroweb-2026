import { describe, expect, test } from "bun:test";
import { aggregateCommerceFunnel, type CommerceEventRow } from "./commerce-funnel";

function row(
  event_name: string,
  cartSession: string,
  metadata: Record<string, unknown> = {},
): CommerceEventRow {
  return {
    event_name,
    session_id: "analytics-session",
    visitor_id: "visitor",
    metadata_json: { cart_session: cartSession, traffic_type: "human", ...metadata },
    created_at: "2026-09-19T12:00:00.000Z",
  };
}

describe("commerce funnel", () => {
  test("deduplica eventos repetidos pela jornada do carrinho", () => {
    const result = aggregateCommerceFunnel([
      row("add_to_cart", "cart_a", { service_slug: "site-express" }),
      row("add_to_cart", "cart_a", { service_slug: "site-express" }),
      row("checkout_started", "cart_a"),
      row("checkout_started", "cart_a"),
      row("checkout_assisted_guest", "cart_a"),
    ]);

    expect(result.counts).toEqual({
      cartAdded: 1,
      checkoutStarted: 1,
      assisted: 1,
      paymentStarted: 0,
      checkoutExited: 0,
      paymentCancelled: 0,
      paymentFailed: 0,
      paid: 0,
    });
    expect(result.topProducts[0]).toEqual({
      serviceSlug: "site-express",
      variantId: "base",
      count: 1,
    });
  });

  test("mede pagamento e receita sem duplicar retry do webhook", () => {
    const result = aggregateCommerceFunnel([
      row("add_to_cart", "cart_b", { service_slug: "seo", variant_id: "pro" }),
      row("checkout_started", "cart_b"),
      row("checkout_stripe_start", "cart_b"),
      row("payment_paid", "cart_b", { value: 397 }),
      row("payment_paid", "cart_b", { value: 397 }),
    ]);

    expect(result.counts.paymentStarted).toBe(1);
    expect(result.counts.paid).toBe(1);
    expect(result.paidRevenue).toBe(397);
    expect(result.rates.paymentStartedToPaid).toBe(100);
  });

  test("separa saída explícita, cancelamento Stripe e falha do provedor", () => {
    const result = aggregateCommerceFunnel([
      row("checkout_started", "cart_loss"),
      row("checkout_exit_store", "cart_loss"),
      row("checkout_stripe_start", "cart_cancel"),
      row("checkout_stripe_cancelled", "cart_cancel"),
      row("checkout_stripe_start", "cart_failed"),
      row("payment_failed", "cart_failed"),
    ]);

    expect(result.counts.checkoutExited).toBe(1);
    expect(result.counts.paymentCancelled).toBe(1);
    expect(result.counts.paymentFailed).toBe(1);
    expect(result.rates.checkoutExitRate).toBe(100);
    expect(result.rates.paymentCancelRate).toBe(50);
    expect(result.rates.paymentFailureRate).toBe(50);
  });

  test("variante posterior substitui a anterior na leitura por produto", () => {
    const result = aggregateCommerceFunnel([
      row("add_to_cart", "cart_variant", { service_slug: "google-meu-negocio", variant_id: "unico" }),
      row("add_to_cart", "cart_variant", { service_slug: "google-meu-negocio", variant_id: "pro" }),
      row("checkout_started", "cart_variant"),
      row("checkout_assisted_handoff", "cart_variant"),
    ]);

    expect(result.productPerformance).toHaveLength(1);
    expect(result.productPerformance[0]).toMatchObject({
      serviceSlug: "google-meu-negocio",
      variantId: "pro",
      added: 1,
      checkout: 1,
      results: 1,
      resultRate: 100,
    });
  });

  test("atribui conversão e receita à origem da jornada", () => {
    const events: CommerceEventRow[] = [
      {
        ...row("add_to_cart", "cart_source", { service_slug: "seo", ft_source: "google", ft_campaign: "seo-pr" }),
        utm_source: "google",
        utm_campaign: "seo-pr",
      },
      {
        ...row("checkout_started", "cart_source", { ft_source: "google", ft_campaign: "seo-pr" }),
        utm_source: "google",
        utm_campaign: "seo-pr",
      },
      row("payment_paid", "cart_source", { value: 499 }),
    ];
    const result = aggregateCommerceFunnel(events);

    expect(result.sourcePerformance[0]).toMatchObject({
      source: "google",
      campaign: "seo-pr",
      carts: 1,
      checkout: 1,
      results: 1,
      paid: 1,
      revenue: 499,
      paidRate: 100,
    });
  });

  test("exclui tráfego interno e mantém compatibilidade com sessão analítica antiga", () => {
    const legacy: CommerceEventRow = {
      event_name: "add_to_cart",
      session_id: "legacy-session",
      visitor_id: null,
      metadata_json: { service_slug: "seo" },
      created_at: "2026-09-18T12:00:00.000Z",
    };
    const internal = row("add_to_cart", "cart_internal", {
      service_slug: "seo",
      traffic_type: "internal",
    });
    const result = aggregateCommerceFunnel([legacy, internal]);

    expect(result.counts.cartAdded).toBe(1);
    expect(result.quality.legacyJourneys).toBe(1);
    expect(result.quality.canonicalJourneys).toBe(0);
  });
});
