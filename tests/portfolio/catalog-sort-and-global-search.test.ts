import { describe, it, expect } from "vitest";
import catalog from "../../src/config/portfolio-catalog.json";
import standalone from "../../src/config/portfolio-catalog-standalone.json";
import dates from "../../src/config/portfolio-project-dates.json";
import { searchItems } from "../../src/lib/portfolio-search";
import { parseCatalogSort, shuffleWithSeed, sortCatalog } from "../../src/lib/portfolio-catalog-sort";

type Entry = { slug: string; title: string; status?: string; tags?: string[] };
const all = [...(catalog as Entry[]), ...(standalone as Entry[])].map((c) => ({
  ...c,
  id: c.slug,
  tags: c.tags ?? [],
}));
const slugs = (q: string) => searchItems(q, all).map((i) => i.slug);

describe("busca global do catálogo", () => {
  it("São Francisco encontra o Pet Center, fora do catálogo canônico", () => {
    expect((catalog as Entry[]).some((c) => c.slug === "sao-francisco-pet-center")).toBe(false);
    expect(slugs("São Francisco")).toContain("sao-francisco-pet-center");
    expect(slugs("São Francisco")).toContain("brecho-sao-francisco");
  });

  it("projetos em rascunho são localizáveis por nome e por status", () => {
    const drafts = all.filter((i) => i.status === "draft").map((i) => i.slug);
    expect(drafts).toContain("dona-garimpeira-brecho");
    expect(slugs("garimpeira")).toContain("dona-garimpeira-brecho");
    expect(slugs("rascunho")).toEqual(expect.arrayContaining(drafts));
    expect(slugs("rascunho")).toHaveLength(drafts.length);
  });

  it("identificador interno diferente do nome comercial também encontra", () => {
    expect(slugs("clinica-integrada").length).toBeGreaterThan(0);
    expect(slugs("Paraná").length).toBeGreaterThan(3);
  });
});

describe("ordenação do catálogo", () => {
  const sample = [
    { id: "a", title: "Alfa" },
    { id: "b", title: "Beta" },
    { id: "c", title: "Gama" },
    { id: "d", title: "Sem data" },
  ];
  const fake = {
    a: { createdAt: "2026-01-10T00:00:00.000Z", updatedAt: "2026-03-01T00:00:00.000Z" },
    b: { createdAt: "2026-02-10T00:00:00.000Z", updatedAt: "2026-02-11T00:00:00.000Z" },
    c: { createdAt: "2025-12-01T00:00:00.000Z", updatedAt: "2026-04-01T00:00:00.000Z" },
  };
  const ids = (sort: Parameters<typeof sortCatalog>[1]) =>
    sortCatalog(sample, sort, { dates: fake, seed: 7 }).map((i) => i.id);

  it("mais recentes e mais antigos usam a data real de criação", () => {
    expect(ids("recent")).toEqual(["b", "a", "c", "d"]);
    expect(ids("oldest")).toEqual(["c", "a", "b", "d"]);
  });

  it("atualizados usa a data real de atualização", () => {
    expect(ids("updated")).toEqual(["c", "a", "b", "d"]);
  });

  it("aleatória embaralha sem excluir nem duplicar", () => {
    const a = sortCatalog(all, "random", { seed: 11 }).map((i) => i.id);
    const b = sortCatalog(all, "random", { seed: 12 }).map((i) => i.id);
    expect([...a].sort()).toEqual(all.map((i) => i.id).sort());
    expect(new Set(a).size).toBe(all.length);
    expect(a).not.toEqual(b);
    expect(shuffleWithSeed(a, 5)).toEqual(shuffleWithSeed(a, 5));
  });

  it("valor de ordenação desconhecido volta para mais recentes", () => {
    expect(parseCatalogSort("qualquer")).toBe("recent");
    expect(parseCatalogSort("random")).toBe("random");
  });

  it("todo projeto do catálogo tem data real registrada", () => {
    const index = (dates as { projects: Record<string, { createdAt?: string }> }).projects;
    expect(all.filter((i) => !index[i.id]?.createdAt).map((i) => i.id)).toEqual([]);
  });
});
