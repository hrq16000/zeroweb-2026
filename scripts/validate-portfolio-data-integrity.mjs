#!/usr/bin/env node

/**
 * Data-integrity gate for /portfolio.
 *
 * Default mode fails on dangerous contradictions (invalid/duplicate verified
 * bindings and direct commercial bypass) but reports migration coverage as a
 * warning. Use --enforce-coverage only after the contact recovery migration is
 * intentionally closed.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const enforceCoverage = process.argv.includes("--enforce-coverage");
const CLIENT_KEYS_FILE = path.join(ROOT, "src/lib/portfolio-client-keys.ts");
const BINDINGS_FILE = path.join(ROOT, "src/config/portfolio-contact-bindings.json");
const SITE_DIR = path.join(ROOT, "src/components/site");

const errors = [];
const warnings = [];

function loadClientKeys() {
  const source = readFileSync(CLIENT_KEYS_FILE, "utf8");
  const block = source.match(/PORTFOLIO_CLIENT_KEYS\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!block) throw new Error("PORTFOLIO_CLIENT_KEYS não pôde ser lido.");
  return [...block[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return digits;
  return null;
}

function validateBindings(clientKeys) {
  if (!existsSync(BINDINGS_FILE)) {
    errors.push("Registro src/config/portfolio-contact-bindings.json não existe.");
    return;
  }

  const registry = JSON.parse(readFileSync(BINDINGS_FILE, "utf8"));
  const entries = registry.entries || {};
  const allowedStatuses = new Set(registry.statuses || []);
  const knownKeys = new Set(clientKeys);
  const verifiedPhones = new Map();

  for (const [key, entry] of Object.entries(entries)) {
    if (!knownKeys.has(key)) errors.push(`Binding órfão: ${key} não existe em PORTFOLIO_CLIENT_KEYS.`);
    if (entry.clientKey !== key) errors.push(`Binding ${key}: clientKey interno diverge (${entry.clientKey}).`);
    if (!allowedStatuses.has(entry.status)) errors.push(`Binding ${key}: status inválido ${entry.status}.`);

    const normalized = entry.phoneE164 ? normalizePhone(entry.phoneE164) : null;
    if (entry.status === "VERIFIED") {
      if (!normalized) errors.push(`Binding ${key}: VERIFIED sem telefone brasileiro válido.`);
      if (!entry.source || !entry.verifiedAt || !Array.isArray(entry.evidence) || entry.evidence.length === 0) {
        errors.push(`Binding ${key}: VERIFIED sem proveniência/data/evidência completa.`);
      }
    }

    if (normalized && entry.status === "VERIFIED") {
      const prior = verifiedPhones.get(normalized);
      if (prior && prior !== key && !entry.sharedGroup) {
        errors.push(`Telefone VERIFIED duplicado sem sharedGroup: ${prior} <-> ${key} (+${normalized}).`);
      } else {
        verifiedPhones.set(normalized, key);
      }
    }
  }

  const missing = clientKeys.filter((key) => !entries[key]);
  const unresolved = clientKeys.filter((key) => entries[key] && entries[key].status !== "VERIFIED" && entries[key].status !== "NOT_APPLICABLE");
  if (missing.length) {
    const message = `${missing.length} clientKeys ainda não possuem binding versionado explícito.`;
    (enforceCoverage ? errors : warnings).push(message);
  }
  if (unresolved.length) {
    const message = `${unresolved.length} bindings ainda não estão VERIFIED/NOT_APPLICABLE.`;
    (enforceCoverage ? errors : warnings).push(message);
  }
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(name)) files.push(full);
  }
  return files;
}

function validateNoDirectCommercialBypass() {
  const pageFiles = walk(SITE_DIR).filter((file) => /Page\.(tsx?|jsx?)$/.test(file));
  const telPattern = /href\s*=\s*["'`]tel:/i;
  const directWaPattern = /href\s*=\s*["'`][^"'`]*(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/i;

  for (const file of pageFiles) {
    const source = readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file).replaceAll("\\", "/");
    if (telPattern.test(source)) errors.push(`${rel}: CTA/link tel: direto detectado.`);
    if (directWaPattern.test(source)) errors.push(`${rel}: bypass direto para WhatsApp detectado.`);
  }
}

const clientKeys = loadClientKeys();
validateBindings(clientKeys);
validateNoDirectCommercialBypass();

console.log("\nPORTFOLIO DATA INTEGRITY");
console.log(`clientKeys: ${clientKeys.length}`);
console.log(`mode: ${enforceCoverage ? "ENFORCE_COVERAGE" : "MIGRATION_SAFE"}`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`FAIL: ${error}`);

if (errors.length) {
  console.error(`\nResultado: FAIL (${errors.length} erro(s), ${warnings.length} aviso(s))`);
  process.exit(1);
}

console.log(`\nResultado: PASS (${warnings.length} aviso(s) de migração)`);
