#!/usr/bin/env node
/**
 * Valida o contrato mínimo de SEO das páginas públicas de portfólio.
 *
 * Este gate é deliberadamente estático: impede regressões estruturais no
 * código-fonte sem substituir o auditor runtime de indexabilidade.
 */
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

const files = walk(ROUTES);
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  const required = [
    [/(?:\{\s*title:|title\s*:)/, "title"],
    [/name:\s*["']description["']/, "meta description"],
    [/name:\s*["']robots["']/, "robots"],
    [/rel:\s*["']canonical["']/, "canonical"],
    [/property:\s*["']og:title["']/, "Open Graph title"],
    [/property:\s*["']og:description["']/, "Open Graph description"],
    [/property:\s*["']og:url["']/, "Open Graph URL"],
    [/property:\s*["']og:image["']/, "Open Graph image"],
    [/name:\s*["']twitter:card["']/, "Twitter card"],
    [/name:\s*["']twitter:title["']/, "Twitter title"],
    [/name:\s*["']twitter:description["']/, "Twitter description"],
    [/application\/ld\+json/, "Schema.org JSON-LD"],
  ];

  for (const [pattern, label] of required) {
    if (!pattern.test(src)) errors.push(`${rel}: ${label} ausente`);
  }

  if (/noindex/i.test(src)) {
    errors.push(`${rel}: noindex encontrado em rota pública de portfólio`);
  }
}

if (errors.length) {
  console.error("[portfolio-meta] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log(
  `[portfolio-meta] OK — ${files.length} rotas verificadas com title, description, robots, canonical, OG, Twitter e JSON-LD; sem noindex estático.`,
);
