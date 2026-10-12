import { describe, expect, test } from "bun:test";
import { selectPortfolioRuntimeAuditTargets } from "../../scripts/lib/portfolio-runtime-audit-targets.mjs";

const versionedSlugs = ["manu-pasteis", "arildo-madeiras"];

describe("auditoria HTTP de portfolios criados pelo painel", () => {
  test("descobre novas rotas no sitemap sem refazer auditoria dos 96 versionados", () => {
    const result = selectPortfolioRuntimeAuditTargets({
      sitemapSlugs: ["manu-pasteis", "nova-loja", "nova-loja", "outra-oficina"],
      versionedSlugs,
    });
    expect(result.runtimeSlugs).toEqual(["nova-loja", "outra-oficina"]);
    expect(result.requestedSlug).toBeNull();
    expect(result.requestedExtraSlugs).toEqual([]);
  });

  test("verifica URL solicitada mesmo quando ela nao consta do sitemap", () => {
    const result = selectPortfolioRuntimeAuditTargets({
      sitemapSlugs: ["manu-pasteis"],
      versionedSlugs,
      requestedSlug: "loja-nova",
    });
    expect(result.requestedMissingSitemap).toBe("loja-nova");
    expect(result.requestedExtraSlugs).toEqual(["loja-nova"]);
  });

  test("slug versionado com ausencia no sitemap aciona alerta sem duplicar alvos", () => {
    const result = selectPortfolioRuntimeAuditTargets({
      sitemapSlugs: [],
      versionedSlugs,
      requestedSlug: "arildo-madeiras",
    });
    expect(result.requestedMissingSitemap).toBe("arildo-madeiras");
    expect(result.requestedExtraSlugs).toEqual([]);
  });

  test("slug dinamico solicitado e ja publicado nao duplica requisicoes", () => {
    const result = selectPortfolioRuntimeAuditTargets({
      sitemapSlugs: ["nova-loja", "manu-pasteis"],
      versionedSlugs,
      requestedSlug: "nova-loja",
    });
    expect(result.runtimeSlugs).toEqual(["nova-loja"]);
    expect(result.requestedExtraSlugs).toEqual([]);
    expect(result.requestedMissingSitemap).toBeNull();
  });

  test("nao confunde caminhos locais e URLs externas com projeto real", () => {
    expect(selectPortfolioRuntimeAuditTargets({
      sitemapSlugs: ["porto", "portfolio-em", "cwb/jardim", "../admin", "x?redirect=evil"],
      versionedSlugs,
    }).runtimeSlugs).toEqual(["porto", "portfolio-em"]);
    for (const requestedSlug of ["../admin", "https://evil.com", "foo/bar", "abc?x=1", "nome com espaco", "x".repeat(81)]) {
      expect(() => selectPortfolioRuntimeAuditTargets({
        sitemapSlugs: [],
        versionedSlugs,
        requestedSlug,
      })).toThrow("PORTFOLIO_AUDIT_SLUG");
    }
  });
});
