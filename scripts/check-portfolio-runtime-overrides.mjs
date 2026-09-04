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

// ---- Matriz de cobertura por componente -----------------------------------
// MANAGED = o campo realmente muda a saída pública quando o admin salva.
// HARDCODED_INTENTIONAL = composição autoral que não entra no núcleo comum.
const files = readdirSync(COMPONENT_DIR).filter((f) => f.endsWith("Page.tsx"));
const rows = [];
for (const file of files) {
  const src = readFileSync(join(COMPONENT_DIR, file), "utf8");
  const isPortfolio = src.includes("PortfolioUpsellPopup") || src.includes("PortfolioStandardShell");
  if (!isPortfolio) continue;
  const has = (re) => re.test(src);
  rows.push({
    component: file,
    logo:
      has(/managedField="logoUrl"/) || has(/useManagedValue\("logoUrl"/)
        ? "MANAGED"
        : /logo/i.test(src)
          ? "MISSING"
          : "NOT_APPLICABLE",
    hero:
      has(/managedField="heroImageUrl"/) || has(/useManagedValue\("heroImageUrl"/)
        ? "MANAGED"
        : has(/<PortfolioImage(?![^>]*managedField)[^>]*priority/)
          ? "MISSING"
          : "NOT_APPLICABLE",
    headline: has(/field="heroHeadline"/) ? "MANAGED" : "HARDCODED_INTENTIONAL",
    subheadline: has(/field="heroSubheadline"/) ? "MANAGED" : "HARDCODED_INTENTIONAL",
    cta: has(/field="ctaLabel"/) ? "MANAGED" : "HARDCODED_INTENTIONAL",
  });
}

const FIELDS = ["logo", "hero", "headline", "subheadline", "cta"];
const coreManaged = rows.filter((r) => FIELDS.some((f) => r[f] === "MANAGED"));
const missing = [];
for (const r of rows) {
  for (const f of FIELDS) if (r[f] === "MISSING") missing.push(`${r.component}:${f}`);
}

// Regressão de cobertura: o número de componentes com núcleo administrável
// nunca pode cair abaixo da linha de base registrada aqui.
const BASELINE_MANAGED = 66;

const lines = [
  "# Matriz de cobertura runtime por componente",
  "",
  "SEO/OG/social image/canonical/robots são resolvidos na rota e valem para **todos** os projetos.",
  "As colunas abaixo indicam o consumo dentro do componente próprio de cada cliente.",
  "",
  "Legenda: `MANAGED` (admin altera a saída pública) · `HARDCODED_INTENTIONAL`",
  "(composição autoral preservada) · `NOT_APPLICABLE` · `MISSING` (bloqueante).",
  "",
  `- Componentes de portfólio auditados: ${rows.length}`,
  `- Componentes com núcleo administrável: ${coreManaged.length}`,
  `- Conexões faltando (MISSING): ${missing.length}`,
  "",
  "| Componente | Logo | Hero | Headline | Subheadline | CTA |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows
    .sort((a, b) => a.component.localeCompare(b.component))
    .map((r) => `| ${r.component} | ${r.logo} | ${r.hero} | ${r.headline} | ${r.subheadline} | ${r.cta} |`),
  "",
];
mkdirSync("reports", { recursive: true });
writeFileSync("reports/portfolio-runtime-matrix.md", lines.join("\n"));

if (missing.length) failures.push(`RUNTIME_FIELD_MISSING: ${missing.join(", ")}`);
if (coreManaged.length < BASELINE_MANAGED) {
  failures.push(
    `RUNTIME_COVERAGE_REGRESSION: ${coreManaged.length} < baseline ${BASELINE_MANAGED}`,
  );
}

console.log(`Componentes de portfólio: ${rows.length} | núcleo administrável: ${coreManaged.length} | MISSING: ${missing.length}`);
console.log("Matriz: reports/portfolio-runtime-matrix.md");

if (failures.length) {
  for (const f of failures) console.error(`✗ ${f}`);
  if (enforce || true) process.exit(1);
}
console.log("✓ Contrato admin → runtime público íntegro.");
