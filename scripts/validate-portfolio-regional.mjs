#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const catalog = JSON.parse(readFileSync(resolve(root, "src/config/portfolio-catalog.json"), "utf8"));
const route = readFileSync(resolve(root, "src/routes/portfolio.$segmento.$bairro.tsx"), "utf8");
const index = readFileSync(resolve(root, "src/routes/portfolio.index.tsx"), "utf8");
const errors = [];

for (const item of catalog) {
  for (const field of ["segment", "city", "state", "location"]) {
    if (!item[field] || typeof item[field] !== "string") errors.push(`${item.slug}: campo regional ${field} ausente`);
  }
  if (item.status === "published" && !item.location?.includes("—")) {
    errors.push(`${item.slug}: projeto publicado sem localização legível (bairro/cidade/estado)`);
  }
}

for (const required of ["portfolioProjectsAtPlace", "portfolioComboPath", "itemListNode", "localBusinessNode"]) {
  if (!route.includes(required)) errors.push(`guia regional sem integração: ${required}`);
}
for (const required of ["PORTFOLIO_PLACES", "Guia comercial nacional", "Explorar todas as regiões"]) {
  if (!index.includes(required)) errors.push(`vitrine nacional sem integração: ${required}`);
}

if (!existsSync(resolve(root, "src/lib/curitiba-neighborhoods.ts"))) errors.push("base nacional de bairros ausente");
if (errors.length) {
  console.error(`[portfolio-regional] FAIL — ${errors.length} problema(s)`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(`[portfolio-regional] OK — ${catalog.length} projetos com localização e guia regional integrados`);
