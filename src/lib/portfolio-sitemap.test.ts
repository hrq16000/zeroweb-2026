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


test("estado imported de legacy não despublica URL aprovada no Git", () => {
  const paths = buildApprovedPortfolioEntries([
    {
      slug: "manu-pasteis",
      published: false,
      project_kind: "legacy",
      lifecycle_status: "imported",
    },
  ]).map((entry) => entry.path);
  expect(paths).toContain("/portfolio/manu-pasteis");
});

test("draft explícito continua removendo a URL aprovada", () => {
  const paths = buildApprovedPortfolioEntries([
    {
      slug: "manu-pasteis",
      published: false,
      project_kind: "legacy",
      lifecycle_status: "draft",
    },
  ]).map((entry) => entry.path);
  expect(paths).not.toContain("/portfolio/manu-pasteis");
});

test("linha legacy órfã não cria URL no sitemap", () => {
  const paths = buildApprovedPortfolioEntries([
    {
      slug: "jkl-marcenaria",
      published: true,
      project_kind: "legacy",
      lifecycle_status: "published",
    },
  ]).map((entry) => entry.path);
  expect(paths).not.toContain("/portfolio/jkl-marcenaria");
});

test("projeto managed publicado pode entrar sem catálogo versionado", () => {
  const paths = buildApprovedPortfolioEntries([
    {
      slug: "managed-exemplo",
      published: true,
      project_kind: "managed",
      lifecycle_status: "published",
    },
  ]).map((entry) => entry.path);
  expect(paths).toContain("/portfolio/managed-exemplo");
});
