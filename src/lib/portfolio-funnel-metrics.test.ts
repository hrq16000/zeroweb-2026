import { describe, expect, it } from "bun:test";
import { leadSlug, PORTFOLIO_METRIC_SOURCES } from "./portfolio-funnel-metrics.functions";

describe("atribuição de projeto do lead", () => {
  it("usa a URL da página do projeto como fonte primária", () => {
    expect(leadSlug({ page_url: "https://0web.com.br/portfolio/rm-fretes?utm=x" })).toBe("rm-fretes");
  });

  it("cai para o client_key quando a URL não foi registrada", () => {
    expect(leadSlug({ client_key: "dyzpromo" })).toBe("dyzpromo");
  });

  it("prefere a URL quando ambos existem, mantendo a mesma chave das visitas", () => {
    expect(leadSlug({ page_url: "/portfolio/r_beauty", client_key: "r-beauty" })).toBe("r_beauty");
  });

  it("retorna null sem atribuição, nunca um projeto inventado", () => {
    expect(leadSlug({})).toBeNull();
    expect(leadSlug({ page_url: "/servicos" })).toBeNull();
    expect(leadSlug({ client_key: "   " })).toBeNull();
  });

  it("mantém uma única fonte canônica declarada por etapa", () => {
    expect(PORTFOLIO_METRIC_SOURCES.PORTFOLIO_VIEW_SOURCE).toBe("analytics_events:portfolio_view");
    expect(PORTFOLIO_METRIC_SOURCES.WHATSAPP_SOURCE).toBe("whatsapp_redirect_tokens.used_at");
  });
});
