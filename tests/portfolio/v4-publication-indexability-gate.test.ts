import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — script do build em JavaScript puro
import { checkNewPortfolioPublication, prototypeEntries } from "../../scripts/lib/portfolio-v4-publication-gate.mjs";

const slug = "novo-negocio";
const registry = `export const PORTFOLIO_PROTOTYPES = [
  { slug: "outro", siteName: "Outro", indexable: true },
  {
    slug: "novo-negocio",
    vertical: "comercios",
    siteName: "Novo Negócio",
    kind: "prototype",
    indexable: true,
  },
];`;
const manifest = (stage = "published", indexability = "complete", evidence: unknown = ["revisao editorial", "auditoria SSR"]) => ({
  contractVersion: 4, stage,
  individualSiteContract: { gates: { PORTFOLIO_INDEXABILITY_GATE: indexability }, evidence: { PORTFOLIO_INDEXABILITY_GATE: evidence } },
});

describe("publicacao e indexabilidade coerentes dos novos portfolio-sites", () => {
  test("o contrato publicado, aprovado e rastreavel passa", () => {
    expect(checkNewPortfolioPublication(slug, manifest(), { status: "published" }, registry)).toEqual([]);
    expect(checkNewPortfolioPublication(slug, manifest(), { status: "approved" }, registry)).toEqual([]);
  });

  test("projeto em preparo nao pode vazar pelo status approved ou published", () => {
    for (const stage of ["draft", "research", "enrichment", "design", "ready"]) {
      expect(checkNewPortfolioPublication(slug, manifest(stage), { status: "approved" }, registry).join(" "))
        .toContain("catálogo permite sitemap");
    }
    expect(checkNewPortfolioPublication(slug, manifest("draft"), { status: "draft" }, registry)).toEqual([]);
    expect(checkNewPortfolioPublication(slug, manifest("ready"), null, registry)).toEqual([]);
  });

  test("manifesto published exige catalogo publicavel e live ativo", () => {
    for (const item of [null, { status: "draft" }, { status: "published", live: false }]) {
      expect(checkNewPortfolioPublication(slug, manifest(), item, registry).join(" "))
        .toContain("manifesto published sem catalogo");
    }
  });

  test("proibe promover indexability apenas por declaracao sem evidencias", () => {
    for (const status of ["pending", "not_started", "not_applicable", null]) {
      expect(checkNewPortfolioPublication(slug, manifest("published", status as string), { status: "published" }, registry).join(" "))
        .toContain("indexabilidade nao comprovada");
    }
    for (const value of [[], ["", "auditoria"], null]) {
      expect(checkNewPortfolioPublication(slug, manifest("published", "complete", value), { status: "published" }, registry).join(" "))
        .toContain("falta evidencia rastreavel");
    }
  });

  test("site publicado na rota compartilhada exige entrada indexable=true e unica", () => {
    for (const source of [
      registry.replace("indexable: true,\n  },", "indexable: false,\n  },"),
      'export const PORTFOLIO_PROTOTYPES = [{ slug: "outro", indexable: true }];',
      'export const PORTFOLIO_PROTOTYPES = [{ slug: "novo-negocio", indexable: true }, { slug: "novo-negocio", indexable: true }];',
      'export const PORTFOLIO_PROTOTYPES = [{ slug: "novo-negocio" }];',
    ]) {
      expect(checkNewPortfolioPublication(slug, manifest(), { status: "published" }, source).length).toBeGreaterThan(0);
    }
  });

  test("rota exclusiva valida catalogo e manifesto sem exigir registro da rota compartilhada", () => {
    expect(checkNewPortfolioPublication(slug, manifest(), { status: "published" }, "", false)).toEqual([]);
  });

  test("os seis gerenciados historicos pre-v4 nao sofrem mudanca", () => {
    const old = JSON.parse(readFileSync("src/config/portfolio-project-manifests.json", "utf8")).projects;
    const catalog = JSON.parse(readFileSync("src/config/portfolio-catalog.json", "utf8"));
    for (const [oldSlug, value] of Object.entries(old)) {
      expect(checkNewPortfolioPublication(oldSlug, value, catalog.find((c: {slug:string})=>c.slug===oldSlug), "", true)).toEqual([]);
    }
  });

  test("o validador obrigatório executa o gate e o sitemap permite approved/published", () => {
    const validator = readFileSync("scripts/validate-portfolio-scaffold.mjs", "utf8");
    const sitemap = readFileSync("src/lib/portfolio-sitemap.server.ts", "utf8");
    expect(validator).toContain("checkNewPortfolioPublication");
    expect(sitemap).toContain('const APPROVED_STATUSES = new Set(["approved", "published"])');
    expect(prototypeEntries(registry)?.get(slug)?.indexable).toBe(true);
  });
});
