import { describe, expect, it } from "bun:test";
import {
  listPortfolioClients,
  resolvePortfolioClientKey,
  resolvePortfolioStandards,
} from "./portfolio-global-config";

describe("padrões globais de /portfolio/:slug", () => {
  it("aplica os elementos essenciais a todos os projetos registrados", () => {
    for (const client of listPortfolioClients()) {
      const standards = resolvePortfolioStandards(client.slug);
      expect(standards.shareButton.enabled).toBe(true);
      expect(standards.contactFloating.enabled).toBe(true);
      expect(standards.contactFloating.behavior).toBe("funnel-modal");
      expect(standards.footer.enabled).toBe(true);
      expect(standards.footer.hostCredit).toBe(true);
      expect(standards.hostCapturePopup.enabled).toBe(true);
      expect(standards.seo.canonicalRequired).toBe(true);
      expect(resolvePortfolioClientKey(client.slug)).toBe(client.clientKey);
    }
  });

  it("resolve pelo slug ou pela clientKey", () => {
    expect(resolvePortfolioStandards("r_beauty")).toEqual(resolvePortfolioStandards("r-beauty"));
  });

  it("usa o padrão global como fallback para projetos ainda não configurados", () => {
    const standards = resolvePortfolioStandards("cliente-futuro");
    expect(standards.shareButton.enabled).toBe(true);
    expect(standards.contactFloating.label).toBe("Fale conosco");
    expect(standards.footer.variant).toBe("light");
    expect(resolvePortfolioClientKey("cliente-futuro")).toBeUndefined();
  });

  it("aplica overrides do cliente sem quebrar o padrão básico", () => {
    const dyz = resolvePortfolioStandards("dyzpromo");
    expect(dyz.contactFloating.label).toBe("Pedir proposta");
    expect(dyz.footer.variant).toBe("dark");
    expect(dyz.footer.enabled).toBe(true);
    expect(dyz.hostCapturePopup.enabled).toBe(true);
  });

  it("deriva o modo do funil a partir do contrato do cliente", () => {
    expect(resolvePortfolioStandards("renata-beauty").contactFloating.mode).toBe("booking");
    expect(resolvePortfolioStandards("rm-fretes").contactFloating.mode).toBe("proposal");
  });
});
