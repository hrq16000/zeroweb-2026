#!/usr/bin/env bun
/**
 * FUNNEL_DESTINATION — resolução operacional mínima via provider SerpApi já existente.
 *
 *   bun scripts/resolve-funnel-destination-serpapi.mjs --slug marido-de-aluguel --query "Mestre dos Serviços marido de aluguel" --location "Curitiba, State of Parana, Brazil"
 *
 * Regras:
 * - UMA chamada google_maps (type=search) por projeto; para na primeira resposta.
 * - Cache em docs/portfolio/enrichment/serpapi/destination/<slug>.json; se o cache
 *   existir e --force não for passado, nenhuma chamada externa é feita.
 * - Não escreve destino em lugar nenhum: apenas registra candidatos e evidência.
 *   A decisão VERIFIED/CONFLICT/UNRESOLVED é humana/editorial.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { searchPlaceCandidates } from "../src/lib/portfolio-enrichment-serpapi.server.ts";

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const force = process.argv.includes("--force");

const slug = arg("slug");
const query = arg("query");
const location = arg("location", "Curitiba, State of Parana, Brazil");
if (!slug || !query) {
  console.error("uso: --slug <slug> --query <termo> [--location <local>] [--force]");
  process.exit(1);
}

const outDir = path.resolve("docs/portfolio/enrichment/serpapi/destination");
const outFile = path.join(outDir, `${slug}.json`);

if (!force) {
  try {
    const cached = JSON.parse(await readFile(outFile, "utf8"));
    console.log(`cache: ${outFile} (${cached.candidates?.length ?? 0} candidatos) — sem chamada externa`);
    process.exit(0);
  } catch {
    /* sem cache: segue para a chamada */
  }
}

let payload;
try {
  const { candidates, provenance } = await searchPlaceCandidates(query, location);
  payload = {
    slug,
    query,
    location,
    resolvedAt: new Date().toISOString(),
    callCount: 1,
    stage: candidates.length ? "SUCCESS" : "NO_RESULTS",
    error: null,
    provenance,
    candidates,
  };
} catch (error) {
  payload = {
    slug,
    query,
    location,
    resolvedAt: new Date().toISOString(),
    callCount: 1,
    stage: String(error?.message ?? error).startsWith("RATE_LIMITED") ? "RATE_LIMITED" : "FAILED",
    error: String(error?.message ?? error),
    provenance: null,
    candidates: [],
  };
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`snapshot: ${outFile} | stage ${payload.stage} | candidatos ${payload.candidates.length}`);
for (const c of payload.candidates) {
  console.log(
    `- ${c.name ?? "—"} | ${c.category ?? "—"} | ${c.address ?? "—"} | tel ${c.phone ? "PRESENTE" : "ausente"} | site ${c.website ?? "—"} | ${c.rating ?? "—"} (${c.reviewCount ?? "—"})`,
  );
}
