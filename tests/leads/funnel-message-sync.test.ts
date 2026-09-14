import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildPortfolioQuizMessage, buildPortfolioQuizPreviewMessage } from "@/lib/portfolio-quiz-copy";
import { resolvePortfolioFunnelContext } from "@/lib/portfolio-funnel-context";

/**
 * FUNNEL_MESSAGE_SYNC_GATE — a mensagem que o visitante vê na prévia e a que
 * chega no WhatsApp do cliente precisam ser exatamente a mesma string.
 */
const answers = {
  service: "Quero confirmar presença",
  experience: "Primeira vez que participo",
  period: "Vou ao encontro de 16 de setembro",
  timing: "Chego às 20:00",
  note: "",
};

const params = {
  studioName: "ADHONEP Curitiba",
  recipientName: "a equipe do Capítulo Curitiba – Nikkey",
  mode: "proposal" as const,
  proposalKind: "service" as const,
  pageUrl: "https://0web.com.br/portfolio/adhonep-curitiba",
  location: "Curitiba / Parana",
  answers,
  funnelContext: resolvePortfolioFunnelContext("adhonep-curitiba"),
};

describe("sincronismo da mensagem do funil", () => {
  it("prévia e entrega usam o mesmo gerador canônico", () => {
    expect(buildPortfolioQuizPreviewMessage).toBe(buildPortfolioQuizMessage);
    expect(buildPortfolioQuizPreviewMessage(params)).toBe(buildPortfolioQuizMessage(params));
  });

  it("a rota de redirecionamento monta leads de portfólio com o gerador canônico", () => {
    const route = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");
    expect(route).toContain("buildPortfolioQuizMessage");
    expect(route).toContain("preview_location");
  });

  it("nenhuma mensagem enviada usa emoji fora do plano básico", () => {
    const message = buildPortfolioQuizMessage(params);
    const helpers = readFileSync("src/lib/whatsapp-redirect.helpers.ts", "utf8");
    const astral = /[\u{1F000}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}]/u;
    expect(astral.test(message)).toBe(false);
    expect(astral.test(helpers)).toBe(false);
  });

  it("a mensagem entregue mantém título, próximo passo e respostas do visitante", () => {
    const message = buildPortfolioQuizMessage(params);
    expect(message).toContain("Quero confirmar presença");
    expect(message).toContain("Chego às 20:00");
    expect(message).toContain("*PRÓXIMO PASSO*");
    expect(message).not.toContain("PROTOCOLO");
  });
});
