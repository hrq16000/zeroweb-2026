import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 12 de aprofundamento orientada pelo GSC", () => {
  test("Simone Lacerda organiza o primeiro contato sem transformar o formulário em avaliação clínica", () => {
    const s = read("SimoneLacerdaVazPage.tsx");
    expect(s).toContain("O tipo de cuidado, seu momento e a disponibilidade ajudam a organizar o primeiro contato.");
    expect(s).toContain("pré ou pós-bariátrica");
    expect(s).toContain("Manhã, tarde, noite ou flexibilidade");
    expect(s).toContain("não substitui avaliação profissional");
  });

  test("JS Elétrica explicita os dados que ajudam a preparar a avaliação", () => {
    const s = read("JsEletricaManutencaoPage.tsx");
    expect(s).toContain("Equipamento, defeito, quantidade de pontos e foto do quadro ajudam a preparar a avaliação.");
    expect(s).toContain("Identifique o aparelho, motor, bomba, quadro");
    expect(s).toContain("informe a quantidade");
    expect(s).toContain("Uma foto do quadro ou do ponto com problema");
  });

});
