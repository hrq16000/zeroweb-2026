/**
 * First executable delivery domain module: deterministic money arithmetic.
 *
 * IMPORTANT: This is an offline, untrusted-input-rejecting calculation kernel,
 * NOT a server quote API. All product, option and discount prices must first
 * be resolved from the authenticated store's published catalog on the server.
 * This module never declares an order, stock reservation or payment complete.
 * See docs/DELIVERY_MENU_PRICING_STANDARD.md.
 */

export class DeliveryPricingError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DeliveryPricingError";
    this.code = code;
  }
}

function invalid(code, message) {
  throw new DeliveryPricingError(code, message);
}

function nonNegativeInteger(name, value) {
  if (!Number.isSafeInteger(value) || value < 0) {
    invalid("INVALID_AMOUNT", name + " must be a nonnegative safe integer");
  }
  return BigInt(value);
}

function positiveInteger(name, value) {
  const number = nonNegativeInteger(name, value);
  if (number === 0n) invalid("INVALID_QUANTITY", name + " must be positive");
  return number;
}

function safeCents(value) {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    invalid("AMOUNT_OVERFLOW", "The calculated total is outside the safe cents range");
  }
  return Number(value);
}

function halfUp(value, denominator) {
  if (denominator <= 0n || value < 0n) invalid("INVALID_FRACTION", "Invalid rational price");
  return (2n * value + denominator) / (2n * denominator);
}

function fractionsWithExactUnitSum(fractions) {
  if (!Array.isArray(fractions) || fractions.length < 1 || fractions.length > 16) {
    invalid("INVALID_FRACTION_SUM", "A pizza requires between 1 and 16 fractions");
  }
  let denominator = 1n;
  let totalNumerator = 0n;
  const parts = fractions.map((f, i) => {
    if (!f || typeof f !== "object") invalid("INVALID_FRACTION", "Invalid fraction at " + i);
    const num = positiveInteger("fraction.numerator", f.numerator);
    const den = positiveInteger("fraction.denominator", f.denominator);
    if (den > 1000n || num > den) invalid("INVALID_FRACTION", "Fraction exceeds permitted denominator or unit");
    return { num, den };
  });
  for (const part of parts) {
    totalNumerator = totalNumerator * part.den + part.num * denominator;
    denominator *= part.den;
  }
  if (totalNumerator !== denominator) invalid("INVALID_FRACTION_SUM", "Pizza fractions must add to one");
  return { parts, denominator };
}

/** Validates rational pizza portions independently from product catalog resolution. */
export function validatePizzaFractions(fractions) {
  fractionsWithExactUnitSum(fractions);
  return true;
}

function weightedBase(prices, fractionInfo) {
  if (!Array.isArray(prices) || prices.length !== fractionInfo.parts.length) {
    invalid("FLAVOR_PRICE_MISSING", "Each pizza fraction must have a configured flavor price");
  }
  let weightedNumerator = 0n;
  let accumulatedDenominator = 1n;
  for (let i = 0; i < fractionInfo.parts.length; i += 1) {
    const part = fractionInfo.parts[i];
    const cents = nonNegativeInteger("flavorPriceCents", prices[i]);
    weightedNumerator = weightedNumerator * part.den + cents * part.num * accumulatedDenominator;
    accumulatedDenominator *= part.den;
  }
  return halfUp(weightedNumerator, accumulatedDenominator);
}

function validateConstraints(input) {
  if (input?.quoteExpired === true) invalid("QUOTE_EXPIRED", "Quote expired; a fresh server quote is required");
  if (input?.inventoryStatus === "UNAVAILABLE" || input?.inventoryStatus === "SOLD_OUT") {
    invalid("ITEM_UNAVAILABLE", "Item is currently unavailable");
  }
  if (input?.group !== undefined) {
    const g = input.group;
    if (!g || !Array.isArray(g.selectedOptionIds)) {
      invalid("INVALID_OPTION_GROUP", "Invalid option group");
    }
    const minimum = nonNegativeInteger("minSelect", g.minSelect);
    const maximum = nonNegativeInteger("maxSelect", g.maxSelect);
    if (maximum < minimum) invalid("INVALID_OPTION_GROUP", "Max must be >= min");
    if (new Set(g.selectedOptionIds).size !== g.selectedOptionIds.length) {
      invalid("INVALID_OPTION_GROUP", "An option cannot be repeated in this group");
    }
    if (BigInt(g.selectedOptionIds.length) < minimum) {
      invalid("REQUIRED_OPTION_MISSING", "Required group selection missing");
    }
    if (BigInt(g.selectedOptionIds.length) > maximum) {
      invalid("OPTION_LIMIT_EXCEEDED", "Too many options in group");
    }
  }
}

/**
 * Calculates one configured product line and its checkout-level fee/discount.
 * This bounded slice deliberately does not price a multi-line cart.
 *
 * Only call with catalog-resolved amounts, not arbitrary browser-provided prices.
 * Discount is applied to this line's eligible merchandise, never shipping.
 */
export function priceConfiguredLine(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    invalid("INVALID_INPUT", "Expected a configured item object");
  }
  validateConstraints(input);
  const quantity = positiveInteger("quantity", input.quantity);
  const hasPizza = input.pricingPolicy !== undefined;
  const hasSimple = input.basePriceCents !== undefined;
  const hasCombo = input.comboPriceCents !== undefined;
  if ([hasPizza, hasSimple, hasCombo].filter(Boolean).length !== 1) {
    invalid("INVALID_PRICE_SOURCE", "Exactly one pricing source is required");
  }
  if (!hasPizza && input.fractions !== undefined) {
    invalid("INVALID_PRICE_SOURCE", "Fractions require an explicit pizza pricing policy");
  }

  let base;
  let basePizzaCents;
  if (hasPizza) {
    const fractions = fractionsWithExactUnitSum(input.fractions);
    if (input.pricingPolicy === "MAX_SELECTED_FLAVOR") {
      const prices = input.baseFlavorPricesCents;
      if (!Array.isArray(prices) || prices.length !== fractions.parts.length) {
        invalid("FLAVOR_PRICE_MISSING", "Each selected flavor requires a price");
      }
      base = prices.reduce((max, p) => {
        const cents = nonNegativeInteger("baseFlavorPricesCents", p);
        return cents > max ? cents : max;
      }, 0n);
    } else if (input.pricingPolicy === "WEIGHTED_FRACTIONS") {
      base = weightedBase(input.baseFlavorPricesCents, fractions);
    } else if (input.pricingPolicy === "BASE_PLUS_FLAVOR_SURCHARGES") {
      base = nonNegativeInteger("doughBaseCents", input.doughBaseCents) +
        weightedBase(input.flavorSurchargesCents, fractions);
    } else {
      invalid("UNKNOWN_PIZZA_POLICY", "Pricing policy must be explicitly configured");
    }
    basePizzaCents = safeCents(base);
  } else {
    base = nonNegativeInteger(hasSimple ? "basePriceCents" : "comboPriceCents",
      hasSimple ? input.basePriceCents : input.comboPriceCents);
  }

  if (input.addons !== undefined && !Array.isArray(input.addons)) {
    invalid("INVALID_ADDONS", "Addons must be a list");
  }
  const addons = input.addons ?? [];
  if (addons.length > 100) invalid("INVALID_ADDONS", "Excessive addon count");
  const seen = new Set();
  let addonTotal = 0n;
  for (const addon of addons) {
    if (!addon || typeof addon.id !== "string" || !addon.id.trim() || seen.has(addon.id)) {
      invalid("INVALID_ADDONS", "Addon ID must be unique and nonblank");
    }
    seen.add(addon.id);
    const mode = addon.chargeMode;
    if (!["PER_UNIT", "PER_PIZZA", "PER_COMBO"].includes(mode) ||
        (mode === "PER_PIZZA" && !hasPizza) ||
        (mode === "PER_COMBO" && !hasCombo)) {
      invalid("INVALID_ADDON_MODE", "Addon pricing mode is invalid for this product");
    }
    addonTotal += nonNegativeInteger("addon.priceCents", addon.priceCents);
  }

  const itemUnit = base + addonTotal;
  const subtotal = itemUnit * quantity;
  const delivery = nonNegativeInteger("deliveryFeeCents", input.deliveryFeeCents ?? 0);

  if (input.discount !== undefined && input.discountCents !== undefined) {
    invalid("INVALID_DISCOUNT", "Only one discount source can be selected");
  }
  let discount = 0n;
  if (input.discount !== undefined) {
    const rule = input.discount;
    if (rule?.type !== "PERCENT_BPS" || rule.appliesTo !== "ELIGIBLE_ITEMS_SUBTOTAL") {
      invalid("INVALID_DISCOUNT", "Unrecognized or ineligible discount rule");
    }
    const basisPoints = nonNegativeInteger("discount.basisPoints", rule.basisPoints);
    if (basisPoints > 10000n) invalid("INVALID_DISCOUNT", "Discount must be <= 100%");
    discount = halfUp(subtotal * basisPoints, 10000n);
  } else if (input.discountCents !== undefined) {
    discount = nonNegativeInteger("discountCents", input.discountCents);
  }
  if (discount > subtotal) invalid("INVALID_DISCOUNT", "Discount exceeds merchandise subtotal");
  const afterDiscount = subtotal - discount;
  if (input.minimumOrderCents !== undefined &&
      afterDiscount < nonNegativeInteger("minimumOrderCents", input.minimumOrderCents)) {
    invalid("BELOW_MINIMUM_ORDER", "Merchandise after discount is below the minimum");
  }

  const result = {
    itemUnitCents: safeCents(itemUnit),
    unitAddonsCents: safeCents(addonTotal),
    itemsSubtotalCents: safeCents(subtotal),
    discountCents: safeCents(discount),
    deliveryFeeCents: safeCents(delivery),
    totalCents: safeCents(afterDiscount + delivery)
  };
  if (hasPizza) result.basePizzaCents = basePizzaCents;
  return result;
}

/** Only an explicit server-validated post-discount subtotal can be tested here. */
export function validateMinimumOrder(eligibleMerchandiseCents, minimumOrderCents) {
  if (nonNegativeInteger("eligibleMerchandiseCents", eligibleMerchandiseCents) <
      nonNegativeInteger("minimumOrderCents", minimumOrderCents)) {
    invalid("BELOW_MINIMUM_ORDER", "Minimum order not reached");
  }
  return true;
}
