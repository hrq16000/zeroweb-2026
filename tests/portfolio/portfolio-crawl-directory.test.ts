import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("diretório crawlable de portfólios", () => {
  const source = readFileSync("src/routes/portfolio.index.tsx", "utf8");

  test("não limita o diretório ao visibleCount da vitrine", () => {
    expect(source).toContain("crawlablePublishedItems.map");
    expect(source).toContain("catalogItems");
    expect(source).toContain(".filter((item) => item.live)");
    expect(source).not.toContain("crawlablePublishedItems.slice");
  });

  test("cada entrada usa link HTML para a rota canônica do projeto", () => {
    expect(source).toContain('id="portfolio-directory-title"');
    expect(source).toContain("href={item.slug}");
  });

  test("diretório permanece leve, sem componente Link ou ícone por item", () => {
    const start = source.indexOf('aria-label="Todos os portfólios publicados"');
    const end = source.indexOf("{/* Banner Callout for Custom Sites */}", start);
    const directory = source.slice(start, end);
    expect(directory).toContain("<a");
    expect(directory).not.toContain("<Link");
    expect(directory).not.toContain("<ArrowRight");
  });
});
