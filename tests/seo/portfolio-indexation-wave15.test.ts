import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 15 de aprofundamento orientada pelo GSC", () => {
  test("Espaço CIH & LUH organiza o pedido de horário com dados do próprio fluxo", () => {
    const s = read("EspacoCihLuhPage.tsx");
    expect(s).toContain("Cuidado, momento, local e preferência deixam o pedido de horário mais claro.");
    expect(s).toContain("Alongamento em gel, reconstrução, pedicure tradicional");
    expect(s).toContain("Manaus e região aparecem no formulário");
    expect(s).toContain("Formato, comprimento, cor, sensibilidade e horário ideal");
  });

  test("Thays Camilla transforma personalização em briefing sem prometer entrega", () => {
    const s = read("ThaysCamillaPage.tsx");
    expect(s).toContain("Peça, ocasião, conteúdo da arte e forma de receber ajudam a organizar a personalização.");
    expect(s).toContain("Kit com caneca e azulejo");
    expect(s).toContain("Frase, imagem, cores, quantidade e data");
    expect(s).toContain("Retirada, entrega combinada e prazo desejado");
  });
});
