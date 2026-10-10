import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — helper Node em JavaScript puro
import { buildPortfolioIndexationReadiness, formatPortfolioIndexationReadiness } from "../../scripts/lib/portfolio-indexation-scorecard.mjs";

const audit = {
  generatedAt: "2026-10-10T18:00:00.000Z",
  fetchBaseUrl: "https://0web.com.br",
  rows: [
    { slug: "historico", failures: [], sitemap: true },
    { slug: "site-novo", failures: [], sitemap: true },
    { slug: "site-bloqueado", failures: ["canonical inválida"], sitemap: true },
    { slug: "rascunho-v4", failures: ["noindex"], sitemap: true },
  ],
};
const manifests = { projects: {
  "historico": { contractVersion: 3, stage: "published" },
  "site-novo": { contractVersion: 4, stage: "published" },
  "site-bloqueado": { contractVersion: 4, stage: "published" },
  "rascunho-v4": { contractVersion: 4, stage: "draft" },
} };
const catalog = [
  { slug: "historico", status: "published" },
  { slug: "site-novo", status: "approved" },
  { slug: "site-bloqueado", status: "published" },
  { slug: "rascunho-v4", status: "draft" },
];

describe("scorecard de elegibilidade — distinto de indexação GSC", () => {
  test("calcula percentuais factuais da auditoria e mostra blockers por v4", () => {
    const result = buildPortfolioIndexationReadiness(audit, manifests, catalog);
    expect(result.overall).toEqual({
      checked: 4, technicallyEligible: 2, blocked: 2, percent: 50,
    });
    expect(result.newV4.published).toBe(2);
    expect(result.newV4.technicallyEligible).toBe(1);
    expect(result.newV4.percent).toBe(50);
    expect(result.newV4.entries.find((x: {slug:string}) => x.slug === "site-bloqueado").blockers)
      .toContain("canonical inválida");
    expect(result.newV4.unpublishedLeakedToSitemap).toEqual(["rascunho-v4"]);
  });

  test("sem novo v4 publicado nao fabrica percentual 100 ou contagem GSC", () => {
    const result = buildPortfolioIndexationReadiness(audit, { projects: {} }, catalog);
    expect(result.newV4.published).toBe(0);
    expect(result.newV4.percent).toBeNull();
    expect(result.googleIndexedCount).toBeNull();
    expect(result.scope).toBe("technical_eligibility_not_google_indexation");
    expect(formatPortfolioIndexationReadiness(result)).toContain("não");
  });

  test("novo v4 published ausente da auditoria nunca vira PASS", () => {
    const result = buildPortfolioIndexationReadiness(
      { ...audit, rows: audit.rows.filter((r) => r.slug !== "site-novo") },
      manifests, catalog,
    );
    expect(result.newV4.entries.find((x: {slug:string}) => x.slug === "site-novo").blockers)
      .toContain("site publicado ausente da auditoria de URLs");
  });

  test("catalogo draft ou live=false nao confirmam publicacao", () => {
    const broken = catalog.map((x) => x.slug === "site-novo" ? { ...x, status: "draft", live: false } : x);
    const result = buildPortfolioIndexationReadiness(audit, manifests, broken);
    expect(result.newV4.entries.find((x: {slug:string}) => x.slug === "site-novo").eligible).toBe(false);
  });

  test("auditoria invalida ou slugs repetidos nao produzem indicador enganoso", () => {
    expect(() => buildPortfolioIndexationReadiness(null, manifests, catalog)).toThrow();
    expect(() => buildPortfolioIndexationReadiness({ rows: [{}] }, manifests, catalog)).toThrow();
    expect(() => buildPortfolioIndexationReadiness(
      { rows: [audit.rows[0], audit.rows[0]] }, manifests, catalog,
    )).toThrow();
  });

  test("marca explicitamente que os numeros nao sao paginas indexadas no Google", () => {
    const summary = formatPortfolioIndexationReadiness(buildPortfolioIndexationReadiness(audit, manifests, catalog));
    expect(summary).toContain("elegibilidade técnica");
    expect(summary).toContain("não");
    expect(summary).toContain("VAZAMENTO NO SITEMAP");
    expect(summary).toContain("BLOQUEADO site-bloqueado");
  });

  test("o workflow diario existente salva o scorecard sem duplicar agendas", () => {
    const wf = readFileSync(".github/workflows/portfolio-seo-runtime.yml", "utf8");
    const gate = readFileSync("scripts/audit-portfolio-seo-permanent-gate.mjs", "utf8");
    const script = readFileSync("scripts/report-portfolio-indexation-readiness.mjs", "utf8");
    expect(wf).toContain('cron: "17 10 * * *"');
    expect(wf).toContain("seo-reports/portfolio-indexation-readiness-latest.json");
    expect(gate).toContain('name:"indexability-scorecard"');
    expect(script).toContain("GITHUB_STEP_SUMMARY");
    expect(script).toContain("portfolio-indexability-latest.json");
  });
});
