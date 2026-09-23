import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const src = readFileSync(resolve(process.cwd(), "src/routes/servicos.site-pro.tsx"), "utf8");

describe("Site Pro commercial claims", () => {
  test("não promete posição específica ou uptime absoluto", () => {
    expect(src).not.toContain("Google posição 1–5");
    expect(src).not.toContain("ranking 1–5");
    expect(src).not.toContain("100% de uptime garantido");
    expect(src).toContain("sem prometer posição específica");
  });

  test("compara corretamente com o Site Express atual", () => {
    expect(src).not.toContain("Site Express (R$ 1.500)");
    expect(src).toContain("Site Express (a partir de R$ 499)");
    expect(src).not.toContain("entrega 1 landing page em 24h");
  });

  test("preserva a oferta própria do Site Pro", () => {
    expect(src).toContain("a partir de R$ 7.900");
    expect(src).toContain("10+ páginas");
    expect(src).toContain("6 meses de suporte");
  });
});
