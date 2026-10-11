import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  DUPLICATE_PATHS, SITEMAP_PAGE, isStrictSitemapRemoval,
} from "../../scripts/classify-sitemap-only-diff.mjs";

const after = readFileSync("src/routes/sitemap-pages[.]xml.ts", "utf8").trimEnd();
const removed = [
  '          { path: "/criacao-de-site-institucional", changefreq: "weekly", priority: "0.95" },',
  '          { path: "/solicitar-orcamento", changefreq: "monthly", priority: "0.85" },',
  '          { path: "/blog", changefreq: "weekly", priority: "0.8" },',
  '          { path: "/solucoes", changefreq: "weekly", priority: "0.85" },',
  '          { path: "/blog-skyscraper", changefreq: "weekly", priority: "0.85" },',
];
const before = after.replace(
  '          { path: "/", changefreq: "weekly", priority: "1.0" },',
  '          { path: "/", changefreq: "weekly", priority: "1.0" },\n' + removed.join("\n"),
);
const files = [
  SITEMAP_PAGE,
  "tests/seo/sitemap-cross-ownership.test.js",
  "tests/seo/sitemap-only-scope.test.ts",
  "scripts/classify-sitemap-only-diff.mjs",
  ".github/workflows/portfolio-gates.yml",
  ".github/workflows/lighthouse.yml",
];

describe("Gate de escopo XML sem bypass visual", () => {
  test("aceita exatamente as cinco remoções declarativas", () => {
    expect(DUPLICATE_PATHS).toHaveLength(5);
    expect(isStrictSitemapRemoval(files, before, after)).toBe(true);
  });
  test("rejeita mudança adicional no gerador de sitemap", () => {
    expect(isStrictSitemapRemoval(files, before, after.replace("renderSitemap", "renderOther"))).toBe(false);
  });
  test("rejeita qualquer componente/rota visual no diff", () => {
    expect(isStrictSitemapRemoval([...files, "src/routes/portfolio.$slug.tsx"], before, after)).toBe(false);
    expect(isStrictSitemapRemoval([...files, "src/components/portfolio/PortfolioStandardShell.tsx"], before, after)).toBe(false);
  });
  test("rejeita mudanças em fluxos protegidos e escopo incompleto", () => {
    expect(isStrictSitemapRemoval([...files, "src/lib/whatsapp-redirect.ts"], before, after)).toBe(false);
    expect(isStrictSitemapRemoval(files.filter((file) => file !== SITEMAP_PAGE), before, after)).toBe(false);
  });
  test("rejeita qualquer sitemap sem uma das cinco linhas exigidas", () => {
    expect(isStrictSitemapRemoval(files, before.replace(removed[0] + "\n", ""), after)).toBe(false);
  });
  test("gatilhos de escopo exigidos nos dois workflows", () => {
    for (const path of [".github/workflows/lighthouse.yml", ".github/workflows/portfolio-gates.yml"]) {
      const workflow = readFileSync(path, "utf8");
      expect(workflow).toContain('scripts/classify-sitemap-only-diff.mjs "$BASE" "$HEAD"');
    }
  });
});
