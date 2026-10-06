import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const seo = readFileSync("src/lib/portfolio-seo.ts", "utf8");
const index = readFileSync("src/routes/portfolio.index.tsx", "utf8");

describe("schema global do portfólio", () => {
  test("usa a mesma Organization global com logo", () => {
    expect(seo).toContain('"@id": `${SITE_URL}/#org`');
    expect(seo).toContain('logo: `${SITE_URL}/favicon.ico`');
    expect(seo).toContain('areaServed: { "@type": "Country", name: "Brasil" }');
    expect(seo).not.toContain('#organization');
  });

  test("serviços apontam para a Organization canônica", () => {
    expect(seo).toContain('provider: { "@id": `${SITE_URL}/#org` }');
  });

  test("hub /portfolio não injeta LocalBusiness da 0WEB", () => {
    expect(index).not.toContain("localBusinessNode()");
    expect(index).not.toContain("localBusinessNode,");
    expect(index).toContain('isPartOf: { "@id": `${SITE_URL}/#org` }');
  });
});
