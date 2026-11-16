import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolveVersionedPortfolioWhatsApp } from "../../src/lib/portfolio-whatsapp-registry.server";

const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const destinations = JSON.parse(readFileSync("src/config/portfolio-funnel-destinations.json", "utf8"));
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const page = readFileSync("src/components/site/CentroMegaPage.tsx", "utf8");

describe("Centro Mega — destino operacional", () => {
  test("resolve somente o WhatsApp versionado do client_key Centro Mega", () => {
    expect(resolveVersionedPortfolioWhatsApp("centro-mega")).toBe("5541998589419");
    expect(whatsapp.contacts["centro-mega"].whatsapp).toBe("5541998589419");
  });

  test("mantém funil isolado e sem contato direto público", () => {
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(client?.funnelType).toBe("pedido");
    expect(client?.funnelRecipientConfigured).toBe(true);
    expect(page).not.toContain("wa.me/");
    expect(page).not.toContain("tel:");
    expect(page).not.toContain("mailto:");
  });

  test("ledger registra verificação e proíbe fallback cross-client", () => {
    const entry = destinations.entries["centro-mega"];
    expect(entry.status).toBe("VERIFIED");
    expect(entry.confidence).toBeGreaterThanOrEqual(90);
    expect(entry.evidence.join(" ")).toContain("sem fallback institucional ou cross-client");
  });
});
