import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("terceira onda de conteúdo original em portfólios", () => {
  test("Angel Mix consulta acervo sem fingir estoque", () => {
    const s = read("AngelMixBrechoPage.tsx");
    expect(s).toContain("não trata as peças como estoque fixo");
    expect(s).toContain("Tipo de peça, tamanho e estilo");
  });

  test("A&G contextualiza avaliação com dados do próprio funil", () => {
    const s = read("AgElectricalServicesPage.tsx");
    expect(s).toContain("Ambiente, pontos, equipamentos e local");
    expect(s).toContain("Quantidade de pontos, rack, câmeras");
  });

  test("Beto não publica bairro nem sabores não reconciliados", () => {
    const s = read("BetoPasteisPage.tsx");
    expect(s).toContain("Beto Pastéis · São José dos Pinhais");
    expect(s).not.toContain("Jardim Itália");
    expect(s).not.toContain("Pastel de carne");
    expect(s).toContain("Sabores, disponibilidade e condições");
  });

  test("Casa Nativa não inventa menu, horário ou capacidade", () => {
    const s = read("CasaNativaBistroPage.tsx");
    expect(s).toContain("experiência gastronômica e reserva");
    expect(s).not.toContain("Terça a sábado");
    expect(s).not.toContain("28 lugares");
    expect(s).not.toContain("Pão de fermentação natural");
  });

  test("Marmitas do Barreiro não publica preço nem cardápio hardcoded", () => {
    const s = read("BarreiroMarmitasPage.tsx");
    expect(s).toContain("quantidade e entrega são confirmadas");
    expect(s).not.toContain("R$ 22");
    expect(s).not.toContain("Frango grelhado");
    expect(s).not.toContain("Combo 5 dias");
  });

  test("Miro diferencia diagnóstico sem garantir recuperação de dados", () => {
    const s = read("MiroTechPage.tsx");
    expect(s).toContain("Equipamento, sintoma e histórico");
    expect(s).toContain("a página não promete resultado");
    expect(s).not.toContain("Profissionais qualificados");
  });
});
