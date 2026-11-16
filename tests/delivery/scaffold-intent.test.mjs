import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../..");
const slug = "delivery-intent-probe-r8";
const draftPath = resolve(projectRoot, "docs/portfolio/delivery-readiness", slug + ".json");

function runScaffold(args) {
  return spawnSync(
    process.execPath,
    ["scripts/scaffold-portfolio-client.mjs",
      "--slug", slug, "--name", "Delivery Readiness QA",
      "--dry-run", ...args],
    { cwd: projectRoot, encoding: "utf8", timeout: 30000 }
  );
}

test("existing default scaffold stays independent of transactional delivery", () => {
  const result = runScaffold(["--funnel-type", "pedido"]);
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /\[scaffold:delivery\] readiness:/);
  assert.doesNotMatch(result.stdout, /docs\/portfolio\/delivery-readiness\/delivery-intent-probe-r8\.json/);
  assert.equal(existsSync(draftPath), false, "dry-run must not create file");
});

test("transactional delivery opt-in creates only a BLOCKED draft plan in dry-run", () => {
  const result = runScaffold(["--funnel-type", "pedido", "--delivery-transactional"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[scaffold:delivery\] readiness: docs\/portfolio\/delivery-readiness\/delivery-intent-probe-r8\.json/);
  assert.match(result.stdout, /DELIVERY_READY=BLOCKED/);
  assert.equal(existsSync(draftPath), false, "dry-run must not create file");
});

test("readiness sample has all mandatory gates NOT_EXECUTED", async () => {
  const { readFileSync } = await import("node:fs");
  const { REQUIRED_GATE_IDS } = await import("../../scripts/delivery/check-operational-readiness.mjs");
  const sample = JSON.parse(readFileSync(resolve(projectRoot, "docs/delivery/DELIVERY_READINESS_MANIFEST.example.json"), "utf8"));
  assert.deepEqual(sample.gates.map((g) => g.id), [...REQUIRED_GATE_IDS]);
  assert.ok(sample.gates.every((g) => g.status === "NOT_EXECUTED" && g.evidence === null));
  assert.equal(sample.productionEnabled, false);
});
