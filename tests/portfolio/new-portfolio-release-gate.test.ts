import { describe, expect, test } from "bun:test";
import {
  newlyPublishedPortfolios,
  validateNewPortfolioRelease,
  mergePortfolioScopes,
} from "../../scripts/portfolio-new-release-gate.mjs";

const client = (slug: string) => ({
  slug, clientKey: slug,
  componentFile: "src/components/site/NewClientPage.tsx",
  routeFile: "src/routes/portfolio.$slug.tsx",
});
const manifest = (slug: string) => ({
  projects: { [slug]: { slug, lifecycleContract: 1, stage: "published" } },
});

describe("gate automático de novos portfólios", () => {
  test("novo published é descoberto; draft não dispara publicação", () => {
    const before = [{ slug: "legado", status: "published" }];
    const after = [
      { slug: "legado", status: "published" },
      { slug: "futuro", status: "draft" },
      { slug: "novo-projeto", status: "published" },
    ];
    expect(newlyPublishedPortfolios(before, after)).toEqual(["novo-projeto"]);
  });

  test("transição draft para published dispara os gates", () => {
    expect(newlyPublishedPortfolios(
      [{ slug: "novo-projeto", status: "draft" }],
      [{ slug: "novo-projeto", status: "published" }],
    )).toEqual(["novo-projeto"]);
  });

  test("atualização de published antigo não é nova publicação", () => {
    expect(newlyPublishedPortfolios(
      [{ slug: "cliente", status: "published", title: "Antes" }],
      [{ slug: "cliente", status: "published", title: "Depois" }],
    )).toEqual([]);
  });

  test("novo published requer cliente e lifecycle", () => {
    expect(validateNewPortfolioRelease(["novo-projeto"], [], { projects: {} })).toHaveLength(2);
    expect(validateNewPortfolioRelease(
      ["novo-projeto"], [client("novo-projeto")], manifest("novo-projeto")
    )).toEqual([]);
  });

  test("manifesto sem lifecycle não pode usar o baseline legado", () => {
    const broken = { projects: { "novo-projeto": { stage: "published" } } };
    expect(validateNewPortfolioRelease(
      ["novo-projeto"], [client("novo-projeto")], broken
    )).toEqual([expect.stringContaining("lifecycle gerenciado")]);
  });

  test("união preserva slugs e remove duplicatas", () => {
    expect(mergePortfolioScopes("outro,novo-projeto", "novo-projeto,terceiro"))
      .toBe("novo-projeto,outro,terceiro");
    expect(mergePortfolioScopes("", "novo-projeto")).toBe("novo-projeto");
    expect(mergePortfolioScopes("", "")).toBe("");
  });
});
