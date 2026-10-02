import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 10 de aprofundamento orientada pelo GSC", () => {
  test("Toquinho de Gente aprofunda a consulta sem inventar disponibilidade", () => {
    const s = read("ToquinhoDeGenteBrechoPage.tsx");
    expect(s).toContain("Adulto ou infantil, tamanho e tipo de peça ajudam a começar o garimpo.");
    expect(s).toContain("peça adulta ou infantil");
    expect(s).toContain("Dizer o tamanho que precisa");
    expect(s).toContain("a confirmação acontece no atendimento");
  });


  test("Raphael Construções aprofunda a avaliação sem prometer escopo ou prazo", () => {
    const s = read("RaphaelConstrucoesPage.tsx");
    expect(s).toContain("Tipo de obra, imóvel e material disponível deixam o primeiro contato mais objetivo.");
    expect(s).toContain("construção, reforma, impermeabilização");
    expect(s).toContain("projeto, medidas, fotos do local");
    expect(s).toContain("escopo, disponibilidade e sequência são confirmados após a avaliação");
  });
});
