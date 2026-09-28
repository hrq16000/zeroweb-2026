import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const services = readFileSync("src/lib/services-data.ts", "utf8");

describe("factualidade do fallback de serviços", () => {
  test("remove promessas universais de performance, ranking e prazo", () => {
    for (const claim of [
      "Conversão acima da média do mercado",
      "Performance 95+ no Lighthouse",
      "Taxa de conversão até 4x maior",
      "Topo do Google",
      "Primeiros ganhos de posição em 60-90 dias",
      "previsível a partir do 6º mês",
      "somos certificados nos dois ecossistemas",
      "MVPs em 2-4 semanas",
      "Resposta em segundos, 24h por dia",
      "Entre 8 e 16 semanas",
      "Entrega em até 7 dias úteis",
    ]) {
      expect(services).not.toContain(claim);
    }
  });

  test("mantém linguagem condicional e mensurável", () => {
    expect(services).toContain("SEO não tem prazo ou posição garantidos");
    expect(services).toContain("A previsão é definida na proposta do projeto");
    expect(services).toContain("conforme a estratégia, as contas disponíveis e o escopo contratado");
    expect(services).toContain("A estimativa é definida após o mapeamento do processo");
  });
});
