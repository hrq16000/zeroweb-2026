import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  listPublicPortfolioSeoDescriptors,
  portfolioUniversalKeywords,
  portfolioUniversalSeoTitle,
  relatedPortfolioItemListSchema,
  relatedPortfolioSeoItems,
} from "@/lib/portfolio-seo-network";

const shell = readFileSync("src/components/portfolio/PortfolioStandardShell.tsx", "utf8");
const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");

describe("SEO universal dos portfolios", () => {
  const published = listPublicPortfolioSeoDescriptors();

  test("todo portfolio publicado entra no grafo semântico", () => {
    expect(published.length).toBeGreaterThanOrEqual(90);

    for (const item of published) {
      const related = relatedPortfolioSeoItems(item.slug, undefined, 6);
      expect(related).toHaveLength(6);
      expect(related.every((candidate) => candidate.slug !== item.slug)).toBe(true);
      expect(new Set(related.map((candidate) => candidate.slug)).size).toBe(6);

      const schema = relatedPortfolioItemListSchema(item.slug, undefined, 6);
      expect(schema?.["@type"]).toBe("ItemList");
      expect(schema?.numberOfItems).toBe(6);
    }
  });

  test("títulos universais são únicos, úteis e dentro do limite", () => {
    const titles = published.map((item) => portfolioUniversalSeoTitle(item.slug));
    expect(titles.every(Boolean)).toBe(true);
    expect(titles.every((title) => (title?.length ?? 999) <= 65)).toBe(true);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("contexto de palavras-chave usa entidade, tags e localidade sem duplicar termos", () => {
    for (const item of published) {
      const keywords = portfolioUniversalKeywords(item.slug) ?? "";
      expect(keywords).toContain(item.title);
      const terms = keywords.split(", ").filter(Boolean);
      expect(new Set(terms).size).toBe(terms.length);
    }
  });

  test("vertical isolada continua conectada sem falsa alegação de afinidade", () => {
    const related = relatedPortfolioSeoItems("almeida-torres", undefined, 6);
    expect(related).toHaveLength(6);
    expect(related.some((item) => item.reason === "discovery")).toBe(true);
  });

  test("a rede SEO pertence à casca universal e o head dinâmico usa o resolvedor", () => {
    expect(shell).toContain("<PortfolioSeoNetwork");
    expect(route).toContain("portfolioUniversalSeoTitle");
    expect(route).toContain("portfolioUniversalKeywords");
    expect(route).toContain('property: "og:locale"');
    expect(route).toContain('hrefLang: "pt-BR"');
  });
});
