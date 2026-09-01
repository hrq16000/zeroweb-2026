#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const catalog = JSON.parse(readFileSync(resolve(root, "src/config/portfolio-catalog.json"), "utf8"));
const assets = JSON.parse(readFileSync(resolve(root, "src/config/portfolio-assets.json"), "utf8"));
const kitSource = readFileSync(resolve(root, "src/components/portfolio/PortfolioPresenceKit.tsx"), "utf8");
const errors = [];
const requiredTokens = ["brandBrief", "printMockup", "Conceito de presença e papelaria", "Cartão de visitas", "Panfleto digital"];
for (const token of requiredTokens) if (!kitSource.includes(token)) errors.push(`kit: contrato ausente (${token})`);
const sourcePath = resolve(root, "public/images/portfolio-kit/stationery-base.png");
if (!existsSync(sourcePath)) errors.push("kit: base bitmap ausente (public/images/portfolio-kit/stationery-base.png)");
for (const item of catalog) {
  if (!item.slug || !item.title || !item.segment || !item.city || !item.state) errors.push(`${item.slug ?? "<sem slug>"}: briefing incompleto`);
  const entry = assets.clients?.[item.slug] ?? assets.clients?.[item.clientKey];
  if (!entry?.icon || !entry?.socialImage) errors.push(`${item.slug}: logo/OG ausente para o mockup visual`);
  for (const field of ["icon", "socialImage"]) {
    const value = entry?.[field];
    if (typeof value === "string" && value.startsWith("/images/") && !existsSync(resolve(root, "public", value.slice(1)))) {
      errors.push(`${item.slug}: ${field} não encontrado (${value})`);
    }
  }
}
if (errors.length) {
  console.error(`[portfolio-presence-kit] FAIL — ${errors.length} problema(s)`);
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}
console.log(`[portfolio-presence-kit] OK — ${catalog.length} projetos com cartão e panfleto conceituais vinculados`);
