import { beforeEach, describe, expect, it } from "bun:test";
import {
  __resetOnceForTests,
  classifyAcquisition,
  classifyTraffic,
  mergeFirstTouch,
  normalizePath,
  pickAllowedParams,
  sanitizeAnalyticsParams,
  shouldEmitPageView,
  shouldEmitSocialProof,
  TELEMETRY_VERSION,
  MEASUREMENT_TRUTH_V2_CUTOVER,
} from "./telemetry-v2";

const SITE = "0web.com.br";

beforeEach(() => {
  __resetOnceForTests();
});

describe("atribuição", () => {
  it("registra first touch de UTM", () => {
    const a = classifyAcquisition({
      search: "?utm_source=google&utm_medium=cpc&utm_campaign=x",
      referrer: null,
      siteHost: SITE,
      path: "/",
    });
    expect(a).toMatchObject({ channel: "utm", source: "google", medium: "cpc", campaign: "x" });
  });

  it("navegação interna não sobrescreve o first touch do Google", () => {
    const google = classifyAcquisition({ search: "?utm_source=google", referrer: null, siteHost: SITE, path: "/" });
    const internal = classifyAcquisition({ referrer: `https://${SITE}/portfolio`, siteHost: SITE, path: "/portfolio/rm-fretes" });
    const merged = mergeFirstTouch(google, internal);
    expect(merged.source).toBe("google");
    expect(merged.source).not.toBe("site");
  });

  it("sem UTM e sem referrer classifica como direct", () => {
    expect(classifyAcquisition({ siteHost: SITE, path: "/" }).channel).toBe("direct");
  });

  it("referrer externo vira referral pelo hostname", () => {
    const a = classifyAcquisition({ referrer: "https://www.google.com/search?q=segredo", siteHost: SITE, path: "/" });
    expect(a).toMatchObject({ channel: "referral", source: "google.com", medium: "referral" });
  });

  it("referrer do próprio domínio não gera nova aquisição", () => {
    const a = classifyAcquisition({ referrer: `https://www.${SITE}/`, siteHost: SITE, path: "/servicos" });
    expect(a.channel).toBe("internal");
  });

  it("nunca usa o literal 'site' como origem", () => {
    const cases = [
      classifyAcquisition({ siteHost: SITE, path: "/" }),
      classifyAcquisition({ referrer: `https://${SITE}/`, siteHost: SITE, path: "/" }),
      classifyAcquisition({ referrer: "https://instagram.com/", siteHost: SITE, path: "/" }),
    ];
    for (const c of cases) expect(c.source).not.toBe("site");
  });
});

describe("page_view", () => {
  it("carregamento inicial gera 1 evento e re-render nenhum", () => {
    expect(shouldEmitPageView("/", 1)).toBe(true);
    expect(shouldEmitPageView("/", 1)).toBe(false);
    expect(shouldEmitPageView("/", 1)).toBe(false);
  });

  it("navegação SPA real gera novo evento", () => {
    expect(shouldEmitPageView("/", 1)).toBe(true);
    expect(shouldEmitPageView("/portfolio/rm-fretes", 2)).toBe(true);
  });

  it("query irrelevante não fragmenta a página", () => {
    expect(normalizePath("/portfolio/x?foo=1")).toBe(normalizePath("/portfolio/x?foo=2"));
    expect(normalizePath("https://0web.com.br/Servicos/")).toBe("/servicos");
  });

  it("só persiste parâmetros analíticos permitidos", () => {
    const got = pickAllowedParams("?utm_source=google&email=a@b.com&foo=1");
    expect(got).toEqual({ utm_source: "google" });
  });
});

describe("prova social", () => {
  it("emite no máximo 1 evento por sessão e contexto", () => {
    expect(shouldEmitSocialProof("site")).toBe(true);
    expect(shouldEmitSocialProof("site")).toBe(false);
    expect(shouldEmitSocialProof("portfolio:rm-fretes")).toBe(true);
    expect(shouldEmitSocialProof("portfolio:rm-fretes")).toBe(false);
  });
});

describe("tráfego", () => {
  it("classifica humano, bot, automação e interno", () => {
    expect(classifyTraffic({ userAgent: "Mozilla/5.0 Chrome/120", hostname: SITE, path: "/" })).toBe("human");
    expect(classifyTraffic({ userAgent: "Googlebot/2.1", hostname: SITE, path: "/" })).toBe("bot");
    expect(classifyTraffic({ userAgent: "Mozilla/5.0", webdriver: true, hostname: SITE, path: "/" })).toBe("automation");
    expect(classifyTraffic({ userAgent: "Mozilla/5.0", hostname: SITE, path: "/app/portfolio" })).toBe("internal");
    expect(classifyTraffic({ userAgent: "Mozilla/5.0", hostname: "localhost", path: "/" })).toBe("internal");
    expect(classifyTraffic({ userAgent: null, hostname: SITE, path: "/" })).toBe("unknown");
  });
});

describe("privacidade", () => {
  it("descarta PII e texto livre da telemetria", () => {
    const out = sanitizeAnalyticsParams({
      nome: "Henrique",
      email: "a@b.com",
      phone: "41997452053",
      whatsapp_message: "Olá, quero orçamento",
      mensagem: "texto livre do formulário",
      endereco: "Rua Belo Horizonte, 340",
      location: "hero",
      portfolio_slug: "rm-fretes",
      percent: 75,
    });
    expect(out).toEqual({ location: "hero", portfolio_slug: "rm-fretes", percent: 75 });
  });

  it("mantém a versão e o cutover declarados", () => {
    expect(TELEMETRY_VERSION).toBe(2);
    expect(MEASUREMENT_TRUTH_V2_CUTOVER).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
