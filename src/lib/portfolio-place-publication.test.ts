import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";
import { portfolioPlaceIsPublished } from "./portfolio-place-seo.functions";

describe("publicação dos hubs regionais do portfólio", () => {
  it("usa catálogo por padrão e respeita override explícito", () => {
    expect(portfolioPlaceIsPublished("curitiba-pr", [])).toBe(true);
    expect(
      portfolioPlaceIsPublished("curitiba-pr", [
        { slug: "curitiba-pr", published: false },
      ]),
    ).toBe(false);
    expect(
      portfolioPlaceIsPublished("curitiba-pr", [
        { slug: "curitiba-pr", published: true },
      ]),
    ).toBe(true);
  });

  it("não representa a 0WEB como negócio físico no local do cliente", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/routes/portfolio-em.$local.tsx"),
      "utf8",
    );

    expect(source).not.toContain('"@type": "ProfessionalService"');
    expect(source).not.toContain('"@type": "LocalBusiness"');
    expect(source).not.toContain('name: "geo.placename"');
    expect(source).not.toContain('name: "geo.region"');
    expect(source).not.toContain('"@type": "PostalAddress"');
  });

  it("mantém sitemaps legados apontando para o mapa canônico", () => {
    const locais = readFileSync(
      resolve(process.cwd(), "src/routes/sitemap-portfolio-locais[.]xml.ts"),
      "utf8",
    );
    const prioritario = readFileSync(
      resolve(process.cwd(), "src/routes/sitemap-portfolio-prioritario[.]xml.ts"),
      "utf8",
    );

    for (const source of [locais, prioritario]) {
      expect(source).toContain('new URL("/sitemap-portfolio.xml", request.url)');
      expect(source).toContain("Response.redirect");
      expect(source).toContain(", 301)");
    }
  });

  it("aplica publicação no detalhe, índice, relacionados e sitemap", () => {
    const detail = readFileSync(
      resolve(process.cwd(), "src/routes/portfolio-em.$local.tsx"),
      "utf8",
    );
    const index = readFileSync(
      resolve(process.cwd(), "src/routes/portfolio-em.index.tsx"),
      "utf8",
    );
    const sitemap = readFileSync(
      resolve(process.cwd(), "src/routes/sitemap-portfolio[.]xml.ts"),
      "utf8",
    );

    expect(detail).toContain("portfolioPlaceIsPublished(hub.slug, states)");
    expect(detail).toContain("seo?.published !== false");
    expect(detail).toContain("portfolioPlaceIsPublished(item.slug, states)");
    expect(index).toContain("portfolioPlaceIsPublished(hub.slug, states)");
    expect(sitemap).toContain("portfolioPlaceIsPublished(hub.slug, placeStates)");
  });
});
