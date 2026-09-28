import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("terceira onda aditiva de conteúdo em portfólios", () => {
  test("Angel Mix ganha orientação sem remover o acervo existente", () => {
    const s = read("AngelMixBrechoPage.tsx");
    expect(s).toContain("Tipo de peça, tamanho e estilo");
    expect(s).toContain("Cada peça chega uma vez só");
    expect(s).toContain("Vestidos");
  });

  test("A&G ganha contexto técnico sem perder serviços e registros existentes", () => {
    const s = read("AgElectricalServicesPage.tsx");
    expect(s).toContain("Ambiente, pontos, equipamentos e local");
    expect(s).toContain("Elétrica geral");
    expect(s).toContain("CFTV");
    expect(s).toContain("Registros de campo");
  });

  test("Beto Pastéis preserva conteúdo existente", () => {
    const s = read("BetoPasteisPage.tsx");
    expect(s).toContain("Jardim Itália");
    expect(s).toContain("Pastel de carne");
    expect(s).toContain("Pastel de queijo");
  });

  test("Casa Nativa preserva a composição existente", () => {
    const s = read("CasaNativaBistroPage.tsx");
    expect(s).toContain("Menu em quatro tempos");
    expect(s).toContain("Carta da semana");
    expect(s).toContain("Reserva");
  });

  test("Marmitas do Barreiro preserva cardápio e referências existentes", () => {
    const s = read("BarreiroMarmitasPage.tsx");
    expect(s).toContain("R$ 22");
    expect(s).toContain("Frango grelhado");
    expect(s).toContain("Combo 5 dias");
  });

  test("Miro Tech recebe novo bloco sem remover diferenciais existentes", () => {
    const s = read("MiroTechPage.tsx");
    expect(s).toContain("Equipamento, sintoma e histórico");
    expect(s).toContain("Profissionais qualificados");
    expect(s).toContain("Atendimento rápido");
    expect(s).toContain("Preços justos");
  });
});
