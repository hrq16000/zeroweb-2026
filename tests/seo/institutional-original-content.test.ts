import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const contato = readFileSync("src/routes/contato.tsx", "utf8");
const sobre = readFileSync("src/routes/sobre.tsx", "utf8");
const solicitar = readFileSync("src/routes/solicitar-orcamento.tsx", "utf8");
const sitemap = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");

describe("conteúdo institucional autêntico", () => {
  test("Contato explica o funil sem expor canal direto", () => {
    expect(contato).toContain("O que ajuda a análise inicial");
    expect(contato).toContain("Quando o atendimento pede continuidade no WhatsApp");
    expect(contato).toContain('"@type": "FAQPage"');
    expect(contato).toContain('mainEntity: { "@id": "https://0web.com.br/#org" }');
    expect(contato).not.toContain("wa.me/");
  });

  test("Sobre remove números e promessas sem evidência", () => {
    expect(sobre).toContain("Evidência antes de escala");
    expect(sobre).toContain("SEO com evidência");
    expect(sobre).toContain("Sem promessa de ranking");
    expect(sobre).not.toContain("300+");
    expect(sobre).not.toContain("1M+");
    expect(sobre).not.toContain("diagnóstico em até 24 horas");
    expect(sobre).not.toContain("Padrão internacional");
  });

  test("formulário de orçamento não compete como conteúdo de busca", () => {
    expect(solicitar).toContain('name: "robots", content: "noindex,follow"');
    expect(sitemap).not.toContain('{ path: "/solicitar-orcamento"');
  });
});
