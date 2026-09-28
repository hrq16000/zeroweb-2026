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

  test("Infraestrutura não publica garantias universais", () => {
    const infra = readFileSync("src/routes/infraestrutura.tsx", "utf8");
    expect(infra).toContain("Performance medida por projeto");
    expect(infra).toContain("A infraestrutura deixa rastros que podem ser auditados");
    expect(infra).not.toContain("100% de uptime garantido");
    expect(infra).not.toContain("LCP < 1.5s");
    expect(infra).not.toContain("300+ pontos de presença");
    expect(infra).not.toContain("carrega em milissegundos");
  });

  test("Sites por segmento explica intenção sem virar template genérico", () => {
    const sites = readFileSync("src/routes/sites.index.tsx", "utf8");
    expect(sites).toContain("Segmento não é sinônimo de template");
    expect(sites).toContain("Quando criar outra página");
    expect(sites).toContain('"@type": "ItemList"');
    expect(sites).toContain("index,follow");
  });

  test("diagnóstico utilitário não compete no índice", () => {
    const diagnostico = readFileSync("src/routes/solicitar-diagnostico.tsx", "utf8");
    expect(diagnostico).toContain('name: "robots", content: "noindex,follow"');
    expect(sitemap).not.toContain('{ path: "/solicitar-diagnostico"');
  });

  test("planos hardcoded ficam fora do índice até reconciliação com catálogo", () => {
    const planos = readFileSync("src/routes/planos.tsx", "utf8");
    const comparativo = readFileSync("src/routes/planos-comparativo.tsx", "utf8");
    expect(planos).toContain('name: "robots", content: "noindex,follow"');
    expect(comparativo).toContain('name: "robots", content: "noindex,follow"');
    expect(sitemap).not.toContain('{ path: "/planos"');
    expect(sitemap).not.toContain('{ path: "/planos-comparativo"');
  });

  test("mapa HTML continua navegável sem competir no índice", () => {
    const mapa = readFileSync("src/routes/mapa-do-site.tsx", "utf8");
    expect(mapa).toContain('name: "robots", content: "noindex,follow"');
    expect(sitemap).not.toContain('{ path: "/mapa-do-site"');
  });
});
