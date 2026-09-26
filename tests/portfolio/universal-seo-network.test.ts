import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  listPublicPortfolioSeoDescriptors,
  portfolioUniversalKeywords,
  portfolioUniversalSeoTitle,
  portfolioSemanticContext,
  portfolioEntityGraphSchema,
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

  test("todo projeto publicado recebe contexto semântico factual", () => {
    for (const item of published) {
      const semantic = portfolioSemanticContext(item.slug);
      expect(semantic).not.toBeNull();
      expect((semantic?.label.length ?? 0) + (semantic?.topics.length ?? 0)).toBeGreaterThan(0);
      expect((semantic?.topics.length ?? 0)).toBeLessThanOrEqual(5);
    }
  });

  test("projetos locais conhecidos devolvem backlinks para hubs regionais", () => {
    const semantic = portfolioSemanticContext("arildo-madeiras");
    expect(semantic?.placeLinks.some((link) => link.href.startsWith("/portfolio-em/"))).toBe(true);
    expect(semantic?.placeLinks.some((link) => /Pinhais/i.test(link.label))).toBe(true);
  });

  test("vertical isolada continua conectada sem falsa alegação de afinidade", () => {
    const related = relatedPortfolioSeoItems("almeida-torres", undefined, 6);
    expect(related).toHaveLength(6);
    expect(related.some((item) => item.reason === "discovery")).toBe(true);
  });

  test("todo portfolio publicado recebe WebPage, entidade e breadcrumb universais", () => {
    for (const item of published) {
      const schema = portfolioEntityGraphSchema(item.slug);
      expect(schema?.["@context"]).toBe("https://schema.org");
      const graph = schema?.["@graph"] ?? [];
      expect(graph.some((node: any) => node["@type"] === "WebPage")).toBe(true);
      expect(graph.some((node: any) => node["@type"] === "Thing")).toBe(true);
      expect(graph.some((node: any) => node["@type"] === "BreadcrumbList")).toBe(true);

      const webpage = graph.find((node: any) => node["@type"] === "WebPage") as any;
      expect(webpage?.url).toBe(`https://0web.com.br/portfolio/${item.slug}`);
      expect(webpage?.inLanguage).toBe("pt-BR");
      expect(webpage?.mainEntity?.["@id"]).toContain("#entity");
    }
  });

  test("servicos Schema.org so nascem de servicos explicitos e preservam o texto comprovado", () => {
    const schema = portfolioEntityGraphSchema("cliente-managed-teste", {
      title: "Cliente Managed Teste",
      segment: "servicos",
      city: "Curitiba",
      state: "PR",
      summary: "Projeto de teste com serviços explicitamente informados.",
      services: ["Manutenção de notebooks", "Configuração de Wi-Fi"],
      tags: ["informatica", "redes"],
      image: "/images/teste.webp",
      projectType: "managed",
    });
    const graph = schema?.["@graph"] ?? [];
    const services = graph.filter((node: any) => node["@type"] === "Service") as any[];
    expect(services.map((node) => node.name)).toEqual([
      "Manutenção de notebooks",
      "Configuração de Wi-Fi",
    ]);
    expect(services.every((node) => node.provider?.["@id"]?.endsWith("#entity"))).toBe(true);
    expect(graph.some((node: any) => node["@type"] === "Place")).toBe(true);
  });

  test("portfolio estatico nao promove tags editoriais a servicos", () => {
    const schema = portfolioEntityGraphSchema("sos-presentes-cosmeticos");
    const graph = schema?.["@graph"] ?? [];
    expect(graph.filter((node: any) => node["@type"] === "Service")).toHaveLength(0);
    const webpage = graph.find((node: any) => node["@type"] === "WebPage") as any;
    expect(Array.isArray(webpage?.about)).toBe(true);
    expect(webpage.about.some((node: any) => node["@type"] === "DefinedTerm")).toBe(true);
  });

  test("a rede SEO pertence à casca universal e o head dinâmico usa o resolvedor", () => {
    expect(shell).toContain("<PortfolioSeoNetwork");
    expect(route).toContain("portfolioUniversalSeoTitle");
    expect(shell).toContain("seoContextOverride");
    expect(route).toContain("portfolioUniversalKeywords");
    expect(route).toContain('property: "og:locale"');
    expect(route).toContain('hrefLang: "pt-BR"');
  });
});
