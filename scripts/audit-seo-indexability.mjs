#!/usr/bin/env node
/**
 * Auditoria de indexabilidade (robots, sitemap, canonicals, noindex/nofollow,
 * redirects e schema) com snapshot comparável antes/depois do build.
 *
 * Uso:
 *   node scripts/audit-seo-indexability.mjs --label=before [baseUrl]
 *   node scripts/audit-seo-indexability.mjs --label=after  [baseUrl]
 *
 * Saídas:
 *   seo-reports/indexability-<label>.json
 *   seo-reports/indexability-diff.md   (quando existem before e after)
 *
 * Este script NÃO inventa dados: tudo é observado por HTTP na URL informada.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const label = (args.find((a) => a.startsWith("--label=")) || "--label=after").split("=")[1];
const BASE = (args.find((a) => !a.startsWith("--")) || process.env.BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const DIR = "seo-reports";
const OUT = path.join(DIR, `indexability-${label}.json`);

const clients = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));
const routes = ["/", "/portfolio", "/servicos", "/blog", ...clients.map((c) => `/portfolio/${c.slug}`)];

const meta = (html, attr, value) => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${value}["']`, "i");
  return (html.match(re) || html.match(alt) || [])[1] ?? null;
};

const canonicalOf = (html) => {
  const tag = (html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i) || [])[0];
  return tag ? (tag.match(/href=["']([^"']+)["']/i) || [])[1] ?? null : null;
};

const schemasOf = (html) => {
  const out = [];
  for (const block of html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []) {
    const json = block.replace(/^[\s\S]*?>/, "").replace(/<\/script>$/i, "");
    try {
      const parsed = JSON.parse(json);
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        const type = node?.["@type"];
        if (Array.isArray(type)) out.push(...type);
        else if (type) out.push(type);
        for (const g of node?.["@graph"] ?? []) if (g?.["@type"]) out.push(g["@type"]);
      }
    } catch {
      out.push("__invalid_json_ld__");
    }
  }
  return [...new Set(out)].sort();
};

async function auditRoute(route) {
  const entry = { route, status: null, redirectedTo: null, canonical: null, robots: null, noindex: false, nofollow: false, schemas: [], problems: [] };
  try {
    const res = await fetch(`${BASE}${route}`, { redirect: "follow" });
    entry.status = res.status;
    const finalPath = new URL(res.url).pathname;
    if (finalPath !== route) entry.redirectedTo = finalPath;
    const html = await res.text();
    entry.canonical = canonicalOf(html);
    entry.robots = meta(html, "name", "robots");
    entry.noindex = /noindex/i.test(entry.robots ?? "");
    entry.nofollow = /nofollow/i.test(entry.robots ?? "");
    entry.schemas = schemasOf(html);
    if (res.status !== 200) entry.problems.push(`status ${res.status}`);
    if (!entry.canonical) entry.problems.push("sem canonical");
    if (entry.noindex) entry.problems.push("noindex");
    if (entry.schemas.includes("__invalid_json_ld__")) entry.problems.push("JSON-LD inválido");
  } catch (error) {
    entry.problems.push(`erro: ${error.message}`);
  }
  return entry;
}

async function auditRobots() {
  const out = { status: null, disallow: [], sitemaps: [], problems: [] };
  try {
    const res = await fetch(`${BASE}/robots.txt`);
    out.status = res.status;
    const text = await res.text();
    out.disallow = [...text.matchAll(/^\s*Disallow:\s*(\S+)/gim)].map((m) => m[1]);
    out.sitemaps = [...text.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    if (out.disallow.includes("/")) out.problems.push("Disallow: / bloqueia o site inteiro");
    if (!out.sitemaps.length) out.problems.push("robots.txt sem Sitemap:");
  } catch (error) {
    out.problems.push(`erro: ${error.message}`);
  }
  return out;
}

async function auditSitemap() {
  const out = { status: null, urls: [], children: [], problems: [] };
  try {
    const res = await fetch(`${BASE}/sitemap.xml`);
    out.status = res.status;
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
    if (/<sitemapindex/i.test(xml)) {
      out.children = locs;
      for (const child of locs) {
        try {
          const sub = await fetch(child);
          const subXml = await sub.text();
          out.urls.push(...[...subXml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim()));
        } catch (error) {
          out.problems.push(`sitemap filho falhou (${child}): ${error.message}`);
        }
      }
    } else {
      out.urls = locs;
    }
    const dupes = out.urls.filter((u, i) => out.urls.indexOf(u) !== i);
    if (dupes.length) out.problems.push(`URLs duplicadas no sitemap: ${[...new Set(dupes)].length}`);
    if (!out.urls.length) out.problems.push("sitemap sem URLs");
  } catch (error) {
    out.problems.push(`erro: ${error.message}`);
  }
  return out;
}

const snapshot = {
  label,
  base: BASE,
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? null,
  robots: await auditRobots(),
  sitemap: await auditSitemap(),
  routes: [],
};
for (const route of routes) snapshot.routes.push(await auditRoute(route));

// Rotas públicas ausentes do sitemap.
const sitemapPaths = new Set(snapshot.sitemap.urls.map((u) => {
  try { return new URL(u).pathname.replace(/\/$/, "") || "/"; } catch { return u; }
}));
for (const route of snapshot.routes) {
  if (route.noindex || route.status !== 200) continue;
  const key = route.route.replace(/\/$/, "") || "/";
  if (!sitemapPaths.has(key)) route.problems.push("ausente do sitemap");
}

fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);

const totalProblems =
  snapshot.robots.problems.length +
  snapshot.sitemap.problems.length +
  snapshot.routes.reduce((n, r) => n + r.problems.length, 0);
console.log(`[indexability:${label}] ${snapshot.routes.length} rota(s), ${snapshot.sitemap.urls.length} URL(s) no sitemap, ${totalProblems} problema(s)`);
console.log(`[indexability:${label}] snapshot → ${OUT}`);

// ---------- diff antes/depois ----------
const beforePath = path.join(DIR, "indexability-before.json");
const afterPath = path.join(DIR, "indexability-after.json");
if (fs.existsSync(beforePath) && fs.existsSync(afterPath)) {
  const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
  const after = JSON.parse(fs.readFileSync(afterPath, "utf8"));
  const byRoute = (snap) => Object.fromEntries(snap.routes.map((r) => [r.route, r]));
  const b = byRoute(before);
  const a = byRoute(after);
  const lines = [
    "# Auditoria de indexabilidade — antes vs. depois",
    "",
    `- Antes: \`${before.base}\` · ${before.generatedAt}`,
    `- Depois: \`${after.base}\` · ${after.generatedAt}`,
    `- Sitemap: ${before.sitemap.urls.length} → ${after.sitemap.urls.length} URL(s)`,
    `- robots.txt Disallow: ${before.robots.disallow.length} → ${after.robots.disallow.length}`,
    "",
    "| Rota | Status | Canonical | robots | Schemas | Regressão |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  let regressions = 0;
  for (const route of [...new Set([...Object.keys(b), ...Object.keys(a)])].sort()) {
    const x = b[route];
    const y = a[route];
    const chg = (from, to) => (String(from ?? "—") === String(to ?? "—") ? String(to ?? "—") : `${from ?? "—"} → **${to ?? "—"}**`);
    const regression =
      (x && y && x.status === 200 && y.status !== 200) ||
      (x && y && x.canonical && !y.canonical) ||
      (x && y && !x.noindex && y.noindex) ||
      (x && y && x.schemas.length > y.schemas.length) ||
      (x && !y);
    if (regression) regressions++;
    lines.push(
      `| \`${route}\` | ${chg(x?.status, y?.status)} | ${chg(x?.canonical, y?.canonical)} | ${chg(x?.robots, y?.robots)} | ${chg(x?.schemas.length, y?.schemas.length)} | ${regression ? "⚠️ sim" : "não"} |`,
    );
  }
  lines.push("", regressions ? `**${regressions} regressão(ões) detectada(s).**` : "Nenhuma regressão de indexabilidade detectada.");
  const diffPath = path.join(DIR, "indexability-diff.md");
  fs.writeFileSync(diffPath, `${lines.join("\n")}\n`);
  console.log(`[indexability] diff → ${diffPath} (${regressions} regressão(ões))`);
  if (regressions && process.env.INDEXABILITY_STRICT === "1") process.exit(1);
}
