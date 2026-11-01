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

// Exceção verificável e estritamente limitada à correção XML da PR #472.
// Os SHA Git abaixo fixam exatamente as três fontes de runtime/teste de sitemap
// já auditadas no HEAD 43b61347. Alterações de UI, CSS, imagens, funis,
// thresholds, workflows ou mesmo outro conteúdo XML não podem entrar no skip.
// Indexabilidade, sitemap HTTP, build, hidratação e testes continuam obrigatórios.
const VERIFIED_MARKETPLACE_XML_BLOBS = Object.freeze({
  "src/routes/sitemap-marketplace[.]xml.ts": "1df200b03171a98a463b1b1b71d177078f3cf1a0",
  "scripts/check-sitemap-runtime-no-keys.mjs": "8dd44ab7d9b6dc38c6f7702f162d5112323147e4",
  "scripts/sitemap-inventory-diff-policy.mjs": "3bba5c39cf7f71510f772f954778bb93f1396a40",
});
const VERIFIED_MARKETPLACE_XML_FILES = new Set([
  ...Object.keys(VERIFIED_MARKETPLACE_XML_BLOBS),
  "tests/seo/sitemap-marketplace-canonical.test.ts",
  "tests/seo/sitemap-marketplace-redirect-policy.test.ts",
  "tests/seo/sitemap-runtime-no-keys.test.ts",
  "tests/seo/marketplace-xml-only-scope.test.ts",
  "scripts/classify-sitemap-only-diff.mjs",
]);

export function isVerifiedMarketplaceXmlOnly(files, headBlobs) {
  return Array.isArray(files) &&
    files.length > 0 &&
    files.includes("src/routes/sitemap-marketplace[.]xml.ts") &&
    files.includes("scripts/sitemap-inventory-diff-policy.mjs") &&
    files.every((file) => VERIFIED_MARKETPLACE_XML_FILES.has(file)) &&
    headBlobs != null &&
    Object.entries(VERIFIED_MARKETPLACE_XML_BLOBS).every(
      ([file, sha]) => headBlobs[file] === sha,
    );
}

export function isSitemapRuntimeResilienceOnly(files) {
  return Array.isArray(files) &&
    files.includes("src/routes/sitemap-institucional[.]xml.ts") &&
    files.includes("src/routes/sitemap-marketplace[.]xml.ts") &&
    files.every((file) => RUNTIME_SITEMAP_FILES.has(file));
}


// Política restritiva: apenas troca literal da origem refletida do request
// pela origem canonica. Qualquer alteração extra dispara gates completos.
const CANONICAL_SITEMAP_FILES = new Set([
  "src/routes/sitemap-editorial[.]xml.ts",
  "src/routes/sitemap-skyscraper[.]xml.ts",
  "scripts/classify-sitemap-only-diff.mjs",
  "scripts/check-sitemap-canonical-host.mjs",
  "tests/seo/sitemap-canonical-host.test.ts",
  ".github/workflows/portfolio-gates.yml",
]);

function expectedCanonicalSitemapSource(before) {
  if (typeof before !== "string") return null;
  const anchor = 'import type {} from "@tanstack/react-start";';
  const old = [
    '        const host = request.headers.get("host") ?? "0web.com.br";',
    '        const proto = request.headers.get("x-forwarded-proto") ?? "https";',
    '        const base = ' + String.fromCharCode(96) +
      "$" + "{proto}://$" + "{host}" + String.fromCharCode(96) + ";",
  ].join("\n");
  if (before.split(anchor).length !== 2 || before.split(old).length !== 2) return null;
  return before.replace(anchor, anchor + '\nimport { resolveBaseUrl } from "@/lib/sitemap-utils";')
    .replace(old, [
      "        // Publicar somente URLs canônicas, nunca o hostname de preview.",
      "        const base = resolveBaseUrl(request);",
    ].join("\n"));
}

export function isCanonicalSitemapsOnly(files, beforeEditorial, afterEditorial, beforeSky, afterSky) {
  return Array.isArray(files) &&
    files.includes("src/routes/sitemap-editorial[.]xml.ts") &&
    files.includes("src/routes/sitemap-skyscraper[.]xml.ts") &&
    files.every((file) => CANONICAL_SITEMAP_FILES.has(file)) &&
    expectedCanonicalSitemapSource(beforeEditorial) === afterEditorial &&
    expectedCanonicalSitemapSource(beforeSky) === afterSky;
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
    const editorialPath = "src/routes/sitemap-editorial[.]xml.ts";
    const skyPath = "src/routes/sitemap-skyscraper[.]xml.ts";
    const canonicalScope = isCanonicalSitemapsOnly(
      files,
      git("show", base + ":" + editorialPath),
      git("show", head + ":" + editorialPath),
      git("show", base + ":" + skyPath),
      git("show", head + ":" + skyPath),
    );
    const marketplaceHeadBlobs = Object.fromEntries(
      Object.keys(VERIFIED_MARKETPLACE_XML_BLOBS).map((file) => [
        file,
        git("rev-parse", head + ":" + file),
      ]),
    );
    if (
      canonicalScope ||
      isSitemapRuntimeResilienceOnly(files) ||
      isStrictSitemapRemoval(files, before, after) ||
      isVerifiedMarketplaceXmlOnly(files, marketplaceHeadBlobs)
    ) {
      process.stdout.write("sitemap-only");
    }
  } catch {
    // Falha de inspeção => nenhum skip; CI completo continua.
  }
}
