#!/usr/bin/env node
/**
 * Scope estrito da correção #429. Somente a remoção de cinco entradas
 * redundantes do sitemap-pages.xml é comprovadamente não visual.
 * Mudança não reconhecida mantém os gates Lighthouse e visual completos.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const SITEMAP_PAGE = "src/routes/sitemap-pages[.]xml.ts";
export const DUPLICATE_PATHS = [
  "/criacao-de-site-institucional",
  "/solicitar-orcamento",
  "/blog",
  "/solucoes",
  "/blog-skyscraper",
];
const ALLOWED_FILES = new Set([
  SITEMAP_PAGE,
  "tests/seo/sitemap-cross-ownership.test.js",
  "scripts/classify-sitemap-only-diff.mjs",
  "tests/seo/sitemap-only-scope.test.ts",
  ".github/workflows/portfolio-gates.yml",
  ".github/workflows/lighthouse.yml",
]);

// Correção isolada de fontes de dados de sitemaps XML: nenhuma página HTML,
// componente visual, CSS, funil ou origem de dados é modificada. SEO e smoke
// HTTP permanecem obrigatórios (o classifier não altera thresholds).
const RUNTIME_SITEMAP_FILES = new Set([
  "src/routes/sitemap-institucional[.]xml.ts",
  "src/routes/sitemap-marketplace[.]xml.ts",
  "src/lib/sitemap-publication-policy.ts",
  "scripts/check-sitemap-runtime-no-keys.mjs",
  "tests/seo/sitemap-runtime-no-keys.test.ts",
  "scripts/classify-sitemap-only-diff.mjs",
  ".github/workflows/portfolio-gates.yml",
]);

export function isSitemapRuntimeResilienceOnly(files) {
  return Array.isArray(files) &&
    files.includes("src/routes/sitemap-institucional[.]xml.ts") &&
    files.includes("src/routes/sitemap-marketplace[.]xml.ts") &&
    files.every((file) => RUNTIME_SITEMAP_FILES.has(file));
}

export function isStrictSitemapRemoval(files, before, after) {
  if (!Array.isArray(files) || !files.includes(SITEMAP_PAGE)) return false;
  if (files.some((file) => !ALLOWED_FILES.has(file))) return false;
  if (typeof before !== "string" || typeof after !== "string") return false;

  const lines = before.split("\n");
  const indices = new Set();
  for (const path of DUPLICATE_PATHS) {
    const matches = lines.flatMap((line, index) => {
      const trim = line.trim();
      const expected = '{ path: "' + path + '", changefreq: "';
      const valid = trim.startsWith(expected) &&
        /^\{ path: "[^"]+", changefreq: "(weekly|monthly)", priority: "[0-9.]+" \},$/.test(trim);
      return valid ? [index] : [];
    });
    if (matches.length !== 1) return false;
    indices.add(matches[0]);
  }
  return lines.filter((_, index) => !indices.has(index)).join("\n") === after;
}

const invoked = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (invoked) {
  const [base, head] = process.argv.slice(2);
  if (!base || !head || !/^[0-9a-f]{40}$/.test(base) || !/^[0-9a-f]{40}$/.test(head)) process.exit(0);
  const git = (...args) => execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
  try {
    const files = git("diff", "--name-only", base, head).split("\n").filter(Boolean);
    const before = git("show", base + ":" + SITEMAP_PAGE);
    const after = git("show", head + ":" + SITEMAP_PAGE);
    if (isSitemapRuntimeResilienceOnly(files) || isStrictSitemapRemoval(files, before, after)) {
      process.stdout.write("sitemap-only");
    }
  } catch {
    // Falha de inspeção => nenhum skip; CI completo continua.
  }
}
