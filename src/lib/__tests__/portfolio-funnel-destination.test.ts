import { describe, expect, it } from "vitest";
import {
  DESTINATION_STATUSES,
  isDestinationOk,
  maskWhatsAppDigits,
} from "@/lib/portfolio-funnel-destination";
import ledger from "@/config/portfolio-funnel-destinations.json";

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
