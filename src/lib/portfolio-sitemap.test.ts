import { expect, test } from "bun:test";
import {
  buildApprovedPortfolioEntries,
  normalizePortfolioSitemapOverride,
} from "./portfolio-sitemap.server";

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

test("sitemap e meta robots concordam mesmo com published=true em rascunho/importado/arquivado", () => {
  const path = "/portfolio/manu-pasteis";
  for (const lifecycle_status of ["draft", "imported", "archived"]) {
    const override = normalizePortfolioSitemapOverride({
      slug: "manu-pasteis",
      published: true,
      lifecycle_status,
    });
    expect(buildApprovedPortfolioEntries([override]).map((entry) => entry.path)).not.toContain(path);
  }
  for (const lifecycle_status of ["published", null]) {
    const override = normalizePortfolioSitemapOverride({
      slug: "manu-pasteis",
      published: true,
      lifecycle_status,
    });
    expect(buildApprovedPortfolioEntries([override]).map((entry) => entry.path)).toContain(path);
  }
  const managed = normalizePortfolioSitemapOverride({
    slug: "managed-qa-lifecycle",
    project_kind: "managed",
    published: true,
    lifecycle_status: "draft",
  });
  expect(buildApprovedPortfolioEntries([managed]).map((entry) => entry.path))
    .not.toContain("/portfolio/managed-qa-lifecycle");
});
test("os sete rascunhos em revisão comercial permanecem fora do sitemap", () => {
  const paths = buildApprovedPortfolioEntries().map((entry) => entry.path);
  for (const slug of [
    "dona-garimpeira-brecho",
    "infinito-spa",
    "espaco-marli-nails-guaratuba",
    "bpl-locacoes-de-brinquedos",
    "toop-assados",
    "panificadora-doce-coracao-santo-antonio",
    "salgados-da-fran",
  ]) {
    expect(paths).not.toContain(`/portfolio/${slug}`);
  }
});
