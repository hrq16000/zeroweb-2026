#!/usr/bin/env node
/**
 * Gate de QUALIDADE VISUAL do /portfolio (report-only por padrão).
 *
 * As regras vivem em scripts/portfolio-visual-quality.mjs. Aqui só formatamos,
 * escrevemos os relatórios e decidimos exit code.
 *
 * Uso:
 *   node scripts/check-portfolio-visual-quality.mjs             # relatório + reports/*
 *   node scripts/check-portfolio-visual-quality.mjs --json      # JSON no stdout
 *   node scripts/check-portfolio-visual-quality.mjs --enforce   # exit 1 se houver P0
 *   node scripts/check-portfolio-visual-quality.mjs --check     # não escreve, só compara
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildVisualQuality } from "./portfolio-visual-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const enforce = args.includes("--enforce");
const checkOnly = args.includes("--check");

const report = await buildVisualQuality(root);
const { summary, projects, crossAssets, contentPairs } = report;

const mdRows = projects.map((p) => {
  const top = p.issues
    .filter((i) => i.severity === "P0" || i.severity === "P1")
    .slice(0, 3)
    .map((i) => i.code);
  const rest = p.issues.filter((i) => i.severity === "P2").slice(0, 3 - top.length).map((i) => i.code);
  return `| ${p.slug} | ${p.businessName} | ${p.segment} | ${p.technical} | ${p.visual} | ${p.score} | ${p.originalityStatus}${p.originalityScore !== null ? ` (${p.originalityScore})` : ""} | ${[...top, ...rest].join(", ") || "—"} | P${p.priority} |`;
});

const issueTally = new Map();
for (const p of projects) {
  for (const i of p.issues) {
    const cur = issueTally.get(i.code) ?? { code: i.code, severity: i.severity, label: i.label, slugs: [] };
    cur.slugs.push(p.slug);
    issueTally.set(i.code, cur);
  }
}
const tally = [...issueTally.values()].sort(
  (a, b) => a.severity.localeCompare(b.severity) || b.slugs.length - a.slugs.length,
);

const queue = projects
  .filter((p) => p.priority <= 2)
  .sort((a, b) => a.priority - b.priority || a.score - b.score);

const top10 = [...projects].sort((a, b) => b.score - a.score).slice(0, 10);
const worst10 = [...projects].sort((a, b) => a.score - b.score).slice(0, 10);

const md = `# Qualidade visual do /portfolio

Gerado em ${report.generatedAt}
Runtime inspecionado em ${report.runtimeGeneratedAt ?? "—"}

Conformidade técnica (COMPLETE/PARTIAL/LEGACY) e qualidade visual
(PREMIUM/STANDARD/NEEDS_UPGRADE) são camadas independentes. Ver
\`docs/PORTFOLIO_VISUAL_QUALITY_STANDARD.md\`.

## Resumo

- PORTFOLIO REAL: **${summary.total}**
- VISUALMENTE INSPECIONADO: **${summary.visuallyReviewed}**
- TECHNICAL: COMPLETE ${summary.technical.COMPLETE} · PARTIAL ${summary.technical.PARTIAL} · LEGACY ${summary.technical.LEGACY}
- VISUAL: PREMIUM ${summary.visual.PREMIUM} · STANDARD ${summary.visual.STANDARD} · NEEDS_UPGRADE ${summary.visual.NEEDS_UPGRADE}
- ORIGINALITY: PASS ${summary.originality.PASS} · WARNING ${summary.originality.WARNING} · FAIL ${summary.originality.FAIL} · UNREVIEWED ${summary.originality.UNREVIEWED}
- ISSUES: P0 ${summary.issues.P0} · P1 ${summary.issues.P1} · P2 ${summary.issues.P2} · P3 ${summary.issues.P3}
- Score médio: **${summary.averageScore}/100**

## Pesos

${Object.entries(report.weights).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Classificação: PREMIUM >= ${report.thresholds.PREMIUM} · STANDARD ${report.thresholds.STANDARD}–${report.thresholds.PREMIUM - 1} · NEEDS_UPGRADE < ${report.thresholds.STANDARD}.
Regras de teto impedem PREMIUM com issue P0/P1, originalidade FAIL, capa REJECTED ou ausência de inspeção visual.

## Top 10 mais fortes

| Slug | Score | Visual | Originalidade |
| --- | --- | --- | --- |
${top10.map((p) => `| ${p.slug} | ${p.score} | ${p.visual} | ${p.originalityStatus} |`).join("\n")}

## Top 10 que mais precisam de upgrade

| Slug | Score | Visual | Principais problemas |
| --- | --- | --- | --- |
${worst10.map((p) => `| ${p.slug} | ${p.score} | ${p.visual} | ${p.issues.slice(0, 4).map((i) => i.code).join(", ")} |`).join("\n")}

## Todos os projetos

| Slug | Empresa | Segmento | Technical | Visual | Score | Originality | Top issues | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${mdRows.join("\n")}

## Issues por código

| Código | Severidade | Projetos | Descrição |
| --- | --- | --- | --- |
${tally.map((t) => `| ${t.code} | ${t.severity} | ${t.slugs.length} | ${t.label} |`).join("\n")}

## Assets cruzados

${
  crossAssets.length === 0
    ? "Nenhum arquivo de imagem compartilhado entre clientes."
    : `| Hash | Classificação | Slugs | Usos |
| --- | --- | --- | --- |
${crossAssets.map((c) => `| ${c.hash.slice(0, 10)} | ${c.classification} | ${c.slugs.join(", ")} | ${c.usage.map((u) => `${u.path} (${u.roles.join("/")})`).join(" · ")} |`).join("\n")}`
}

## Similaridade editorial (copy do cliente, sem boilerplate compartilhado)

${
  contentPairs.length === 0
    ? "Nenhum par acima do limiar de 35%."
    : `| A | B | Similaridade |
| --- | --- | --- |
${contentPairs.slice(0, 25).map((p) => `| ${p.a} | ${p.b} | ${p.score}% |`).join("\n")}`
}

## Fila priorizada de intervenção

${queue
  .map(
    (p, i) =>
      `${i + 1}. **${p.slug}** — prioridade ${p.priority} · score ${p.score} · ${p.visual} · ${p.issues
        .filter((x) => x.severity === "P0" || x.severity === "P1")
        .map((x) => x.code)
        .join(", ") || p.issues.slice(0, 3).map((x) => x.code).join(", ")}`,
  )
  .join("\n")}
`;

if (!checkOnly) {
  fs.mkdirSync(path.join(root, "reports"), { recursive: true });
  fs.writeFileSync(path.join(root, "reports/portfolio-visual-quality.md"), md);
  fs.writeFileSync(
    path.join(root, "reports/portfolio-visual-quality.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  // Versão enxuta consumida pelo admin (/app/portfolio).
  fs.writeFileSync(
    path.join(root, "src/config/portfolio-visual-quality.json"),
    `${JSON.stringify(
      {
        generatedAt: report.generatedAt,
        runtimeGeneratedAt: report.runtimeGeneratedAt,
        thresholds: report.thresholds,
        weights: report.weights,
        summary,
        projects: projects.map((p) => ({
          slug: p.slug,
          businessName: p.businessName,
          segment: p.segment,
          componentType: p.componentType,
          preset: p.preset,
          technical: p.technical,
          visual: p.visual,
          score: p.score,
          groupScores: p.groupScores,
          originalityStatus: p.originalityStatus,
          originalityScore: p.originalityScore,
          originalityNearest: p.originalityNearest,
          contentSimilarity: p.contentSimilarity,
          charm: p.charm,
          coverReview: p.coverReview,
          visuallyReviewed: p.visuallyReviewed,
          priority: p.priority,
          severities: p.severities,
          assets: p.assets,
          runtime: p.runtime,
          issues: p.issues,
        })),
        crossAssets,
        contentPairs: contentPairs.slice(0, 25),
      },
      null,
      2,
    )}\n`,
  );
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `[visual-quality] ${summary.total} projeto(s) · inspecionados ${summary.visuallyReviewed} · PREMIUM ${summary.visual.PREMIUM} · STANDARD ${summary.visual.STANDARD} · NEEDS_UPGRADE ${summary.visual.NEEDS_UPGRADE} · P0 ${summary.issues.P0} · P1 ${summary.issues.P1} · P2 ${summary.issues.P2} · P3 ${summary.issues.P3} · score médio ${summary.averageScore}`,
  );
  for (const p of projects.filter((x) => x.severities.P0 > 0)) {
    console.log(`  [P0] ${p.slug} → ${p.issues.filter((i) => i.severity === "P0").map((i) => i.code).join(", ")}`);
  }
}

process.exit(enforce && summary.issues.P0 > 0 ? 1 : 0);
