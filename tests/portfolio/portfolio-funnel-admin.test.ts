import { describe, expect, it } from "vitest";
import {
  buildPortfolioProvisionQuestions,
  canonicalPortfolioFunnelSlug,
} from "@/lib/portfolio-funnel-admin.functions";

describe("portfolio funnel admin", () => {
  it("preserva o slug canônico já usado pelos funis individuais", () => {
    expect(canonicalPortfolioFunnelSlug("autoescola-aptos")).toBe("funnel-autoescola-aptos");
  });

  it("gera perguntas próprias a partir da configuração do portfolio", () => {
    const questions = buildPortfolioProvisionQuestions("autoescola-aptos");
    expect(questions.length).toBeGreaterThanOrEqual(5);
    expect(questions[0]?.key).toBe("servico");
    expect(questions[0]?.options_json.length).toBeGreaterThan(0);
    expect(questions.some((q) => q.key === "nome")).toBe(true);
    expect(questions.some((q) => q.key === "whatsapp")).toBe(true);
    expect(questions.map((q) => q.order_index)).toEqual(
      Array.from({ length: questions.length }, (_, index) => index),
    );
  });

  it("não injeta conteúdo de outro cliente no fallback", () => {
    const questions = buildPortfolioProvisionQuestions("carecas-infotec");
    const text = JSON.stringify(questions).toLowerCase();
    expect(text).toContain("celular");
    expect(text).not.toContain("autoescola aptos");
  });
});
