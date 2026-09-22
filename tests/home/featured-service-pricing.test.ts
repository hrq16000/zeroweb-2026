import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const navSource = readFileSync(
  resolve(__dirname, "../../src/lib/services-nav.functions.ts"),
  "utf8",
);
const featuredSource = readFileSync(
  resolve(__dirname, "../../src/components/site/FeaturedServices.tsx"),
  "utf8",
);

describe("Home — preços reais nos serviços em destaque", () => {
  test("a query de navegação preserva preço e período do catálogo", () => {
    expect(navSource).toContain("price_period");
    expect(navSource).toContain("price: r.price == null || !Number.isFinite(Number(r.price)) ? null : Number(r.price)");
    expect(navSource).toContain("pricePeriod: r.price_period");
  });

  test("o card da home mostra preço publicado sem inventar fallback", () => {
    expect(featuredSource).toContain('typeof s.price === "number" && s.price > 0');
    expect(featuredSource).toContain("A partir de");
    expect(featuredSource).toContain('style: "currency"');
    expect(featuredSource).toContain('currency: "BRL"');
  });
});
