import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const hub = readFileSync("src/routes/cases.index.tsx", "utf8");
const detail = readFileSync("src/routes/cases.$slug.tsx", "utf8");
const casesSitemap = readFileSync("src/routes/sitemap-cases[.]xml.ts", "utf8");
const pagesSitemap = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");
const rootSitemap = readFileSync("src/routes/sitemap[.]xml.ts", "utf8");

describe("governança de evidência dos cases", () => {
  test("cases sem prova ficam noindex,follow", () => {
    expect(hub).toContain('name: "robots", content: "noindex,follow,max-image-preview:large"');
    expect(detail).toContain('name: "robots", content: "noindex,follow,max-image-preview:large"');
  });

  test("não expõe métricas e depoimentos como prova enquanto estão sem evidência", () => {
    expect(detail).not.toContain("c.metrics.map");
    expect(detail).not.toContain("c.testimonial.quote");
    expect(detail).not.toContain("c.results");
    expect(hub).toContain("Critério de publicação dos cases");
  });

  test("cases sem evidência ficam fora dos sitemaps canônicos", () => {
    expect(casesSitemap).not.toContain("cases.map");
    expect(pagesSitemap).not.toContain('{ path: "/cases"');
    expect(rootSitemap).not.toContain('"sitemap-cases.xml"');
  });
});
