import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const storefront = readFileSync("src/lib/services-public.functions.ts", "utf8");
const index = readFileSync("src/routes/servicos.index.tsx", "utf8");

describe("storefront performance contract", () => {
  test("/servicos usa loader específico de vitrine", () => {
    expect(index).toContain("listServicesStorefront");
    expect(index).not.toContain("listServicesPublic");
  });

  test("vitrine não depende de gallery nem OG image no payload", () => {
    expect(index).not.toMatch(/s\.gallery|s\.ogImageUrl/);
    const cols = storefront.match(/const STOREFRONT_COLS =\s*\n?\s*"([^"]+)"/)?.[1] ?? "";
    expect(cols).toContain("image_path");
    expect(cols).toContain("price");
    expect(cols).not.toContain("gallery");
    expect(cols).not.toContain("og_image_path");
    expect(cols).not.toContain("faq");
    expect(cols).not.toContain("rich_html");
    expect(cols).not.toContain("schema_jsonld");
  });

  test("loader assina somente a capa principal", () => {
    const start = storefront.indexOf("export const listServicesStorefront");
    const end = storefront.indexOf("export const listServicesPublic", start);
    const block = storefront.slice(start, end);
    expect(block).toContain("signImage(signer, row.image_path)");
    expect(block).not.toContain("signGallery(");
    expect(block).not.toContain("row.og_image_path");
  });
});
