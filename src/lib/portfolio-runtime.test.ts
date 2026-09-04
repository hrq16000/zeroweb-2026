import { describe, expect, it } from "vitest";
import {
  applyPortfolioRuntime,
  sanitizePortfolioRuntimeRow,
  type PortfolioRuntimeBase,
} from "./portfolio-runtime";

const base: PortfolioRuntimeBase = {
  slug: "paulo-mestre-de-obras",
  title: "Paulo Mestre de Obras",
  description: "Descrição do registry.",
  canonicalUrl: "https://0web.com.br/portfolio/paulo-mestre-de-obras",
  socialImage: "https://0web.com.br/images/paulo-mestre-de-obras/capa.webp",
  logoUrl: "https://0web.com.br/images/paulo-mestre-de-obras/logo.webp",
};

describe("resolver de runtime do portfólio", () => {
  it("sem linha no banco mantém exatamente o registry e segue indexável", () => {
    const eff = applyPortfolioRuntime(base, null);
    expect(eff.title).toBe(base.title);
    expect(eff.description).toBe(base.description);
    expect(eff.socialImage).toBe(base.socialImage);
    expect(eff.robots).toContain("index,follow");
    expect(eff.overriddenFields).toEqual([]);
  });

  it("override do banco tem precedência sobre o registry", () => {
    const ov = sanitizePortfolioRuntimeRow("paulo-mestre-de-obras", {
      seo_title: "Novo título administrado",
      seo_description: "Nova descrição vinda do painel.",
      lifecycle_status: "published",
      published: true,
    });
    const eff = applyPortfolioRuntime(base, ov);
    expect(eff.title).toBe("Novo título administrado");
    expect(eff.description).toBe("Nova descrição vinda do painel.");
    expect(eff.overriddenFields).toContain("title");
  });

  it("campo vazio no banco faz rollback automático para o registry", () => {
    const ov = sanitizePortfolioRuntimeRow("paulo-mestre-de-obras", {
      seo_title: "   ",
      published: true,
      lifecycle_status: "published",
    });
    const eff = applyPortfolioRuntime(base, ov);
    expect(eff.title).toBe(base.title);
  });

  it("social image override e socialVersion chegam ao og:image", () => {
    const ov = sanitizePortfolioRuntimeRow("paulo-mestre-de-obras", {
      social_image_url: "/api/public/portfolio-asset/paulo/social-2.webp",
      social_version: "v7",
      published: true,
      lifecycle_status: "published",
    });
    const eff = applyPortfolioRuntime(base, ov);
    expect(eff.socialImage).toBe("/api/public/portfolio-asset/paulo/social-2.webp?v=v7");
  });

  it("bloqueia contato operacional, HTML e URL externa", () => {
    const ov = sanitizePortfolioRuntimeRow("paulo-mestre-de-obras", {
      seo_title: "Fale https://wa.me/5541999999999",
      seo_description: "<script>alert(1)</script>",
      logo_url: "https://evil.example.com/logo.png",
      canonical_url: "https://concorrente.com/",
      published: true,
    });
    expect(ov?.seoTitle).toBeUndefined();
    expect(ov?.seoDescription).toBeUndefined();
    expect(ov?.logoUrl).toBeUndefined();
    expect(ov?.canonicalUrl).toBeUndefined();
    const eff = applyPortfolioRuntime(base, ov);
    expect(eff.canonicalUrl).toBe(base.canonicalUrl);
    expect(eff.logoUrl).toBe(base.logoUrl);
  });

  it("draft e archived saem do índice", () => {
    for (const status of ["draft", "archived"] as const) {
      const ov = sanitizePortfolioRuntimeRow("x", { lifecycle_status: status, published: false });
      const eff = applyPortfolioRuntime({ ...base, slug: "x" }, ov);
      expect(eff.indexable).toBe(false);
      expect(eff.robots).toBe("noindex,nofollow");
    }
  });

  it("share copy administrável fica restrita ao próprio slug", () => {
    const ov = sanitizePortfolioRuntimeRow("heloa-gas", {
      share_copy: "Heloá Gás está de site novo!",
      published: true,
      lifecycle_status: "published",
    });
    const eff = applyPortfolioRuntime({ ...base, slug: "heloa-gas" }, ov);
    expect(eff.slug).toBe("heloa-gas");
    expect(eff.shareCopy).toBe("Heloá Gás está de site novo!");
  });

  it("galeria aceita apenas assets internos", () => {
    const ov = sanitizePortfolioRuntimeRow("x", {
      gallery: ["/images/x/a.webp", "https://evil.com/b.png", 42],
      published: true,
    });
    expect(ov?.gallery).toEqual(["/images/x/a.webp"]);
  });
});
