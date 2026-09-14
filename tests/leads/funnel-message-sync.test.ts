import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildPortfolioQuizMessage, buildPortfolioQuizPreviewMessage } from "@/lib/portfolio-quiz-copy";
import { resolvePortfolioFunnelContext } from "@/lib/portfolio-funnel-context";

const params = {
  studioName: "ADHONEP Curitiba",
  recipientName: "a equipe do Capítulo Curitiba – Nikkey",
  mode: "proposal" as const,
  proposalKind: "service" as const,
  pageUrl: "https://0web.com.br/portfolio/adhonep-curitiba",
  location: "Curitiba / Paraná",
  answers: {
    service: "Quero confirmar presença",
    experience: "Primeira vez que participo",
    period: "Vou ao próximo encontro",
    timing: "Chego às 20:00",
    note: "Levarei um convidado 🙂",
  },
  funnelContext: resolvePortfolioFunnelContext("adhonep-curitiba"),
};

describe("ZERO_FUNNEL_DRIFT", () => {
  it("prévia e entrega usam a mesma referência canônica", () => {
    expect(buildPortfolioQuizPreviewMessage).toBe(buildPortfolioQuizMessage);
    expect(buildPortfolioQuizPreviewMessage(params)).toBe(buildPortfolioQuizMessage(params));
  });

  it("preserva acentuação, emoji, respostas e localização", () => {
    const message = buildPortfolioQuizMessage(params);
    expect(message).toContain("Paraná");
    expect(message).toContain("🙂");
    expect(message).toContain("Quero confirmar presença");
    expect(message).toContain("Chego às 20:00");
  });

  it("a rota final usa o gerador canônico e o snapshot da prévia", () => {
    const route = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");
    const submit = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
    const quiz = readFileSync("src/components/site/BeautyBookingQuiz.tsx", "utf8");
    expect(route).toContain("buildPortfolioQuizMessage");
    expect(route).toContain("meta.preview_location");
    expect(submit).toContain("preview_location: data.previewLocation");
    expect(quiz).toContain("previewLocation");
  });
});
