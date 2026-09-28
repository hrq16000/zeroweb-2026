import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const home2 = readFileSync("src/routes/home2.tsx", "utf8");
const home3 = readFileSync("src/routes/home3.tsx", "utf8");
const home3Component = readFileSync("src/components/site/Home3MixExperience.tsx", "utf8");
const sitemap = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8");

describe("Home2 e Home3 como landing pages indexáveis", () => {
  test("ambas usam canonical própria e index,follow", () => {
    expect(home2).toContain('href: "https://0web.com.br/home2"');
    expect(home3).toContain('href: "https://0web.com.br/home3"');
    expect(home2).toContain("index,follow");
    expect(home3).toContain("index,follow");
    expect(home2).not.toContain("noindex");
    expect(home3).not.toContain("noindex");
  });

  test("Home3 deixou de ser cópia da Home2", () => {
    expect(home3Component).not.toContain("Home2PersonalityExperience");
    expect(home3Component).toContain("Landing pages autorais");
    expect(home3Component).toContain("Perguntas frequentes sobre landing pages");
  });

  test("as intenções SEO são diferentes", () => {
    expect(home2).toContain("Agência Digital Integrada");
    expect(home3).toContain("Landing Pages Autorais");
  });

  test("as duas LPs entram no sitemap", () => {
    expect(sitemap).toContain('{ path: "/home2"');
    expect(sitemap).toContain('{ path: "/home3"');
  });
});
