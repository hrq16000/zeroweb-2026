import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/routes/sites.$vertical.tsx", "utf8");

describe("autenticidade das páginas /sites/:vertical", () => {
  test("remove promessas universais de ranking e prazo", () => {
    expect(source).not.toContain("Pronto para ser o primeiro do Google");
    expect(source).not.toContain("Em até 24h");
    expect(source).not.toContain("Apereça em 1º lugar");
    expect(source).not.toContain("Conformidade total com o Provimento");
  });

  test("não renderiza negócios fictícios como página do segmento", () => {
    expect(source).not.toContain("PrototypeSite");
    expect(source).not.toContain("Almeida & Torres");
    expect(source).not.toContain("casa nativa");
  });

  test("publica conteúdo específico e FAQ real por vertical", () => {
    expect(source).toContain("VERTICAL_GUIDES");
    expect(source).toContain('"@type": "FAQPage"');
    expect(source).toContain("O que um site precisa resolver para");
    expect(source).toContain("Perguntas frequentes sobre site para");
  });
});
