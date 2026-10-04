import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/DonaLucySalgadosPage.tsx", "utf8");

describe("Dona Lucy · LCP do hero", () => {
  test("mantém a imagem hero prioritária fora de MotionReveal", () => {
    expect(source).toContain('src="/images/dona-lucy-salgados/hero.png"');
    expect(source).toContain('priority managedField="heroImageUrl"');
    expect(source).not.toContain('<MotionReveal variant="right"><PortfolioImage src="/images/dona-lucy-salgados/hero.png"');
  });

  test("mantém também o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-6 max-w-2xl');
    expect(source).toContain("domingo em família.");
    expect(source).not.toContain('<MotionReveal as="h1"');
  });
});
