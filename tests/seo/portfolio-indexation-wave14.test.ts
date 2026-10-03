import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 14 de aprofundamento orientada pelo GSC", () => {
  test("Manu Pastéis organiza o pedido com dados já publicados", () => {
    const s = read("ManuPasteisPage.tsx");
    expect(s).toContain("Cardápio, horário e forma de pagamento deixam o pedido mais direto.");
    expect(s).toContain("terça a sábado, das 18h30 às 23h");
    expect(s).toContain("PIX e cartão de crédito");
    expect(s).toContain("pagamento na entrega");
  });


});
