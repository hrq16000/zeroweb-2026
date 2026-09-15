import { describe, expect, it } from "bun:test";
import {
  getVersionedPortfolioWhatsAppClientKeys,
  getWhatsAppNotApplicableClientKeys,
  hydrateLegacyResolverFromVersionedRegistry,
  isPortfolioWhatsAppNotApplicable,
  resolveVersionedPortfolioWhatsApp,
} from "./portfolio-whatsapp-registry.server";

describe("portfolio WhatsApp registry", () => {
  it("resolve somente destinos com prova explícita de WhatsApp", () => {
    expect(resolveVersionedPortfolioWhatsApp("r-beauty")).toBe("554196048639");
    expect(resolveVersionedPortfolioWhatsApp("simone-lacerda-vaz")).toBe("5541995129384");
  });

  it("mantém telefone público sem prova de WhatsApp fora do registro", () => {
    expect(resolveVersionedPortfolioWhatsApp("kitutes-na-mesa")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("auto-socorro-dentinho")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("woodhouse-hamburgueres")).toBeNull();
  });

  it("mantém o Marido de Aluguel sem fallback institucional", () => {
    expect(resolveVersionedPortfolioWhatsApp("marido-de-aluguel")).toBeNull();
  });

  it("não cria fallback entre clientes", () => {
    expect(resolveVersionedPortfolioWhatsApp("angel-mix-brecho")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("cliente-inexistente")).toBeNull();
  });

  it("hidrata o resolvedor legado sem sobrescrever configuração explícita", () => {
    const env: Record<string, string | undefined> = {
      PORTFOLIO_WHATSAPP_R_BEAUTY: "5511999999999",
    };

    hydrateLegacyResolverFromVersionedRegistry(env);

    expect(env.PORTFOLIO_WHATSAPP_R_BEAUTY).toBe("5511999999999");
    expect(env.MARIDO_DE_ALUGUEL_WHATSAPP_NUMBER).toBeUndefined();
    expect(env.PORTFOLIO_WHATSAPP_SIMONE_LACERDA_VAZ).toBe("5541995129384");
    expect(env.PORTFOLIO_WHATSAPP_KITUTES_NA_MESA).toBeUndefined();
    expect(env.PORTFOLIO_WHATSAPP_AUTO_SOCORRO_DENTINHO).toBeUndefined();
    expect(env.PORTFOLIO_WHATSAPP_WOODHOUSE_HAMBURGUERES).toBeUndefined();
  });

  it("classifica apenas conceitos/amostras comprovados e loja externa como não aplicável", () => {
    for (const key of [
      "angel-mix-brecho",
      "bh-barreiro-marmitas",
      "guaratuba-atelie-presentes",
      "guaratuba-oficina-nautica",
      "guaratuba-reparos-residenciais",
      "guaratuba-sabores-da-baia",
      "mirassol-conserta-celular",
      "mirassol-delicias-caseiras",
      "uberlandia-eletrica-residencial",
      "papelemi-personalizados",
    ]) {
      expect(isPortfolioWhatsAppNotApplicable(key)).toBe(true);
    }
    expect(isPortfolioWhatsAppNotApplicable("r-beauty")).toBe(false);
  });

  it("não permite sobreposição entre destino real e NOT_APPLICABLE", () => {
    const configured = new Set(getVersionedPortfolioWhatsAppClientKeys());
    const overlap = getWhatsAppNotApplicableClientKeys().filter((key) => configured.has(key));
    expect(overlap).toEqual([]);
  });
});
