import { describe, expect, test } from "bun:test";
import {
  getNewPublicPortfolioSlugs,
  assertNewPublicPortfolioContracts,
} from "../../scripts/resolve-new-public-portfolios.mjs";

const project = (slug: string, status: string) => ({ slug, status });
const clients = [{ slug: "novo-site" }, { slug: "promovido" }];
const manifests = { projects: { "novo-site": { contractVersion: 4 }, promovido: { contractVersion: 4 } } };

describe("portfolios novos — gate de publicação automática", () => {
  test("novo slug publicado não escapa do Lighthouse por alterar só catálogo", () => {
    expect(getNewPublicPortfolioSlugs(
      [project("legado", "published")],
      [project("legado", "published"), project("novo-site", "published")],
    )).toEqual(["novo-site"]);
  });

  test("rascunho promovido a publicado entra na validação obrigatória", () => {
    expect(getNewPublicPortfolioSlugs(
      [project("promovido", "draft")],
      [project("promovido", "published")],
    )).toEqual(["promovido"]);
  });

  test("edição e rascunho novo não disparam auditoria Lighthouse desnecessária", () => {
    expect(getNewPublicPortfolioSlugs(
      [project("legado", "published")],
      [project("legado", "published"), project("novo-site", "draft")],
    )).toEqual([]);
  });

  test("detecção não duplica slugs e mantém ordem estável", () => {
    expect(getNewPublicPortfolioSlugs([], [project("promovido", "published"), project("novo-site", "published")]))
      .toEqual(["novo-site", "promovido"]);
    expect(() => getNewPublicPortfolioSlugs([], [project("x", "published"), project("x", "published")]))
      .toThrow(/duplicado/);
  });

  test("publicação exige registro e manifesto gerenciado", () => {
    expect(assertNewPublicPortfolioContracts(["novo-site", "promovido"], clients, manifests))
      .toEqual(["novo-site", "promovido"]);
    expect(() => assertNewPublicPortfolioContracts(["novo-site"], [], manifests))
      .toThrow(/cliente registrado/);
    expect(() => assertNewPublicPortfolioContracts(["novo-site"], clients, { projects: {} }))
      .toThrow(/manifesto gerenciado/);
  });
});
