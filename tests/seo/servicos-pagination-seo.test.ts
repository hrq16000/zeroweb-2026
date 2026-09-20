import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const route = readFileSync("src/routes/servicos.index.tsx", "utf8");

describe("/servicos pagination SEO", () => {
  test("paginações limpas têm canonical próprio e prev/next", () => {
    expect(route).toContain('absUrl(`/servicos?page=${page}`)');
    expect(route).toContain('rel: "prev"');
    expect(route).toContain('rel: "next"');
    expect(route).toContain('page === 2 ? absUrl("/servicos")');
  });

  test("filtros, busca e ordenação ficam noindex", () => {
    expect(route).toMatch(/const hasFilter = Boolean\(search\.q \|\| search\.cat/);
    expect(route).toContain('"noindex, follow, max-image-preview:large, max-snippet:-1"');
  });

  test("canonical de filtro volta para a coleção principal", () => {
    expect(route).toMatch(/const url = paginated \? absUrl\(\`\/servicos\?page=\$\{page\}\`\) : absUrl\("\/servicos"\)/);
  });

  test("página inválida é limitada ao intervalo real", () => {
    expect(route).toContain("Math.min(Math.max(requestedPage, 1), totalPages)");
  });
});
