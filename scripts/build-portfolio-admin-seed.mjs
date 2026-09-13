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

function normalizePayload(value) {
  if (!value || typeof value !== "object") return value;

  return {
    ...value,
    blocking: Array.isArray(value.blocking) ? [...value.blocking].sort() : value.blocking,
    projects: Array.isArray(value.projects)
      ? value.projects
          .map((project) => ({
            ...project,
            gallery: Array.isArray(project.gallery) ? [...project.gallery].sort() : project.gallery,
            issues: Array.isArray(project.issues) ? [...project.issues].sort() : project.issues,
            blocking: Array.isArray(project.blocking) ? [...project.blocking].sort() : project.blocking,
          }))
          .sort((a, b) => String(a.slug ?? "").localeCompare(String(b.slug ?? "")))
      : value.projects,
  };
}

const payload = normalizePayload({
  version: 1,
  generatedBy: "scripts/build-portfolio-admin-seed.mjs",
  codes: CODES,
  blocking: [...BLOCKING],
  projects: buildRecords(root),
});

const next = `${JSON.stringify(payload, null, 2)}\n`;
const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";

if (check) {
  let currentNormalized = "";

  try {
    currentNormalized = current
      ? `${JSON.stringify(normalizePayload(JSON.parse(current)), null, 2)}\n`
      : "";
  } catch {
    currentNormalized = current;
  }

  if (currentNormalized !== next) {
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
