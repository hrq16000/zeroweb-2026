import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const index = readFileSync("src/routes/blog.index.tsx", "utf8");
const detail = readFileSync("src/routes/blog.$slug.tsx", "utf8");

describe("entidade Organization do blog", () => {
  test("índice referencia Organization global", () => {
    expect(index).toContain('publisher: { "@id": "https://0web.com.br/#org" }');
    expect(index).not.toContain('publisher: { "@type": "Organization", name: "0WEB"');
  });

  test("artigos usam a mesma entidade em author e publisher", () => {
    expect(detail).toContain('author: { "@id": "https://0web.com.br/#org" }');
    expect(detail).toContain('publisher: { "@id": "https://0web.com.br/#org" }');
  });
});
