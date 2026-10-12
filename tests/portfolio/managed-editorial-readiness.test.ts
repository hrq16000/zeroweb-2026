import { describe, expect, test } from "bun:test";
import { evaluateNewManagedEditorialReadiness } from "@/lib/portfolio-managed-editorial";
import { managedStatus, sanitizeManagedProject } from "@/lib/portfolio-managed";

const editorial = {
  summary:
    "Oficina Horizonte trabalha com manutenção mecânica e revisões agendadas no bairro Centro, em Curitiba, conforme informações verificadas com o responsável.",
  about:
    "A Oficina Horizonte organiza atendimentos de revisão e manutenção mecânica em Curitiba. As especialidades apresentadas nesta página foram confirmadas pelo responsável, que fornece orçamento após avaliação individual.",
  seoTitle: "Oficina Horizonte: revisão e manutenção em Curitiba",
  seoDescription:
    "Conheça os atendimentos de revisão e manutenção da Oficina Horizonte em Curitiba, os serviços informados pelo responsável e como solicitar um orçamento.",
};

const codes = (data: typeof editorial) =>
  evaluateNewManagedEditorialReadiness(data).map((issue) => issue.code);

describe("readiness editorial — novos Managed", () => {
  test("aceita narrativa factual, específica e diferenciada", () => {
    expect(codes(editorial)).toEqual([]);
  });

  test("bloqueia resumo, apresentação e meta description insuficientes", () => {
    expect(codes({
      ...editorial,
      summary: "Oficina Horizonte em Curitiba.",
      about: "Conheça nosso trabalho.",
      seoDescription: "Serviços e novidades.",
    })).toEqual(expect.arrayContaining([
      "PORTFOLIO_EDITORIAL_SUMMARY_THIN",
      "PORTFOLIO_EDITORIAL_ABOUT_THIN",
      "PORTFOLIO_EDITORIAL_SEO_DESCRIPTION_THIN",
    ]));
  });

  test("detecta placeholders mesmo com texto comprido", () => {
    expect(codes({
      ...editorial,
      about: editorial.about + " [PREENCHER]",
    })).toContain("PORTFOLIO_EDITORIAL_PLACEHOLDER");
    expect(codes({
      ...editorial,
      seoTitle: "Nome da empresa",
    })).toContain("PORTFOLIO_EDITORIAL_PLACEHOLDER");
  });

  test("bloqueia conteúdo automático genérico e descrição SEO duplicada", () => {
    const about =
      editorial.about + " Esta página reúne somente informações sustentadas pelas evidências da pesquisa.";
    expect(codes({ ...editorial, about })).toContain("PORTFOLIO_EDITORIAL_RESEARCH_SCAFFOLD");
    expect(codes({ ...editorial, seoDescription: editorial.summary })).toContain(
      "PORTFOLIO_EDITORIAL_DUPLICATED_META",
    );
  });

  test("integra ao gate de novos Managed, sem bloquear os projetos históricos", () => {
    const base = {
      slug: "oficina-horizonte-fixture",
      client_key: "oficina-horizonte-fixture",
      display_name: "Oficina Horizonte",
      summary: "Curitiba",
      seo_title: editorial.seoTitle,
      seo_description: editorial.seoDescription,
      content_blocks: { about: "Texto insuficiente" },
      source_snapshot: {
        managed_funnel: { configured: true, intent: "orcamento", delivery_mode: "lead_only" },
      },
      lifecycle_status: "draft",
      published: false,
    };
    const legacy = sanitizeManagedProject(base)!;
    const newer = sanitizeManagedProject({
      ...base,
      source_snapshot: {
        ...base.source_snapshot,
        authorial_composition: { required: true },
      },
    })!;
    const legacyCodes = managedStatus(legacy).blockers.map((issue) => issue.code);
    const newCodes = managedStatus(newer).blockers.map((issue) => issue.code);
    expect(legacyCodes).not.toContain("PORTFOLIO_EDITORIAL_SUMMARY_THIN");
    expect(legacyCodes).not.toContain("PORTFOLIO_EDITORIAL_ABOUT_THIN");
    expect(newCodes).toContain("PORTFOLIO_EDITORIAL_SUMMARY_THIN");
    expect(newCodes).toContain("PORTFOLIO_EDITORIAL_ABOUT_THIN");
  });
});
