import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
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

  test("publicação do catálogo e rota offline não dependem do banco", () => {
    const raw = parse("src/config/portfolio-catalog.json");
    const catalog = Array.isArray(raw) ? raw : raw.projects;
    const project = catalog.find((item: { slug: string }) => item.slug === slug);
    expect(project?.status).toBe("published");
    expect(project?.clientKey).toBe(slug);
    // O loader exige registro indexável, mas não consulta dynamic_forms.
    const authorial = read("src/config/portfolio-authorial-compositions.ts");
    expect(authorial).toContain(`"${slug}"`);
    const registry = read("src/components/portfolio/composition/registry.ts");
    expect(registry).toContain(`"${slug}": lazy(`);
    const prototypes = read("src/lib/portfolio-site-registry.ts");
    expect(prototypes).toContain(`slug: "${slug}"`);
    expect(prototypes).toContain(`slug: "${slug}", vertical: "comercios"`);
    expect(prototypes).toMatch(new RegExp(`slug: "${slug}"[^\\n]*indexable: true`));
    const route = read("src/routes/portfolio.$slug.tsx");
    expect(route).toContain('if (params.slug === "dona-garimpeira-brecho" && !site?.indexable) throw notFound()');
    expect(route).toContain('if (params.slug === "dona-garimpeira-brecho") {');
    expect(route).toContain("return { vertical, slug: params.slug, overrides: null, managed: null }");
    expect(route).not.toContain('getPublicFunnel({ data: { slug: "funnel-dona-garimpeira-brecho" } })');
    expect(route).not.toContain("if (!available) throw notFound()");
    const clients = parse("src/config/portfolio-clients.json");
    expect(clients.find((entry: { slug: string }) => entry.slug === slug)).toBeUndefined();
    const active = parse("src/config/portfolio-project-manifests.json").projects[slug];
    expect(active).toBeUndefined();
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

  test("funnel SQL stays inert until real database schema is verified", () => {
    expect(existsSync(resolve(process.cwd(), "supabase/migrations/20261102170400_seed_dona_garimpeira_brecho_funnel.sql"))).toBe(false);
    const sql = read("docs/portfolio/drafts/dona-garimpeira-brecho-funnel-seed.sql");
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
