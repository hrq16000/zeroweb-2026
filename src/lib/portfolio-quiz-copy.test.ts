import { describe, expect, it } from "vitest";
import { buildPortfolioQuizPreviewMessage, getPortfolioQuizSemanticCopy } from "./portfolio-quiz-copy";

const answers = {
  service: "Bolo personalizado",
  experience: "Aniversário",
  period: "Curitiba",
  timing: "Próxima semana",
  note: "Tema infantil",
};

describe("copy semântica do funil de portfolio", () => {
  it("usa serviço como fallback seguro e nunca mistura panfletagem", () => {
    const copy = getPortfolioQuizSemanticCopy("proposal", undefined, "Chyrley");
    expect(copy.requestKind).toBe("service");
    expect(copy.titles.service).toBe("Qual serviço você precisa?");
    expect(copy.nextStep).not.toMatch(/promotores|campanha|panfletagem/i);
  });

  it("mantém linguagem de campanha somente com opt-in explícito", () => {
    const copy = getPortfolioQuizSemanticCopy("proposal", "campaign", "D.Y.Z Promo");
    expect(copy.requestKind).toBe("campaign");
    expect(copy.nextStep).toMatch(/promotores/i);
  });

  it("inclui marca, URL, localidade e elogio na mensagem de serviço", () => {
    const message = buildPortfolioQuizPreviewMessage({
      studioName: "Chyrley Doces & Festas",
      recipientName: "Chyrley",
      mode: "proposal",
      proposalKind: "service",
      answers,
      pageUrl: "https://0web.com.br/portfolio/confeitaria-chyrley",
      location: "Curitiba · Água Verde",
    });
    expect(message).toContain("URL completa: https://0web.com.br/portfolio/confeitaria-chyrley");
    expect(message).toContain("A página é linda, parabéns!");
    expect(message).toContain("Sou de Curitiba · Água Verde");
    expect(message).toContain("DETALHES DO SERVIÇO");
    expect(message).not.toMatch(/promotores|BRIEFING DA CAMPANHA/i);
  });
});
