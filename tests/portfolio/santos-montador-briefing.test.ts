import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/SantosMontadorDeMoveisPage.tsx", "utf8");

describe("Santos Montador · briefing factual", () => {
  test("organiza somente opções já presentes no funil e na página", () => {
    expect(source).toContain('id="briefing"');
    expect(source).toContain("Montagem ou desmontagem de móveis");
    expect(source).toContain("limpeza de caixa d'água");
    expect(source).toContain("Alphaville, Curitiba, Colombo e outra região");
    expect(source).toContain("Manhã, tarde ou flexibilidade");
    expect(source).toContain("o quanto antes, nesta semana");
    expect(source).toContain("Tipo de móvel, quantidade, medidas, fotos");
  });

  test("não introduz preço, prazo fixo ou garantia", () => {
    expect(source).not.toContain("R$");
    expect(source).not.toContain("dias úteis");
    expect(source).not.toContain("garantia de");
  });
});
