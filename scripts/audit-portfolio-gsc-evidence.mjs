#!/usr/bin/env node
/**
 * Evidência observacional do Google Search Console por portfolio.
 *
 * Lê o snapshot versionado de Search Analytics. Uma URL com impressões/cliques
 * é evidência de visibilidade em resultados de busca no período; ausência no
 * snapshot NÃO significa noindex e NÃO é tratada como falha.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const CANONICAL_BASE="https://0web.com.br";
const clients=JSON.parse(await readFile("src/config/portfolio-clients.json","utf8"));
let snapshot=null;
try {
  snapshot=JSON.parse(await readFile("src/data/gsc-latest.json","utf8"));
} catch (error) {
  console.warn("[portfolio-gsc] snapshot indisponível: "+(error instanceof Error ? error.message : String(error)));
}

const clientSlugs=new Set(clients.map((client)=>client.slug).filter(Boolean));
const observed=new Map();

for (const row of snapshot?.pages ?? []) {
  const raw=row?.keys?.[0];
  if (typeof raw!=="string") continue;
  try {
    const url=new URL(raw);
    if (url.origin!==CANONICAL_BASE) continue;
    const match=url.pathname.match(/^\/portfolio\/([^/]+)\/?$/);
    if (!match) continue;
    const slug=match[1];
    if (!clientSlugs.has(slug)) continue;
    observed.set(slug,{
      url:raw,
      clicks:Number(row.clicks ?? 0),
      impressions:Number(row.impressions ?? 0),
      ctr:Number(row.ctr ?? 0),
      position:Number(row.position ?? 0),
    });
  } catch {
    // Linha inválida do snapshot é ignorada; o exportador GSC é a fonte.
  }
}

const rows=clients
  .filter((client)=>client.slug)
  .map((client)=>({
    slug:client.slug,
    observedInSearchAnalytics:observed.has(client.slug),
    metrics:observed.get(client.slug) ?? null,
  }));

const refreshedAt=snapshot?.refreshedAt ?? null;
const ageDays=refreshedAt
  ? Math.floor((Date.now()-new Date(refreshedAt).getTime())/86400000)
  : null;

const report={
  generatedAt:new Date().toISOString(),
  source:"src/data/gsc-latest.json",
  siteUrl:snapshot?.siteUrl ?? null,
  range:snapshot?.range ?? null,
  refreshedAt,
  snapshotAgeDays:ageDays,
  totalClients:rows.length,
  observedCount:rows.filter((row)=>row.observedInSearchAnalytics).length,
  rows,
  interpretation:{
    observed:"A URL apareceu no Search Analytics no período e teve evidência de visibilidade no Google.",
    notObserved:"Ausência no snapshot não prova ausência do índice; pode significar zero impressões ou cobertura fora do top exportado.",
  },
};

await mkdir("seo-reports",{recursive:true});
await writeFile(
  "seo-reports/portfolio-gsc-evidence-latest.json",
  JSON.stringify(report,null,2)+"\n",
);

console.log(
  "[portfolio-gsc] "+report.observedCount+"/"+report.totalClients+" portfolios observados em Search Analytics"+
  (ageDays==null ? " · snapshot sem data" : " · snapshot há "+ageDays+" dia(s)"),
);
console.log("[portfolio-gsc] informativo — ausência de evidência NÃO reprova indexabilidade.");