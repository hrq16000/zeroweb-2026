import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/**
 * Regressões estruturais da garantia de entrega e da correção de segurança
 * de parceiros. Não dependem de rede nem de banco.
 */
const funnel = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
const redirect = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");

describe("garantia de entrega no funil de portfólio", () => {
  it("salva o lead antes de qualquer verificação de canal", () => {
    const insertAt = funnel.indexOf('.from("dynamic_form_leads")');
    const channelAt = funnel.indexOf("getPortfolioWhatsAppChannelStateAsync(data.clientKey)");
    expect(insertAt).toBeGreaterThan(-1);
    expect(channelAt).toBeGreaterThan(insertAt);
  });

  it("decide recuperabilidade e registra o ledger em todos os desfechos", () => {
    expect(funnel).toContain("decideLeadRecoverability");
    expect(funnel).toContain("recordLeadDelivery");
    expect(funnel).toContain("requiresRecoveryContact");
  });

  it("o redirect marca entrega e falha sem expor contato", () => {
    expect(redirect).toContain("markLeadDelivered");
    expect(redirect).toContain("markLeadDeliveryFailed");
    expect(redirect).not.toMatch(/console\.(log|error)\([^)]*contact\.digits/);
  });

  it("o contato de retorno tem finalidade declarada", () => {
    expect(funnel).toContain("RECOVERY_CONTACT_PURPOSE");
  });
});

describe("segurança: parceiro não aprova a própria conta", () => {
  const guard = readFileSync(
    "supabase/migrations/20260910074526_55fec5aa-e1fa-4a9f-954c-0efaf6dc1d90.sql",
    "utf8",
  );
  it("restaura colunas privilegiadas em update de não-admin", () => {
    expect(guard).toMatch(/partners_guard_(self_approval|approval_columns)/);
    expect(guard.toLowerCase()).toContain("status");
    expect(guard.toLowerCase()).toContain("trigger");
  });
});
