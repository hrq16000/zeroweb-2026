import { describe, expect, it } from "bun:test";
import {
  comboHasOwnContent,
  findPortfolioPlace,
  findPortfolioSegment,
  portfolioProjectsForSegmentAtPlace,
} from "./portfolio-clusters";

function required<T>(value: T | undefined, label: string): T {
  if (!value) throw new Error(`Fixture ausente: ${label}`);
  return value;
}

// Gate regional: só indexa combinação sustentada por projeto real compatível.
// O Lighthouse regional cobre a superfície alterada sem auditar portfólios canônicos não relacionados.\ndescribe("gate de indexacao do portfolio programatico", () => {
  it("nao libera segmento sem projeto real correspondente no local", () => {
    const barreiro = required(findPortfolioPlace("barreiro"), "bairro Barreiro");
    const beleza = required(findPortfolioSegment("beleza-estetica"), "segmento beleza-estetica");

    expect(portfolioProjectsForSegmentAtPlace(beleza, barreiro)).toHaveLength(0);
    expect(comboHasOwnContent(beleza, barreiro)).toBe(false);
  });

  it("libera servicos locais quando existe projeto real compativel no local", () => {
    const barreiro = required(findPortfolioPlace("barreiro"), "bairro Barreiro");
    const servicos = required(findPortfolioSegment("servicos-locais"), "segmento servicos-locais");

    const projects = portfolioProjectsForSegmentAtPlace(servicos, barreiro);
    expect(projects.some((project) => project.slug === "bh-barreiro-marmitas")).toBe(true);
    expect(comboHasOwnContent(servicos, barreiro)).toBe(true);
  });

  it("mantem marido de aluguel restrito ao projeto especifico", () => {
    const segment = required(findPortfolioSegment("marido-de-aluguel"), "segmento marido-de-aluguel");
    expect(segment.projectSlugs).toEqual(["marido-de-aluguel"]);
  });
});
