#!/usr/bin/env node
/**
 * Gate de descoberta/indexação dos portfolios.
 * Cruza as duas fontes estruturais locais usadas pelo portal e o sitemap
 * publicado. Não promove páginas fracas e não inventa dados de cliente.
 *
 * Uso:
 *   node scripts/audit-portfolio-discovery-consistency.mjs [baseUrl]
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const BASE = (process.argv[2] || "https://0web.com.br").replace(/\/$/, "");
const catalog = JSON.parse(await readFile("src/config/portfolio-catalog.json", "utf8"));
const clients = JSON.parse(await readFile("src/config/portfolio-clients.json", "utf8"));
const PUBLIC_STATUSES = new Set(["published", "approved"]);
const failures = [];

const published = catalog.filter((item) => PUBLIC_STATUSES.has(item.status ?? "") && item.live !== false);
const publishedSlugs = new Set(published.map((item) => item.slug).filter(Boolean));
const clientSlugs = new Set(clients.map((item) => item.slug).filter(Boolean));

function duplicates(values) {
  const seen = new Set();
  const dupes = new Set();
  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes].sort();
}

for (const slug of duplicates(published.map((item) => item.slug))) failures.push(`catálogo: slug publicado duplicado ${slug}`);
for (const slug of duplicates(clients.map((item) => item.slug))) failures.push(`clientes: slug duplicado ${slug}`);

const missingClient = [...publishedSlugs].filter((slug) => !clientSlugs.has(slug)).sort();
const clientOutsidePublished = [...clientSlugs].filter((slug) => !publishedSlugs.has(slug)).sort();
for (const slug of missingClient) failures.push(`${slug}: publicado no catálogo mas ausente de portfolio-clients.json`);

let sitemapUrls = new Set();
let sitemapError = "";
try {
  const response = await fetch(`${BASE}/sitemap-portfolio.xml`, {
    headers: { "user-agent": "0web-portfolio-discovery-audit/1.0", accept: "application/xml,text/xml,text/plain" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  sitemapUrls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim().replace(/\/$/, "")));
} catch (error) {
  sitemapError = error instanceof Error ? error.message : String(error);
  failures.push(`sitemap-portfolio.xml indisponível: ${sitemapError}`);
}

const expectedUrls = new Set([...publishedSlugs].map((slug) => `${BASE}/portfolio/${slug}`));
const missingSitemap = [...expectedUrls].filter((url) => !sitemapUrls.has(url)).sort();
const portfolioSitemapUrls = [...sitemapUrls].filter((url) => url.startsWith(`${BASE}/portfolio/`));
const unexpectedSitemap = portfolioSitemapUrls.filter((url) => !expectedUrls.has(url)).sort();
for (const url of missingSitemap) failures.push(`${url}: publicado mas ausente do sitemap de portfolio`);
for (const url of unexpectedSitemap) failures.push(`${url}: sitemap aponta para slug fora do catálogo publicado`);

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE,
  publishedCatalogCount: publishedSlugs.size,
  clientRegistryCount: clientSlugs.size,
  sitemapPortfolioCount: portfolioSitemapUrls.length,
  missingClient,
  clientOutsidePublished,
  missingSitemap,
  unexpectedSitemap,
  sitemapError: sitemapError || null,
};
await mkdir("seo-reports", { recursive: true });
await writeFile("seo-reports/portfolio-discovery-consistency-latest.json", `${JSON.stringify(report, null, 2)}\n`);

console.log(`[portfolio-discovery] catálogo ${publishedSlugs.size} · registry ${clientSlugs.size} · sitemap ${portfolioSitemapUrls.length}`);
console.log(`[portfolio-discovery] faltando registry ${missingClient.length} · faltando sitemap ${missingSitemap.length} · sitemap inesperado ${unexpectedSitemap.length}`);
console.log(`[portfolio-discovery] clientes fora do conjunto publicado: ${clientOutsidePublished.length} (informativo)`);
if (failures.length) {
  console.error("[portfolio-discovery] FAIL");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log("[portfolio-discovery] OK — catálogo publicado, registry e sitemap estão coerentes.");
