#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const clients = JSON.parse(readFileSync(resolve("src/config/portfolio-catalog.json"), "utf8"));
const assets = JSON.parse(readFileSync(resolve("src/config/portfolio-assets.json"), "utf8"));
const errors = [];
for (const client of clients) {
  const entry = assets.clients?.[client.clientKey];
  if (!entry) { errors.push(`${client.slug}: entrada de assets ausente`); continue; }
  for (const field of ["icon", "socialImage", "proof"]) {
    if (!entry[field]) errors.push(`${client.slug}: ${field} ausente`);
  }
  for (const field of ["icon", "socialImage"]) {
    const path = entry[field];
    if (typeof path === "string" && path.startsWith("/images/") && !existsSync(resolve("public", path.slice(1)))) {
      errors.push(`${client.slug}: ${field} não encontrado (${path})`);
    }
  }
}
if (errors.length) { console.error("[portfolio-assets] FAIL"); errors.forEach((e) => console.error(` - ${e}`)); process.exit(1); }
console.log(`[portfolio-assets] OK — ${clients.length} clientes com ícone, imagem social e prova social próprios`);
