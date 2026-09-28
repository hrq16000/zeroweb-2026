import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("segunda onda de conteúdo original em portfólios", () => {
  test("Marmitaria não presume cardápio fixo", () => {
    const s = readFileSync("src/components/site/MarmitariaDomDiegoPage.tsx", "utf8");
    expect(s).toContain("Cardápio do dia, quantidade e forma de receber");
    expect(s).toContain("sem tratar os itens como estoque fixo");
  });
  test("Maresia organiza diagnóstico por contexto", () => {
    const s = readFileSync("src/components/site/RefrigeracaoMaresiaPage.tsx", "utf8");
    expect(s).toContain("Sintoma, equipamento e local");
    expect(s).toContain("marca, modelo quando conhecido");
  });
  test("Lucas separa sintomas antes do diagnóstico", () => {
    const s = readFileSync("src/components/site/LucasArrumaMaquinaLavarPage.tsx", "utf8");
    expect(s).toContain("Descrever o sintoma evita começar");
    expect(s).toContain("Não centrifuga ou não lava");
  });
  test("Eletrovale contextualiza ordem de serviço", () => {
    const s = readFileSync("src/components/site/EletrovaleEletromecanicaPage.tsx", "utf8");
    expect(s).toContain("Equipamento, sintoma e objetivo");
    expect(s).toContain("corretiva, preventiva ou de melhoria de desempenho");
  });
});
