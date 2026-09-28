import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const acai = readFileSync("src/components/site/AcaiTotalAraucariaPage.tsx", "utf8");
const almeida = readFileSync("src/components/site/AlmeidaTorresAdvocaciaPage.tsx", "utf8");

describe("onda de conteúdo original em portfólios", () => {
  test("Açaí Total aprofunda somente escolhas já existentes no pedido", () => {
    expect(acai).toContain("Três informações deixam o pedido mais claro");
    expect(acai).toContain("Copão ou litrão?");
    expect(acai).toContain("Frutas, cremes e complementos");
    expect(acai).toContain("Endereço em Araucária");
    expect(acai).not.toContain("entrega garantida");
  });

  test("Almeida Torres aprofunda triagem sem prometer resultado", () => {
    expect(almeida).toContain("Contexto, documentos e próximo passo");
    expect(almeida).toContain("Contratos, comprovantes, mensagens e documentos oficiais");
    expect(almeida).toContain("sem prometer resultado");
    expect(almeida).not.toContain("causa ganha");
  });


  test("Darléia aprofunda encomenda sem presumir estoque", () => {
    const source = readFileSync("src/components/site/ArtesanatosDarLeiaOliveiraPage.tsx", "utf8");
    expect(source).toContain("O que vale definir antes de falar com a artesã");
    expect(source).toContain("a página não presume estoque");
    expect(source).toContain("Retirada ou entrega");
  });

  test("Assistência Santos separa reparo, ferrugem e revisados", () => {
    const source = readFileSync("src/components/site/AssistenciaMicroondasSantosPage.tsx", "utf8");
    expect(source).toContain("Conserto, restauração ou aparelho revisado");
    expect(source).toContain("Marca e modelo quando conhecidos");
    expect(source).toContain("Disponibilidade, garantia e condições são confirmadas");
  });
});
