import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("onda 23 de aprofundamento orientada pelo GSC", () => {
  test("Easy Clean organiza a avaliação sem prometer preço ou agenda", () => {
    const s = readFileSync("src/components/site/EasyCleanPage.tsx", "utf8");
    expect(s).toContain("Cinco dados deixam o pedido mais claro.");
    expect(s).toContain("Diga quantas peças precisam de avaliação.");
    expect(s).toContain("Avise se também deseja consultar impermeabilização.");
    expect(s).toContain("valor, tratamento e disponibilidade continuam sendo confirmados no atendimento");
  });
});
