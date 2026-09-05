#!/usr/bin/env node
/**
 * Gate de ORIGINALIDADE dos projetos /portfolio/:slug.
 *
 * Independente do gate de conformidade (check:portfolio-projects):
 * COMPLETE != ORIGINAL. Regras em scripts/portfolio-originality.mjs.
 *
 * Uso:
 *   node scripts/check-portfolio-originality.mjs                 # report-only (nunca bloqueia)
 *   node scripts/check-portfolio-originality.mjs --json          # JSON no stdout
 *   node scripts/check-portfolio-originality.mjs --report        # grava reports/ + src/config/portfolio-originality.json
 *   node scripts/check-portfolio-originality.mjs --write-baseline
 *   node scripts/check-portfolio-originality.mjs --enforce       # falha só em REGRESSÃO (passivo legado é tolerado)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzePortfolio, toBaseline, detectRegressions, STATUS } from "./portfolio-originality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const writeReport = args.includes("--report");
const writeBaseline = args.includes("--write-baseline");
const enforce = args.includes("--enforce");

const BASELINE_PATH = path.join(root, "reports/portfolio-originality.baseline.json");
const JSON_PATH = path.join(root, "reports/portfolio-originality.json");
const MD_PATH = path.join(root, "reports/portfolio-originality.md");
const ADMIN_PATH = path.join(root, "src/config/portfolio-originality.json");

const report = analyzePortfolio(root);
const baseline = fs.existsSync(BASELINE_PATH)
  ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"))
  : null;
const regression = detectRegressions(report, baseline);
report.regression = {
  mode: enforce ? "NEW_OR_MODIFIED" : "REPORT_ONLY",
  baseline: baseline ? baseline.summary : null,
  current: report.summary,
  verdict: regression.verdict,
  regressions: regression.regressions,
  improvements: regression.improvements,
};

function markdown(r) {
  const s = r.summary;
  const rows = [...r.projects].sort((a, b) => b.score - a.score);
  const sig = (arr) => (arr.length ? arr.join(", ") : "—");
  return `# Originalidade do portfólio

Gerado por \`bun run check:portfolio-originality --report\`. Determinístico: mesmos
arquivos produzem o mesmo resultado. Modo atual: **${r.regression.mode}**.

## Fórmula

\`score = ${Object.entries(r.weights).map(([k, v]) => `${v}·${k}`).join(" + ")}\`

Cada dimensão é um índice de Jaccard sobre conjuntos derivados do componente
renderizado (n-gramas de estrutura, ordem de seções, componentes próprios,
classes de layout sem cor, padrão de assets, cor/ícone). Infraestrutura
compartilhada é excluída do fingerprint — reutilizá-la não penaliza.

Limiares: 0–20 ORIGINAL · 21–40 ACCEPTABLE · 41–60 ATTENTION · 61–80 HIGH_SIMILARITY · 81–100 CLONE.

## Summary

| Métrica | Valor |
|---|---|
| Total | ${s.total} |
| ORIGINAL | ${s.original} |
| ACCEPTABLE | ${s.acceptable} |
| ATTENTION | ${s.attention} |
| HIGH_SIMILARITY | ${s.highSimilarity} |
| CLONE | ${s.clone} |
| SHARED_FALLBACK | ${s.sharedFallback} |
| Clusters | ${s.clusters} |
| Logos placeholder | ${s.placeholderLogos} |
| Logos ausentes | ${s.missingLogos} |
| Capas sem arquivo no catálogo (legado) | ${s.missingCovers} |
| Capas válidas (contrato canônico) | ${s.coverValid ?? "—"} |
| Capas pendentes (contrato canônico) | ${s.coverPending ?? "—"} |
| Capas usando imagem social | ${s.coversAsSocialImage} |
| Capas compartilhadas | ${s.sharedCovers} |
| Crop severo | ${s.severeCrop} |
| Assets de marca cruzados (inválidos) | ${s.invalidCrossClientAssets ?? 0} |
| Assets compartilhados suspeitos | ${s.suspiciousSharedAssets ?? 0} |

## Clusters

${r.clusters.map((c) => `### ${c.id} — ${c.reason} (média ${c.averageScore}, risco ${c.risk})
Base: \`${c.baseComponent}\`
Membros: ${c.members.join(", ")}`).join("\n\n") || "Nenhum cluster acima do limiar."}

## Matriz de pares — top 20

| A | B | Score | Motivo | STRUCTURE | SECTION_ORDER | COMPONENT | STYLE | COPY | ASSET | IDENTITY |
|---|---|---|---|---|---|---|---|---|---|---|
${r.topPairs.slice(0, 20).map((x) => `| ${x.a} | ${x.b} | ${x.score} | ${x.reason} | ${x.dimensions.STRUCTURE_SIMILARITY} | ${x.dimensions.SECTION_ORDER_SIMILARITY} | ${x.dimensions.COMPONENT_SIMILARITY} | ${x.dimensions.STYLE_SIMILARITY} | ${x.dimensions.COPY_SIMILARITY} | ${x.dimensions.ASSET_PATTERN_SIMILARITY} | ${x.dimensions.IDENTITY_SIMILARITY} |`).join("\n")}

## Compartilhamento de assets entre clientes

${r.projects.flatMap((p) => (p.assetSharing ?? []).map((x) => `- ${p.slug} · ${x.kind} · ${x.classification} · \`${x.path}\` · também em: ${x.sharedWith.join(", ")}`)).join("\n") || "Nenhum asset percebido compartilhado entre clientes."}

## Projetos

| Projeto | Score | Status | Mais parecido | Motivo | Capa | Logo | Fallback |
|---|---|---|---|---|---|---|---|
${rows.map((p) => `| ${p.slug} | ${p.score} | ${p.originalityStatus} | ${p.nearestMatch ?? "—"} (${p.nearestMatchScore}) | ${p.reasons[0] ?? "DISTINCT"} | ${sig(p.coverSignals)} | ${sig(p.logoSignals)} | ${p.fallbackVertical ?? "—"} |`).join("\n")}

## Regressão

Veredito: **${r.regression.verdict}**

${r.regression.regressions.length === 0 ? "Nenhuma regressão em relação à baseline." : r.regression.regressions.map((x) => `- ${x.kind}: ${JSON.stringify(x)}`).join("\n")}

${r.regression.improvements.length ? `Melhorias:\n${r.regression.improvements.map((x) => `- ${JSON.stringify(x)}`).join("\n")}` : ""}
`;
}

if (writeReport) {
  fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
  fs.writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MD_PATH, markdown(report));
  // Visão compacta consumida pelo admin (sem banco).
  fs.writeFileSync(
    ADMIN_PATH,
    `${JSON.stringify(
      {
        generatedAt: null,
        weights: report.weights,
        thresholds: report.thresholds,
        summary: report.summary,
        clusters: report.clusters,
        projects: report.projects.map((p) => ({
          slug: p.slug,
          score: p.score,
          originalityStatus: p.originalityStatus,
          nearestMatch: p.nearestMatch,
          nearestMatchScore: p.nearestMatchScore,
          reasons: p.reasons,
          dimensions: p.dimensions,
          coverSignals: p.coverSignals,
          logoSignals: p.logoSignals,
          assetSharing: p.assetSharing ?? [],
          nearest: report.pairMatrix.nearest[p.slug] ?? [],
          fallbackVertical: p.fallbackVertical,
        })),
      },
      null,
      2,
    )}\n`,
  );
}

if (writeBaseline) {
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(toBaseline(report), null, 2)}\n`);
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const s = report.summary;
  const worst = [...report.projects].sort((a, b) => b.score - a.score).slice(0, 10);
  for (const p of worst) {
    console.log(
      `[${p.originalityStatus}] ${p.slug} · score ${p.score} · ~ ${p.nearestMatch} · ${p.reasons[0] ?? "DISTINCT"}`,
    );
  }
  console.log(
    `\n[portfolio-originality] ${s.total} projeto(s) · ${s.original} ORIGINAL · ${s.acceptable} ACCEPTABLE · ${s.attention} ATTENTION · ${s.highSimilarity} HIGH_SIMILARITY · ${s.clone} CLONE · ${s.sharedFallback} SHARED_FALLBACK · ${s.clusters} cluster(s)`,
  );
  console.log(
    `[portfolio-originality] identidade: ${s.placeholderLogos} logo(s) placeholder · ${s.coverValid ?? "—"} capa(s) válida(s) · ${s.coverPending ?? "—"} capa(s) pendente(s) · ${s.sharedCovers} capa(s) compartilhada(s)`,
  );
  console.log(
    `[portfolio-originality] modo ${report.regression.mode} · regressão ${report.regression.verdict}` +
      (baseline ? "" : " (sem baseline)"),
  );
  for (const x of regression.regressions) console.log(`  ! ${x.kind} ${x.slug ?? x.key}`);
}

const shouldFail = enforce && regression.verdict === "FAIL";
if (shouldFail) {
  console.error(
    "\n[portfolio-originality] REGRESSÃO: uma alteração aumentou clones/fallbacks/placeholders acima da baseline.",
  );
}
process.exit(shouldFail ? 1 : 0);

export { STATUS };
