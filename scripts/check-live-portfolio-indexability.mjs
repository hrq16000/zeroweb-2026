#!/usr/bin/env node
/**
 * Prova HTTP de indexabilidade no domínio oficial da 0WEB.
 *
 * node scripts/check-live-portfolio-indexability.mjs sao-francisco-pet-center
 * node scripts/check-live-portfolio-indexability.mjs --all
 *
 * O status "elegível para rastreamento" não equivale a "Google já indexou".
 */
import { readFileSync } from "node:fs";
const ORIGIN = "https://0web.com.br";
const SITEMAP = ORIGIN + "/sitemap-portfolio.xml";
const PORTFOLIO_ROOT = ORIGIN + "/portfolio/";
const args = process.argv.slice(2);
const ALL = args.includes("--all");
const slugs = args.filter((slug) => slug !== "--all");

async function get(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "0WEB-portfolio-indexability-healthcheck/1.0", "Cache-Control": "no-cache" },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      return { status: response.status, url: response.url, body: await response.text(), headers: response.headers };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error("Não foi possível consultar " + url + ": " + String(lastError));
}

function value(tag, name) {
  const pattern = new RegExp('\\b' + name + '\\s*=\\s*["\\x27]([^"\\x27]+)["\\x27]', "i");
  return tag.match(pattern)?.[1] ?? "";
}

function meta(html, field) {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (value(tag, "name").toLowerCase() === field) return value(tag, "content").toLowerCase();
  }
  return "";
}

function canonical(html) {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (value(tag, "rel").toLowerCase().split(/\s+/).includes("canonical")) {
      return value(tag, "href");
    }
  }
  return "";
}

function listedUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim().replace(/&amp;/g, "&"));
}

async function verify(slug, sitemapUrls) {
  const url = PORTFOLIO_ROOT + slug;
  const reasons = [];
  try {
    const page = await get(url);
    const robot = meta(page.body, "robots");
    const canon = canonical(page.body);
    const xRobot = page.headers.get("x-robots-tag") ?? "";
    const title = page.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";

    if (page.status !== 200) reasons.push("HTTP " + page.status);
    if (new URL(page.url).origin !== ORIGIN) reasons.push("host final diferente do domínio oficial: " + page.url);
    if (new URL(page.url).pathname.replace(/\/$/, "") !== "/portfolio/" + slug) reasons.push("redireciona para " + page.url);
    if (!/(^|[,;\s])index([,;\s]|$)/.test(robot) || /noindex/.test(robot)) reasons.push("meta robots não indexável: " + (robot || "ausente"));
    if (/(^|[,;\s])noindex([,;\s]|$)/i.test(xRobot)) reasons.push("X-Robots-Tag impede indexação");
    if (canon !== url) reasons.push("canonical incorreta: " + (canon || "ausente"));
    if (!sitemapUrls.has(url)) reasons.push("URL não incluída no sitemap oficial");
    if (!title || /404|página não encontrada|not found/i.test(title)) reasons.push("página não possui título válido");
    if (!/São Francisco Pet Center/i.test(page.body) && slug === "sao-francisco-pet-center") reasons.push("conteúdo do Pet Center não identificado");
    return { slug, url, status: page.status, robots: robot, canonical: canon, title, reasons };
  } catch (error) {
    return { slug, url, status: 0, reasons: [String(error)] };
  }
}

const sitemap = await get(SITEMAP);
if (sitemap.status !== 200 || !/<urlset[\s>]/i.test(sitemap.body)) {
  throw new Error("Sitemap oficial inválido: HTTP " + sitemap.status);
}
const sitemapUrls = new Set(listedUrls(sitemap.body));
const catalogSlugs = [...sitemapUrls]
  .filter((url) => url.startsWith(PORTFOLIO_ROOT))
  .map((url) => url.slice(PORTFOLIO_ROOT.length))
  .filter((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));
// A fonte editorial versionada é comparada com o sitemap real: uma URL que
// desaparece do mapa continua na auditoria e reprova a descoberta.
const catalog = JSON.parse(readFileSync(new URL("../src/config/portfolio-catalog.json", import.meta.url), "utf8"));
const publishedInCatalog = catalog
  .filter((item) => ["published", "approved"].includes(item.status) && item.live !== false)
  .map((item) => item.slug)
  .filter(Boolean);
const selected = ALL ? [...new Set([...publishedInCatalog, ...catalogSlugs])] : slugs;
if (!selected.length) throw new Error("Nenhum slug informado ou encontrado no sitemap");
if (new Set(selected).size !== selected.length) throw new Error("Lista de slugs duplicados");

const results = [];
let index = 0;
await Promise.all(Array.from({ length: Math.min(5, selected.length) }, async () => {
  while (index < selected.length) {
    const slug = selected[index++];
    results.push(await verify(slug, sitemapUrls));
  }
}));
results.sort((a, b) => a.slug.localeCompare(b.slug));
const failures = results.filter((r) => r.reasons.length);
for (const item of results) {
  console.log((item.reasons.length ? "[FAIL] " : "[OK]   ") + item.url + " — HTTP " + item.status +
    (item.reasons.length ? " — " + item.reasons.join(" | ") : " · meta index · canonical · sitemap"));
}
console.log("[0WEB] Portfólios indexáveis no domínio oficial: " + (results.length - failures.length) + "/" + results.length);
console.log("[0WEB] Status de indexação Google não verificado por esta checagem HTTP.");
if (failures.length) process.exitCode = 1;
