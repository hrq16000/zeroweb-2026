import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

const GATES = [
  "PORTFOLIO_INDIVIDUAL_SITE_GATE",
  "PORTFOLIO_ENTITY_GATE",
  "PORTFOLIO_LOCAL_SEO_GATE",
  "PORTFOLIO_MEDIA_RICHNESS_GATE",
  "PORTFOLIO_DISCOVERY_GRAPH_GATE",
  "PORTFOLIO_INDEXABILITY_GATE",
];

describe("portfolio como site individual — contrato operacional", () => {
  test("scaffold cria contrato v4 e os seis gates universais", () => {
    const source = read("scripts/scaffold-portfolio-client.mjs");
    expect(source).toContain("contractVersion: 4");
    expect(source).toContain("individualSiteContract");
    expect(source).toContain("docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md");
    for (const gate of GATES) expect(source).toContain(gate);
  });

  test("scaffold gate valida estado e exige evidência quando complete", () => {
    const source = read("scripts/validate-portfolio-scaffold.mjs");
    expect(source).toContain("INDIVIDUAL_SITE_CONTRACT_VERSION = 4");
    expect(source).toContain('state === "complete"');
    expect(source).toContain("complete sem evidência registrada");
    for (const gate of GATES) expect(source).toContain(gate);
  });

  test("readiness bloqueia READY/PUBLISH com contrato incompleto", () => {
    const source = read("scripts/check-portfolio-project-readiness.mjs");
    expect(source).toContain("Number(manifest.contractVersion ?? 0) >= INDIVIDUAL_SITE_CONTRACT_VERSION");
    expect(source).toContain("precisa estar complete/not_applicable antes de READY/PUBLISH");
    expect(source).toContain("gate estrutural não pode ser not_applicable");
    expect(source).toContain("portfolio publicado exige estado complete");
  });

  test("norma especializada documenta a execução operacional", () => {
    const source = read("docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md");
    expect(source).toContain("Execução operacional do contrato");
    expect(source).toContain("individualSiteContract");
    for (const gate of GATES) expect(source).toContain(gate);
  });
});
