import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/HbkIluminacaoLedPage.tsx", "utf8");

describe("HBK Iluminação LED · briefing factual", () => {
  test("restaura o briefing validado da onda GSC 10", () => {
    expect(source).toContain('id="briefing-led"');
    expect(source).toContain("Residência, condomínio, comércio ou obra em andamento");
    expect(source).toContain("Sala, cozinha, fachada, área externa, móveis planejados");
    expect(source).toContain("Metragem, fotos do ambiente ou uma descrição do projeto");
    expect(source).toContain("disponibilidade e indicação final são confirmadas pela HBK");
  });

  test("preserva a estabilização do H1 e não inventa preço ou prazo fixo", () => {
    expect(source).not.toContain('<MotionReveal as="h1" variant="scale" intensity="EXPRESSIVE"');
    expect(source).not.toContain("R$");
    expect(source).not.toContain("dias úteis");
  });
});
