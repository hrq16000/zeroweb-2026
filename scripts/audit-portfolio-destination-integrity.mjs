#!/usr/bin/env node
/**
 * Read-only audit of clientKey -> operational destination bindings.
 *
 * This script never prints phone digits and never writes data. It exists to
 * distinguish runtime configuration, provenance and known conflicts without
 * treating "funnel works" as "destination is verified".
 *
 * Usage:
 *   node scripts/audit-portfolio-destination-integrity.mjs
 *   node scripts/audit-portfolio-destination-integrity.mjs --json
 *   node scripts/audit-portfolio-destination-integrity.mjs --enforce
 */
import { readFileSync } from "node:fs";

const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const ledgerDoc = JSON.parse(
  readFileSync("src/config/portfolio-funnel-destinations.json", "utf8"),
);
const aliases = JSON.parse(
  readFileSync("src/config/portfolio-whatsapp-env-aliases.json", "utf8"),
);
const runtimeSource = readFileSync("src/lib/whatsapp-redirect.server.ts", "utf8");

const ledger = ledgerDoc.entries ?? {};
const json = process.argv.includes("--json");
const enforce = process.argv.includes("--enforce");

function canonicalEnvName(clientKey) {
  return `PORTFOLIO_WHATSAPP_${String(clientKey).toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
}

function runtimeEnvName(clientKey) {
  return aliases[clientKey] ?? canonicalEnvName(clientKey);
}

function hasValidEnvDestination(clientKey) {
  const digits = String(process.env[runtimeEnvName(clientKey)] ?? "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

const keys = clients.map((c) => c.clientKey).filter(Boolean);
const slugs = clients.map((c) => c.slug).filter(Boolean);
const duplicateClientKeys = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
const duplicateSlugs = [...new Set(slugs.filter((k, i) => slugs.indexOf(k) !== i))];

const aliasGroups = new Map();
for (const [clientKey, envName] of Object.entries(aliases)) {
  const list = aliasGroups.get(envName) ?? [];
  list.push(clientKey);
  aliasGroups.set(envName, list);
}
const sharedAliases = [...aliasGroups.entries()]
  .filter(([, clientKeys]) => clientKeys.length > 1)
  .map(([envName, clientKeys]) => ({
    envName,
    clientKeys: [...clientKeys].sort(),
    ledgerStates: Object.fromEntries(
      clientKeys.map((key) => [key, ledger[key]?.status ?? "NO_LEDGER_ENTRY"]),
    ),
    humanDecisionRecorded: clientKeys.every((key) => Boolean(ledger[key]?.humanDecision)),
  }));

// Until the runtime imports the shared JSON directly, guard against accidental
// drift between the compatibility map and the hard-coded legacy resolver.
const aliasDrift = Object.entries(aliases)
  .filter(([clientKey, envName]) =>
    !runtimeSource.includes(`clientKey === \"${clientKey}\"`) ||
    !runtimeSource.includes(`\"${envName}\"`),
  )
  .map(([clientKey]) => clientKey);

const configuredFromEnvironment = keys.filter(hasValidEnvDestination);
const staleConfiguredFlags = clients
  .filter((c) => Boolean(c.funnelRecipientConfigured) !== hasValidEnvDestination(c.clientKey))
  .map((c) => ({
    slug: c.slug,
    declared: Boolean(c.funnelRecipientConfigured),
    runtimeEnvironmentConfigured: hasValidEnvDestination(c.clientKey),
  }));

const statusCounts = Object.values(ledger).reduce((acc, row) => {
  const status = row?.status ?? "UNKNOWN";
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {});

const p0 = [];
if (duplicateClientKeys.length) p0.push("DUPLICATE_CLIENT_KEY");
if (duplicateSlugs.length) p0.push("DUPLICATE_SLUG");
if (aliasDrift.length) p0.push("LEGACY_ALIAS_MAP_DRIFT");
if (sharedAliases.length) p0.push("SHARED_OPERATIONAL_ALIAS_REQUIRES_DECISION");

const report = {
  projects: clients.length,
  stableClientKeys: new Set(keys).size,
  duplicateClientKeys,
  duplicateSlugs,
  provenanceEntries: Object.keys(ledger).length,
  provenanceStatusCounts: statusCounts,
  legacyAliases: Object.keys(aliases).length,
  sharedAliases,
  aliasDrift,
  environment: {
    // Count/state only. Never emit env names paired with digits or raw values.
    configuredCount: configuredFromEnvironment.length,
    staleConfiguredFlags,
  },
  p0,
  notes: [
    "Environment configuration is compatibility state, not proof of ownership.",
    "A working funnel is not equivalent to a verified destination.",
    "Shared aliases are never auto-promoted by this audit.",
  ],
};

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("PORTFOLIO_DESTINATION_INTEGRITY_AUDIT");
  console.log(`${report.projects} projetos · ${report.stableClientKeys} clientKeys únicos`);
  console.log(`${report.provenanceEntries} entradas de proveniência · ${report.legacyAliases} aliases legados`);
  console.log(`destinos reconhecidos no ambiente atual: ${report.environment.configuredCount}`);
  console.log(`flags legadas divergentes do ambiente atual: ${report.environment.staleConfiguredFlags.length}`);
  if (report.sharedAliases.length) {
    console.log("ALIASES COMPARTILHADOS:");
    for (const row of report.sharedAliases) {
      console.log(`  ${row.clientKeys.join(" <-> ")} · decisão registrada=${row.humanDecisionRecorded ? "sim" : "não"}`);
    }
  }
  if (report.aliasDrift.length) {
    console.log(`DRIFT NO MAPA DE ALIASES: ${report.aliasDrift.join(", ")}`);
  }
  if (p0.length) console.log(`P0: ${p0.join(", ")}`);
}

if (enforce && p0.length) process.exit(1);
