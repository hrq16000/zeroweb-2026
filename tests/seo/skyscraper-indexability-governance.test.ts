import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const hub = readFileSync("src/routes/blog-skyscraper.index.tsx", "utf8");
const detail = readFileSync("src/routes/blog-skyscraper.$slug.tsx", "utf8");
const sitemap = readFileSync("src/routes/sitemap-skyscraper[.]xml.ts", "utf8");
const pages = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");
const rootSitemap = readFileSync("src/routes/sitemap[.]xml.ts", "utf8");

describe("governança de indexação do skyscraper", () => {
  test("blueprints ficam noindex,follow", () => {
    expect(hub).toContain('name: "robots", content: "noindex, follow"');
    expect(detail).toContain('name: "robots", content: "noindex, follow, max-image-preview:large"');
  });

  test("não publica datas sintéticas", () => {
    expect(detail).not.toContain("new Date().toISOString()");
    expect(detail).not.toContain('"@type": "Article"');
    expect(detail).toContain('"@type": "WebPage"');
  });

  test("blueprints ficam fora dos sitemaps canônicos", () => {
    expect(sitemap).toContain("<urlset");
    expect(sitemap).not.toContain("SKYSCRAPER_CALENDAR");
    expect(pages).not.toContain('{ path: "/blog-skyscraper"');
    expect(pages).not.toContain('{ path: "/rss.xml"');
    expect(rootSitemap).not.toContain('"sitemap-skyscraper.xml"');
  });
});
