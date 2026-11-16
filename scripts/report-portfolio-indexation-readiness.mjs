#!/usr/bin/env node
/**
 * Resumo da auditoria HTTP real de /portfolio, sem chaves nem Supabase.
 * Roda depois de audit-portfolio-indexability.mjs na rotina permanente.
 * O objetivo e acompanhar elegibilidade, NAO inventar indexacao GSC.
 */
import { readFile, mkdir, writeFile, appendFile } from "node:fs/promises";
import { buildPortfolioIndexationReadiness, formatPortfolioIndexationReadiness } from "./lib/portfolio-indexation-scorecard.mjs";

const [audit, manifests, catalog] = await Promise.all([
  readFile("seo-reports/portfolio-indexability-latest.json", "utf8").then(JSON.parse),
  readFile("src/config/portfolio-project-manifests.json", "utf8").then(JSON.parse),
  readFile("src/config/portfolio-catalog.json", "utf8").then(JSON.parse),
]);
const sourceTime = Date.parse(audit.generatedAt ?? "");
if (!Number.isFinite(sourceTime) || Math.abs(Date.now() - sourceTime) > 60 * 60 * 1000) {
  throw new Error("PORTFOLIO_READINESS_REPORT: auditoria HTTP inexistente ou desatualizada (>1 hora)");
}
const scorecard = buildPortfolioIndexationReadiness(audit, manifests, catalog);
await mkdir("seo-reports", { recursive: true });
await writeFile(
  "seo-reports/portfolio-indexation-readiness-latest.json",
  JSON.stringify(scorecard, null, 2) + "\n",
);
const markdown = formatPortfolioIndexationReadiness(scorecard);
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
}
if (scorecard.newV4.blocked || scorecard.newV4.unpublishedLeakedToSitemap.length) {
  console.error("[portfolio-indexation-scorecard] FAIL: novo v4 publicado nao elegivel ou URL vazou no sitemap");
  process.exit(1);
}
console.log("[portfolio-indexation-scorecard] OK — relatorio gerado; indexacao GSC nao inferida");
