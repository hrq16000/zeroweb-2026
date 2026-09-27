#!/usr/bin/env node
/**
 * Valida o contrato estático de SEO das rotas públicas de portfólio.
 * O auditor runtime continua responsável por provar o HTML final/indexabilidade.
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
    [/application\/ld\+json/, "Schema.org JSON-LD"],
  ];

  for (const [pattern, label] of required) {
    if (!pattern.test(src)) errors.push(`${rel}: ${label} ausente`);
  }

  // noindex pode ser legítimo em rotas facetadas/programáticas de baixa qualidade.
  // O gate não o proíbe estaticamente: audit-portfolio-indexability prova os slugs
  // canônicos publicados e impede que páginas elegíveis desapareçam do índice.
}

if (errors.length) {
  console.error("[portfolio-meta] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log(
  `[portfolio-meta] OK — ${files.length} rotas verificadas com title, description, robots, canonical, OG image, Twitter card e JSON-LD.`,
);
