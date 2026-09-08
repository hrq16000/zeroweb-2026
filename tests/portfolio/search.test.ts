import { describe, it, expect } from "vitest";
import catalog from "../../src/config/portfolio-catalog.json";
import { searchItems, scoreItem } from "../../src/lib/portfolio-search";

type Item = {
  slug: string;
  title: string;
  segment?: string;
  city?: string;
  state?: string;
  subtitle?: string;
  summary?: string;
  tags: string[];
};

const items = (catalog as Item[]).map((c) => ({ ...c, tags: c.tags ?? [] }));
const slugs = (q: string) => searchItems(q, items).map((i) => i.slug);

describe("busca inteligente do portfólio", () => {
  it("sem busca devolve todo o catálogo", () => {
    expect(searchItems("", items)).toHaveLength(items.length);
  });

  it.each(["lanche", "pastel", "comida", "fome", "almoço"])(
    "%s encontra a pastelaria Route 66",
    (q) => {
      expect(slugs(q)).toContain("pastelaria-route-66");
    },
  );

  it("tolera erro de digitação", () => {
    expect(slugs("pastelaira")).toContain("pastelaria-route-66");
  });

  it("busca por cidade funciona", () => {
    expect(slugs("curitiba").length).toBeGreaterThan(3);
  });

  it("termo sem relação não devolve tudo", () => {
    expect(slugs("xyzabcqwe")).toHaveLength(0);
  });

  it("pontua o projeto mais aderente acima dos demais", () => {
    const route66 = items.find((i) => i.slug === "pastelaria-route-66")!;
    const outro = items.find((i) => i.segment !== "restaurantes")!;
    expect(scoreItem("pastel", route66)).toBeGreaterThan(scoreItem("pastel", outro));
  });
});
