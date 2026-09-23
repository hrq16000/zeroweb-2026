import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const source = readFileSync(
  resolve(__dirname, "../../src/lib/services-public.functions.ts"),
  "utf8",
);

const featuredSource = readFileSync(
  resolve(__dirname, "../../src/components/site/FeaturedServices.tsx"),
  "utf8",
);

describe("/servicos — contrato de capa da vitrine", () => {
  test("produtos conhecidos usam assets editoriais próprios da 0WEB", () => {
    expect(source).toContain('"criacao-de-sites": blogSitesCover');
    expect(source).toContain('"landing-pages": blogRoiTrafegoCover');
    expect(source).toContain('"loja-virtual": heroDashboardCover');
  });

  test("a vitrine não usa SVG gerado como placeholder", () => {
    const start = source.indexOf("export const listServicesStorefront");
    const end = source.indexOf("export const listServicesPublic", start);
    const storefront = source.slice(start, end);

    expect(storefront).not.toContain("generatedServiceCover(");
    expect(storefront).toContain("if (!imageUrl) return null");
  });
  test("a home só destaca produtos publicáveis pela loja", () => {
    expect(featuredSource).not.toContain("serviceCoverFallback");
    expect(featuredSource).toContain('typeof service.price === "number" && service.price > 0');
    expect(featuredSource).toContain("Boolean(service.imageUrl)");
    expect(featuredSource).toContain("src={s.imageUrl!}");
  });
});
