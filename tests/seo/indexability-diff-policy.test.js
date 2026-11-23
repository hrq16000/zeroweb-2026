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

  it("não classifica como perda de indexabilidade uma rota nova 404→200 em rascunho", () => {
    const before = { ...base, status: 404, canonical: null, schemas: [], problems: ["rota inexistente"] };
    const after = { ...base, noindex: true, nofollow: true, schemas: ["WebPage"] };
    const delta = classifyIndexabilityDelta(before, after);
    expect(delta.hard).toBe(false);
    expect(delta.schemaDelta).toBe(1);
  });

  it("mantém bloqueio para noindex/nofollow em página que já era 200", () => {
    const after = { ...base, noindex: true, nofollow: true };
    const delta = classifyIndexabilityDelta(base, after);
    expect(delta.hard).toBe(true);
    expect(delta.reason).toContain("noindex introduzido");
    expect(delta.reason).toContain("nofollow introduzido");
  });
});
