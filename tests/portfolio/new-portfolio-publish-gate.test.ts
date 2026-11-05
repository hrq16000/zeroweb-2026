import { describe, expect, it } from "bun:test";
import { publishedCandidates, validatePublication } from "../../scripts/new-portfolio-publish-gate.mjs";

const slug = "portfolio-novo-teste";
const item = {
  slug, clientKey: slug, status: "published", title: "Exemplo Original",
  summary: "Um resumo editorial factual específico para a empresa, seus serviços, localização e formas de solicitar atendimento, sem inventar informações.",
};
const client = { slug, clientKey: slug, contactMode: "funnelOnly", componentFile: "src/components/site/TestePage.tsx" };
const core = [
  "PORTFOLIO_INDIVIDUAL_SITE_GATE", "PORTFOLIO_ENTITY_GATE",
  "PORTFOLIO_DISCOVERY_GRAPH_GATE", "PORTFOLIO_INDEXABILITY_GATE",
];
const manifest = {
  projects: {
    [slug]: {
      stage: "published", contractVersion: 4,
      lifecycle: { qa: "complete", publish: "complete" },
      visualQa: { status: "PASS" },
      individualSiteContract: {
        gates: Object.fromEntries(core.map((k) => [k, "complete"])),
        evidence: Object.fromEntries(core.map((k) => [k, ["docs/evidence/" + slug]])),
      },
    },
  },
};
const allFiles = () => true;

describe("gate automático de publicação de novos portfólios", () => {
  it("detecta slug novo publicado", () => {
    expect(publishedCandidates([], [item], [], [client])).toEqual([slug]);
  });
  it("detecta promoção draft → published", () => {
    expect(publishedCandidates([{ ...item, status: "draft" }], [item], [client], [client])).toEqual([slug]);
  });
  it("detecta cliente novo ligado a catálogo já publicado", () => {
    expect(publishedCandidates([item], [item], [], [client])).toEqual([slug]);
  });
  it("ignora atualização de legado, novos rascunhos e nenhuma publicação", () => {
    expect(publishedCandidates([item], [item], [client], [client])).toEqual([]);
    expect(publishedCandidates([], [{ ...item, status: "draft" }], [], [client])).toEqual([]);
  });
  it("aceita somente a publicação completa com evidências e baselines", () => {
    expect(validatePublication(slug, [item], [client], manifest, allFiles)).toEqual([]);
  });
  it("bloqueia ausência de baselines sem gerar/aprovar hashes", () => {
    const errors = validatePublication(slug, [item], [client], manifest,
      (file) => !file.includes("tests/visual/baseline"));
    expect(errors.filter((x) => x.startsWith("baseline "))).toHaveLength(3);
  });
  it("bloqueia funil inexistente, QA incompleto e contrato sem evidência", () => {
    const broken = structuredClone(manifest);
    broken.projects[slug].visualQa.status = "NOT_EXECUTED";
    broken.projects[slug].individualSiteContract.evidence.PORTFOLIO_INDEXABILITY_GATE = [];
    const errors = validatePublication(slug, [item], [{ ...client, contactMode: "direct" }], broken, allFiles);
    expect(errors.some((e) => e.includes("funnelOnly"))).toBe(true);
    expect(errors.some((e) => e.includes("visualQa"))).toBe(true);
    expect(errors.some((e) => e.includes("PORTFOLIO_INDEXABILITY_GATE"))).toBe(true);
  });
});
