#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const clients = JSON.parse(readFileSync(resolve("src/config/portfolio-catalog.json"), "utf8"));
const assets = JSON.parse(readFileSync(resolve("src/config/portfolio-assets.json"), "utf8"));
const errors = [];
const seen = new Map();

for (const client of clients) {
  const entry = assets.clients?.[client.clientKey];
  const logo = entry?.icon;
  if (!logo) { errors.push(`${client.slug}: logo ausente (campo icon)`); continue; }
  if (!logo.startsWith("/images/")) { errors.push(`${client.slug}: logo deve ser um asset /images/`); continue; }
  const expectedPrefix = `/images/${client.slug}/`;
  if (!logo.startsWith(expectedPrefix)) errors.push(`${client.slug}: logo fora do diretório exclusivo (${logo})`);
  if (!existsSync(resolve("public", logo.slice(1)))) errors.push(`${client.slug}: arquivo de logo não encontrado (${logo})`);
  const previous = seen.get(logo);
  if (previous) errors.push(`${client.slug}: logo reutilizada por ${previous} (${logo})`);
  else seen.set(logo, client.slug);
}

if (errors.length) {
  console.error("[portfolio-logos] FAIL");
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}
console.log(`[portfolio-logos] OK — ${clients.length} projetos com logo própria no diretório do slug`);
