import { expect, test } from "bun:test";
import {
  comboHasOwnContent,
  findPortfolioPlace,
  findPortfolioSegment,
  portfolioProjectMatchesSegment,
  portfolioProjectsForSegmentAtPlace,
} from "./portfolio-clusters";

test("mapeia a taxonomia real do catálogo para o segmento programático", () => {
  const beauty = findPortfolioSegment("beleza-estetica");
  const health = findPortfolioSegment("saude-clinicas");
  const legal = findPortfolioSegment("advocacia-consultoria");
  const local = findPortfolioSegment("servicos-locais");

  expect(beauty).toBeDefined();
  expect(health).toBeDefined();
  expect(legal).toBeDefined();
  expect(local).toBeDefined();

  expect(portfolioProjectMatchesSegment({ slug: "studio-x", segment: "beleza" }, beauty!)).toBe(true);
  expect(portfolioProjectMatchesSegment({ slug: "clinica-x", segment: "saude" }, health!)).toBe(true);
  expect(portfolioProjectMatchesSegment({ slug: "adv-x", segment: "juridico" }, legal!)).toBe(true);
  expect(portfolioProjectMatchesSegment({ slug: "restaurante-x", segment: "restaurantes" }, local!)).toBe(true);
  expect(portfolioProjectMatchesSegment({ slug: "restaurante-x", segment: "restaurantes" }, beauty!)).toBe(false);
});

test("segmento específico pode exigir slug real em vez de taxonomia ampla", () => {
  const handyman = findPortfolioSegment("marido-de-aluguel");
  expect(handyman).toBeDefined();

  expect(portfolioProjectMatchesSegment({ slug: "marido-de-aluguel", segment: "servicos" }, handyman!)).toBe(true);
  expect(portfolioProjectMatchesSegment({ slug: "outro-servico", segment: "servicos" }, handyman!)).toBe(false);
});

test("Barreiro só libera combinação sustentada por projeto local compatível", () => {
  const barreiro = findPortfolioPlace("barreiro");
  const local = findPortfolioSegment("servicos-locais");
  const beauty = findPortfolioSegment("beleza-estetica");

  expect(barreiro).toBeDefined();
  expect(local).toBeDefined();
  expect(beauty).toBeDefined();

  const matching = portfolioProjectsForSegmentAtPlace(local!, barreiro!);
  expect(matching.some((project) => project.slug === "bh-barreiro-marmitas")).toBe(true);
  expect(comboHasOwnContent(local!, barreiro!)).toBe(true);
  expect(comboHasOwnContent(beauty!, barreiro!)).toBe(false);
});
