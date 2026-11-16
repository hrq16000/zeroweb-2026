import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/PastelariaRoute66Page.tsx", "utf8");

describe("Pastelaria Route 66 · profundidade local", () => {
  test("expõe respostas locais apoiadas no brief oficial", () => {
    expect(source).toContain('id="guia-local"');
    expect(source).toContain("Rua Comendador Roseira, 505, no Prado Velho, em Curitiba");
    expect(source).toContain("De segunda a sábado, das 7h às 20h. Domingo: fechado.");
    expect(source).toContain("Dá para retirar o pedido?");
    expect(source).toContain("A Route 66 faz entrega?");
  });

  test("não introduz preço, avaliação pública ou cardápio detalhado", () => {
    expect(source).not.toContain("R$");
    expect(source).not.toContain("4.7");
    expect(source).not.toContain("6 avaliações");
  });
});
