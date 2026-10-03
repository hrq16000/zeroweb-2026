import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 18 de aprofundamento orientada pelo GSC", () => {
  test("Fernanda & Amaral organiza a primeira avaliação sem prometer viabilidade", () => {
    const s = read("FernandaAmaralDrywallPage.tsx");
    expect(s).toContain("Quatro informações ajudam a organizar a primeira avaliação.");
    expect(s).toContain("Drywall, pintura, reforma, móveis e madeira, corte de grama ou pequeno frete.");
    expect(s).toContain("Fotos, medidas aproximadas, acabamento desejado, endereço a confirmar");
    expect(s).toContain("não confirmam viabilidade, preço nem agenda automaticamente");
  });
});
