#!/usr/bin/env node
/**
 * Gate de descoberta dos portfolios canônicos de clientes.
 *
 * O sitemap também contém hubs e rotas programáticas válidas; elas são
 * deliberadamente ignoradas aqui. A política runtime/admin pode sobrepor o
 * estado estático, então catálogo↔registry é diagnóstico e a prova forte é:
 * cliente canônico registrado + URL presente no sitemap publicado.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
const BASE=(process.argv[2]||"https://0web.com.br").replace(/\/$/,"");
const catalog=JSON.parse(await readFile("src/config/portfolio-catalog.json","utf8"));
const clients=JSON.parse(await readFile("src/config/portfolio-clients.json","utf8"));
const PUBLIC_STATUSES=new Set(["published","approved"]);const failures=[];
const catalogPublished=new Set(catalog.filter(x=>PUBLIC_STATUSES.has(x.status??"")&&x.live!==false).map(x=>x.slug).filter(Boolean));
const clientSlugs=new Set(clients.map(x=>x.slug).filter(Boolean));
function duplicates(values){const seen=new Set(),dupes=new Set();for(const v of values){if(!v)continue;if(seen.has(v))dupes.add(v);seen.add(v);}return [...dupes].sort();}
for(const slug of duplicates(clients.map(x=>x.slug)))failures.push(`registry: slug duplicado ${slug}`);
const registryNotStaticPublished=[...clientSlugs].filter(s=>!catalogPublished.has(s)).sort();
const staticPublishedNotRegistry=[...catalogPublished].filter(s=>!clientSlugs.has(s)).sort();
let sitemapUrls=new Set(),sitemapError="";try{const r=await fetch(`${BASE}/sitemap-portfolio.xml`,{headers:{"user-agent":"0web-portfolio-discovery-audit/1.1",accept:"application/xml,text/xml,text/plain"}});if(!r.ok)throw new Error(`HTTP ${r.status}`);const xml=await r.text();sitemapUrls=new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m=>m[1].trim().replace(/\/$/,"")));}catch(e){sitemapError=e instanceof Error?e.message:String(e);failures.push(`sitemap-portfolio.xml indisponível: ${sitemapError}`);}
// Somente URLs canônicas de clientes registrados. Hubs /portfolio-em/* e
// combinações /portfolio/<segmento>/<local> não pertencem a este conjunto.
const expectedClientUrls=new Set([...clientSlugs].map(slug=>`${BASE}/portfolio/${slug}`));
const missingRegisteredClients=[...expectedClientUrls].filter(url=>!sitemapUrls.has(url)).sort();
for(const url of missingRegisteredClients)failures.push(`${url}: cliente registrado ausente do sitemap publicado`);
const sitemapClientUrls=[...sitemapUrls].filter(url=>expectedClientUrls.has(url));
const report={generatedAt:new Date().toISOString(),baseUrl:BASE,staticPublishedCatalogCount:catalogPublished.size,clientRegistryCount:clientSlugs.size,sitemapRegisteredClientCount:sitemapClientUrls.length,missingRegisteredClients,staticPublishedNotRegistry,registryNotStaticPublished,sitemapError:sitemapError||null};
await mkdir("seo-reports",{recursive:true});await writeFile("seo-reports/portfolio-discovery-consistency-latest.json",`${JSON.stringify(report,null,2)}\n`);
console.log(`[portfolio-discovery] registry ${clientSlugs.size} · clientes no sitemap ${sitemapClientUrls.length} · ausentes ${missingRegisteredClients.length}`);
console.log(`[portfolio-discovery] catálogo estático fora do registry ${staticPublishedNotRegistry.length} · registry fora do published estático ${registryNotStaticPublished.length} (diagnóstico; admin/runtime pode sobrepor)`);
if(failures.length){console.error("[portfolio-discovery] FAIL");for(const f of failures)console.error(` - ${f}`);process.exit(1);}console.log("[portfolio-discovery] OK — clientes canônicos registrados estão descobertos no sitemap.");
