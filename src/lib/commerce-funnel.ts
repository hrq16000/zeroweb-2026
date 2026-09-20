export const COMMERCE_EVENT_NAMES = [
  "add_to_cart",
  "cart_checkout_click",
  "checkout_started",
  "checkout_assisted_guest",
  "checkout_assisted_handoff",
  "checkout_stripe_start",
  "checkout_stripe_cancelled",
  "checkout_exit_store",
  "payment_failed",
  "payment_paid",
] as const;

export type CommerceEventRow = {
  event_name: string;
  session_id: string | null;
  visitor_id: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
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

function intersectCount(a: Set<string>, b: Set<string>) {
  let count = 0;
  for (const value of a) if (b.has(value)) count += 1;
  return count;
}

function unionSet(...sets: Set<string>[]) {
  const out = new Set<string>();
  for (const set of sets) for (const value of set) out.add(value);
  return out;
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
    checkoutExited: new Set<string>(),
    paymentCancelled: new Set<string>(),
    paymentFailed: new Set<string>(),
    paid: new Set<string>(),
  };
  const allJourneys = new Set<string>();
  const canonicalJourneys = new Set<string>();
  const latestProductsByJourney = new Map<string, Map<string, string>>();
  const journeyAcquisition = new Map<string, { source: string; campaign: string | null }>();
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

    if (!journeyAcquisition.has(journey)) {
      const source =
        typeof metadata.ft_source === "string"
          ? metadata.ft_source
          : row.utm_source || "direct";
      const campaign =
        typeof metadata.ft_campaign === "string"
          ? metadata.ft_campaign
          : row.utm_campaign ?? null;
      journeyAcquisition.set(journey, { source, campaign });
    }

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
        const selected = latestProductsByJourney.get(journey) ?? new Map<string, string>();
        // Carrinho é unitário por serviço: variante posterior substitui a anterior.
        selected.set(slug, variantId);
        latestProductsByJourney.set(journey, selected);
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

    if (row.event_name === "checkout_exit_store") {
      stages.checkoutExited.add(journey);
    }

    if (row.event_name === "checkout_stripe_cancelled") {
      stages.paymentCancelled.add(journey);
    }

    if (row.event_name === "payment_failed") {
      stages.paymentFailed.add(journey);
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
    checkoutExited: stages.checkoutExited.size,
    paymentCancelled: stages.paymentCancelled.size,
    paymentFailed: stages.paymentFailed.size,
    paid: stages.paid.size,
  };

  const productJourneys = new Map<string, Set<string>>();
  for (const [journey, selected] of latestProductsByJourney.entries()) {
    for (const [serviceSlug, variantId] of selected.entries()) {
      const productKey = `${serviceSlug}::${variantId}`;
      const journeys = productJourneys.get(productKey) ?? new Set<string>();
      journeys.add(journey);
      productJourneys.set(productKey, journeys);
    }
  }

  const resultJourneys = unionSet(stages.assisted, stages.paid);
  const productPerformance = Array.from(productJourneys.entries())
    .map(([key, journeys]) => {
      const [serviceSlug, variantId] = key.split("::");
      const added = journeys.size;
      const checkout = intersectCount(journeys, stages.checkoutStarted);
      const assisted = intersectCount(journeys, stages.assisted);
      const paymentStarted = intersectCount(journeys, stages.paymentStarted);
      const paid = intersectCount(journeys, stages.paid);
      const results = intersectCount(journeys, resultJourneys);
      return {
        serviceSlug,
        variantId,
        added,
        checkout,
        assisted,
        paymentStarted,
        paid,
        results,
        checkoutRate: pct(checkout, added),
        resultRate: pct(results, added),
        paidRate: pct(paid, added),
      };
    })
    .sort((a, b) => b.added - a.added || b.results - a.results || a.serviceSlug.localeCompare(b.serviceSlug))
    .slice(0, 12);

  const topProducts = productPerformance.slice(0, 6).map((row) => ({
    serviceSlug: row.serviceSlug,
    variantId: row.variantId,
    count: row.added,
  }));

  const sourceBuckets = new Map<
    string,
    { source: string; campaign: string | null; journeys: Set<string> }
  >();
  for (const journey of stages.cartAdded) {
    const acquisition = journeyAcquisition.get(journey) ?? { source: "unknown", campaign: null };
    const key = `${acquisition.source}::${acquisition.campaign ?? ""}`;
    const bucket = sourceBuckets.get(key) ?? {
      source: acquisition.source,
      campaign: acquisition.campaign,
      journeys: new Set<string>(),
    };
    bucket.journeys.add(journey);
    sourceBuckets.set(key, bucket);
  }

  const sourcePerformance = Array.from(sourceBuckets.values())
    .map((bucket) => {
      const carts = bucket.journeys.size;
      const checkout = intersectCount(bucket.journeys, stages.checkoutStarted);
      const results = intersectCount(bucket.journeys, resultJourneys);
      const paid = intersectCount(bucket.journeys, stages.paid);
      let revenue = 0;
      for (const journey of bucket.journeys) revenue += paidValues.get(journey) ?? 0;
      return {
        source: bucket.source,
        campaign: bucket.campaign,
        carts,
        checkout,
        results,
        paid,
        revenue,
        checkoutRate: pct(checkout, carts),
        resultRate: pct(results, carts),
        paidRate: pct(paid, carts),
      };
    })
    .sort((a, b) => b.carts - a.carts || b.results - a.results || a.source.localeCompare(b.source))
    .slice(0, 10);

  return {
    counts,
    rates: {
      cartToCheckout: pct(counts.checkoutStarted, counts.cartAdded),
      cartToAssisted: pct(counts.assisted, counts.cartAdded),
      cartToPaymentStarted: pct(counts.paymentStarted, counts.cartAdded),
      cartToPaid: pct(counts.paid, counts.cartAdded),
      paymentStartedToPaid: pct(counts.paid, counts.paymentStarted),
      checkoutExitRate: pct(counts.checkoutExited, counts.checkoutStarted),
      paymentCancelRate: pct(counts.paymentCancelled, counts.paymentStarted),
      paymentFailureRate: pct(counts.paymentFailed, counts.paymentStarted),
    },
    paidRevenue: Array.from(paidValues.values()).reduce((sum, value) => sum + value, 0),
    topProducts,
    productPerformance,
    sourcePerformance,
    quality: {
      journeys: allJourneys.size,
      canonicalJourneys: canonicalJourneys.size,
      legacyJourneys: Math.max(0, allJourneys.size - canonicalJourneys.size),
    },
  };
}
