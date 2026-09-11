#!/usr/bin/env bun
/**
 * Ingestão profunda do provider SerpApi (server-side, em escada).
 *
 *   bun scripts/ingest-portfolio-serpapi.mjs --slug carecas-infotec --place-id ChIJ...
 *
 * Escreve docs/portfolio/enrichment/serpapi/<slug>.json (snapshot normalizado
 * com provenance). Não altera landing, manifesto ou enrichment oficial.
 * Rodar apenas na criação do projeto, atualização editorial ou revalidação
 * manual — nunca em page view (economia de créditos SerpApi).
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
const name = arg("name", null);
const phone = arg("phone", null);
const locality = arg("locality", "São José dos Pinhais");

const snapshot = await buildEnrichmentSnapshot(slug, placeId, {
  ...(name ? { name } : {}),
  ...(phone ? { phone } : {}),
  locality,
});

const outDir = path.resolve("docs/portfolio/enrichment/serpapi");
await mkdir(outDir, { recursive: true });
const outFile = path.join(outDir, `${slug}.json`);
await writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`snapshot: ${outFile}`);
console.log(`stages: ${JSON.stringify(snapshot.stages)}`);
console.log(`calls: ${snapshot.callCount}`);
console.log(`errors: ${snapshot.errors.length ? snapshot.errors.join(" | ") : "nenhum"}`);
console.log(
  `place: ${snapshot.place?.name ?? "—"} | data_id ${snapshot.google.dataId ?? "—"} | cid ${snapshot.google.cid ?? "—"} | rating ${snapshot.place?.rating ?? "—"} (${snapshot.place?.reviewCount ?? "—"}) | reviews ${snapshot.reviews?.items.length ?? 0} | fotos ${snapshot.google.photos.length}`,
);
console.log(
  `social: ${snapshot.socialProfiles.map((s) => `${s.platform}=${s.url} (${s.confidence}/${s.status})`).join(" | ") || "nenhum"}`,
);
