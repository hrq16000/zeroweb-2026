/**
 * Delivery catalog selection resolver — isolated P2 domain module.
 *
 * This is NOT authentication, database isolation, a quote endpoint or checkout.
 * Caller MUST supply catalog and context from an authorized server-side store
 * lookup; never let browser payload choose tenantId, storeId, or money fields.
 * Outputs normalized pricing inputs for the separate P1 pricing kernel.
 * Defaults to rejection for unimplemented combo slot configuration.
 *
 * Contract: docs/DELIVERY_MENU_PRICING_STANDARD.md.
 */

export class DeliveryCatalogError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DeliveryCatalogError";
    this.code = code;
  }
}

function reject(code, message) {
  throw new DeliveryCatalogError(code, message);
}

function isRecord(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function id(v) {
  return typeof v === "string" && v.length > 0 && v.length <= 128 &&
    /^[\w.-]+$/.test(v);
}

function money(field, v) {
  if (!Number.isSafeInteger(v) || v < 0) {
    reject("CATALOG_PRICE_INVALID", field + " must be a nonnegative integer in cents");
  }
  return v;
}

function boundedInt(field, v, min, max) {
  if (!Number.isSafeInteger(v) || v < min || v > max) {
    reject("INVALID_CONFIGURATION", field + " is outside accepted limits");
  }
  return v;
}

function uniqueById(items, code) {
  const set = new Set();
  for (const row of items) {
    if (!isRecord(row) || !id(row.id) || set.has(row.id)) {
      reject(code, "Invalid or duplicate catalog identifier");
    }
    set.add(row.id);
  }
}

function ensureUnitFractions(fractions) {
  let numerator = 0n;
  let denominator = 1n;
  for (const part of fractions) {
    const n = BigInt(boundedInt("fraction.numerator", part.numerator, 1, 12));
    const d = BigInt(boundedInt("fraction.denominator", part.denominator, 1, 12));
    if (n > d) reject("INVALID_FRACTION", "Fraction exceeds one");
    numerator = numerator * d + n * denominator;
    denominator *= d;
  }
  if (numerator !== denominator) {
    reject("INVALID_FRACTION_SUM", "Pizza portions must sum exactly to one");
  }
}

function resolveOptions(product, variant, selected, type) {
  const groups = [...(product.optionGroups ?? []), ...(variant?.optionGroups ?? [])];
  if (groups.length > 30 || !groups.every(isRecord)) {
    reject("INVALID_OPTION_GROUP", "Invalid catalog option groups");
  }
  uniqueById(groups, "INVALID_OPTION_GROUP");
  if (!Array.isArray(selected) || selected.length > 100) {
    reject("INVALID_OPTION", "Invalid selected options");
  }
  const chosen = new Map();
  for (const sel of selected) {
    if (!isRecord(sel) || !id(sel.groupId) || !id(sel.optionId)) {
      reject("INVALID_OPTION", "Option selection requires valid IDs");
    }
    const key = sel.groupId + ":" + sel.optionId;
    if (chosen.has(key)) reject("DUPLICATE_OPTION", "Duplicate option selection");
    const quantity = boundedInt("option.quantity", sel.quantity ?? 1, 1, 100);
    chosen.set(key, { groupId: sel.groupId, optionId: sel.optionId, quantity });
  }
  const accepted = [];
  const addons = [];
  for (const group of groups) {
    const min = boundedInt("minSelect", group.minSelect ?? 0, 0, 100);
    const max = boundedInt("maxSelect", group.maxSelect ?? 1, 0, 100);
    if (max < min || !["SINGLE", "MULTI", "QUANTITY"].includes(group.selectionMode)) {
      reject("INVALID_OPTION_GROUP", "Invalid selection limits or mode");
    }
    const options = group.options ?? [];
    if (!Array.isArray(options) || options.length > 100) {
      reject("INVALID_OPTION_GROUP", "Options must be a bounded list");
    }
    uniqueById(options, "INVALID_OPTION_GROUP");
    const selectedForGroup = [...chosen.values()].filter(x => x.groupId === group.id);
    const count = group.selectionMode === "QUANTITY"
      ? selectedForGroup.reduce((a, b) => a + b.quantity, 0)
      : selectedForGroup.length;
    if (count < min) reject("REQUIRED_OPTION_MISSING", "A required option is missing");
    if (count > max || (group.selectionMode === "SINGLE" && count > 1)) {
      reject("OPTION_LIMIT_EXCEEDED", "Too many options selected");
    }
    if (selectedForGroup.length > 0 && group.available !== true) {
      reject("OPTION_UNAVAILABLE", "Selected option group is unavailable");
    }
    for (const choice of selectedForGroup) {
      const option = options.find(x => x.id === choice.optionId);
      if (!option) reject("OPTION_NOT_FOUND", "Selected option does not belong to this group");
      if (option.available !== true) reject("OPTION_UNAVAILABLE", "Option is unavailable");
      boundedInt("maxQuantity", option.maxQuantity ?? 1, 1, 100);
      if (choice.quantity > (option.maxQuantity ?? 1) ||
          (group.selectionMode !== "QUANTITY" && choice.quantity !== 1)) {
        reject("OPTION_LIMIT_EXCEEDED", "Exceeds option quantity limit");
      }
      const chargeMode = option.chargeMode ?? "PER_UNIT";
      if ((type === "PIZZA" && !["PER_UNIT", "PER_PIZZA"].includes(chargeMode)) ||
          (type !== "PIZZA" && chargeMode !== "PER_UNIT")) {
        reject("INVALID_OPTION_PRICE_MODE", "Option charge mode does not match product type");
      }
      const amount = BigInt(money("priceDeltaCents", option.priceDeltaCents)) *
        BigInt(choice.quantity);
      if (amount > BigInt(Number.MAX_SAFE_INTEGER)) {
        reject("CATALOG_PRICE_INVALID", "Addon amount overflows safe cents");
      }
      addons.push({
        id: group.id + ":" + option.id,
        chargeMode,
        priceCents: Number(amount)
      });
      accepted.push({ groupId: group.id, optionId: option.id, quantity: choice.quantity });
      chosen.delete(group.id + ":" + option.id);
    }
  }
  if (chosen.size) reject("OPTION_GROUP_NOT_FOUND", "An option references another product/group");
  accepted.sort((a, b) => (a.groupId + ":" + a.optionId).localeCompare(b.groupId + ":" + b.optionId));
  return { accepted, addons };
}

function resolvePizza(variant, selectedFractions) {
  if (!variant || !Array.isArray(variant.flavors)) {
    reject("PIZZA_VARIANT_REQUIRED", "Pizza requires a variant with flavor pricing");
  }
  const flavors = variant.flavors;
  if (flavors.length > 100) reject("INVALID_CATALOG", "Excessive flavor catalog");
  uniqueById(flavors, "INVALID_CATALOG");
  if (!Array.isArray(selectedFractions) || selectedFractions.length < 1 ||
      selectedFractions.length > 12) {
    reject("INVALID_FRACTION_SUM", "Pizza requires an explicit fraction selection");
  }
  const maxDistinct = boundedInt("maxDistinctFlavors", variant.maxDistinctFlavors ?? 1, 1, 12);
  if (selectedFractions.length > maxDistinct) {
    reject("TOO_MANY_FLAVORS", "Too many selected flavors for this variant");
  }
  const ids = new Set(), fractions = [], prices = [];
  const surcharges = [];
  const allowed = variant.allowedFractionDenominators ?? [1];
  if (!Array.isArray(allowed) || !allowed.length || !allowed.every(x => Number.isSafeInteger(x) && x >= 1 && x <= 12)) {
    reject("INVALID_CATALOG", "Invalid fraction size policy");
  }
  for (const part of selectedFractions) {
    if (!isRecord(part) || !id(part.flavorId) || ids.has(part.flavorId)) {
      reject("INVALID_FRACTION", "Flavor IDs must be unique");
    }
    ids.add(part.flavorId);
    const flavor = flavors.find(x => x.id === part.flavorId);
    if (!flavor) reject("FLAVOR_NOT_FOUND", "Selected flavor is not in this variant");
    if (flavor.available !== true) reject("FLAVOR_UNAVAILABLE", "Selected flavor is unavailable");
    if (!allowed.includes(part.denominator)) reject("FRACTION_NOT_ALLOWED", "Unsupported portion size");
    fractions.push({ numerator: part.numerator, denominator: part.denominator });
    prices.push(money("flavor.priceCents", flavor.priceCents));
    surcharges.push(money("flavor.surchargeCents", flavor.surchargeCents ?? 0));
  }
  ensureUnitFractions(fractions);
  const policy = variant.pizzaPricingPolicy;
  if (!["MAX_SELECTED_FLAVOR", "WEIGHTED_FRACTIONS", "BASE_PLUS_FLAVOR_SURCHARGES"].includes(policy)) {
    reject("PIZZA_POLICY_MISSING", "Pizza pricing policy must be explicitly configured");
  }
  const config = { pricingPolicy: policy, fractions };
  if (policy === "BASE_PLUS_FLAVOR_SURCHARGES") {
    config.doughBaseCents = money("doughBaseCents", variant.doughBaseCents);
    config.flavorSurchargesCents = surcharges;
  } else {
    config.baseFlavorPricesCents = prices;
  }
  return { priceInputs: config, normalizedFractions: selectedFractions.map(part => ({
    flavorId: part.flavorId, numerator: part.numerator, denominator: part.denominator
  })).sort((a, b) => a.flavorId.localeCompare(b.flavorId)) };
}

/**
 * Resolves published prices/options from a previously authorized catalog.
 * Context MUST be server-derived; tenant/store claims from the browser are
 * not authentication. Returns a draft pricing input, NOT a confirmed quote.
 */
export function resolvePublishedCatalogSelection({ catalog, context, selection }) {
  if (!isRecord(context) || !id(context.tenantId) || !id(context.storeId)) {
    reject("TRUSTED_CONTEXT_REQUIRED", "Authenticated store context is required");
  }
  if (!isRecord(catalog) || catalog.tenantId !== context.tenantId ||
      catalog.storeId !== context.storeId) {
    reject("STORE_SCOPE_MISMATCH", "Catalog cannot cross tenant/store boundaries");
  }
  if (catalog.published !== true) reject("CATALOG_UNPUBLISHED", "Catalog is not published");
  if (!Number.isSafeInteger(catalog.version) || catalog.version < 1 ||
      !isRecord(selection) || selection.catalogVersion !== catalog.version) {
    reject("REQUOTE_REQUIRED", "Catalog version missing or stale");
  }
  if (!Array.isArray(catalog.products) || catalog.products.length > 2000) {
    reject("INVALID_CATALOG", "Catalog products must be a bounded list");
  }
  if (!id(selection.productId)) reject("PRODUCT_NOT_FOUND", "Missing product identifier");
  const matchingProducts = catalog.products.filter(x => x?.id === selection.productId);
  if (matchingProducts.length !== 1) reject("PRODUCT_NOT_FOUND", "Product not uniquely found");
  const product = matchingProducts[0];
  if (product.visibility !== "PUBLISHED" || product.availability !== "AVAILABLE") {
    reject("ITEM_UNAVAILABLE", "Product cannot be purchased");
  }
  const type = product.productType;
  if (!["SIMPLE", "CONFIGURABLE", "PIZZA", "COMBO"].includes(type)) {
    reject("INVALID_CATALOG", "Unsupported product type");
  }
  if (type === "COMBO") {
    reject("COMBO_SLOT_VALIDATION_NOT_IMPLEMENTED", "Combo slot selection is not yet verified");
  }
  const quantity = boundedInt("quantity", selection.quantity, 1, 100);
  const variants = product.variants ?? [];
  if (!Array.isArray(variants) || variants.length > 100) {
    reject("INVALID_CATALOG", "Invalid variant list");
  }
  uniqueById(variants, "INVALID_CATALOG");
  const variant = variants.length
    ? variants.find(x => x.id === selection.variantId)
    : null;
  if (variants.length && !variant) reject("VARIANT_REQUIRED", "Select an available variant");
  if (!variants.length && selection.variantId != null) {
    reject("VARIANT_NOT_FOUND", "Product has no variants");
  }
  if (variant && variant.available !== true) {
    reject("VARIANT_UNAVAILABLE", "Variant unavailable");
  }
  const { accepted, addons } = resolveOptions(
    product, variant, selection.selectedOptions ?? [], type
  );
  let pricingInput;
  let normalizedFractions = [];
  if (type === "PIZZA") {
    const pizza = resolvePizza(variant, selection.fractions);
    pricingInput = { ...pizza.priceInputs, quantity, addons };
    normalizedFractions = pizza.normalizedFractions;
  } else {
    if (selection.fractions !== undefined) {
      reject("INVALID_CONFIGURATION", "Only pizzas can have flavor fractions");
    }
    const configured = variant?.priceCents ?? product.basePriceCents;
    pricingInput = { basePriceCents: money("priceCents", configured), quantity, addons };
  }
  return {
    storeId: context.storeId,
    tenantId: context.tenantId,
    catalogVersion: catalog.version,
    productId: product.id,
    variantId: variant?.id ?? null,
    pricingInput,
    selectionSnapshot: {
      productId: product.id,
      variantId: variant?.id ?? null,
      quantity,
      selectedOptions: accepted,
      fractions: normalizedFractions
    },
    status: "CATALOG_RESOLVED_NOT_QUOTED"
  };
}
