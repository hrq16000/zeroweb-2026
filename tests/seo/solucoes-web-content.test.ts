import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/routes/solucoes.tsx", "utf8");

describe("/solucoes como hub original de decisão", () => {
  test("trabalha explicitamente a intenção soluções web", () => {
    expect(source).toContain("Soluções Web, SEO, IA e Marketing Digital");
    expect(source).toContain("Qual solução web faz sentido para o seu momento?");
    expect(source).toContain("Serviço de catálogo ou solução sob medida?");
  });

  test("liga problemas a serviços canônicos reais", () => {
    for (const path of [
      "/servicos/criacao-de-sites",
      "/servicos/landing-pages",
      "/servicos/seo",
      "/servicos/trafego-pago",
      "/servicos/google-meu-negocio",
      "/servicos/automacao-com-ia",
    ]) {
      expect(source).toContain(path);
    }
  });

  test("não promete ranking ou conversão", () => {
    expect(source).toContain("Não existe garantia responsável de primeira posição");
    expect(source).toContain('"@type": "FAQPage"');
  });
});
