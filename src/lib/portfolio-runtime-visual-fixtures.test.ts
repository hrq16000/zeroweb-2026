import { describe, expect, it } from "vitest";
import { applyPortfolioRuntime, sanitizePortfolioRuntimeRow, type PortfolioRuntimeBase } from "./portfolio-runtime";
import { PORTFOLIO_RUNTIME_VISUAL_FIXTURES, PORTFOLIO_RUNTIME_VISUAL_FIXTURE_SLUGS } from "./portfolio-runtime-visual-fixtures";

describe("fixtures sintéticas de overrides visuais", () => {
  it("cobre as rotas com conteúdo administrado sem incorporar dados de clientes", () => {
    expect(PORTFOLIO_RUNTIME_VISUAL_FIXTURE_SLUGS).toHaveLength(4);
    const serialized = JSON.stringify(PORTFOLIO_RUNTIME_VISUAL_FIXTURES);
    expect(serialized).not.toMatch(/\+?55\s*\d{2}\s*\d{4,5}[- ]?\d{4}/);
    expect(serialized).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(serialized).toContain("visual-fixture-");
  });

  it.each(PORTFOLIO_RUNTIME_VISUAL_FIXTURE_SLUGS)("sanitiza e aplica overrides determinísticos em %s", (slug) => {
    const row = PORTFOLIO_RUNTIME_VISUAL_FIXTURES[slug];
    const overrides = sanitizePortfolioRuntimeRow(slug, row);
    const base: PortfolioRuntimeBase = {
      slug,
      title: "Título fallback",
      description: "Descrição fallback.",
      canonicalUrl: `https://0web.com.br/portfolio/${slug}`,
      socialImage: "/images/default-social.svg",
    };
    const effective = applyPortfolioRuntime(base, overrides);

    expect(overrides?.logoUrl).toBe("/images/visual-fixtures/logo.svg");
    expect(overrides?.heroImageUrl).toBe("/images/visual-fixtures/hero.svg");
    expect(overrides?.socialImageUrl).toBe("/images/visual-fixtures/social.svg");
    expect(effective.heroImageUrl).toBe("/images/visual-fixtures/hero.svg");
    expect(effective.logoUrl).toBe("/images/visual-fixtures/logo.svg");
    expect(effective.socialImage).toBe("/images/visual-fixtures/social.svg");
    expect(effective.gallery).toEqual(["/images/visual-fixtures/gallery.svg"]);
    expect(effective.indexable).toBe(false);
    expect(effective.robots).toBe("noindex,nofollow");
    expect(effective.overriddenFields).toContain("hero");
  });
});
