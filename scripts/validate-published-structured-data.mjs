#!/usr/bin/env node
/**
 * Valida dados estruturados e metadados das páginas publicadas de /portfolio.
 * Enumera via sitemap-portfolio.xml. Sai com código 1 se alguma página tiver
 * erro que possa impedir o reconhecimento pelo Google (alerta no CI).
 *
 * Uso: node scripts/validate-published-structured-data.mjs [baseUrl] [--only=slug1,slug2]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { checkPage } from "./lib/structured-data-check.mjs";

const BASE = (process.argv.find((a) => a.startsWith("http")) || process.env.BASE_URL || "https://0web.com.br").replace(/\/$/, "");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",").filter(Boolean);
const UA = { headers: { "user-agent": "0web-structured-data-check/1.0" } };

async function urls() {
  if (only?.length) return only.map((s) => `${BASE}/portfolio/${s}`);
  const xml = await (await fetch(`${BASE}/sitemap-portfolio.xml`, UA)).text();
  return [...new Set([...xml.matchAll(/<loc>([^<]*\/portfolio\/[^<]+)<\/loc>/g)].map((m) => m[1].replace("https://0web.com.br", BASE)))];
}

const list = await urls();
const results = [];
for (const url of list) {
  try {
    const r = await fetch(url, UA);
    if (!r.ok) { results.push({ url, ok: false, errors: [`HTTP ${r.status}`], warnings: [] }); continue; }
    const res = checkPage(await r.text(), url.replace(BASE, "https://0web.com.br"));
    results.push({ url, ok: res.ok, errors: res.errors, warnings: res.warnings, title: res.head.title, types: res.types });
  } catch (e) {
    results.push({ url, ok: false, errors: [`fetch falhou: ${e.message}`], warnings: [] });
  }
}

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? "✓" : "✗"} ${r.url}`);
  for (const e of r.errors) console.log(`    ERRO  ${e}`);
  for (const w of r.warnings) console.log(`    aviso ${w}`);
}
await mkdir("seo-reports", { recursive: true });
await writeFile("seo-reports/structured-data-latest.json", JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} páginas sem erros bloqueantes.`);
if (failed.length) {
  console.log(`::error::${failed.length} página(s) com erros de dados estruturados que podem impedir o reconhecimento pelo Google`);
  process.exit(1);
}
