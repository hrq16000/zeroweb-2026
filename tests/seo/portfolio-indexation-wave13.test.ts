import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 13 de aprofundamento orientada pelo GSC", () => {
  test("Auto Socorro Dentinho aprofunda a triagem sem prometer prazo ou disponibilidade", () => {
    const s = read("AutoSocorroDentinhoPage.tsx");
    expect(s).toContain("Sintoma, situação do veículo, localização e urgência deixam a triagem mais objetiva.");
    expect(s).toContain("não liga, perdeu força, acendeu uma luz no painel");
    expect(s).toContain("Quatro Barras e Região Metropolitana");
    expect(s).toContain("Prazo, orçamento e disponibilidade só são confirmados no canal oficial.");
  });

  test("Mimo diferencia pedido do dia e encomenda para evento sem inventar estoque", () => {
    const s = read("MimoSalgadosDocesPage.tsx");
    expect(s).toContain("Um pedido para hoje e uma encomenda para festa começam com informações diferentes.");
    expect(s).toContain("confirme sabores, quantidade e disponibilidade do dia com a equipe");
    expect(s).toContain("quantidade aproximada e data");
    expect(s).toContain("Retirada na Costeira, entrega a combinar");
  });
});
