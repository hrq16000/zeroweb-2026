import { describe, expect, it } from "vitest";
// Módulo server-only: o preload de testes cria `window`, então removemos o
// global antes de importar (é exatamente o ambiente real do servidor).
const globalRef = globalThis as { window?: unknown };
const savedWindow = globalRef.window;
delete globalRef.window;
const { getPortfolioWhatsAppChannelState, resolvePortfolioWhatsAppContact } = await import(
  "@/lib/whatsapp-redirect.server"
);
const { getWhatsAppNotApplicableClientKeys } = await import(
  "@/lib/portfolio-whatsapp-registry.server"
);
if (savedWindow !== undefined) globalRef.window = savedWindow;

// Política SEM COFRE: o canal vem exclusivamente do cadastro versionado do
// próprio clientKey (número válido ou null). Não há env, vault ou tabela.
const CONFIGURED_KEY = "heloa-gas";

describe("estado do canal WhatsApp por projeto", () => {
  it("CONFIGURED quando o cadastro versionado tem número do próprio cliente", () => {
    expect(getPortfolioWhatsAppChannelState(CONFIGURED_KEY)).toBe("CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(CONFIGURED_KEY)?.digits).toBe("5541988253751");
  });

  it("lead-only quando o cadastro é null, sem erro e sem fallback", () => {
    const leadOnly = getWhatsAppNotApplicableClientKeys()[0];
    expect(leadOnly).toBeTruthy();
    expect(resolvePortfolioWhatsAppContact(leadOnly!)).toBeNull();
    expect(getPortfolioWhatsAppChannelState(leadOnly!)).not.toBe("CONFIGURED");
  });

  it("nunca resolve canal para chave desconhecida", () => {
    expect(getPortfolioWhatsAppChannelState("projeto-inexistente")).toBe("NOT_CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(null)).toBeNull();
  });
});
