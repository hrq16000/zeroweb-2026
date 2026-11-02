import test from "node:test";
import assert from "node:assert/strict";
import {
  DELIVERY_READINESS_SCHEMA,
  REQUIRED_GATE_IDS,
  evaluateDeliveryReadiness
} from "../../scripts/delivery/check-operational-readiness.mjs";

function fakeManifest(overrides = {}) {
  return {
    schemaVersion: DELIVERY_READINESS_SCHEMA,
    storeId: "QA-STORE-NOT-REAL",
    systemType: "TRANSACTIONAL_DELIVERY",
    productionEnabled: false,
    implementationStatus: "NOT_IMPLEMENTED",
    commitSha: "a".repeat(40),
    gates: REQUIRED_GATE_IDS.map((id) => ({ id, status: "NOT_EXECUTED", evidence: null })),
    ...overrides
  };
}

test("delivery readiness gates are unique and cover all required outcomes", () => {
  assert.equal(REQUIRED_GATE_IDS.length, 17);
  assert.equal(new Set(REQUIRED_GATE_IDS).size, REQUIRED_GATE_IDS.length);
  assert.ok(REQUIRED_GATE_IDS.includes("DURABLE_IDEMPOTENT_ORDER"));
  assert.ok(REQUIRED_GATE_IDS.includes("KITCHEN_KDS_OPERATION"));
  assert.ok(REQUIRED_GATE_IDS.includes("CROSS_TENANT_RLS_ISOLATION"));
});

test("not implemented gate never marks a demo store ready", () => {
  const result = evaluateDeliveryReadiness(fakeManifest());
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.deliveryReady, false);
  assert.ok(result.blockers.some((x) => x.gate === "DURABLE_IDEMPOTENT_ORDER"));
  assert.ok(result.blockers.some((x) => x.gate === "TRUSTED_RUNTIME_ATTESTOR_NOT_INSTALLED"));
});

test("reject lead-only landing as transactional delivery", () => {
  const result = evaluateDeliveryReadiness(fakeManifest({ systemType: "LEAD_ONLY_LANDING" }));
  assert.ok(result.blockers.some((x) => x.gate === "SYSTEM_TYPE_INVALID"));
  assert.equal(result.deliveryReady, false);
});

test("productionEnabled true is unsafe before trusted E2E", () => {
  const result = evaluateDeliveryReadiness(fakeManifest({ productionEnabled: true }));
  assert.ok(result.blockers.some((x) => x.gate === "PRODUCTION_SWITCH_UNSAFE"));
});

test("unknown, missing or duplicated gate entries are blocked", () => {
  const base = fakeManifest();
  base.gates = base.gates.slice(1).concat(base.gates[1], { id: "FAKE_EXTRA", status: "PASS" });
  const result = evaluateDeliveryReadiness(base);
  assert.ok(result.blockers.some((x) => x.gate === "GATE_DUPLICATED"));
  assert.ok(result.blockers.some((x) => x.gate === "UNKNOWN_GATE"));
  assert.ok(result.blockers.some((x) => x.gate === REQUIRED_GATE_IDS[0]));
});

test("fabricated PASS entries and CI action links do not count as verified attestation", () => {
  const base = fakeManifest();
  base.gates = REQUIRED_GATE_IDS.map((id) => ({
    id,
    status: "PASS",
    evidence: {
      source: "CI_VERIFIED_RUNTIME_E2E",
      runUrl: "https://github.com/hrq16000/zeroweb-2026/actions/runs/123456789",
      commitSha: base.commitSha
    }
  }));
  const result = evaluateDeliveryReadiness(base);
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.deliveryReady, false);
  assert.ok(result.blockers.some((x) => x.gate === "TRUSTED_RUNTIME_ATTESTOR_NOT_INSTALLED"));
});

test("invalid or unparseable manifest never passes", () => {
  for (const bad of [null, {}, [], "oops", { gates: [] }]) {
    const result = evaluateDeliveryReadiness(bad);
    assert.equal(result.status, "BLOCKED");
    assert.equal(result.deliveryReady, false);
  }
});
