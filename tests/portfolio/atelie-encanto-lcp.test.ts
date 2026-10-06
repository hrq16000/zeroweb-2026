import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/AtelieEncantoDaBaiaPage.tsx", "utf8");

describe("Ateliê Encanto da Baía · LCP crítico", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="text-5xl font-black leading-[.95] sm:text-7xl">');
    expect(source).not.toContain('<MotionReveal as="h1" variant="up" intensity="EXPRESSIVE"');
  });

  test("preserva motion não crítico e funil", () => {
    expect(source).toContain('<MotionReveal variant="right" delay={140}>');
    expect(source).toContain('clientKey="guaratuba-atelie-presentes"');
    expect(source).toContain("Pedir orçamento");
  });
});
