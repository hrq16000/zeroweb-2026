import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 15 de aprofundamento orientada pelo GSC", () => {

  test("Thays Camilla transforma personalização em briefing sem prometer entrega", () => {
    const s = read("ThaysCamillaPage.tsx");
    expect(s).toContain("Peça, ocasião, conteúdo da arte e forma de receber ajudam a organizar a personalização.");
    expect(s).toContain("Kit com caneca e azulejo");
    expect(s).toContain("Frase, imagem, cores, quantidade e data");
    expect(s).toContain("Retirada, entrega combinada e prazo desejado");
  });
});
