#!/usr/bin/env node
/**
 * Gate permanente de SEO dos portfolios.
 *
 * Separa contratos determinísticos (falham) de evidência observacional GSC
 * (informa, mas nunca transforma ausência de dados em erro de indexação).
 *
 * Uso:
 *   node scripts/audit-portfolio-seo-permanent-gate.mjs [fetchBase] [canonicalBase]
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const FETCH_BASE=(process.argv[2]||"https://0web.com.br").replace(/\/$/,"");
const CANONICAL_BASE=(process.argv[3]||"https://0web.com.br").replace(/\/$/,"");

const checks=[
  { name:"metadata", command:process.execPath, args:["scripts/validate-portfolio-meta.mjs"], required:true },
  { name:"internal-link-graph", command:"bun", args:["test","tests/portfolio/universal-seo-network.test.ts"], required:true },
  { name:"schema-runtime", command:process.execPath, args:["scripts/validate-published-structured-data.mjs",FETCH_BASE], required:true },
  { name:"runtime-indexability", command:process.execPath, args:["scripts/audit-portfolio-indexability.mjs",FETCH_BASE,CANONICAL_BASE], required:true },
  { name:"discovery-consistency", command:process.execPath, args:["scripts/audit-portfolio-discovery-consistency.mjs",FETCH_BASE,CANONICAL_BASE], required:true },
  { name:"gsc-evidence", command:process.execPath, args:["scripts/audit-portfolio-gsc-evidence.mjs"], required:false },
];

const results=[];
let failed=false;

for(const check of checks){
  const script=check.args.find((arg)=>arg.startsWith("scripts/")||arg.startsWith("tests/"));
  if(script && !existsSync(script)){
    const status=check.required?"MISSING":"OBSERVATIONAL_MISSING";
    results.push({name:check.name,status});
    if(check.required) failed=true;
    console.log("[portfolio-seo-gate] "+status+" "+check.name+" — "+script);
    continue;
  }

  console.log("\n[portfolio-seo-gate] RUN "+check.name);
  const run=spawnSync(check.command,check.args,{stdio:"inherit",env:process.env});
  const ok=run.status===0;
  const status=ok?"PASS":(check.required?"FAIL":"OBSERVATIONAL_WARN");
  results.push({name:check.name,status});
  if(check.required && !ok) failed=true;
}

console.log("\n[portfolio-seo-gate] RESUMO");
for(const result of results) console.log(" - "+result.name+": "+result.status);
console.log("[portfolio-seo-gate] GSC é evidência observacional; ausência de linhas não equivale a noindex.");

if(failed){
  console.error("[portfolio-seo-gate] FAIL — contrato determinístico violado.");
  process.exit(1);
}
console.log("[portfolio-seo-gate] PASS — contratos determinísticos preservados.");
