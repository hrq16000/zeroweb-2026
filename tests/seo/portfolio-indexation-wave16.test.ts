import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 16 de aprofundamento orientada pelo GSC", () => {

  test("Uberlândia Elétrica organiza o chamado pelos dados já coletados", () => {
    const s = read("UberlandiaEletricaResidencialPage.tsx");
    expect(s).toContain("Serviço, tipo de imóvel, situação atual e urgência ajudam a preparar a avaliação elétrica.");
    expect(s).toContain("Quadro de distribuição, chuveiro ou ducha, aterramento e DR");
    expect(s).toContain("Casa, apartamento, comércio ou obra em andamento");
    expect(s).toContain("Emergência hoje, atendimento nesta semana ou agendamento");
  });
});
