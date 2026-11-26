import { describe, expect, it } from "vitest";
import { classifyIndexabilityDelta } from "../../scripts/indexability-diff-policy.mjs";

const base = {
  status: 200,
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

  it("bloqueia status, canonical, noindex, nofollow e sitemap", () => {
    expect(classifyIndexabilityDelta(base, { ...base, status: 500 }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, canonical: null }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, canonical: "https://0web.com.br/portfolio/y" }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, noindex: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, nofollow: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, problems: ["ausente do sitemap"] }).hard).toBe(true);
  });

  it("distingue rascunho novo comprovado de regressões em páginas públicas", () => {
    const absent = { ...base, route: "/portfolio/x", status: 404, canonical: null, problems: ["status 404", "sem canonical"] };
    const draft = { ...base, route: "/portfolio/x", noindex: true, problems: ["noindex"] };
    const options = { expectedUnpublishedDraft: true };
    expect(classifyIndexabilityDelta(absent, draft, options).hard).toBe(false);
    expect(classifyIndexabilityDelta(absent, draft).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, draft, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(absent, { ...draft, canonical: null }, options).hard).toBe(true);
    const nofollowDraft = { ...draft, nofollow: true, problems: ["noindex", "nofollow"] };
    expect(classifyIndexabilityDelta(absent, nofollowDraft, options).hard).toBe(false);
    expect(classifyIndexabilityDelta(absent, nofollowDraft).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, nofollowDraft, options).hard).toBe(true);
    expect(classifyIndexabilityDelta(absent, { ...draft, noindex: false, problems: ["ausente do sitemap"] }, options).hard).toBe(true);
  });

  it("bloqueia rota removida", () => {
    expect(classifyIndexabilityDelta(base, undefined).hard).toBe(true);
  });
});


describe("nova demonstração protegida", () => {
  const missing = { status: 404, canonical: null, noindex: false, nofollow: false, schemas: [], problems: ["status 404"] };
  const draft = { ...base, route: "/portfolio/x", noindex: true, nofollow: true, problems: ["noindex"] };
  const config = { newDraft: true, beforeInSitemap: false, afterInSitemap: false };
  it("aceita somente a rota nova, declarada draft e fora do sitemap", () => {
    expect(classifyIndexabilityDelta(missing, draft, config).hard).toBe(false);
    expect(classifyIndexabilityDelta(missing, draft).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, draft, config).hard).toBe(true);
  });
  it("bloqueia indexação, sitemap, canonical incorreta, redirecionamento e JSON-LD inválido", () => {
    expect(classifyIndexabilityDelta(missing, { ...draft, noindex: false }, config).hard).toBe(true);
    expect(classifyIndexabilityDelta(missing, draft, { ...config, beforeInSitemap: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(missing, draft, { ...config, afterInSitemap: true }).hard).toBe(true);
    expect(classifyIndexabilityDelta(missing, { ...draft, canonical: "https://0web.com.br/portfolio/y" }, config).hard).toBe(true);
    expect(classifyIndexabilityDelta(missing, { ...draft, redirectedTo: "/portfolio/y" }, config).hard).toBe(true);
    expect(classifyIndexabilityDelta(missing, { ...draft, problems: ["noindex", "JSON-LD inválido"] }, config).hard).toBe(true);
    expect(classifyIndexabilityDelta(base, { ...base, nofollow: true }, config).hard).toBe(true);
  });
});
