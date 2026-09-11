#!/usr/bin/env node
/**
 * Quality matrix gate — camada editorial/visual do lifecycle.
 *
 * Documento mestre: docs/PORTFOLIO_LANDING_QUALITY_MATRIX.md
 *
 * LEGADO PROTEGIDO: só avalia slugs com manifesto
 * (src/config/portfolio-project-manifests.json, lifecycleContract >= 1).
 *
 * Uso:
 *   node scripts/check-portfolio-landing-quality.mjs
 *   node scripts/check-portfolio-landing-quality.mjs --slug=carecas-infotec
 *   node scripts/check-portfolio-landing-quality.mjs --json
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const readJson = (p, fallback) => {
  const abs = path.resolve(root, p);
  if (!existsSync(abs)) return fallback;
  try {
    return JSON.parse(readFileSync(abs, "utf8"));
  } catch {
    return fallback;
  }
};

export const DIMENSIONS = [
  "ENTITY",
  "CONTENT",
  "MEDIA",
  "VISUAL_COMPOSITION",
  "ORIGINALITY",
  "DISCOVERY",
  "SEO",
  "CONVERSION",
  "PROOF",
  "RESPONSIVENESS",
  "PERFORMANCE",
  "ACCESSIBILITY",
  "QA",
];

const STATUSES = new Set(["PASS", "WARNING", "FAIL", "NOT_APPLICABLE"]);

export function evaluateMatrix(slug, matrix) {
  const failures = [];
  const warnings = [];

  if (!matrix) {
    return {
      slug,
      status: "MISSING",
      failures: [`quality matrix ausente: docs/portfolio/quality-matrix/${slug}.json`],
      warnings: [],
      score: null,
      technicalPass: false,
      editorialPass: false,
    };
  }

  for (const dim of DIMENSIONS) {
    const entry = matrix.dimensions?.[dim];
    if (!entry || !STATUSES.has(entry.status)) {
      failures.push(`dimensão não avaliada: ${dim}`);
      continue;
    }
    if (entry.status === "FAIL") failures.push(`${dim}: FAIL — ${entry.notes ?? "sem nota"}`);
    if (entry.status === "WARNING") warnings.push(`${dim}: ${entry.notes ?? "warning"}`);
  }

  // Hero e Cover são avaliados separadamente (§7 e §8).
  for (const key of ["hero", "cover"]) {
    const status = matrix[key]?.status;
    if (!STATUSES.has(status)) failures.push(`${key} matrix não avaliada`);
    else if (status === "FAIL") failures.push(`${key}: FAIL — ${matrix[key].notes ?? "sem nota"}`);
    else if (status === "WARNING") warnings.push(`${key}: ${matrix[key].notes ?? "warning"}`);
  }

  // Coverage visual: toda seção registrada precisa de decisão visual deliberada.
  const coverage = Array.isArray(matrix.coverage) ? matrix.coverage : [];
  if (!coverage.length) failures.push("coverage visual matrix vazia");
  for (const row of coverage) {
    if (!row.mediaDecision) failures.push(`coverage sem mediaDecision: ${row.section}`);
    if (row.status === "FAIL") failures.push(`coverage FAIL em "${row.section}": ${row.notes ?? "sem nota"}`);
    if (row.status === "WARNING") warnings.push(`coverage warning em "${row.section}"`);
  }

  // Dead zones abertas são P0 (§14).
  for (const dz of matrix.deadZones ?? []) {
    if (dz.resolved) warnings.push(`dead zone resolvida: ${dz.section} — ${dz.resolution ?? ""}`);
    else failures.push(`VISUAL_DEAD_ZONE aberta: ${dz.section} (${dz.viewport ?? "?"})`);
  }

  // P0 declarados reprovam sempre.
  for (const p0 of matrix.p0 ?? []) failures.push(`P0: ${typeof p0 === "string" ? p0 : p0.issue}`);

  if (matrix.technicalPass !== true) failures.push("technicalPass não confirmado");
  if (matrix.editorialPass !== true) failures.push("editorialPass não confirmado");

  warnings.push(...(matrix.warnings ?? []));

  return {
    slug,
    status: failures.length ? "FAIL" : "PASS",
    failures,
    warnings,
    score: matrix.score?.total ?? null,
    technicalPass: matrix.technicalPass === true,
    editorialPass: matrix.editorialPass === true,
    ownerRequired: matrix.ownerRequired ?? [],
  };
}

const manifests = readJson("src/config/portfolio-project-manifests.json", { projects: {} }).projects ?? {};
const slugs = Object.keys(manifests).filter((s) => !onlySlug || s === onlySlug);
const results = slugs.map((slug) =>
  evaluateMatrix(slug, readJson(`docs/portfolio/quality-matrix/${slug}.json`, null)),
);

if (asJson) {
  console.log(JSON.stringify({ results }, null, 2));
} else {
  console.log(`\n[quality-matrix] ${results.length} projeto(s) gerenciado(s)\n`);
  for (const r of results) {
    console.log(`${r.status === "PASS" ? "✅" : "⛔"} ${r.slug} — score=${r.score ?? "n/a"} technical=${r.technicalPass} editorial=${r.editorialPass}`);
    for (const f of r.failures) console.log(`     FAIL     ${f}`);
    for (const w of r.warnings) console.log(`     warning  ${w}`);
    for (const o of r.ownerRequired ?? []) console.log(`     OWNER_REQUIRED  ${o}`);
    console.log("");
  }
}

const failing = results.filter((r) => r.status !== "PASS");
const enforce = process.env.PORTFOLIO_QUALITY_ENFORCE === "1";
if (failing.length && enforce) {
  console.error(`[quality-matrix] ${failing.length} projeto(s) reprovado(s).`);
  process.exit(1);
}
process.exit(0);
