#!/usr/bin/env node
/**
 * Valida o contrato estático das rotas canônicas de clientes em /portfolio.
 * Hubs regionais/programáticos têm contratos próprios e não devem ser forçados
 * a declarar imagem social quando não existe ativo factual apropriado.
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
    else if (/^portfolio(?:\.index|\.\$slug)\.(?:tsx|ts)$/.test(name)) files.push(full);
  }
  return files;
}

const files = walk(ROUTES);
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  const head = src.match(/head\s*:\s*(?:\([^)]*\)|[^=,{]+)?\s*=>\s*\(?(\{[\s\S]*?\n\s*\}\)?\s*,?\n\s*(?:component|loader|beforeLoad)\s*:)/)?.[1] ?? src;
  const required = [
    [/meta\s*:\s*\[[\s\S]*?\{\s*title\s*:/, "title"],
    [/name:\s*["']description["']/, "meta description"],
    [/name:\s*["']robots["']/, "robots"],
    [/rel:\s*["']canonical["']/, "canonical"],
    [/property:\s*["']og:title["']/, "Open Graph title"],
    [/property:\s*["']og:description["']/, "Open Graph description"],
    [/property:\s*["']og:url["']/, "Open Graph URL"],
    [/name:\s*["']twitter:card["']/, "Twitter card"],
    [/application\/ld\+json/, "Schema.org JSON-LD"],
  ];
  for (const [pattern, label] of required) {
    if (!pattern.test(head)) errors.push(`${rel}: ${label} ausente`);
  }
}

if (errors.length) {
  console.error("[portfolio-meta] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}
console.log(`[portfolio-meta] OK — ${files.length} rotas canônicas verificadas.`);
