/**
 * Regressão do pipeline de novos /portfolio/:slug.
 *
 * Um projeto recém-scaffoldado (stubs vazios) NUNCA pode passar no quality gate,
 * e projetos legados (sem manifesto) continuam fora do gate.
 */
import { describe, expect, it } from "bun:test";
// @ts-expect-error — gate em .mjs sem tipos
import { evaluateMatrix, evaluatePolicyGates, DIMENSIONS } from "../../scripts/check-portfolio-landing-quality.mjs";
import manifests from "../../src/config/portfolio-project-manifests.json";
import clients from "../../src/config/portfolio-clients.json";
import { readFileSync } from "node:fs";
import { LIFECYCLE_STEPS, VISUAL_QA_STATUSES } from "../../src/lib/portfolio-project-lifecycle";

/** Igual ao stub gerado por scripts/scaffold-portfolio-client.mjs. */
const scaffoldStub = {
  slug: "zz-lifecycle-test",
  matrixVersion: 1,
  evaluatedAt: null,
  technicalPass: false,
  editorialPass: false,
  score: { total: null, byDimension: {} },
  dimensions: {},
  hero: { status: null, criteria: {} },
  cover: { status: null, criteria: {} },
  coverage: [],
  deadZones: [],
  mediaSourceMix: {},
  p0: [],
  warnings: [],
  ownerRequired: [],
};

describe("quality matrix gate", () => {
  it("reprova um projeto recém-scaffoldado", () => {
    const r = evaluateMatrix("zz-lifecycle-test", scaffoldStub);
    expect(r.status).toBe("FAIL");
    for (const dim of DIMENSIONS) {
      expect(r.failures).toContain(`dimensão não avaliada: ${dim}`);
    }
    expect(r.failures).toContain("hero matrix não avaliada");
    expect(r.failures).toContain("cover matrix não avaliada");
    expect(r.failures).toContain("coverage visual matrix vazia");
    expect(r.failures).toContain("technicalPass não confirmado");
    expect(r.failures).toContain("editorialPass não confirmado");
  });

  it("reprova quando a matriz não existe", () => {
    expect(evaluateMatrix("inexistente", null).status).toBe("MISSING");
  });

  it("reprova dead zone aberta e coverage sem mediaDecision", () => {
    const r = evaluateMatrix("x", {
      ...scaffoldStub,
      technicalPass: true,
      editorialPass: true,
      dimensions: Object.fromEntries(DIMENSIONS.map((d: string) => [d, { status: "PASS" }])),
      hero: { status: "PASS" },
      cover: { status: "PASS" },
      coverage: [{ section: "hero" }],
      deadZones: [{ section: "offers", viewport: "390px", resolved: false }],
    });
    expect(r.failures).toContain("coverage sem mediaDecision: hero");
    expect(r.failures).toContain("VISUAL_DEAD_ZONE aberta: offers (390px)");
  });

  it("não aplica o lifecycle retroativamente ao legado", () => {
    const managed = Object.keys((manifests as { projects: Record<string, unknown> }).projects);
    const legacy = (clients as { slug: string }[]).filter((c) => !managed.includes(c.slug));
    expect(managed).toContain("carecas-infotec");
    expect(legacy.length).toBeGreaterThan(0);
  });
});

describe("contact and media purpose gates", () => {
  it("reprova tel: quando o projeto é funnelOnly", () => {
    const result = evaluatePolicyGates({
      slug: "fixture",
      client: { contactMode: "funnelOnly" },
      componentSource: '<a href="tel:+5541999999999">Ligar</a><PortfolioCTAQuiz />',
      mediaPlan: { inventory: { referenceOnlyAssets: [] } },
    });
    expect(result.status).toBe("FAIL");
    expect(result.failures[0]).toContain("CONTACT_FUNNEL_GATE");
  });

  it("reprova asset EVIDENCE_ONLY em posição editorial", () => {
    const result = evaluatePolicyGates({
      slug: "fixture",
      client: { contactMode: "funnelOnly" },
      componentSource: '<PortfolioCTAQuiz /><img src="/images/fixture/banner.webp" />',
      mediaPlan: {
        inventory: {
          referenceOnlyAssets: [{ file: "public/images/fixture/banner.webp", editorialAllowed: false }],
        },
      },
    });
    expect(result.status).toBe("FAIL");
    expect(result.failures.some((failure: string) => failure.includes("MEDIA_PURPOSE_GATE"))).toBe(true);
  });

  it("Carecas funnelOnly não expõe tel: nem usa a placa como mídia editorial", () => {
    const client = (clients as Array<{ slug: string; contactMode?: string; componentFile: string }>).find(
      (item) => item.slug === "carecas-infotec",
    );
    expect(client?.contactMode).toBe("funnelOnly");
    const source = readFileSync(client!.componentFile, "utf8");
    const result = evaluatePolicyGates({
      slug: "carecas-infotec",
      client,
      componentSource: source,
      mediaPlan: {
        inventory: {
          referenceOnlyAssets: [
            { file: "public/images/carecas-infotec/banner.webp", editorialAllowed: false },
          ],
        },
      },
    });
    expect(result.status).toBe("PASS");
    expect(source).not.toContain("tel:");
    expect(source).not.toContain("/images/carecas-infotec/banner.webp");
  });
});

describe("pipeline canônico de projetos novos", () => {
  const managed = (manifests as { projects: Record<string, Record<string, unknown>> }).projects;

  it("todo projeto gerenciado declara visualQa com estado válido (BLOCKED_ENVIRONMENT ≠ PASS)", () => {
    for (const [slug, manifest] of Object.entries(managed)) {
      const status = (manifest as { visualQa?: { status?: string } }).visualQa?.status;
      expect(VISUAL_QA_STATUSES).toContain(status as (typeof VISUAL_QA_STATUSES)[number]);
      expect(`${slug}:${status}`).not.toContain("undefined");
    }
  });

  it("o lifecycle inclui as etapas de media discovery e media plan", () => {
    expect(LIFECYCLE_STEPS).toContain("media");
    expect(LIFECYCLE_STEPS).toContain("mediaPlan");
    for (const manifest of Object.values(managed)) {
      const lifecycle = (manifest as { lifecycle: Record<string, string> }).lifecycle;
      for (const step of LIFECYCLE_STEPS) expect(lifecycle[step]).toBeDefined();
    }
  });

  it("projeto gerenciado nasce funnelOnly, com funnelType e rodando pelo Blueprint", () => {
    const registry = readFileSync("src/components/portfolio/blueprint/registry.ts", "utf8");
    for (const slug of Object.keys(managed)) {
      const client = (clients as Array<Record<string, unknown>>).find((c) => c.slug === slug);
      expect(client?.contactMode).toBe("funnelOnly");
      expect(typeof client?.funnelType).toBe("string");
      expect(registry).toContain(`"${slug}"`);
    }
  });

  it("o scaffold nunca gera conteúdo factual inventado", () => {
    const scaffold = readFileSync("scripts/scaffold-portfolio-client.mjs", "utf8");
    for (const forbidden of ["anos de experiência", "aggregateRating", "tel:", "wa.me"]) {
      expect(scaffold).not.toContain(forbidden);
    }
    expect(scaffold).toContain("CREATIVE_BRIEF_REQUIRED");
    expect(scaffold).toContain('contactMode: "funnelOnly"');
  });
});
