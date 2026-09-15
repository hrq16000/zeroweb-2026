import { describe, expect, it } from "bun:test";
import { applyVersionedPortfolioWhatsAppDefaults } from "./contact.server";

describe("applyVersionedPortfolioWhatsAppDefaults", () => {
  it("recupera somente os destinos históricos comprovados quando a configuração está vazia", () => {
    const env: Record<string, string | undefined> = {};

    applyVersionedPortfolioWhatsAppDefaults(env);

    expect(env.PORTFOLIO_WHATSAPP_R_BEAUTY).toBe("554196048639");
    expect(env.MARIDO_DE_ALUGUEL_WHATSAPP_NUMBER).toBe("5541997452053");
  });

  it("não sobrescreve configuração explícita atual", () => {
    const env: Record<string, string | undefined> = {
      PORTFOLIO_WHATSAPP_R_BEAUTY: "5511999999999",
      MARIDO_DE_ALUGUEL_WHATSAPP_NUMBER: "5521999999999",
    };

    applyVersionedPortfolioWhatsAppDefaults(env);

    expect(env.PORTFOLIO_WHATSAPP_R_BEAUTY).toBe("5511999999999");
    expect(env.MARIDO_DE_ALUGUEL_WHATSAPP_NUMBER).toBe("5521999999999");
  });

  it("não cria fallback para nenhum outro cliente", () => {
    const env: Record<string, string | undefined> = {
      PORTFOLIO_WHATSAPP_ANGEL_MIX_BRECHO: "",
    };

    applyVersionedPortfolioWhatsAppDefaults(env);

    expect(env.PORTFOLIO_WHATSAPP_ANGEL_MIX_BRECHO).toBe("");
  });
});
