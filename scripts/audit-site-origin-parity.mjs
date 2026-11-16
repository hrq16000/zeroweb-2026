#!/usr/bin/env node
/**
 * Observa divergência entre o domínio público e o deploy Vercel da 0WEB.
 * Não muda DNS, não exige chaves e NÃO estima indexação real do Google.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifySitemapInventoryDelta } from "./sitemap-inventory-diff-policy.mjs";

const OFFICIAL = "https://0web.com.br";
const VERCEL = "https://zeroweb-2026.vercel.app";
const canonical = "https://0web.com.br";

const urlsOf = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());

export function compareSiteInventories(official, vercel, portfolioSlugs) {
  const delta = classifySitemapInventoryDelta(official.urls, vercel.urls);
  const portfolioPaths = portfolioSlugs.map((slug) => "/portfolio/" + slug);
  const pathSet = (urls) => new Set(urls.flatMap((u) => {
    try { return [new URL(u).pathname]; } catch { return []; }
  }));
  const officialPaths = pathSet(official.urls);
  const vercelPaths = pathSet(vercel.urls);
  const portfolioMissingOfficial = portfolioPaths.filter((p) => !officialPaths.has(p));
  const portfolioMissingVercel = portfolioPaths.filter((p) => !vercelPaths.has(p));
  const staticLoss = delta.missingProtected;
  const issues = [
    ...official.problems.map((p) => "domínio público: " + p),
    ...vercel.problems.map((p) => "Vercel: " + p),
    ...portfolioMissingOfficial.map((p) => "portfólio ausente do domínio público: " + p),
    ...portfolioMissingVercel.map((p) => "portfólio ausente da Vercel: " + p),
    ...delta.hardProblems,
  ];
  return {
    official: { base: official.base, entries: official.urls.length, children: official.children, problems: official.problems },
    vercel: { base: vercel.base, entries: vercel.urls.length, children: vercel.children, problems: vercel.problems },
    portfolioExpected: portfolioSlugs.length,
    portfolioMissingOfficial,
    portfolioMissingVercel,
    missingStaticInVercel: staticLoss,
    dynamicCapitals: delta.dynamicLocal,
    dynamicCategories: delta.dynamicCategories,
    disappeared: delta.disappeared,
    addedInVercel: delta.added,
    issues: [...new Set(issues)],
    notes: [
      "Divergência entre provedores não prova retirada do conteúdo no domínio público.",
      "Sitemap publicado não é evidência de URL indexada pelo Google.",
      "Não modificar DNS, credenciais ou flags index,follow sem comprovação.",
    ],
  };
}

async function fetchXml(origin, route, doFetch) {
  const url = origin + route;
  const res = await doFetch(url, { signal: AbortSignal.timeout(15000), redirect: "follow" });
  const xml = await res.text();
  if (res.status !== 200 || !/xml/i.test(res.headers.get("content-type") ?? "")) {
    throw new Error(route + " HTTP " + res.status + " ou content-type não XML");
  }
  return xml;
}

export async function fetchInventory(origin, doFetch = fetch) {
  const out = { base: origin, children: [], urls: [], problems: [] };
  try {
    const sitemap = await fetchXml(origin, "/sitemap.xml", doFetch);
    if (!/<sitemapindex\b/i.test(sitemap)) throw new Error("sitemap.xml sem sitemapindex");
    const children = urlsOf(sitemap);
    if (!children.length) throw new Error("sitemap.xml sem sitemaps filhos");
    for (const loc of children) {
      try {
        const parsed = new URL(loc);
        if (parsed.origin !== canonical) throw new Error("host declarado não canônico: " + loc);
        out.children.push(parsed.pathname);
      } catch (error) {
        out.problems.push("URL de sitemap filho inválida: " + error.message);
      }
    }
    const results = await Promise.all(out.children.map(async (child) => {
      try {
        const xml = await fetchXml(origin, child, doFetch);
        if (!/<urlset\b/i.test(xml)) throw new Error("sitemap filho sem urlset");
        return { child, locs: urlsOf(xml) };
      } catch (error) {
        return { child, error: String(error.message) };
      }
    }));
    for (const item of results) {
      if (item.error) out.problems.push(item.child + ": " + item.error);
      else out.urls.push(...item.locs);
    }
  } catch (error) {
    out.problems.push(String(error.message));
  }
  return out;
}

export async function runSiteOriginAudit({
  officialBase = OFFICIAL,
  vercelBase = VERCEL,
  portfolioSlugs,
  doFetch = fetch,
} = {}) {
  if (!Array.isArray(portfolioSlugs)) throw new Error("registry de portfólios obrigatório");
  const [official, vercel] = await Promise.all([
    fetchInventory(officialBase, doFetch),
    fetchInventory(vercelBase, doFetch),
  ]);
  return { generatedAt: new Date().toISOString(), ...compareSiteInventories(official, vercel, portfolioSlugs) };
}

function markdown(report) {
  return [
    "# Paridade de publicação — 0WEB",
    "",
    "Gerado em: " + report.generatedAt,
    "",
    "| Indicador | 0web.com.br | Vercel |",
    "| --- | ---: | ---: |",
    "| URLs no sitemap | " + report.official.entries + " | " + report.vercel.entries + " |",
    "| Portfólios esperados | " + report.portfolioExpected + " | " + report.portfolioExpected + " |",
    "| Portfólios ausentes | " + report.portfolioMissingOfficial.length + " | " + report.portfolioMissingVercel.length + " |",
    "| Capitais dinâmicas não comparáveis no preview | — | " + report.dynamicCapitals.length + " |",
    "| Categorias dinâmicas não comparáveis no preview | — | " + report.dynamicCategories.length + " |",
    "| URLs estáticas divergentes | — | " + report.missingStaticInVercel.length + " |",
    "",
    "## Pendências observadas",
    "",
    ...(report.issues.length ? report.issues.map((x) => "- " + x) : ["Nenhuma regressão técnica observada."]),
    "",
    "## Publicações dinâmicas que exigem evidência",
    "",
    ...[...report.dynamicCapitals, ...report.dynamicCategories].map((x) => "- " + x),
    "",
    ...report.notes.map((x) => "> " + x),
    "",
  ].join("\n");
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (invoked) {
  const registry = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));
  const result = await runSiteOriginAudit({ portfolioSlugs: registry.map((c) => c.slug) });
  fs.mkdirSync("seo-reports", { recursive: true });
  fs.writeFileSync("seo-reports/seo-host-parity-latest.json", JSON.stringify(result, null, 2) + "\n");
  const md = markdown(result);
  fs.writeFileSync("seo-reports/seo-host-parity-latest.md", md);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
  console.log("[host-parity] dominio " + result.official.entries + " · Vercel " +
    result.vercel.entries + " · portfólios ausentes " +
    (result.portfolioMissingOfficial.length + result.portfolioMissingVercel.length) +
    " · diferenças dinâmicas " +
    (result.dynamicCapitals.length + result.dynamicCategories.length) +
    " · pendências " + result.issues.length);
  for (const issue of result.issues) console.warn("::warning::[host-parity] " + issue);
  if (process.env.PARITY_STRICT === "1" && result.issues.length) process.exitCode = 1;
}
