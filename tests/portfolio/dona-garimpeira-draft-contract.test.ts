import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Contract guard for Dona Garimpeira during staged onboarding.
 * The new portfolio must not accidentally appear in production with
 * unverified social media or a draft-only funnel.
 */
const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");
const parse = (file: string) => JSON.parse(read(file));
const slug = "dona-garimpeira-brecho";

describe("Dona Garimpeira draft lifecycle — fail closed", () => {
  test("individual SEO contract v4 stays draft with explicit blockers", () => {
    const project = parse(`docs/portfolio/drafts/${slug}-manifest-v4.json`);
    expect(project).toBeDefined();
    expect(project.stage).toBe("draft");
    expect(project.contractVersion).toBeGreaterThanOrEqual(4);
    expect(project.individualSiteContract.version).toBe(1);
    expect(project.individualSiteContract.gates.PORTFOLIO_INDEXABILITY_GATE).not.toBe("complete");
    expect(project.blockers.length).toBeGreaterThan(0);
    const activated = parse("src/config/portfolio-project-manifests.json").projects[slug];
    expect(activated).toBeUndefined();
  });

  test("no public catalog or routing exists before readiness", () => {
    const raw = parse("src/config/portfolio-catalog.json");
    const catalog = Array.isArray(raw) ? raw : raw.projects;
    const project = catalog.find((item: { slug: string }) => item.slug === slug);
    expect(project?.status).not.toBe("published");
    const authorial = read("src/config/portfolio-authorial-compositions.ts");
    expect(authorial).not.toContain(`"${slug}"`);
    const registry = read("src/components/portfolio/composition/registry.ts");
    expect(registry).not.toContain(`"${slug}"`);
  });

  test("media is documented but no unverified Instagram items are published", () => {
    const plan = parse(`docs/portfolio/media-plans/${slug}.json`);
    expect(plan.socialLatestSix.verifiedPostPermalinks).toEqual([]);
    expect(plan.cover.approved).toBe(false);
    const component = read("src/components/site/DonaGarimpeiraBrechoPage.tsx");
    expect(component).toContain("const GALLERY_ITEMS: GalleryItem[] = []");
    expect(component).not.toContain("wa.me/");
    expect(component).not.toContain("tel:");
    expect(component).not.toContain("mailto:");
  });

  test("funnel migration is draft-only and does not overwrite existing forms", () => {
    const sql = read("supabase/migrations/20261102170400_seed_dona_garimpeira_brecho_funnel.sql");
    expect(sql).toContain("funnel-dona-garimpeira-brecho");
    expect(sql).toMatch(/'draft'/);
    expect(sql).toMatch(/on conflict \(slug\) do nothing/i);
    expect(sql).not.toMatch(/'published'/);
    const context = parse("src/config/portfolio-funnel-context.json")[slug];
    expect(context).toBeDefined();
    expect(context.intent).toBe("contato");
  });

  test("discovery terms use confirmed location and business segment", () => {
    const entry = parse("src/config/portfolio-discovery.json").projects[slug];
    expect(entry.locality).toContain("Boneca do Iguaçu");
    expect(entry.locality).toContain("São José dos Pinhais");
    expect(entry.categories).toContain("brechó");
    expect(entry.services).toContain("recebimento de doações de roupas");
  });
});
