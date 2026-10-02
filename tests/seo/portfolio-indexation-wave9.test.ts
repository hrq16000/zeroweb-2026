import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 9 de aprofundamento orientada pelo GSC", () => {
  test("Beto Pastéis ganha orientação de pedido sem confirmar disponibilidade automaticamente", () => {
    const s = read("BetoPasteisPage.tsx");
    expect(s).toContain("Sabor, quantidade e horário deixam a conversa mais objetiva.");
    expect(s).toContain("confirme com a equipe o que está disponível");
    expect(s).toContain("Informe quantos pastéis");
    expect(s).toContain("não transforma intenção de pedido em confirmação automática");
  });

  test("D'Lara aprofunda a escolha sem inventar sabores, tamanhos ou valores", () => {
    const s = read("DlaraPizzariaPage.tsx");
    expect(s).toContain("Pizza para compartilhar, esfiha para variar ou lanche");
    expect(s).toContain("sabores, tamanhos e valores para confirmação com a equipe");
    expect(s).toContain("bairro ou endereço em São José dos Pinhais");
  });

  test("Eletro Soluções ganha briefing baseado nas opções já publicadas", () => {
    const s = read("EletroSolucoesEficazesPage.tsx");
    expect(s).toContain("Um briefing curto ajuda a enquadrar o serviço.");
    expect(s).toContain("Residência, comércio ou condomínio");
    expect(s).toContain("Pinhais, Curitiba e região");
    expect(s).toContain("quer uma visita técnica");
  });
});
