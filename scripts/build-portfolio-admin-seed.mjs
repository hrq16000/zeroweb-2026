#!/usr/bin/env node
/**
 * Gera src/config/portfolio-admin-seed.json a partir dos registries versionados.
 *
 * Esse arquivo é o SEED do admin (/app/portfolio). Ele não é uma segunda fonte
 * de verdade: é a projeção determinística dos registries + do contrato de
 * conformidade, usada para importar/comparar os projetos no banco e para
 * avaliar conformidade em runtime (onde não há acesso ao disco).
 *
 * Uso:
 *   node scripts/build-portfolio-admin-seed.mjs
 *   node scripts/build-portfolio-admin-seed.mjs --check   # falha se estiver desatualizado
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRecords, CODES, BLOCKING } from "./portfolio-conformance.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "src/config/portfolio-admin-seed.json");
const check = process.argv.includes("--check");

const payload = {
  version: 1,
  generatedBy: "scripts/build-portfolio-admin-seed.mjs",
  codes: CODES,
  blocking: [...BLOCKING].sort(),
  projects: buildRecords(root).sort((a, b) => a.slug.localeCompare(b.slug)),
};

const next = `${JSON.stringify(payload, null, 2)}\n`;
const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";

if (check) {
  if (current !== next) {
    console.error(
      "[portfolio-admin-seed] desatualizado. Rode: bun run build:portfolio-admin-seed",
    );
    process.exit(1);
  }
  console.log(`[portfolio-admin-seed] OK — ${payload.projects.length} projeto(s).`);
} else {
  fs.writeFileSync(target, next);
  console.log(
    `[portfolio-admin-seed] gerado — ${payload.projects.length} projeto(s) em src/config/portfolio-admin-seed.json`,
  );
}
