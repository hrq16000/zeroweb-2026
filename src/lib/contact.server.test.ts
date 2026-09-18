import { describe, expect, it } from "bun:test";
import {
  getPortfolioContactClientKeys,
  getVersionedPortfolioWhatsAppClientKeys,
  getWhatsAppNotApplicableClientKeys,
  isPortfolioWhatsAppNotApplicable,
  resolveVersionedPortfolioWhatsApp,
} from "./portfolio-whatsapp-registry.server";

describe("portfolio WhatsApp data", () => {
  it("mantém os 92 portfolios no cadastro canônico", () => {
    expect(getPortfolioContactClientKeys()).toHaveLength(92);
  });

  it("migra os destinos atuais e preserva o comprovado na PR", () => {
    expect(getVersionedPortfolioWhatsAppClientKeys()).toHaveLength(65);
    expect(resolveVersionedPortfolioWhatsApp("carecas-infotec")).toBe("5541995072700");
    expect(resolveVersionedPortfolioWhatsApp("jkl-decor")).toBe("5541991425088");
    expect(resolveVersionedPortfolioWhatsApp("adhonep-curitiba")).toBe("5541995610718");
    // r-beauty não possui número próprio comprovado (variante derivada de
    // renata-beauty foi removida): portfolio lead-only.
    expect(resolveVersionedPortfolioWhatsApp("r-beauty")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("simone-lacerda-vaz")).toBe("5541995129384");
  });

  it("trata portfolio sem número como estado normal", () => {
    expect(resolveVersionedPortfolioWhatsApp("marido-de-aluguel")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("kitutes-na-mesa")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("auto-socorro-dentinho")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("woodhouse-hamburgueres")).toBeNull();
  });

  it("não cria fallback entre clientes", () => {
    expect(resolveVersionedPortfolioWhatsApp("angel-mix-brecho")).toBeNull();
    expect(resolveVersionedPortfolioWhatsApp("cliente-inexistente")).toBeNull();
  });

  it("mantém classificação de auditoria sem interferir na conclusão do funil", () => {
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
