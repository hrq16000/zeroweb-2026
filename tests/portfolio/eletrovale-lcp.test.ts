import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/EletrovaleEletromecanicaPage.tsx", "utf8");

describe("Eletrovale · LCP do hero", () => {
  test("mantém a imagem hero prioritária fora de MotionReveal", () => {
    expect(source).toContain('src="/images/eletrovale-eletromecanica/equipamentos.webp"');
    expect(source).toContain("priority");
    expect(source).not.toContain('<MotionReveal variant="mask" delay={80}>\n          <PortfolioImage\n            src="/images/eletrovale-eletromecanica/equipamentos.webp"');
  });

  test("preserva CTA e motions não críticos", () => {
    expect(source).toContain("Solicitar avaliação");
    expect(source).toContain('as="article"');
    expect(source).toContain("<MotionReveal");
  });
});
