import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/ManiaDeLimpezaPage.tsx", "utf8");

describe("Mania de Limpeza · LCP do hero", () => {
  test("mantém a imagem hero prioritária fora de MotionReveal", () => {
    expect(source).toContain('src="/images/mania-de-limpeza/hero.png"');
    expect(source).toContain('priority managedField="heroImageUrl"');
    expect(source).not.toContain('<MotionReveal variant="right"><PortfolioImage src="/images/mania-de-limpeza/hero.png"');
  });

  test("preserva o H1 animado e o MotionScope da página", () => {
    expect(source).toContain('<MotionReveal as="h1" variant="mask"');
    expect(source).toContain('<MotionScope intensity="BALANCED">');
  });
});
