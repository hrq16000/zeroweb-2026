import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";

// Cada URL pública permanece no seu sitemap especializado; o pages.xml
// é reservado a URLs não cobertas pelos mapas temáticos.
const pages = readFileSync(new URL("../../src/routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const sitemapOwners = [
  ["/criacao-de-site-institucional", "sitemap-institucional[.]xml.ts"],
  ["/solicitar-orcamento", "sitemap-marketplace[.]xml.ts"],
  ["/blog", "sitemap-blog[.]xml.ts"],
  ["/solucoes", "sitemap-solutions[.]xml.ts"],
  ["/blog-skyscraper", "sitemap-skyscraper[.]xml.ts"],
];

describe("Sitemap principal sem duplicidades entre mapas temáticos", () => {
  for (const [path, ownerFile] of sitemapOwners) {
    it(`mantém ${path} apenas no seu sitemap especializado`, () => {
      expect(pages).not.toContain(`path: "${path}"`);
      const owner = readFileSync(new URL(`../../src/routes/${ownerFile}`, import.meta.url), "utf8");
      expect(owner).toContain(path);
    });
  }
});
