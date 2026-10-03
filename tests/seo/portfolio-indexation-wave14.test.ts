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

  test("Empório LeleCute transforma a ideia em briefing factual", () => {
    const s = read("EmporioLelecutePage.tsx");
    expect(s).toContain("Ocasião, quantidade, data e formato ajudam a transformar a ideia em proposta.");
    expect(s).toContain("Casamento, noivado, maternidade");
    expect(s).toContain("Uma estimativa de unidades");
    expect(s).toContain("mini-velas, sabonetes, kit presente ou convites perfumados");
  });

  test("Lucas Arruma Máquina detalha a ficha do sintoma sem prometer diagnóstico", () => {
    const s = read("LucasArrumaMaquinaLavarPage.tsx");
    expect(s).toContain("Equipamento, marca, modelo, código de erro e início do problema ajudam a preparar o diagnóstico.");
    expect(s).toContain("Máquina de lavar, lava e seca, tanquinho");
    expect(s).toContain("Não liga, não centrifuga, não drena, vaza, faz ruído");
    expect(s).toContain("se ela acontece sempre ou em algum ciclo específico");
  });
});
