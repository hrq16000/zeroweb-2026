import { describe, expect, it } from "vitest";
import {
  DESTINATION_STATUSES,
  compareByOperationalRisk,
  computeDestinationPriority,
  EMPTY_TELEMETRY,
  isDestinationOk,
  maskWhatsAppDigits,
  type DestinationRow,
} from "@/lib/portfolio-funnel-destination";
import { evaluateFunnelDestination } from "../../../scripts/lib/funnel-destination-gate.mjs";
import ledger from "@/config/portfolio-funnel-destinations.json";

const LEDGER = ledger as { entries: Record<string, { status: string; evidence?: string[] }> };

function row(over: Partial<DestinationRow>): DestinationRow {
  return {
    slug: "x",
    projectName: "x",
    clientKey: "x",
    funnelType: "proposal:orcamento",
    contactMode: "funnelOnly",
    destinationStatus: "UNRESOLVED",
    destinationSource: "NONE",
    destinationValueMasked: null,
    evidenceSource: null,
    confidence: 0,
    lastVerifiedAt: null,
    publicState: "published",
    note: null,
    telemetry: { ...EMPTY_TELEMETRY },
    priority: "P3",
    deliveryNotConfigured: false,
    conversionsAtRisk: 0,
    ...over,
  };
}

describe("prioridade operacional por risco real", () => {
  it("conversão sem entrega é P0", () => {
    expect(
      computeDestinationPriority("UNRESOLVED", { ...EMPTY_TELEMETRY, funnelCompletes90: 8, views90: 200 }),
    ).toBe("P0");
  });

  it("tráfego sem conversão é P1 e destino resolvido é OK", () => {
    expect(computeDestinationPriority("UNRESOLVED", { ...EMPTY_TELEMETRY, views30: 300, views90: 900 })).toBe("P1");
    expect(computeDestinationPriority("VERIFIED", { ...EMPTY_TELEMETRY })).toBe("OK");
  });

  it("ordena por risco, nunca alfabeticamente", () => {
    const alto = row({ slug: "zz", priority: "P0", conversionsAtRisk: 8 });
    const baixo = row({ slug: "aa", priority: "P2" });
    expect([baixo, alto].sort(compareByOperationalRisk)[0].slug).toBe("zz");
  });
});

describe("FUNNEL_DESTINATION_GATE para projetos novos", () => {
  const clients = [{ slug: "novo-projeto", clientKey: "novo-projeto", contactMode: "funnelOnly" }];

  it("reprova projeto novo sem destino operacional", () => {
    const r = evaluateFunnelDestination("novo-projeto", { clients, ledger: { entries: {} } });
    expect(r.status).toBe("FAIL");
    expect(r.blockers.join(" ")).toContain("destino operacional ausente");
  });

  it("reprova destino configurado sem evidência verificada", () => {
    process.env["PORTFOLIO_WHATSAPP_NOVO_PROJETO"] = "5541900000000";
    const r = evaluateFunnelDestination("novo-projeto", {
      clients,
      ledger: { entries: { "novo-projeto": { status: "INSUFFICIENT_EVIDENCE" } } },
    });
    expect(r.status).toBe("FAIL");
    const ok = evaluateFunnelDestination("novo-projeto", {
      clients,
      ledger: { entries: { "novo-projeto": { status: "VERIFIED", evidence: ["owner"] } } },
    });
    expect(ok.status).toBe("PASS");
    delete process.env["PORTFOLIO_WHATSAPP_NOVO_PROJETO"];
  });
});

describe("livro-razão dos nove configurados", () => {
  const NOVE = [
    "dyzpromo",
    "emporio-lelecute",
    "estrutura-nacional",
    "heloa-gas",
    "paraiso-do-hot-dog",
    "r-beauty",
    "renata-beauty",
    "rm-fretes",
    "sscons",
  ];
  it("nenhum foi promovido a VERIFIED sem evidência", () => {
    for (const slug of NOVE) {
      const entry = LEDGER.entries[slug];
      expect(entry, `${slug} precisa estar registrado`).toBeTruthy();
      expect(entry.status).toBe("INSUFFICIENT_EVIDENCE");
      expect(isDestinationOk(entry.status as never)).toBe(false);
    }
  });
});


describe("portfolio funnel destination contract", () => {
  it("mascara o número e nunca expõe o miolo", () => {
    const masked = maskWhatsAppDigits("5541997940764");
    expect(masked).toBe("(41) 9****-0764");
    expect(masked).not.toContain("9794");
  });

  it("rejeita entradas curtas demais para mascarar", () => {
    expect(maskWhatsAppDigits("41999")).toBeNull();
    expect(maskWhatsAppDigits(null)).toBeNull();
  });

  it("só considera entregue quem tem destino resolvido", () => {
    expect(isDestinationOk("VERIFIED")).toBe(true);
    expect(isDestinationOk("AUTO_RESOLVED")).toBe(true);
    expect(isDestinationOk("NOT_APPLICABLE")).toBe(true);
    expect(isDestinationOk("UNRESOLVED")).toBe(false);
    expect(isDestinationOk("CONFIGURED_UNVERIFIED")).toBe(false);
    expect(isDestinationOk("CONFLICT")).toBe(false);
  });

  it("o livro-razão guarda proveniência, nunca número", () => {
    const raw = JSON.stringify(ledger);
    expect(raw).not.toMatch(/\d{8,}/);
    for (const [slug, entry] of Object.entries(
      (ledger as { entries: Record<string, { status: string; evidence?: string[] }> }).entries,
    )) {
      expect(DESTINATION_STATUSES).toContain(entry.status as never);
      expect(entry.evidence?.length, `${slug} precisa de evidência`).toBeGreaterThan(0);
    }
  });
});
