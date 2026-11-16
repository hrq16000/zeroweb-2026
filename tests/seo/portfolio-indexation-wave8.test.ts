import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 8 de aprofundamento orientada pelo GSC", () => {
  test("Almeida Torres ganha triagem factual sem prometer resultado", () => {
    const s = read("AlmeidaTorresAdvocaciaPage.tsx");
    expect(s).toContain("Quatro informações ajudam a organizar a primeira orientação.");
    expect(s).toContain("Família e sucessões");
    expect(s).toContain("ainda não há processo");
    expect(s).toContain("Contratos, comprovantes, mensagens");
    expect(s).toContain("não substitui a análise jurídica");
  });

  test("Brechó São Francisco ganha consulta de garimpo sem inventar estoque", () => {
    const s = read("BrechoSaoFranciscoPage.tsx");
    expect(s).toContain("Quanto mais claro o pedido, mais fácil consultar o que está na vitrine.");
    expect(s).toContain("roupa feminina");
    expect(s).toContain("Tamanho e estilo");
    expect(s).toContain("a confirmação acontece no atendimento");
  });

  test("Woodhouse ganha orientação de pedido preservando disponibilidade real", () => {
    const s = read("WoodhouseHamburgueresPage.tsx");
    expect(s).toContain("Três decisões deixam o pedido mais direto.");
    expect(s).toContain("hambúrguer grelhado");
    expect(s).toContain("retirada");
    expect(s).toContain("entrega combinada");
    expect(s).toContain("a página não presume estoque");
  });
});
