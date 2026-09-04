#!/usr/bin/env node
/**
 * GATE: ADMIN → BANCO → RUNTIME PÚBLICO (Frentes F e G).
 *
 * 1. Garante que /portfolio/:slug resolve SEO, OG, social image, canonical e
 *    robots pelo resolver único (src/lib/portfolio-runtime.ts) — e não por
 *    valores hardcoded.
 * 2. Gera a matriz de suporte por componente: quais páginas já consomem
 *    campos administráveis (logo, hero, galeria, CTA, copy).
 *
 * Uso: node scripts/check-portfolio-runtime-overrides.mjs [--enforce]
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROUTE = "src/routes/portfolio.$slug.tsx";
const COMPONENT_DIR = "src/components/site";
const enforce = process.argv.includes("--enforce");

const route = readFileSync(ROUTE, "utf8");
const failures = [];

const CONTRACTS = [
  ["resolver importado", /applyPortfolioRuntime/],
  ["overrides carregados no loader", /getPortfolioRuntimeOverrides/],
  ["title efetivo", /\{\s*title:\s*eff\.title\s*\}/],
  ["description efetiva", /name:\s*"description",\s*content:\s*eff\.description/],
  ["robots efetivo", /name:\s*"robots",\s*content:\s*eff\.robots/],
  ["og:title efetivo", /property:\s*"og:title",\s*content:\s*eff\.title/],
  ["og:description efetiva", /property:\s*"og:description",\s*content:\s*eff\.description/],
  ["og:image efetiva", /property:\s*"og:image",\s*content:\s*effSocial/],
  ["twitter:image efetiva", /name:\s*"twitter:image",\s*content:\s*effSocial/],
  ["canonical protegida", /rel:\s*"canonical",\s*href:\s*eff\.canonicalUrl/],
  ["contexto de runtime", /PortfolioRuntimeProvider/],
];

for (const [label, re] of CONTRACTS) {
  if (!re.test(route)) failures.push(`RUNTIME_CONTRACT_MISSING: ${label}`);
}

// ---- Matriz de suporte por componente -------------------------------------
const files = readdirSync(COMPONENT_DIR).filter((f) => f.endsWith("Page.tsx"));
const rows = [];
for (const file of files) {
  const src = readFileSync(join(COMPONENT_DIR, file), "utf8");
  const managed = src.includes("useManagedValue") || src.includes("usePortfolioRuntime");
  rows.push({
    component: file,
    logo: /useManagedValue\("logoUrl"/.test(src),
    hero: /useManagedValue\("heroImageUrl"/.test(src),
    headline: /useManagedValue\("heroHeadline"/.test(src),
    gallery: /useManagedValue\("gallery"/.test(src),
    cta: /useManagedValue\("ctaLabel"/.test(src),
    managed,
  });
}

const mark = (v) => (v ? "sim" : "—");
const covered = rows.filter((r) => r.managed).length;
const lines = [
  "# Matriz de suporte a overrides por componente",
  "",
  "SEO/OG/social image/canonical/robots são resolvidos na rota e valem para **todos** os projetos.",
  "As colunas abaixo indicam o consumo dentro do componente próprio de cada cliente.",
  "",
  `- Componentes auditados: ${rows.length}`,
  `- Componentes já conectados ao contexto administrável: ${covered}`,
  "",
  "| Componente | Logo | Hero | Headline | Galeria | CTA |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows
    .sort((a, b) => Number(b.managed) - Number(a.managed) || a.component.localeCompare(b.component))
    .map(
      (r) =>
        `| ${r.component} | ${mark(r.logo)} | ${mark(r.hero)} | ${mark(r.headline)} | ${mark(r.gallery)} | ${mark(r.cta)} |`,
    ),
  "",
];
mkdirSync("reports", { recursive: true });
writeFileSync("reports/portfolio-runtime-matrix.md", lines.join("\n"));

console.log(`Componentes auditados: ${rows.length} | conectados ao admin: ${covered}`);
console.log("Matriz: reports/portfolio-runtime-matrix.md");

if (failures.length) {
  for (const f of failures) console.error(`✗ ${f}`);
  if (enforce || true) process.exit(1);
}
console.log("✓ Contrato admin → runtime público íntegro.");
