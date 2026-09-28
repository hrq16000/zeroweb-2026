import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const hub = readFileSync("src/routes/cases.index.tsx", "utf8");
const detail = readFileSync("src/routes/cases.$slug.tsx", "utf8");
const sitemap = readFileSync("src/routes/sitemap-cases[.]xml.ts", "utf8");
const pages = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");
const rootSitemap = readFileSync("src/routes/sitemap[.]xml.ts", "utf8");

describe("governança de indexação dos cases", () => {
  test("cases sem evidência ficam noindex,follow", () => {
    expect(hub).toContain('name: "robots", content: "noindex,follow,max-image-preview:large"');
    expect(detail).toContain('name: "robots", content: "noindex,follow,max-image-preview:large"');
  });

  test("cases não verificados ficam fora dos sitemaps", () => {
    expect(sitemap).toContain("<urlset");
    expect(sitemap).not.toContain("cases.map");
    expect(pages).not.toContain('{ path: "/cases"');
    expect(rootSitemap).not.toContain('"sitemap-cases.xml"');
  });
});
