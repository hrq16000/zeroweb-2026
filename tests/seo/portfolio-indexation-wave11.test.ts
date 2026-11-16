import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 11 de aprofundamento orientada pelo GSC", () => {
  test("Marmitaria Dom Diego aprofunda o pedido sem inventar disponibilidade", () => {
    const s = read("MarmitariaDomDiegoPage.tsx");
    expect(s).toContain("Dia da semana, o que procura e como quer receber deixam o pedido mais claro.");
    expect(s).toContain("segunda a sexta");
    expect(s).toContain("confirme com a equipe o que está disponível naquele dia");
    expect(s).toContain("Retirada ou entrega são combinadas diretamente com a casa");
  });

  test("REuse House organiza o garimpo preservando a disponibilidade real", () => {
    const s = read("ReuseHouseBrechoPage.tsx");
    expect(s).toContain("Peça, estilo e disponibilidade organizam o garimpo antes da resposta.");
    expect(s).toContain("garimpo é feito peça a peça");
    expect(s).toContain("atenção ao estado e ao caimento");
    expect(s).toContain("dependem do que estiver disponível no momento da consulta");
  });

  test("Oficina Náutica ganha briefing baseado no próprio fluxo de orçamento", () => {
    const s = read("OficinaNauticaGuaratubaPage.tsx");
    expect(s).toContain("Serviço, tipo de embarcação, localização e prazo ajudam a oficina a entender o chamado.");
    expect(s).toContain("Revisão de motor, reparo de casco, elétrica de bordo");
    expect(s).toContain("Lancha, barco de pesca, jet ski ou bote inflável");
    expect(s).toContain("Garagem, marina, água ou outra cidade");
  });
});
