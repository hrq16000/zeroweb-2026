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

  it("bloqueia rota removida", () => {
    expect(classifyIndexabilityDelta(base, undefined).hard).toBe(true);
  });
});
