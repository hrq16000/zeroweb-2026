#!/usr/bin/env node
/**
 * 0WEB Delivery readiness preflight (R7).
 *
 * IMPORTANT: Fail-closed specification gate, NOT a production E2E attestor.
 * No runtime delivery test infrastructure is connected yet, so this program
 * deliberately cannot return PASS. The R8 / implementation milestone must
 * replace the sentinel with verification against real trusted CI evidence.
 * Does not touch existing portfolio/service build or production behavior.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REQUIRED_GATE_IDS = Object.freeze([
  "REAL_STORE_CATALOG",
  "MOBILE_CATALOG_UX",
  "OPTIONS_PIZZA_COMBO_PRICING",
  "PERSISTENT_REVALIDATED_CART",
  "SERVER_QUOTE_DELIVERY_COVERAGE",
  "DURABLE_IDEMPOTENT_ORDER",
  "PAYMENT_SANDBOX_WEBHOOK_RECONCILIATION",
  "CUSTOMER_ORDER_TRACKING",
  "OPERATOR_QUEUE_REALTIME",
  "KITCHEN_KDS_OPERATION",
  "DELIVERY_PICKUP_FULFILLMENT",
  "SERVER_SIDE_ROLE_AUTHORIZATION",
  "CROSS_TENANT_RLS_ISOLATION",
  "LGPD_PII_PAYMENT_SECURITY",
  "OUTBOX_NETWORK_FAILURE_RECOVERY",
  "MOBILE_A11Y_PERFORMANCE_E2E",
  "PRODUCTION_SMOKE_WITH_REAL_STORE"
]);

export const DELIVERY_READINESS_SCHEMA = "0web.delivery.readiness.v1";

export function evaluateDeliveryReadiness(manifest) {
  const blockers = [];
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    blockers.push({ gate: "MANIFEST_INVALID", reason: "Expected a JSON object." });
  } else {
    if (manifest.schemaVersion !== DELIVERY_READINESS_SCHEMA) {
      blockers.push({ gate: "SCHEMA_INVALID", reason: "Unsupported manifest schema." });
    }
    if (typeof manifest.storeId !== "string" || !manifest.storeId.trim()) {
      blockers.push({ gate: "STORE_ID_MISSING", reason: "A real store identifier is required." });
    }
    if (manifest.systemType !== "TRANSACTIONAL_DELIVERY") {
      blockers.push({ gate: "SYSTEM_TYPE_INVALID", reason: "A lead-only landing is not a transactional delivery system." });
    }
    if (manifest.productionEnabled === true) {
      blockers.push({ gate: "PRODUCTION_SWITCH_UNSAFE", reason: "R7 has no trusted runtime attestor. Production must remain disabled." });
    }
    if (!Array.isArray(manifest.gates)) {
      blockers.push({ gate: "GATES_INVALID", reason: "Expected a gates array." });
    }
    const rows = Array.isArray(manifest.gates) ? manifest.gates : [];
    const seen = new Set();
    for (const entry of rows) {
      if (!entry || typeof entry !== "object" || typeof entry.id !== "string") {
        blockers.push({ gate: "GATE_ROW_INVALID", reason: "Malformed gate entry." });
        continue;
      }
      if (seen.has(entry.id)) blockers.push({ gate: "GATE_DUPLICATED", reason: entry.id });
      seen.add(entry.id);
      if (!REQUIRED_GATE_IDS.includes(entry.id)) {
        blockers.push({ gate: "UNKNOWN_GATE", reason: entry.id });
      }
    }
    for (const id of REQUIRED_GATE_IDS) {
      const entry = rows.find((row) => row && row.id === id);
      if (!entry || entry.status !== "PASS") {
        blockers.push({
          gate: id,
          reason: !entry ? "Missing mandatory gate." : "Not passed with verified runtime evidence."
        });
        continue;
      }
      if (entry.evidence?.source !== "CI_VERIFIED_RUNTIME_E2E" ||
          typeof entry.evidence?.runUrl !== "string" ||
          !/^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/[0-9]+(?:\/.*)?$/.test(entry.evidence.runUrl) ||
          typeof entry.evidence?.commitSha !== "string" ||
          entry.evidence.commitSha !== manifest.commitSha ||
          !/^[a-f0-9]{40}$/i.test(manifest.commitSha ?? "")) {
        blockers.push({ gate: id, reason: "Missing or invalid CI runtime evidence metadata." });
      }
    }
  }
  // Deliberate independent barrier: a user-supplied JSON "PASS" or copied
  // action URL is not verified proof that a checkout/order/KDS E2E actually ran.
  // Remove this sentinel ONLY in a separately reviewed implementation PR that
  // validates trusted CI attestations, real E2E results and store readiness.
  blockers.push({
    gate: "TRUSTED_RUNTIME_ATTESTOR_NOT_INSTALLED",
    reason: "R7 cannot verify real executed delivery E2E/DB/payment-sandbox evidence. Never mark DELIVERY_READY=PASS."
  });
  return {
    schemaVersion: DELIVERY_READINESS_SCHEMA,
    status: "BLOCKED",
    deliveryReady: false,
    blockerCount: blockers.length,
    blockers
  };
}

function runCli(argv) {
  const i = argv.indexOf("--manifest");
  const path = i >= 0 ? argv[i + 1] : "docs/delivery/DELIVERY_READINESS_MANIFEST.example.json";
  let result;
  try {
    if (!path || path.startsWith("--")) throw new Error("Missing manifest path");
    const manifest = JSON.parse(readFileSync(resolve(path), "utf8"));
    result = evaluateDeliveryReadiness(manifest);
  } catch (err) {
    result = evaluateDeliveryReadiness(null);
    result.blockers.unshift({ gate: "MANIFEST_LOAD_FAILED", reason: String(err.message || err) });
    result.blockerCount = result.blockers.length;
  }
  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else {
    process.stdout.write("DELIVERY_OPERATIONAL_GATE = " + result.status + "\n");
    for (const x of result.blockers) process.stdout.write("- " + x.gate + ": " + x.reason + "\n");
  }
  process.exitCode = 2; // never succeed on a specification-only checkout
}

const invokedFile = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedFile === fileURLToPath(import.meta.url)) runCli(process.argv.slice(2));
