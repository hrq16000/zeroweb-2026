import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/SaboresDaBaiaPage.tsx", "utf8");

describe("Sabores da Baía · profundidade de decisão", () => {
  test("reorganiza apenas fatos já publicados na própria página", () => {
    expect(source).toContain('id="guia-pedido"');
    expect(source).toContain("segunda a sexta, das 11h30 às 14h");
    expect(source).toContain("indicado para sábados e domingos");
    expect(source).toContain("raio de 6 km do Centro");
    expect(source).toContain("De dezembro a março");
    expect(source).toContain("retirada no balcão");
    expect(source).toContain("Reserva de mesa");
  });

  test("não adiciona avaliação, depoimento ou nova promessa operacional", () => {
    expect(source).not.toContain("avaliações");
    expect(source).not.toContain("estrelas");
    expect(source).not.toContain("entrega garantida");
  });
});
