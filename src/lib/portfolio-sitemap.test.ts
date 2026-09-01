import { expect, test } from "bun:test";
import { buildApprovedPortfolioEntries } from "./portfolio-sitemap.server";

test("sitemap do portfólio é derivado do catálogo aprovado", () => {
  const paths = buildApprovedPortfolioEntries().map((entry) => entry.path);
  expect(paths).toContain("/portfolio");
  expect(paths).toContain("/portfolio/manu-pasteis");
  expect(paths).toContain("/portfolio/confeitaria-sabor-da-realeza");
  expect(new Set(paths).size).toBe(paths.length);
});

test("override despublicado remove somente o slug correspondente", () => {
  const paths = buildApprovedPortfolioEntries([{ slug: "manu-pasteis", published: false }]).map(
    (entry) => entry.path,
  );
  expect(paths).not.toContain("/portfolio/manu-pasteis");
  expect(paths).toContain("/portfolio/galileu-locacao-brinquedos");
});
