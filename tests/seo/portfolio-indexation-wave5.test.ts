import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 5 de aprofundamento orientada pelo GSC", () => {
  test("Cris Presentes ganha mapa de procura sem inventar estoque", () => {
    const s = read("CrisPresentesColoniaRioGrandePage.tsx");
    expect(s).toContain("Comece pela situação, não pelo produto.");
    expect(s).toContain("Este guia não representa estoque em tempo real.");
    expect(s).toContain("Brinquedos e artigos recreativos");
    expect(s).toContain("Papelaria");
    expect(s).toContain("Rua Pedro Trevisan, 58");
  });

  test("BTB ganha caderno de escopo mantendo serviços e limites comerciais", () => {
    const s = read("BtbConstrucaoPage.tsx");
    expect(s).toContain("Quatro perguntas antes do orçamento.");
    expect(s).toContain("Essa organização não calcula preço, prazo nem viabilidade");
    expect(s).toContain("Garantia informada pela BTB: 90 dias");
    expect(s).toContain("Pintura");
    expect(s).toContain("Drywall e forro");
  });

  test("Clínica Integrada ganha orientação de triagem sem fazer diagnóstico", () => {
    const s = read("ClinicaIntegradaSaudePage.tsx");
    expect(s).toContain("Escolha o caminho do contato sem adivinhar a especialidade.");
    expect(s).toContain("diagnóstico e conduta clínica são definidos no atendimento por profissional de saúde");
    expect(s).toContain("Odontologia");
    expect(s).toContain("Cardiologia");
    expect(s).toContain("Exames anteriores ajudam na avaliação");
  });
});
