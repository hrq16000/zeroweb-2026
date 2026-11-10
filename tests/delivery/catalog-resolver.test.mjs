import test from "node:test";
import assert from "node:assert/strict";
import { DeliveryCatalogError, resolvePublishedCatalogSelection } from "../../src/lib/delivery/catalog-resolver.mjs";

const context = Object.freeze({ tenantId: "tenant-a", storeId: "store-a" });

function fixture() {
  return {
    catalog: {
      tenantId: "tenant-a", storeId: "store-a", published: true, version: 3,
      products: [
        { id: "sandwich", productType: "SIMPLE", visibility: "PUBLISHED",
          availability: "AVAILABLE", basePriceCents: 1699 },
        { id: "burger", productType: "CONFIGURABLE", visibility: "PUBLISHED",
          availability: "AVAILABLE", variants: [
            { id: "big", available: true, priceCents: 3299 },
            { id: "small", available: false, priceCents: 2499 }
          ], optionGroups: [
            { id: "extras", available: true, selectionMode: "MULTI",
              minSelect: 1, maxSelect: 2, options: [
                { id: "cheese", available: true, priceDeltaCents: 500, maxQuantity: 1 },
                { id: "bacon", available: true, priceDeltaCents: 800, maxQuantity: 1 },
                { id: "onions", available: false, priceDeltaCents: 100, maxQuantity: 1 }
              ] }
          ] },
        { id: "pizza", productType: "PIZZA", visibility: "PUBLISHED",
          availability: "AVAILABLE", variants: [{
            id: "large", available: true,
            pizzaPricingPolicy: "WEIGHTED_FRACTIONS",
            maxDistinctFlavors: 2, allowedFractionDenominators: [2, 1],
            flavors: [
              { id: "a", available: true, priceCents: 4200 },
              { id: "b", available: true, priceCents: 5400 },
              { id: "c", available: false, priceCents: 6800 }
            ],
            optionGroups: [{ id: "edge", available: true, selectionMode: "SINGLE",
              minSelect: 0, maxSelect: 1, options: [
                { id: "catupiry", available: true, chargeMode: "PER_PIZZA",
                  priceDeltaCents: 900 }
              ] }]
          }] },
        { id: "combo", productType: "COMBO", visibility: "PUBLISHED",
          availability: "AVAILABLE", comboPriceCents: 3299 }
      ]
    },
    context: { ...context },
    selection: { catalogVersion: 3, productId: "sandwich", quantity: 2 }
  };
}

function run(changes) {
  const data = fixture();
  if (changes) changes(data);
  return resolvePublishedCatalogSelection(data);
}
function throwsCode(changes, code) {
  assert.throws(() => run(changes),
    err => err instanceof DeliveryCatalogError && err.code === code);
}

test("simple product returns server-resolved cents and selection snapshot", () => {
  const item = run();
  assert.deepEqual(item.pricingInput, { basePriceCents: 1699, quantity: 2, addons: [] });
  assert.equal(item.status, "CATALOG_RESOLVED_NOT_QUOTED");
  assert.equal(item.catalogVersion, 3);
  assert.equal(item.selectionSnapshot.productId, "sandwich");
  assert.ok(!("orderId" in item));
  assert.ok(!("paymentState" in item));
});

test("product variant and required addons are validated before pricing", () => {
  const item = run(x => { x.selection = {
    catalogVersion: 3, productId: "burger", variantId: "big", quantity: 1,
    selectedOptions: [{ groupId: "extras", optionId: "cheese" },
      { groupId: "extras", optionId: "bacon" }]
  };});
  assert.equal(item.pricingInput.basePriceCents, 3299);
  assert.deepEqual(item.pricingInput.addons, [
    { id: "extras:cheese", chargeMode: "PER_UNIT", priceCents: 500 },
    { id: "extras:bacon", chargeMode: "PER_UNIT", priceCents: 800 }
  ]);
  assert.deepEqual(item.selectionSnapshot.selectedOptions,
    [{ groupId: "extras", optionId: "bacon", quantity: 1 },
      { groupId: "extras", optionId: "cheese", quantity: 1 }]);
});

test("store and tenant boundaries reject foreign catalogs", () => {
  throwsCode(x => { x.context.storeId = "store-b"; }, "STORE_SCOPE_MISMATCH");
  throwsCode(x => { x.context.tenantId = "tenant-b"; }, "STORE_SCOPE_MISMATCH");
  throwsCode(x => { x.context = null; }, "TRUSTED_CONTEXT_REQUIRED");
});

test("stale catalog and unpublished data cannot price", () => {
  throwsCode(x => { x.selection.catalogVersion = 2; }, "REQUOTE_REQUIRED");
  throwsCode(x => { x.catalog.published = false; }, "CATALOG_UNPUBLISHED");
  throwsCode(x => { x.catalog.products[0].visibility = "DRAFT"; }, "ITEM_UNAVAILABLE");
  throwsCode(x => { x.catalog.products[0].availability = "SOLD_OUT"; }, "ITEM_UNAVAILABLE");
});

test("variant and mandatory option rules prevent incomplete products", () => {
  throwsCode(x => { x.selection = { catalogVersion: 3, productId: "burger", quantity: 1 }; }, "VARIANT_REQUIRED");
  throwsCode(x => { x.selection = { catalogVersion: 3, productId: "burger", variantId: "small", quantity: 1, selectedOptions: [{groupId:"extras",optionId:"cheese"}] }; }, "VARIANT_UNAVAILABLE");
  throwsCode(x => { x.selection = { catalogVersion: 3, productId: "burger", variantId: "big", quantity: 1 }; }, "REQUIRED_OPTION_MISSING");
  throwsCode(x => { x.selection = { catalogVersion: 3, productId: "burger", variantId: "big", quantity: 1, selectedOptions: [
    { groupId:"extras",optionId:"cheese" }, { groupId:"extras",optionId:"cheese" }
  ]}; }, "DUPLICATE_OPTION");
  throwsCode(x => { x.selection = { catalogVersion: 3, productId: "burger", variantId: "big", quantity: 1, selectedOptions: [
    { groupId:"extras",optionId:"unknown" }
  ]}; }, "OPTION_NOT_FOUND");
  throwsCode(x => { x.selection = { catalogVersion: 3, productId: "burger", variantId: "big", quantity: 1, selectedOptions: [
    { groupId:"extras",optionId:"onions" }
  ]}; }, "OPTION_UNAVAILABLE");
});

test("selected option cannot belong to another group or product", () => {
  throwsCode(x => { x.selection.selectedOptions = [
    { groupId: "extras", optionId: "cheese" }
  ]; }, "OPTION_GROUP_NOT_FOUND");
  throwsCode(x => { x.selection.selectedOptions = [
    { groupId: "other", optionId: "cheese" }
  ]; }, "OPTION_GROUP_NOT_FOUND");
});

test("pizza fraction + variant prices are taken from published catalog", () => {
  const item = run(x => { x.selection = {
    catalogVersion: 3, productId: "pizza", variantId: "large", quantity: 2,
    fractions: [
      { flavorId: "a", numerator: 1, denominator: 2 },
      { flavorId: "b", numerator: 1, denominator: 2 }
    ],
    selectedOptions: [{ groupId: "edge", optionId: "catupiry" }]
  };});
  assert.deepEqual(item.pricingInput, {
    pricingPolicy: "WEIGHTED_FRACTIONS",
    fractions: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 2 }],
    baseFlavorPricesCents: [4200, 5400],
    quantity: 2,
    addons: [{ id: "edge:catupiry", chargeMode: "PER_PIZZA", priceCents: 900 }]
  });
  assert.equal(item.storeId, "store-a");
});

test("invalid pizza portions, flavors or variant are blocked", () => {
  const selectPizza = x => { x.selection = {
    catalogVersion:3, productId:"pizza", variantId:"large", quantity:1,
    fractions: [{ flavorId:"a",numerator:1,denominator:2 },
      { flavorId:"b",numerator:1,denominator:2 }]
  };};
  throwsCode(x => { selectPizza(x); x.selection.fractions[1].denominator = 3; }, "FRACTION_NOT_ALLOWED");
  throwsCode(x => { selectPizza(x); x.selection.fractions[1].numerator = 2; }, "INVALID_FRACTION_SUM");
  throwsCode(x => { selectPizza(x); x.selection.fractions[1].flavorId = "c"; }, "FLAVOR_UNAVAILABLE");
  throwsCode(x => { selectPizza(x); x.selection.fractions[1].flavorId = "z"; }, "FLAVOR_NOT_FOUND");
  throwsCode(x => { selectPizza(x); x.selection.fractions[1].flavorId = "a"; }, "INVALID_FRACTION");
  throwsCode(x => { selectPizza(x); x.selection.variantId = "missing"; }, "VARIANT_REQUIRED");
});

test("combos with unverified slots fail closed, not silently priced", () => {
  throwsCode(x => { x.selection.productId = "combo"; }, "COMBO_SLOT_VALIDATION_NOT_IMPLEMENTED");
});

test("browser-injected cents and invalid catalog pricing cannot be trusted", () => {
  const res = run(x => { x.selection.priceCents = 1; });
  assert.equal(res.pricingInput.basePriceCents, 1699);
  throwsCode(x => { x.catalog.products[0].basePriceCents = 19.5; }, "CATALOG_PRICE_INVALID");
  throwsCode(x => { x.catalog.products[0].basePriceCents = -1; }, "CATALOG_PRICE_INVALID");
  throwsCode(x => { x.selection.quantity = 0; }, "INVALID_CONFIGURATION");
});

test("a selected item cannot bypass a missing explicit catalog version", () => {
  throwsCode(x => { delete x.selection.catalogVersion; }, "REQUOTE_REQUIRED");
  throwsCode(x => { x.catalog.version = 0; }, "REQUOTE_REQUIRED");
});
