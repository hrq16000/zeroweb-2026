import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolvePortfolioFunnelContext } from "../../src/lib/portfolio-funnel-context";
import {
  buildPortfolioQuizMessage,
  getPortfolioQuizSemanticCopy,
} from "../../src/lib/portfolio-quiz-copy";
import { normalizeRecoveryPhone } from "../../src/lib/lead-recoverability";
import { evaluateFunnelDestination } from "../../scripts/lib/funnel-destination-gate.mjs";

describe("Infinito Spa — funil chileno", () => {
  test("a escrita pública é exclusiva do cliente Infinito Spa e usa o tipo do banco", () => {
    const intake = readFileSync("src/lib/lead-intake.functions.ts", "utf8");
    const form = readFileSync("src/components/site/InfinitoSpaLeadForm.tsx", "utf8");
    const operationalGate = readFileSync("scripts/check-portfolio-funnel-operational.mjs", "utf8");
    const hostLead = readFileSync("src/lib/portfolio-host-leads.functions.ts", "utf8");
    const phoneLeads = readFileSync("src/lib/phone-leads.functions.ts", "utf8");
    expect(form).toContain("submitInfinitoSpaPublicLead");
    expect(operationalGate).toContain("submitInfinitoSpaPublicLead");
    expect(intake).toContain("export const submitPublicLead");
    expect(intake).toContain('data.source !== "portfolio:infinito-spa"');
    const legacyAction = intake.slice(
      intake.indexOf("export const submitPublicLead"),
      intake.indexOf("export const submitInfinitoSpaPublicLead"),
    );
    const infinitoAction = intake.slice(intake.indexOf("export const submitInfinitoSpaPublicLead"));
    expect(legacyAction).toContain("supabaseAdmin");
    expect(infinitoAction).toContain("publicClient");
    expect(infinitoAction).not.toContain("supabaseAdmin");
    expect(hostLead).toContain('data.attribution?.portfolioSlug === "infinito-spa"');
    expect(hostLead).toContain("normalizeChilePhone(data.phone)");
    expect(phoneLeads).toContain("toWhatsAppPhoneDigits(telefone)");
    expect(intake).toContain('Database["public"]["Tables"]["lead_submissions"]["Insert"]');
    expect(intake).not.toContain("as any");
    expect(intake).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("todos os CTAs legados bloqueiam persistência fora do formulário dedicado", () => {
    const narrative = readFileSync("src/components/portfolio/PortfolioConversionNarrative.tsx", "utf8");
    const legacy = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
    expect(narrative).toContain('slug === "infinito-spa"');
    expect(narrative).toContain('href="#consulta"');
    expect(legacy).toContain('if (data.clientKey === "infinito-spa")');
    expect(legacy).toContain('String(data.client_metadata?.client_key ?? "") === "infinito-spa"');
    expect(legacy).toContain('form.slug === "portfolio-infinito-spa"');
  });

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
      pageUrl: "https://www.0web.com.br/portfolio/infinito-spa",
      contactName: "Camila",
      contactPhone: "56912345678",
      answers: {
        service: "Masajes",
        experience: "Primera sesión",
        period: "Tarde",
        timing: "Esta semana",
        note: "",
      },
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
    expect(normalizeRecoveryPhone("+56 2 1234 5678", "es-CL")).toBe("56212345678");
    expect(normalizeRecoveryPhone("2 1234 5678", "es-CL")).toBe("56212345678");
    expect(normalizeRecoveryPhone("(41) 99999-0000")).toBe("5541999990000");
  });

  test("exige segredo válido para redirecionar e registra fallback BLOCKED_MISSING_SECRET", () => {
    const clients = [
      { slug: "infinito-spa", clientKey: "infinito-spa", contactMode: "funnelOnly" },
    ];
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
      clients,
      ledger,
      contacts,
      env: { PORTFOLIO_WHATSAPP_INFINITO_SPA: "+56 9 1234 5678" },
    });
    expect(configured.status).toBe("PASS");
    expect(configured.mode).toBe("WHATSAPP");

    const missing = evaluateFunnelDestination("infinito-spa", {
      clients,
      ledger,
      contacts,
      env: {},
    });
    expect(missing.status).toBe("PASS");
    expect(missing.mode).toBe("LEAD_ONLY");
    expect(missing.warnings.join(" ")).toContain("BLOCKED_MISSING_SECRET");

    const wrong = evaluateFunnelDestination("otro-cliente", { clients, ledger, contacts, env: {} });
    expect(wrong.status).not.toBe("PASS");
  });
});

describe("Infinito Spa — HTTP redirect", () => {
  test("configured destination returns HTTP 302; missing returns HTTP 503", async () => {
    const globals = globalThis as { window?: unknown };
    const originalWindow = globals.window;
    let handleInfinitoSpaWhatsAppRedirect: typeof import("../../src/lib/infinito-spa-whatsapp.server").handleInfinitoSpaWhatsAppRedirect;
    try {
      delete globals.window;
      ({ handleInfinitoSpaWhatsAppRedirect } =
        await import("../../src/lib/infinito-spa-whatsapp.server"));
    } finally {
      if (originalWindow !== undefined) globals.window = originalWindow;
    }
    const key = "PORTFOLIO_WHATSAPP_INFINITO_SPA";
    const original = process.env[key];
    const request = new Request(
      "https://www.0web.com.br/r/whatsapp/portfolio-infinito-spa?message=Hola%00%20%0ARoze",
    );
    try {
      process.env[key] = "56200000000"; // synthetic fixture; never contact this number
      const configured = handleInfinitoSpaWhatsAppRedirect(request);
      expect(configured.status).toBe(302);
      const location = new URL(configured.headers.get("location")!);
      expect(location.hostname).toBe("wa.me");
      expect(location.pathname).toBe("/56200000000");
      expect(location.searchParams.get("text")).toBe("Hola Roze");
      expect(configured.headers.get("referrer-policy")).toBe("no-referrer");
      delete process.env[key];
      const unavailable = handleInfinitoSpaWhatsAppRedirect(request);
      expect(unavailable.status).toBe(503);
      expect(unavailable.headers.has("location")).toBe(false);
    } finally {
      if (original === undefined) delete process.env[key];
      else process.env[key] = original;
    }
  });

  test("message stays within 700 code units without splitting emoji", async () => {
    const { sanitizeInfinitoSpaMessage } = await import("../../src/lib/infinito-spa-whatsapp");
    const message = sanitizeInfinitoSpaMessage("a".repeat(699) + "😀");
    expect(message.length).toBe(699);
    expect(() => encodeURIComponent(message)).not.toThrow();
    expect(sanitizeInfinitoSpaMessage("Hola\u0000  \nRoze\u007f")).toBe("Hola Roze");
  });

  test("verified env provenance must match the registered secret", () => {
    const clients = [
      { slug: "infinito-spa", clientKey: "infinito-spa", contactMode: "funnelOnly" },
    ];
    const contacts = { "infinito-spa": { whatsapp: "env:PORTFOLIO_WHATSAPP_INFINITO_SPA" } };
    const provenance = {
      status: "VERIFIED",
      source: "OPERATIONAL_SECRET+GOOGLE_ENTITY",
      evidence: ["PORTFOLIO_WHATSAPP_INFINITO_SPA"],
    };
    const opts = { clients, contacts, ledger: { entries: { "infinito-spa": provenance } } };
    expect(evaluateFunnelDestination("infinito-spa", opts).mode).toBe("WHATSAPP");
    expect(
      evaluateFunnelDestination("infinito-spa", {
        ...opts,
        ledger: {
          entries: {
            "infinito-spa": { ...provenance, evidence: ["PORTFOLIO_WHATSAPP_INFINITO_SPA_OTHER"] },
          },
        },
      }).status,
    ).toBe("FAIL");
  });

  test("matrix and commercial hold block admin publication, even with stale DB override", async () => {
    const { seedBySlug, mergeProject } = await import("../../src/lib/portfolio-admin");
    const seed = seedBySlug("infinito-spa")!;
    expect(seed.published).toBe(false);
    expect(seed.status).not.toBe("COMPLETE");
    const merged = mergeProject(seed, { published: true, lifecycle_status: "published" });
    expect(merged.published).toBe(false);
    expect(merged.lifecycleStatus).toBe("draft");
    expect(merged.conformance.blocking).toContain("PORTFOLIO_TECHNICAL_PASS_REQUIRED");
    expect(merged.conformance.blocking).toContain("PORTFOLIO_COMMERCIAL_APPROVAL_REQUIRED");
  });
});
