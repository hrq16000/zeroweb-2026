import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/ReparosDoLitoralPage.tsx", "utf8");

describe("onda 20 de aprofundamento orientada pelo GSC", () => {
  test("Reparos do Litoral organiza o primeiro contato sem confirmar orçamento automaticamente", () => {
    expect(source).toContain("Quatro dados deixam o primeiro contato mais objetivo.");
    expect(source).toContain("Elétrica pequena, hidráulica pequena, montagem e fixação");
    expect(source).toContain("Casa, apartamento, comércio ou casa de temporada.");
    expect(source).toContain("valor, atendimento e agendamento continuam sujeitos à confirmação da equipe");
  });
});
