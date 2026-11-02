import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DeliveryPricingError, priceConfiguredLine, validateMinimumOrder, validatePizzaFractions } from "../../src/lib/delivery/pricing.mjs";

const fixtures = JSON.parse(readFileSync(
  fileURLToPath(new URL("../../docs/delivery/PRICE_CALCULATION_FIXTURES.v1.json", import.meta.url)),
  "utf8"
));

for (const fixture of fixtures.cases) {
  test("R3 contract fixture " + fixture.id, () => {
    const { input, expected } = fixture;
    if (expected.totalCents !== undefined) {
      const actual = priceConfiguredLine(input);
      for (const [key, value] of Object.entries(expected)) {
        assert.equal(actual[key], value, fixture.id + " → " + key);
      }
    } else if (fixture.id === "INVALID_FRACTIONS_BLOCK") {
      assert.throws(
        () => validatePizzaFractions(input.fractions),
        (err) => err instanceof DeliveryPricingError && err.code === expected.errorCode
      );
    } else if (fixture.id === "MINIMUM_ORDER_BLOCK") {
      assert.throws(
        () => validateMinimumOrder(input.eligibleMerchandiseCents, input.minimumOrderCents),
        (err) => err instanceof DeliveryPricingError && err.code === expected.errorCode
      );
    } else {
      assert.throws(
        () => priceConfiguredLine(input),
        (err) => err instanceof DeliveryPricingError && err.code === expected.errorCode
      );
    }
  });
}

test("pizza fractions must add exactly to one", () => {
  const input = {
    quantity: 1, pricingPolicy: "WEIGHTED_FRACTIONS",
    fractions: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 4 }],
    baseFlavorPricesCents: [4200, 5400]
  };
  assert.throws(() => priceConfiguredLine(input), { code: "INVALID_FRACTION_SUM" });
});

test("fractional money/negative cents and zero quantity are rejected", () => {
  assert.throws(() => priceConfiguredLine({ quantity: 1, basePriceCents: 4.2 }), { code: "INVALID_AMOUNT" });
  assert.throws(() => priceConfiguredLine({ quantity: 1, basePriceCents: -1 }), { code: "INVALID_AMOUNT" });
  assert.throws(() => priceConfiguredLine({ quantity: 0, basePriceCents: 100 }), { code: "INVALID_QUANTITY" });
  assert.throws(() => priceConfiguredLine({ quantity: 1.2, basePriceCents: 100 }), { code: "INVALID_AMOUNT" });
});

test("money overflow is rejected rather than silently rounded", () => {
  assert.throws(
    () => priceConfiguredLine({ quantity: 2, basePriceCents: Number.MAX_SAFE_INTEGER }),
    { code: "AMOUNT_OVERFLOW" }
  );
});

test("shipping never receives the merchandise percent discount", () => {
  const price = priceConfiguredLine({
    quantity: 1, basePriceCents: 1000, deliveryFeeCents: 700,
    discount: { type: "PERCENT_BPS", basisPoints: 1000, appliesTo: "ELIGIBLE_ITEMS_SUBTOTAL" }
  });
  assert.equal(price.discountCents, 100);
  assert.equal(price.totalCents, 1600);
});

test("exact cents half-up rounds one cent from 0.5 cent", () => {
  const price = priceConfiguredLine({
    pricingPolicy: "WEIGHTED_FRACTIONS", quantity: 1,
    fractions: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 2 }],
    baseFlavorPricesCents: [100, 101]
  });
  assert.equal(price.basePizzaCents, 101);
});

test("duplicate addon cannot charge pizza edge twice", () => {
  assert.throws(
    () => priceConfiguredLine({
      pricingPolicy: "MAX_SELECTED_FLAVOR",
      fractions: [{ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 2 }],
      baseFlavorPricesCents: [4200, 5400], quantity: 1,
      addons: [
        { id: "edge", chargeMode: "PER_PIZZA", priceCents: 900 },
        { id: "edge", chargeMode: "PER_PIZZA", priceCents: 900 }
      ]
    }),
    { code: "INVALID_ADDONS" }
  );
});

test("invalid discount cannot exceed 100% or item subtotal", () => {
  assert.throws(() => priceConfiguredLine({
    quantity: 1, basePriceCents: 1000, discountCents: 1001
  }), { code: "INVALID_DISCOUNT" });
  assert.throws(() => priceConfiguredLine({
    quantity: 1, basePriceCents: 1000,
    discount: { type: "PERCENT_BPS", basisPoints: 10001, appliesTo: "ELIGIBLE_ITEMS_SUBTOTAL" }
  }), { code: "INVALID_DISCOUNT" });
});

test("misconfigured combo/pizza addon mode and missing prices fail closed", () => {
  assert.throws(
    () => priceConfiguredLine({
      quantity: 1, basePriceCents: 1000, comboPriceCents: 700
    }),
    { code: "INVALID_PRICE_SOURCE" }
  );
  assert.throws(
    () => priceConfiguredLine({
      quantity: 1, basePriceCents: 1000,
      addons: [{ id: "edge", chargeMode: "PER_PIZZA", priceCents: 900 }]
    }),
    { code: "INVALID_ADDON_MODE" }
  );
});

test("minimum order is based on merchandise after discount, not freight", () => {
  assert.throws(() => priceConfiguredLine({
    quantity: 1, basePriceCents: 3000, discountCents: 200,
    deliveryFeeCents: 2000, minimumOrderCents: 3000
  }), { code: "BELOW_MINIMUM_ORDER" });
});

test("option maximum is enforced, independently of button visibility", () => {
  assert.throws(() => priceConfiguredLine({
    quantity: 1, basePriceCents: 1000,
    group: { minSelect: 0, maxSelect: 1, selectedOptionIds: ["one", "two"] }
  }), { code: "OPTION_LIMIT_EXCEEDED" });
});

test("pricing kernel never creates an order or claims payment", () => {
  const result = priceConfiguredLine({ quantity: 1, basePriceCents: 1699, deliveryFeeCents: 0 });
  assert.equal(result.totalCents, 1699);
  assert.ok(!("orderId" in result));
  assert.ok(!("paymentStatus" in result));
});
