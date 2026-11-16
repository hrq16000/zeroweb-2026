import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(`src/components/site/${name}`, "utf8");

describe("onda 7 de aprofundamento orientada pelo GSC", () => {
  test("Marmitas do Barreiro ganha planejamento semanal sem prometer disponibilidade", () => {
    const s = read("BarreiroMarmitasPage.tsx");
    expect(s).toContain("Monte a semana a partir do que já está definido.");
    expect(s).toContain("Retirada no Barreiro");
    expect(s).toContain("entrega no bairro");
    expect(s).toContain("sujeitos à confirmação da cozinha");
  });

  test("Autoescola APTOS ganha mapa de decisão com fatos já publicados", () => {
    const s = read("AutoescolaAptosPage.tsx");
    expect(s).toContain("Que informação levar para a APTOS?");
    expect(s).toContain("Primeira habilitação");
    expect(s).toContain("carro automático");
    expect(s).toContain("moto automática");
    expect(s).toContain("Rua Passos de Oliveira, 810");
  });

  test("Casa Nativa ganha orientação de reserva sem confirmar mesa automaticamente", () => {
    const s = read("CasaNativaBistroPage.tsx");
    expect(s).toContain("Quatro decisões simples deixam o pedido de mesa mais claro.");
    expect(s).toContain("menu em quatro tempos");
    expect(s).toContain("Salão interno");
    expect(s).toContain("não confirma mesa automaticamente");
  });
});
