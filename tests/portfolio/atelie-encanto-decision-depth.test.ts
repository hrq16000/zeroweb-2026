import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/AtelieEncantoDaBaiaPage.tsx", "utf8");

describe("Ateliê Encanto da Baía · profundidade de decisão", () => {
  test("organiza apenas fatos já publicados na página", () => {
    expect(source).toContain('id="guia-encomenda"');
    expect(source).toContain("20 a 200 peças");
    expect(source).toContain("etiqueta personalizada");
    expect(source).toContain("produtos escolhidos por você");
    expect(source).toContain("retirada no mesmo dia");
    expect(source).toContain("monta uma amostra para aprovação");
    expect(source).toContain("Dia das Mães, festa junina, formaturas, Natal, chá de bebê e casamentos");
  });

  test("não inventa preço, avaliação ou prazo fixo", () => {
    expect(source).not.toContain("R$");
    expect(source).not.toContain("estrelas");
    expect(source).not.toContain("dias úteis");
  });
});
