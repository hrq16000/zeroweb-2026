import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/SaboresDaBaiaPage.tsx", "utf8");

describe("Sabores da Baía · LCP crítico", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-4 text-4xl font-bold leading-[1.06] sm:text-6xl">');
    expect(source).not.toContain('<MotionReveal variant="up" delay={120}>');
  });

  test("preserva motions não críticos e funil", () => {
    expect(source).toContain('<MotionReveal variant="left">');
    expect(source).toContain('<MotionReveal variant="up" delay={240}>');
    expect(source).toContain('clientKey="guaratuba-sabores-da-baia"');
    expect(source).toContain("Fazer meu pedido");
  });
});
