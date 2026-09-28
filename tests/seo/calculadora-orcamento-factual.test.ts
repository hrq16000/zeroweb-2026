import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/routes/calculadora-orcamento.tsx", "utf8");

describe("calculadora de orçamento factual", () => {
  test("remove comparação de mercado e promessas sem prova", () => {
    for (const claim of [
      "200+ operações",
      "+40% de performance",
      "Mercado tradicional",
      "marketMin",
      "marketMax",
      "Setup completo em até 7 dias úteis",
      "Equipe sênior dedicada — nada de estagiário",
    ]) {
      expect(source).not.toContain(claim);
    }
  });

  test("declara metodologia e limitações", () => {
    expect(source).toContain("Como a estimativa é calculada");
    expect(source).toContain("O que a ferramenta não calcula");
    expect(source).toContain("não substitui diagnóstico, proposta");
    expect(source).toContain('"@type": "FAQPage"');
    expect(source).toContain("index,follow");
  });

  test("mantém atendimento pelo funil existente", () => {
    expect(source).toContain('open("calculator_result")');
    expect(source).toContain("Levar estimativa para o atendimento");
    expect(source).not.toContain("wa.me/");
  });
});
