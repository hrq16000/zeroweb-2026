import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const route = readFileSync("src/routes/servicos.$slug.tsx", "utf8");

describe("schema Product dos serviços", () => {
  test("Product só é emitido quando há imagem específica válida", () => {
    expect(route).toContain("const productImage = ogImage !== DEFAULT_OG_IMAGE ? ogImage : null");
    expect(route).toContain('loaderData.price > 0 && productImage');
    expect(route).toContain("image: [productImage]");
  });

  test("Service continua independente do Product", () => {
    expect(route).toContain('"@type": "Service"');
    expect(route).toContain("offers: buildSingleOffer(loaderData.price, url)");
  });


  test("Organization extra da própria 0WEB recebe logo oficial quando ausente", () => {
    expect(route).toContain('nodeType === "Organization"');
    expect(route).toContain('nodeName.trim().toUpperCase() === "0WEB"');
    expect(route).toContain('logo: (node as { logo?: unknown }).logo ?? `${ORIGIN}/0web-logo.png`');
  });
});
