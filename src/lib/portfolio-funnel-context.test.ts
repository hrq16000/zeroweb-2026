import { describe, expect, it } from "bun:test";
import contracts from "@/config/portfolio-funnel-context.json";
import catalog from "@/config/portfolio-catalog.json";
import {
  auditPortfolioFunnelContext,
  resolvePortfolioFunnelContext,
} from "@/lib/portfolio-funnel-context";
import { buildPortfolioQuizPreviewMessage } from "@/lib/portfolio-quiz-copy";

const slugs = (catalog as { slug: string }[]).map((c) => c.slug);

describe("contrato de funil por projeto", () => {
  it("cobre todos os projetos do catálogo com contrato próprio", () => {
    for (const slug of slugs) {
      expect(resolvePortfolioFunnelContext(slug).source).toBe("PROJECT_CONTRACT");
    }
  });

  it("não deixa nenhum projeto com funil incoerente", () => {
    const failing = slugs.filter((slug) => auditPortfolioFunnelContext(slug).status === "FAIL");
    expect(failing).toEqual([]);
  });

  it("usa fallback neutro — nunca o texto de outro projeto — quando não há contrato", () => {
    const context = resolvePortfolioFunnelContext("projeto-inexistente-xyz");
    expect(context.source).toBe("NEUTRAL_FALLBACK");
    expect(context.primaryCtaLabel).toBe("Fale com a empresa");
    expect(context.intent).toBe("contato");
  });
});

describe("intenção por segmento representativo", () => {
  const expected: Array<[string, string]> = [
    ["paulo-mestre-de-obras", "orcamento"], // construção
    ["salao-da-marcia", "agendamento"], // beleza
    ["dlara-pizzaria", "pedido"], // alimentação
    ["miro-tech", "diagnostico"], // informática
    ["eletro-solucoes-eficazes", "orcamento"], // elétrica
    ["rm-fretes", "orcamento"], // frete
    ["mp-festas-eventos", "reserva"], // eventos
    ["mary-diarista", "agendamento"], // serviços domésticos
  ];

  for (const [slug, intent] of expected) {
    it(`${slug} → ${intent}`, () => {
      const context = resolvePortfolioFunnelContext(slug);
      expect(context.intent).toBe(intent as never);
      expect(context.quizMode).toBe(intent === "agendamento" || intent === "reserva" ? "booking" : "proposal");
      expect(context.nextStepBody.length).toBeGreaterThan(20);
    });
  }

  it("intenções distintas geram próximos passos distintos", () => {
    const obra = resolvePortfolioFunnelContext("paulo-mestre-de-obras");
    const pizza = resolvePortfolioFunnelContext("dlara-pizzaria");
    expect(obra.whatsappPrompt).not.toBe(pizza.whatsappPrompt);
    expect(obra.whatsappSubject).not.toBe(pizza.whatsappSubject);
  });
});

describe("isolamento por slug", () => {
  it("nenhum projeto compartilha o mesmo próximo passo de outro", () => {
    const seen = new Map<string, string>();
    for (const slug of slugs) {
      const c = resolvePortfolioFunnelContext(slug);
      const key = `${c.nextStepTitle}|${c.nextStepBody}|${c.primaryCtaLabel}`.toLowerCase();
      expect(seen.has(key)).toBe(false);
      seen.set(key, slug);
    }
    expect(seen.size).toBe(slugs.length);
  });

  it("a mensagem de WhatsApp de um projeto não vaza para outro", () => {
    const answers = { service: "", experience: "", period: "", timing: "", note: "" };
    const obra = buildPortfolioQuizPreviewMessage({
      studioName: "Paulo Mestre de Obras",
      recipientName: "Paulo",
      answers,
      funnelContext: resolvePortfolioFunnelContext("paulo-mestre-de-obras"),
    });
    const beleza = buildPortfolioQuizPreviewMessage({
      studioName: "Salão da Marcia",
      recipientName: "Marcia",
      answers,
      funnelContext: resolvePortfolioFunnelContext("salao-da-marcia"),
    });
    expect(obra).toContain("um orçamento");
    expect(beleza).toContain("um atendimento");
    expect(beleza).not.toContain("Paulo Mestre de Obras");
    expect(obra).not.toContain("horários disponíveis");
    expect(beleza).toContain("horários disponíveis");
  });

  it("o contrato do cliente nunca aponta para a 0WEB", () => {
    const blob = JSON.stringify(contracts).toLowerCase();
    expect(blob).not.toContain("0web");
    expect(blob).not.toContain("wa.me");
  });
});
