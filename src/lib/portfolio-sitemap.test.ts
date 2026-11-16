import { expect, test } from "bun:test";
import { buildApprovedPortfolioEntries } from "./portfolio-sitemap.server";

test("sitemap do portfólio é derivado do catálogo aprovado", () => {
  const paths = buildApprovedPortfolioEntries().map((entry) => entry.path);
  expect(paths).toContain("/portfolio");
  expect(paths).toContain("/portfolio/manu-pasteis");
  expect(paths).toContain("/portfolio/confeitaria-sabor-da-realeza");
  expect(paths).toContain("/portfolio/sao-francisco-pet-center"); // portfólio editorial 0WEB
  expect(new Set(paths).size).toBe(paths.length);
});

test("override despublicado remove somente o slug correspondente", () => {
  const paths = buildApprovedPortfolioEntries([{ slug: "manu-pasteis", published: false }]).map(
    (entry) => entry.path,
  );
  expect(paths).not.toContain("/portfolio/manu-pasteis");
  expect(paths).toContain("/portfolio/galileu-locacao-brinquedos");
});

test("demonstração da 0WEB não duplica entrada e admite despublicação explícita", () => {
  const path = "/portfolio/sao-francisco-pet-center";
  const entries = buildApprovedPortfolioEntries();
  expect(entries.filter((entry) => entry.path === path).length).toBe(1);
  const unpublished = buildApprovedPortfolioEntries([{ slug: "sao-francisco-pet-center", published: false }]);
  expect(unpublished.map((entry) => entry.path)).not.toContain(path);
});
