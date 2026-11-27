import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import catalog from "@/config/portfolio-catalog.json";
import {
  SEED_PROJECTS,
  containsPublicContact,
  diffAgainstSeed,
  evaluateConformance,
  isSafeAssetPath,
  mergeProject,
  seedBySlug,
} from "@/lib/portfolio-admin";

describe("seed do admin do portfólio", () => {
  it("projeta todos os projetos dos registries", () => {
    expect(SEED_PROJECTS.length).toBeGreaterThanOrEqual(68);
    for (const p of SEED_PROJECTS) {
      expect(p.slug).toMatch(/^[a-z0-9][a-z0-9_-]*$/);
      expect(p.clientKey.length).toBeGreaterThan(0);
    }
  });

  it("mantém conformidade COMPLETE para projetos aptos e bloqueia matrizes não aprovadas", () => {
    for (const seed of SEED_PROJECTS) {
      const item = catalog.find((entry) => entry.slug === seed.slug);
      const matrixPath = `docs/portfolio/quality-matrix/${seed.slug}.json`;
      const technicalBlocked = existsSync(matrixPath) &&
        JSON.parse(readFileSync(matrixPath, "utf8")).technicalPass === false;
      const commercialBlocked = item?.status === "draft" && item.live === true &&
        "indexable" in item && item.indexable === false;
      const merged = mergeProject(seed, null);
      if (technicalBlocked || commercialBlocked) {
        expect(merged.published).toBe(false);
        expect(merged.conformance.status).not.toBe("COMPLETE");
        if (technicalBlocked) expect(merged.conformance.blocking).toContain("PORTFOLIO_TECHNICAL_PASS_REQUIRED");
        if (commercialBlocked) expect(merged.conformance.blocking).toContain("PORTFOLIO_COMMERCIAL_APPROVAL_REQUIRED");
      } else {
        expect(merged.conformance.status).toBe("COMPLETE");
      }
    }
  });
});

describe("precedência banco > seed", () => {
  const seed = seedBySlug("paulo-mestre-de-obras")!;

  it("herda o seed quando o campo do banco está vazio", () => {
    const merged = mergeProject(seed, { display_name: "", summary: "" });
    expect(merged.displayName).toBe(seed.title);
    expect(merged.summary).toBe(seed.summary);
  });

  it("usa o valor do banco quando preenchido e registra divergência", () => {
    const merged = mergeProject(seed, { display_name: "Paulo Obras Premium" });
    expect(merged.displayName).toBe("Paulo Obras Premium");
    expect(diffAgainstSeed(seed, merged)).toContain("title");
  });

  it("não altera estrutura protegida", () => {
    const merged = mergeProject(seed, { slug: "outro-slug", display_name: "X" });
    expect(merged.slug).toBe(seed.slug);
    expect(merged.structure.componentFile).toBe(seed.componentFile);
  });
});

describe("conformidade reavaliada no admin", () => {
  const base = {
    displayName: "Projeto",
    segment: "servicos",
    summary: "a".repeat(120),
    logoUrl: "/images/x/logo.webp",
    socialImageUrl: "/images/x/og.jpg",
    gallery: ["/images/x/1.webp", "/images/x/2.webp"],
    shareCopy: "b".repeat(140),
    seoDescription: "c".repeat(120),
    structure: {
      hasCta: true,
      hasCustomComponent: true,
      hasOwnDescription: false,
      requiresComponent: true,
    },
  };

  it("aprova um projeto completo", () => {
    expect(evaluateConformance(base).status).toBe("COMPLETE");
  });

  it("bloqueia quando falta imagem social", () => {
    const result = evaluateConformance({ ...base, socialImageUrl: "" });
    expect(result.issues).toContain("PORTFOLIO_SOCIAL_IMAGE_MISSING");
    expect(result.status).toBe("LEGACY");
  });

  it("marca PARTIAL quando só falta galeria", () => {
    const result = evaluateConformance({ ...base, gallery: ["/images/x/1.webp"] });
    expect(result.issues).toEqual(["PORTFOLIO_HERO_MISSING"]);
    expect(result.status).toBe("PARTIAL");
  });
});

describe("guardas de privacidade e assets", () => {
  it("rejeita contatos operacionais em qualquer campo administrável", () => {
    expect(containsPublicContact("Fale em https://wa.me/5541999999999")).toBe(true);
    expect(containsPublicContact("mailto:contato@exemplo.com")).toBe(true);
    expect(containsPublicContact("Reformas em Curitiba")).toBe(false);
  });

  it("aceita apenas assets internos", () => {
    expect(isSafeAssetPath("/images/heloa-gas/logo.webp")).toBe(true);
    expect(isSafeAssetPath("/api/public/portfolio-asset/heloa-gas/logo-1.webp")).toBe(true);
    expect(isSafeAssetPath("https://cdn.externo.com/logo.png")).toBe(false);
    expect(isSafeAssetPath("javascript:alert(1)")).toBe(false);
  });
});

describe("hold versionado prevalece sem afetar projetos aptos", () => {
  it("mantém arquivamento e bloqueia override de publicação para um hold", () => {
    const seed = seedBySlug("infinito-spa")!;
    const merged = mergeProject(seed, { published: true, lifecycle_status: "archived" });
    expect(merged.published).toBe(false);
    expect(merged.lifecycleStatus).toBe("archived");
    expect(merged.conformance.blocking).toContain("PORTFOLIO_COMMERCIAL_APPROVAL_REQUIRED");
  });
  it("preserva publicação e override editorial de um projeto apto", () => {
    const seed = seedBySlug("paulo-mestre-de-obras")!;
    const merged = mergeProject(seed, { published: true, lifecycle_status: "published", display_name: "Paulo Obras" });
    expect(merged.published).toBe(true);
    expect(merged.lifecycleStatus).toBe("published");
    expect(merged.displayName).toBe("Paulo Obras");
  });
});
