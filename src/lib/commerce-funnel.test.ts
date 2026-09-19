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
