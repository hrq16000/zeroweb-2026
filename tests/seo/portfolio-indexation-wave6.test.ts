import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 6 de aprofundamento orientada pelo GSC", () => {
  test("Eisenfer ganha roteiro de cotação sem inventar especificação técnica", () => {
    const s = read("EisenferTubosAcosPage.tsx");
    expect(s).toContain("Quatro dados deixam o pedido de aço mais claro.");
    expect(s).toContain("Dimensionamento estrutural, espessura e especificação técnica");
    expect(s).toContain("Tubos e perfis");
    expect(s).toContain("Chapas de aço");
    expect(s).toContain("Telhas TP40");
  });

  test("Darléia ganha guia de encomenda mantendo disponibilidade no atendimento", () => {
    const s = read("ArtesanatosDarLeiaOliveiraPage.tsx");
    expect(s).toContain("Quatro escolhas antes de falar com a artesã.");
    expect(s).toContain("as estampas podem variar");
    expect(s).toContain("Coador de café 100% algodão");
    expect(s).toContain("Retirada ou entrega são combinadas diretamente no atendimento.");
  });

  test("Chyrley ganha planejamento de festa sem presumir preço ou agenda", () => {
    const s = read("ConfeitariaChyrleyPage.tsx");
    expect(s).toContain("O que definir antes de pedir orçamento.");
    expect(s).toContain("os kits festa divulgados atendem de 6 a 100 pessoas");
    expect(s).toContain("Preço, agenda e disponibilidade não são presumidos");
    expect(s).toContain("Retirada no Rio Bonito");
    expect(s).toContain("Envio por Uber a combinar");
  });
});
