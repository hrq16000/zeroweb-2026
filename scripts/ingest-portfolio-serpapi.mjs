#!/usr/bin/env bun
/**
 * Ingestão de teste do provider SerpApi (server-side).
 *
 *   bun scripts/ingest-portfolio-serpapi.mjs --slug carecas-infotec --place-id ChIJ...
 *
 * Escreve docs/portfolio/enrichment/serpapi/<slug>.json (snapshot normalizado
 * com provenance). Não altera landing, manifesto ou enrichment oficial.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { buildEnrichmentSnapshot } from "../src/lib/portfolio-enrichment-serpapi.server.ts";

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const slug = arg("slug", "carecas-infotec");
const placeId = arg("place-id", "ChIJjxhi67_73JQRgGgv4G2-G18");

const snapshot = await buildEnrichmentSnapshot(slug, placeId);

const outDir = path.resolve("docs/portfolio/enrichment/serpapi");
await mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, `${slug}.json`);
await writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`snapshot: ${outFile}`);
console.log(`errors: ${snapshot.errors.length ? snapshot.errors.join(" | ") : "nenhum"}`);
console.log(
  `place: ${snapshot.place?.name ?? "—"} | rating ${snapshot.place?.rating ?? "—"} (${snapshot.place?.reviewCount ?? "—"}) | reviews ingeridas ${snapshot.reviews?.items.length ?? 0} | fotos ${snapshot.place?.photos.length ?? 0}`,
);
