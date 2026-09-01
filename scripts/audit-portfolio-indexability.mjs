#!/usr/bin/env node
/**
 * Auditoria pública de indexabilidade de todos os clientes em /portfolio/:slug.
 *
 * Fonte de verdade: src/config/portfolio-clients.json.
 * Verifica status HTTP, canonical própria, robots, metadados sociais, ícone,
 * JSON-LD e presença no sitemap de portfólio. Gera relatório versionável em
 * seo-reports/portfolio-indexability-latest.json.
 *
 * Uso:
 *   node scripts/audit-portfolio-indexability.mjs [fetchBaseUrl] [canonicalBaseUrl]
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const FETCH_BASE = (process.argv[2] || "https://0web.com.br").replace(/\/$/, "");
const CANONICAL_BASE = (process.argv[3] || "https://0web.com.br").replace(/\/$/, "");
const CONCURRENCY = 5;
const USER_AGENT = "0web-portfolio-indexability-audit/1.0";

const clients = JSON.parse(await readFile("src/config/portfolio-clients.json", "utf8"));

function decodeEntities(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attribute(tag, name) {
  return decodeEntities(tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1] ?? "");
}

function findMeta(html, attributeName, attributeValue) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => attribute(candidate, attributeName) === attributeValue);
  return tag ? attribute(tag, "content") : "";
}

function findLink(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => attribute(candidate, "rel").split(/\s+/).includes(rel));
  return tag ? attribute(tag, "href") : "";
}

function findLinks(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return tags
    .filter((candidate) => attribute(candidate, "rel").split(/\s+/).includes(rel))
    .map((candidate) => attribute(candidate, "href"))
    .filter(Boolean);
}

function extractSitemapUrls(xml) {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => decodeEntities(match[1].trim()).replace(/\/$/, "")));
}

function hasValidJsonLd(html) {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) return false;
  return blocks.some(([, raw]) => {
    try {
      const parsed = JSON.parse(decodeEntities(raw.trim()));
      return Boolean(parsed && (parsed["@context"] || parsed["@type"] || parsed["@graph"]));
    } catch {
      return false;
    }
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xml,text/plain" },
  });
  return { response, body: await response.text() };
}

async function auditClient(client, sitemapUrls) {
  const url = `${FETCH_BASE}/portfolio/${client.slug}`;
  const expectedCanonical = `${CANONICAL_BASE}/portfolio/${client.slug}`;
  const expectedFetchUrl = url.replace(/\/$/, "");
  const failures = [];
  const warnings = [];

  try {
    const { response, body } = await fetchText(url);
    const canonical = findLink(body, "canonical").replace(/\/$/, "");
    const robots = findMeta(body, "name", "robots").toLowerCase();
    const title = decodeEntities(body.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
    const description = findMeta(body, "name", "description");
    const ogTitle = findMeta(body, "property", "og:title");
    const ogDescription = findMeta(body, "property", "og:description");
    const ogUrl = findMeta(body, "property", "og:url").replace(/\/$/, "");
    const ogImage = findMeta(body, "property", "og:image");
    const icons = findLinks(body, "icon");
    const globalIcons = new Set(["/favicon.ico", "/favicon.svg", "/favicon-32.png", "/favicon-192.png"]);
    const icon = [...icons].reverse().find((candidate) => !globalIcons.has(candidate)) ?? "";
    const schema = hasValidJsonLd(body);

    if (response.status !== 200) failures.push(`HTTP ${response.status}`);
    if (response.url.replace(/\/$/, "") !== expectedFetchUrl) failures.push(`redirecionou para ${response.url}`);
    if (canonical !== expectedCanonical) failures.push(`canonical inválida: ${canonical || "ausente"}`);
    if (!robots || robots.includes("noindex")) failures.push(`robots inválido: ${robots || "ausente"}`);
    if (!title) failures.push("title ausente");
    if (!description) failures.push("description ausente");
    if (!ogTitle || !ogDescription || !ogUrl || !ogImage) failures.push("Open Graph incompleto");
    if (ogUrl && ogUrl !== expectedCanonical) failures.push(`og:url inválida: ${ogUrl}`);
    if (ogImage && !/^https:\/\//.test(ogImage)) failures.push(`og:image não absoluta: ${ogImage}`);
    if (!icon) failures.push("ícone próprio ausente (somente ícones globais encontrados)");
    if (/Portfólio 0WEB/i.test(title)) failures.push("title herdou a marca 0WEB");
    if (!schema) failures.push("JSON-LD ausente ou inválido");
    if (!sitemapUrls.has(expectedCanonical)) failures.push("ausente do sitemap-portfolio.xml");
    if (title.length > 65) warnings.push(`title longo (${title.length})`);
    if (description.length > 165) warnings.push(`description longa (${description.length})`);

    return {
      slug: client.slug,
      url,
      status: response.status,
      title,
      canonical,
      robots,
      ogImage,
      icon,
      schema,
      sitemap: sitemapUrls.has(expectedCanonical),
      failures,
      warnings,
    };
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
    return { slug: client.slug, url, status: 0, failures, warnings };
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await mapper(items[index]);
      }
    }),
  );
  return results;
}

const sitemapUrl = `${FETCH_BASE}/sitemap-portfolio.xml`;
const { response: sitemapResponse, body: sitemapXml } = await fetchText(sitemapUrl);
if (!sitemapResponse.ok) throw new Error(`${sitemapUrl} retornou HTTP ${sitemapResponse.status}`);
const sitemapUrls = extractSitemapUrls(sitemapXml);
const rows = await mapWithConcurrency(clients, CONCURRENCY, (client) => auditClient(client, sitemapUrls));

const failures = rows.flatMap((row) => row.failures.map((failure) => `${row.slug}: ${failure}`));
const warnings = rows.flatMap((row) => row.warnings.map((warning) => `${row.slug}: ${warning}`));
const report = {
  generatedAt: new Date().toISOString(),
  fetchBaseUrl: FETCH_BASE,
  canonicalBaseUrl: CANONICAL_BASE,
  sitemapUrl,
  total: rows.length,
  passed: rows.filter((row) => row.failures.length === 0).length,
  failed: rows.filter((row) => row.failures.length > 0).length,
  warningCount: warnings.length,
  rows,
};

await mkdir("seo-reports", { recursive: true });
await writeFile("seo-reports/portfolio-indexability-latest.json", `${JSON.stringify(report, null, 2)}\n`);

for (const row of rows) {
  console.log(`${row.failures.length ? "[FAIL]" : "[ok]  "} /portfolio/${row.slug}${row.warnings.length ? ` · ${row.warnings.join("; ")}` : ""}`);
}
console.log(`\n[portfolio-indexability] ${report.passed}/${report.total} aprovados · ${warnings.length} aviso(s)`);
console.log("[portfolio-indexability] relatório → seo-reports/portfolio-indexability-latest.json");

if (failures.length) {
  console.error("\nFalhas:");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
