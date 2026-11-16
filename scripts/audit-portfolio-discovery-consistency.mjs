#!/usr/bin/env node
/**
 * Auditor de descoberta dos portfolios canônicos.
 *
 * O sitemap runtime é a fonte efetiva de publicação: o painel pode publicar
 * ou retirar projetos sem que os JSONs estáticos mudem. Por isso catálogo e
 * registry entram como diagnóstico, nunca como autoridade de lifecycle.
 *
 * Uso:
 *   node scripts/audit-portfolio-discovery-consistency.mjs [fetchBase] [canonicalBase]
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const FETCH_BASE=(process.argv[2]||"https://0web.com.br").replace(/\/$/,"");
const CANONICAL_BASE=(process.argv[3]||"https://0web.com.br").replace(/\/$/,"");
const catalog=JSON.parse(await readFile("src/config/portfolio-catalog.json","utf8"));
const clients=JSON.parse(await readFile("src/config/portfolio-clients.json","utf8"));
const PUBLIC_STATUSES=new Set(["published","approved"]);
const failures=[];

const catalogPublished=new Set(
  catalog.filter(x=>PUBLIC_STATUSES.has(x.status??"")&&x.live!==false).map(x=>x.slug).filter(Boolean),
);
const clientSlugs=new Set(clients.map(x=>x.slug).filter(Boolean));

function duplicates(values){
  const seen=new Set(),dupes=new Set();
  for(const value of values){
    if(!value)continue;
    if(seen.has(value))dupes.add(value);
    seen.add(value);
  }
  return [...dupes].sort();
}

for(const slug of duplicates(clients.map(x=>x.slug))) failures.push(`registry: slug duplicado ${slug}`);

let sitemapUrls=[];
let sitemapError="";
try{
  const response=await fetch(`${FETCH_BASE}/sitemap-portfolio.xml`,{
    headers:{"user-agent":"0web-portfolio-discovery-audit/1.2",accept:"application/xml,text/xml,text/plain"},
  });
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml=await response.text();
  sitemapUrls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(match=>match[1].trim().replace(/\/$/,""));
}catch(error){
  sitemapError=error instanceof Error?error.message:String(error);
  failures.push(`sitemap-portfolio.xml indisponível: ${sitemapError}`);
}

let canonicalClientUrls=[];
let malformedClientUrls=[];
if(!sitemapError){
  const canonicalOrigin=new URL(CANONICAL_BASE).origin;
  for(const raw of sitemapUrls){
    try{
      const url=new URL(raw);
      if(/^\/portfolio\/[^/]+\/?$/.test(url.pathname)){
        if(url.origin===canonicalOrigin) canonicalClientUrls.push(raw);
        else malformedClientUrls.push(raw);
      }
    }catch{
      if(raw.includes("/portfolio/")) malformedClientUrls.push(raw);
    }
  }

  for(const url of duplicates(canonicalClientUrls)) failures.push(`sitemap: URL canônica duplicada ${url}`);
  for(const url of malformedClientUrls) failures.push(`sitemap: URL de cliente fora do canonical ${url}`);
  if(canonicalClientUrls.length===0) failures.push("sitemap: nenhum portfolio canônico de cliente encontrado");
}

const sitemapSlugs=new Set(
  canonicalClientUrls.map(raw=>new URL(raw).pathname.replace(/^\/portfolio\//,"").replace(/\/$/,"")),
);
const staticPublishedNotInRuntime=[...catalogPublished].filter(slug=>!sitemapSlugs.has(slug)).sort();
const registryNotInRuntime=[...clientSlugs].filter(slug=>!sitemapSlugs.has(slug)).sort();
const runtimeNotInRegistry=[...sitemapSlugs].filter(slug=>!clientSlugs.has(slug)).sort();
const runtimeNotInStaticPublished=[...sitemapSlugs].filter(slug=>!catalogPublished.has(slug)).sort();

const report={
  generatedAt:new Date().toISOString(),
  fetchBase:FETCH_BASE,
  canonicalBase:CANONICAL_BASE,
  sitemapError:sitemapError||null,
  sitemapUrlCount:sitemapUrls.length,
  canonicalClientCount:canonicalClientUrls.length,
  malformedClientUrls,
  staticPublishedCatalogCount:catalogPublished.size,
  clientRegistryCount:clientSlugs.size,
  staticPublishedNotInRuntime,
  registryNotInRuntime,
  runtimeNotInRegistry,
  runtimeNotInStaticPublished,
};

await mkdir("seo-reports",{recursive:true});
await writeFile(
  "seo-reports/portfolio-discovery-consistency-latest.json",
  `${JSON.stringify(report,null,2)}\n`,
);

console.log(`[portfolio-discovery] sitemap ${sitemapUrls.length} · clientes canônicos ${canonicalClientUrls.length}`);
console.log(`[portfolio-discovery] runtime fora do registry ${runtimeNotInRegistry.length} · runtime fora do published estático ${runtimeNotInStaticPublished.length} (diagnóstico de lifecycle)`);
if(failures.length){
  console.error("[portfolio-discovery] FAIL");
  for(const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log("[portfolio-discovery] OK — sitemap runtime disponível, canônico e sem duplicações de clientes.");
