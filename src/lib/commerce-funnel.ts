export const COMMERCE_EVENT_NAMES = [
  "add_to_cart",
  "cart_checkout_click",
  "checkout_started",
  "checkout_assisted_guest",
  "checkout_assisted_handoff",
  "checkout_stripe_start",
  "payment_paid",
] as const;

export type CommerceEventRow = {
  event_name: string;
  session_id: string | null;
  visitor_id: string | null;
  metadata_json: unknown;
  created_at: string;
};

function metadataOf(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function numberOf(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pct(value: number, base: number) {
  return base > 0 ? Math.round((value / base) * 1000) / 10 : 0;
}

export function commerceJourneyKey(row: CommerceEventRow) {
  const metadata = metadataOf(row.metadata_json);
  const cartSession = metadata.cart_session;
  if (typeof cartSession === "string" && cartSession.startsWith("cart_")) {
    return cartSession;
  }
  if (row.session_id) return `analytics:${row.session_id}`;
  return null;
}

export function aggregateCommerceFunnel(rows: CommerceEventRow[]) {
  const stages = {
    cartAdded: new Set<string>(),
    checkoutStarted: new Set<string>(),
    assisted: new Set<string>(),
    paymentStarted: new Set<string>(),
    paid: new Set<string>(),
  };
  const allJourneys = new Set<string>();
  const canonicalJourneys = new Set<string>();
  const productJourneys = new Map<string, Set<string>>();
  const paidValues = new Map<string, number>();

  for (const row of rows) {
    const metadata = metadataOf(row.metadata_json);
    const trafficType = metadata.traffic_type;
    if (trafficType === "bot" || trafficType === "automation" || trafficType === "internal") {
      continue;
    }

    const journey = commerceJourneyKey(row);
    if (!journey) continue;
    allJourneys.add(journey);
    if (journey.startsWith("cart_")) canonicalJourneys.add(journey);

    if (row.event_name === "add_to_cart") {
      stages.cartAdded.add(journey);
      const slug =
        typeof metadata.service_slug === "string"
          ? metadata.service_slug
          : typeof metadata.slug === "string"
            ? metadata.slug
            : null;
      if (slug) {
        const variantId = typeof metadata.variant_id === "string" ? metadata.variant_id : "base";
        const productKey = `${slug}::${variantId}`;
        const journeys = productJourneys.get(productKey) ?? new Set<string>();
        journeys.add(journey);
        productJourneys.set(productKey, journeys);
      }
    }

    if (row.event_name === "cart_checkout_click" || row.event_name === "checkout_started") {
      stages.checkoutStarted.add(journey);
    }

    if (row.event_name === "checkout_assisted_guest" || row.event_name === "checkout_assisted_handoff") {
      stages.assisted.add(journey);
    }

    if (row.event_name === "checkout_stripe_start") {
      stages.paymentStarted.add(journey);
    }

    if (row.event_name === "payment_paid") {
      stages.paid.add(journey);
      if (!paidValues.has(journey)) {
        paidValues.set(journey, numberOf(metadata.value ?? metadata.total));
      }
    }
  }

  const counts = {
    cartAdded: stages.cartAdded.size,
    checkoutStarted: stages.checkoutStarted.size,
    assisted: stages.assisted.size,
    paymentStarted: stages.paymentStarted.size,
    paid: stages.paid.size,
  };

  const topProducts = Array.from(productJourneys.entries())
    .map(([key, journeys]) => {
      const [serviceSlug, variantId] = key.split("::");
      return { serviceSlug, variantId, count: journeys.size };
    })
    .sort((a, b) => b.count - a.count || a.serviceSlug.localeCompare(b.serviceSlug))
    .slice(0, 6);

  return {
    counts,
    rates: {
      cartToCheckout: pct(counts.checkoutStarted, counts.cartAdded),
      cartToAssisted: pct(counts.assisted, counts.cartAdded),
      cartToPaymentStarted: pct(counts.paymentStarted, counts.cartAdded),
      cartToPaid: pct(counts.paid, counts.cartAdded),
      paymentStartedToPaid: pct(counts.paid, counts.paymentStarted),
    },
    paidRevenue: Array.from(paidValues.values()).reduce((sum, value) => sum + value, 0),
    topProducts,
    quality: {
      journeys: allJourneys.size,
      canonicalJourneys: canonicalJourneys.size,
      legacyJourneys: Math.max(0, allJourneys.size - canonicalJourneys.size),
    },
  };
}
