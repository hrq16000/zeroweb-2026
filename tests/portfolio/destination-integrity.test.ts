import { describe, expect, it } from "bun:test";
import clients from "@/config/portfolio-clients.json";
import ledgerDoc from "@/config/portfolio-funnel-destinations.json";
import aliases from "@/config/portfolio-whatsapp-env-aliases.json";

type LedgerRow = { status?: string; humanDecision?: string };
const ledger = (ledgerDoc as { entries?: Record<string, LedgerRow> }).entries ?? {};
const clientKeys = new Set(
  (clients as Array<{ clientKey?: string }>).map((row) => row.clientKey).filter(Boolean),
);

describe("portfolio destination binding integrity", () => {
  it("mantém aliases legados vinculados somente a clientKeys conhecidos", () => {
    for (const [clientKey, envName] of Object.entries(aliases)) {
      expect(clientKeys.has(clientKey)).toBe(true);
      expect(envName).toMatch(/^[A-Z0-9_]+_WHATSAPP_NUMBER$/);
      expect(envName.startsWith("VITE_")).toBe(false);
    }
  });

  it("não permite promover silenciosamente aliases compartilhados", () => {
    const byAlias = new Map<string, string[]>();
    for (const [clientKey, envName] of Object.entries(aliases)) {
      byAlias.set(envName, [...(byAlias.get(envName) ?? []), clientKey]);
    }

    for (const clientKeysSharingAlias of byAlias.values()) {
      if (clientKeysSharingAlias.length < 2) continue;
      for (const clientKey of clientKeysSharingAlias) {
        expect(ledger[clientKey]?.humanDecision).toBeTruthy();
        expect(ledger[clientKey]?.status).not.toBe("VERIFIED");
      }
    }
  });

  it("o gate operacional lê o mapa de aliases compartilhado", async () => {
    const gate = await Bun.file("scripts/check-portfolio-funnel-operational.mjs").text();
    expect(gate).toContain("portfolio-whatsapp-env-aliases.json");
    expect(gate).toContain("runtimeEnvName");
  });

  it("documenta que ambiente é compatibilidade, não fonte durável", async () => {
    const standard = await Bun.file("docs/PORTFOLIO_DATA_INTEGRITY_STANDARD.md").text();
    expect(standard).toContain("Legacy environment variables are compatibility/import sources only");
    expect(standard).toContain("clientKey -> destination");
    expect(standard).toContain("serviceId -> mediaId");
  });
});
