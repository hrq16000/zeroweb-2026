import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("performance do índice de portfólios", () => {
  const source = readFileSync("src/routes/portfolio.index.tsx", "utf8");

  test("limita somente a vitrine visual inicial sem limitar o diretório crawlable", () => {
    expect(source).toContain("useState(6)");
    expect(source).toContain("Math.min(count + 6, filteredItems.length)");
    expect(source).toContain("crawlablePublishedItems.map");
    expect(source).not.toContain("crawlablePublishedItems.slice");
  });

  test("capas declaram dimensões intrínsecas e preservam lazy loading", () => {
    expect(source).toContain("width={640}");
    expect(source).toContain("height={400}");
    expect(source).toContain('loading={index === 0 ? "eager" : "lazy"}');
  });
});
