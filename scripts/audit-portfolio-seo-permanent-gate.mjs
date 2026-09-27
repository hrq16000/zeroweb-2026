#!/usr/bin/env node
/**
 * Gate permanente de SEO/indexabilidade dos portfolios publicados.
 *
 * Este orquestrador NÃO força indexação e NÃO interpreta ausência de sinal GSC
 * como erro. Ele reúne os gates determinísticos do portal; evidência externa
 * continua observacional e deve vir do GSC.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const baseUrl = (process.argv[2] || "https://0web.com.br").replace(/\/$/, "");
const checks = [
  { name: "metadata", script: "scripts/validate-portfolio-meta.mjs", args: [] },
  { name: "schema", script: "scripts/validate-portfolio-schema.mjs", args: [] },
  { name: "runtime-indexability", script: "scripts/audit-portfolio-indexability.mjs", args: [baseUrl] },
  { name: "internal-link-graph", script: "scripts/audit-portfolio-internal-link-graph.mjs", args: [], optionalUntilMerged: true },
  { name: "discovery-consistency", script: "scripts/audit-portfolio-discovery-consistency.mjs", args: [baseUrl], optionalUntilMerged: true },
];

const results = [];
let failed = false;

for (const check of checks) {
  if (!existsSync(check.script)) {
    const status = check.optionalUntilMerged ? "PENDING_COMPONENT" : "MISSING";
    results.push({ name: check.name, status, script: check.script });
    if (!check.optionalUntilMerged) failed = true;
    console.log(`[portfolio-seo-gate] ${status} ${check.name} — ${check.script}`);
    continue;
  }

  console.log(`\n[portfolio-seo-gate] RUN ${check.name}`);
  const run = spawnSync(process.execPath, [check.script, ...check.args], {
    stdio: "inherit",
    env: process.env,
  });
  const ok = run.status === 0;
  results.push({ name: check.name, status: ok ? "PASS" : "FAIL", script: check.script });
  if (!ok) failed = true;
}

console.log("\n[portfolio-seo-gate] RESUMO");
for (const result of results) console.log(` - ${result.name}: ${result.status}`);
console.log("[portfolio-seo-gate] GSC: observacional — ausência de sinal não reprova uma URL tecnicamente elegível.");

if (failed) {
  console.error("[portfolio-seo-gate] FAIL — pelo menos um contrato determinístico foi violado.");
  process.exit(1);
}
console.log("[portfolio-seo-gate] PASS — contratos determinísticos preservados.");
