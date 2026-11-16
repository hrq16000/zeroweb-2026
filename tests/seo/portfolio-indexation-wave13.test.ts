import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 13 de aprofundamento orientada pelo GSC", () => {

  test("Mimo diferencia pedido do dia e encomenda para evento sem inventar estoque", () => {
    const s = read("MimoSalgadosDocesPage.tsx");
    expect(s).toContain("Um pedido para hoje e uma encomenda para festa começam com informações diferentes.");
    expect(s).toContain("confirme sabores, quantidade e disponibilidade do dia com a equipe");
    expect(s).toContain("quantidade aproximada e data");
    expect(s).toContain("Retirada na Costeira, entrega a combinar");
  });
});
