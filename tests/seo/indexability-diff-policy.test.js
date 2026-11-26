import { describe, expect, it } from "vitest";
import { classifyIndexabilityDelta } from "../../scripts/indexability-diff-policy.mjs";

const base = {
  status: 200,
  route: "/portfolio/x",
  canonical: "https://0web.com.br/portfolio/x",
  noindex: false,
  nofollow: false,
  schemas: ["WebPage", "LocalBusiness", "BreadcrumbList"],
  problems: [],
};

describe("indexability diff policy", () => {
  it("não bloqueia queda isolada de schema entre produção e preview", () => {
    const delta = classifyIndexabilityDelta(base, { ...base, schemas: ["WebPage", "BreadcrumbList"] });
    expect(delta.hard).toBe(false);
    expect(delta.schemaDelta).toBe(-1);
  });

  it("bloqueia regressões de páginas publicadas", () => {
    expect(classifyIndexabilityDelta(base, { ...base, status: 500 }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, canonical: null }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, canonical: "https://0web.com.br/portfolio/y" }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, noindex: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, nofollow: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, problems: ["ausente do sitemap"] }).hard).toBe(true);
  });

  it("exige noindex em qualquer draft que responda 200, mesmo se já existia", () => {
    const absent = { ...base, status: 404, canonical: null, noindex: false, problems: ["status 404", "sem canonical"] };
    const draft = { ...base, noindex: true, nofollow: true, problems: ["noindex", "nofollow", "ausente do sitemap"] };
    const options = { expectedUnpublishedDraft: true, beforeInSitemap: false, afterInSitemap: false };

    expect(classifyIndexabilityDelta(absent, draft, options).hard).toBe(false);
    expect(classifyIndexabilityDelta(absent, { ...draft, noindex: false }, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, draft, options).hard).toBe(false);
    expect(classifyIndexabilityDelta(base, { ...draft, noindex: false }, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(absent, draft, { ...options, afterInSitemap: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(absent, { ...draft, canonical: "https://0web.com.br/portfolio/y" }, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(absent, { ...draft, redirectedTo: "/portfolio/y" }, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(absent, { ...draft, problems: ["noindex", "JSON-LD inválido"] }, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...draft, status: 404 }, options).hard).toBe(true);
  });

  it("não confunde a retirada de sitemap anterior com inclusão atual", () => {
    const absent = { ...base, status: 404, canonical: null, noindex: false, problems: ["status 404"] };
    const draft = { ...base, noindex: true, nofollow: true, problems: ["noindex", "nofollow"] };
    expect(classifyIndexabilityDelta(absent, draft, {
      newDraft: true,
      beforeInSitemap: true,
      afterInSitemap: false,
    }).hard).toBe(false);
  });

  it("bloqueia rota removida", () => {
    expect(classifyIndexabilityDelta(base, undefined).hard).toBe(true);
  });
});
