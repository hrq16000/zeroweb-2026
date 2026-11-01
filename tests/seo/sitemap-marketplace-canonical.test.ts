import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const sitemap = readFileSync("src/routes/sitemap-marketplace[.]xml.ts", "utf8");
const marketplaceRedirect = readFileSync("src/routes/marketplace.tsx", "utf8");
const categoryPage = readFileSync("src/routes/categoria.$slug.tsx", "utf8");
const smoke = readFileSync("scripts/check-sitemap-runtime-no-keys.mjs", "utf8");

describe("Sitemap marketplace: somente URL canônica e perfis indexáveis", () => {
  test("não publica endereço redirecionado nem categorias noindex por padrão", () => {
    expect(marketplaceRedirect).toContain('statusCode: 301');
    expect(sitemap).not.toContain("`${ORIGIN}/servicos/marketplace`");
    expect(sitemap).not.toContain("`${ORIGIN}/marketplace`");
    expect(sitemap).not.toContain("/categoria/${c.slug}");
  });
  test("preserva URL pública de orçamento e perfis ativos do catálogo", () => {
    expect(sitemap).toContain("${ORIGIN}/solicitar-orcamento");
    expect(sitemap).toContain("${ORIGIN}/profissional/${p.slug}");
    expect(sitemap).toContain("${ORIGIN}/empresa/${co.slug}");
    expect(sitemap).toContain("listSitemapEntries()");
  });
  test("não promove categoria antes de haver perfis ativos", () => {
    expect(categoryPage).toContain("const indexable = Boolean(category) && total > 0");
    expect(categoryPage).toContain('"noindex, follow"');
    expect(smoke).toContain('urls.includes("https://0web.com.br/servicos/marketplace")');
    expect(smoke).toContain('u.startsWith("https://0web.com.br/categoria/")');
  });
});
