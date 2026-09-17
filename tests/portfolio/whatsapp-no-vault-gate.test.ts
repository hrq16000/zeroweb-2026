/**
 * GATE ANTIRREGRESSÃO — política SEM COFRE para WhatsApp de portfolio.
 *
 * Falha se alguém reintroduzir no caminho de resolução de destino:
 *  - env/secret PORTFOLIO_WHATSAPP_*
 *  - consulta operacional a portfolio_client_settings
 *  - funnel_recipient como fonte de destino
 *  - segunda fonte de verdade administrativa (portfolio_whatsapp_confirmations)
 *  - fallback institucional ou entre clientes
 */
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const resolver = readFileSync("src/lib/whatsapp-redirect.server.ts", "utf8");
const registry = readFileSync("src/lib/portfolio-whatsapp-registry.server.ts", "utf8");
const admin = readFileSync("src/lib/portfolio-whatsapp-admin.functions.ts", "utf8");
const contacts = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8")) as Array<{
  clientKey: string;
}>;

describe("WhatsApp de portfolio — SEM COFRE", () => {
  it("resolvedor não depende de env/secret por portfolio", () => {
    expect(resolver).not.toContain("PORTFOLIO_WHATSAPP_");
    expect(registry).not.toContain("process.env");
  });

  it("resolvedor não consulta tabela privada nem funnel_recipient", () => {
    expect(resolver).not.toContain("portfolio_client_settings");
    expect(resolver).not.toContain("funnel_recipient");
    expect(resolver).not.toContain("portfolio_whatsapp_confirmations");
  });

  it("painel não cria segunda fonte operacional de destino", () => {
    expect(admin).not.toContain("portfolio_whatsapp_confirmations");
    expect(admin).not.toContain("funnel_recipient");
  });

  it("fonte canônica é o cadastro versionado por clientKey", () => {
    expect(registry).toContain("@/config/portfolio-whatsapp.json");
    expect(resolver).toContain("resolveVersionedPortfolioWhatsApp(clientKey)");
  });

  it("todo clientKey do catálogo tem entrada explícita (número ou null)", () => {
    for (const c of clients) {
      expect(Object.prototype.hasOwnProperty.call(contacts.contacts, c.clientKey)).toBe(true);
      const value = contacts.contacts[c.clientKey].whatsapp;
      expect(value === null || typeof value === "string").toBe(true);
    }
  });

  it("nenhum número é compartilhado entre clientes", () => {
    const digits = Object.values(contacts.contacts as Record<string, { whatsapp: string | null }>)
      .map((v) => (v.whatsapp ?? "").replace(/\D/g, ""))
      .filter(Boolean);
    expect(new Set(digits).size).toBe(digits.length);
  });
});
