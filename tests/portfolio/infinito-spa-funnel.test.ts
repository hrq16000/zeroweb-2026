import { describe, expect, test } from "bun:test";
import { resolvePortfolioFunnelContext } from "../../src/lib/portfolio-funnel-context";
import { buildPortfolioQuizMessage, getPortfolioQuizSemanticCopy } from "../../src/lib/portfolio-quiz-copy";
import { evaluateFunnelDestination } from "../../scripts/lib/funnel-destination-gate.mjs";

describe("Infinito Spa — funil chileno", () => {
  test("usa contexto de agendamento en español", () => {
    const context = resolvePortfolioFunnelContext("infinito-spa");
    expect(context.intent).toBe("agendamento");
    expect(context.whatsappSubject).toContain("masoterapia");
    const copy = getPortfolioQuizSemanticCopy("booking", "service", "Roze", "es-CL");
    expect(copy.titles.service).toContain("¿Qué");
    const message = buildPortfolioQuizMessage({ studioName: "Infinito Spa", recipientName: "Roze", mode: "booking", locale: "es-CL", funnelContext: context, pageUrl: "https://0web.com.br/portfolio/infinito-spa", answers: { service: "Masajes", experience: "Primera sesión", period: "Tarde", timing: "Esta semana", note: "" } });
    expect(message).toContain("Hola, Roze");
    expect(message).toContain("SIGUIENTE PASO");
    expect(message).not.toContain("Tudo bem");
  });
  test("acepta referencia de secreto solo con clientKey y evidencia coincidentes", () => {
    const contacts = { "infinito-spa": { whatsapp: "env:PORTFOLIO_WHATSAPP_INFINITO_SPA" } };
    const entries = { "infinito-spa": { status: "CONFIGURED_UNVERIFIED", source: "CLIENT_SUPPLIED", evidence: ["PORTFOLIO_WHATSAPP_INFINITO_SPA fue informado por la profesional"] } };
    const result = evaluateFunnelDestination({ slug: "infinito-spa", clientKey: "infinito-spa", contacts, entries });
    expect(result.status).toBe("PASS");
    const wrong = evaluateFunnelDestination({ slug: "otro-cliente", clientKey: "otro-cliente", contacts, entries });
    expect(wrong.status).not.toBe("PASS");
  });
});
