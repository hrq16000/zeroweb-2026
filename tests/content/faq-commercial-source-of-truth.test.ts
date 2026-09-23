import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const src = readFileSync(resolve(process.cwd(), "src/routes/faq.tsx"), "utf8");

describe("FAQ commercial source of truth", () => {
  test("não mantém preços/prazos globais que divergem da loja viva", () => {
    for (const stale of ["R$ 2.500","R$ 290/mês","10 e 25 dias","até 7 dias","60 e 120 dias","6 a 12 meses","contrato de 6 meses","Em até 24h"]) {
      expect(src).not.toContain(stale);
    }
  });
  test("encaminha condições comerciais para a fonte canônica", () => {
    expect(src).toContain("loja /servicos");
    expect(src).toContain("página do serviço");
    expect(src).toContain("não existe uma condição global única para todo o catálogo");
  });
  test("não promete posição de SEO", () => {
    expect(src).toContain("sem prometer posição ou prazo fixo");
  });
});
