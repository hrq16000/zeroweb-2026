import { describe, expect, test } from "bun:test";
import { resolvePortfolioFunnelContext } from "../../src/lib/portfolio-funnel-context";
import { buildPortfolioQuizMessage, getPortfolioQuizSemanticCopy } from "../../src/lib/portfolio-quiz-copy";
import { normalizeRecoveryPhone } from "../../src/lib/lead-recoverability";
import { evaluateFunnelDestination } from "../../scripts/lib/funnel-destination-gate.mjs";

describe("Infinito Spa — funil chileno", () => {
  test("usa contexto e mensagem de agendamento em espanhol, com dados de retorno", () => {
    const context = resolvePortfolioFunnelContext("infinito-spa");
    expect(context.intent).toBe("agendamento");
    expect(context.whatsappSubject).toContain("masoterapia");
    const copy = getPortfolioQuizSemanticCopy("booking", "service", "Roze", "es-CL");
    expect(copy.titles.service).toContain("¿Qué");
    const message = buildPortfolioQuizMessage({
      studioName: "Infinito Spa",
      recipientName: "Roze",
      mode: "booking",
      locale: "es-CL",
      funnelContext: context,
      pageUrl: "https://0web.com.br/portfolio/infinito-spa",
      contactName: "Camila",
      contactPhone: "56912345678",
      answers: { service: "Masajes", experience: "Primera sesión", period: "Tarde", timing: "Esta semana", note: "" },
    });
    expect(message).toContain("Hola, Roze");
    expect(message).toContain("SIGUIENTE PASO");
    expect(message).toContain("*Nombre:* Camila");
    expect(message).toContain("*WhatsApp de contacto:* 56912345678");
    expect(message).not.toContain("Tudo bem");
  });

  test("normaliza móviles chilenos y no confunde DDI 56 con DDI 55", () => {
    expect(normalizeRecoveryPhone("+56 9 1234 5678", "es-CL")).toBe("56912345678");
    expect(normalizeRecoveryPhone("9 1234 5678", "es-CL")).toBe("56912345678");
    expect(normalizeRecoveryPhone("0056 9 1234 5678", "es-CL")).toBe("56912345678");
    expect(normalizeRecoveryPhone("+56 2 1234 5678", "es-CL")).toBeNull();
    expect(normalizeRecoveryPhone("(41) 99999-0000")).toBe("5541999990000");
  });

  test("exige segredo válido para redirecionar e registra fallback BLOCKED_MISSING_SECRET", () => {
    const clients = [{ slug: "infinito-spa", clientKey: "infinito-spa", contactMode: "funnelOnly" }];
    const contacts = { "infinito-spa": { whatsapp: "env:PORTFOLIO_WHATSAPP_INFINITO_SPA" } };
    const ledger = {
      entries: {
        "infinito-spa": {
          status: "CONFIGURED_UNVERIFIED",
          source: "CLIENT_SUPPLIED",
          evidence: ["PORTFOLIO_WHATSAPP_INFINITO_SPA fue informado por la profesional"],
        },
      },
    };
    const configured = evaluateFunnelDestination("infinito-spa", {
      clients, ledger, contacts,
      env: { PORTFOLIO_WHATSAPP_INFINITO_SPA: "+56 9 1234 5678" },
    });
    expect(configured.status).toBe("PASS");
    expect(configured.mode).toBe("WHATSAPP");

    const missing = evaluateFunnelDestination("infinito-spa", {
      clients, ledger, contacts, env: {},
    });
    expect(missing.status).toBe("PASS");
    expect(missing.mode).toBe("LEAD_ONLY");
    expect(missing.warnings.join(" ")).toContain("BLOCKED_MISSING_SECRET");

    const wrong = evaluateFunnelDestination("otro-cliente", { clients, ledger, contacts, env: {} });
    expect(wrong.status).not.toBe("PASS");
  });
});
