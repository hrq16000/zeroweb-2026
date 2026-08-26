#!/usr/bin/env node
/** Valida metadados mínimos de SEO nas páginas públicas do portfólio. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const ROUTES = join(ROOT, "src", "routes");
const errors = [];

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) files.push(...walk(full));
    else if (/^portfolio(?:\.|\.).*\.(?:tsx|ts)$/.test(name)) files.push(full);
  }
  return files;
}

for (const file of walk(ROUTES)) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  const required = [
    [/rel:\s*["']canonical["']/, "canonical"],
    [/property:\s*["']og:title["']/, "Open Graph title"],
    [/property:\s*["']og:description["']/, "Open Graph description"],
    [/property:\s*["']og:url["']/, "Open Graph URL"],
    [/application\/ld\+json/, "Schema.org JSON-LD"],
  ];
  for (const [pattern, label] of required) {
    if (!pattern.test(src)) errors.push(`${rel}: ${label} ausente`);
  }
}

if (errors.length) {
  console.error("[portfolio-meta] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}
console.log(`[portfolio-meta] OK — ${walk(ROUTES).length} rotas de portfólio verificadas.`);
