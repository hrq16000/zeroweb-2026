/**
 * FUNNEL_DESTINATION — pesquisa de candidatos em fonte OFICIAL pública.
 *
 *   bun run scripts/research-destination-proposals.ts [--limit 20] [--allow-external] [--slugs a,b]
 *
 * Para cada projeto publicado SEM destino operacional, faz no máximo UMA
 * consulta google_maps (cacheada em docs/portfolio/enrichment/serpapi/destination)
 * e registra os candidatos com telefone na fila de revisão
 * (public.portfolio_destination_proposals), SEMPRE com status PENDING.
 *
 * Este script NUNCA grava destino: a gravação só acontece após confirmação
 * humana no painel administrativo. Nenhum número completo é impresso.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import catalog from "@/config/portfolio-catalog.json";
import { maskWhatsAppDigits } from "@/lib/portfolio-funnel-destination";
import { auditPortfolioDestinations } from "@/lib/portfolio-funnel-destination.server";
import { searchPlaceCandidates, type PlaceCandidate } from "@/lib/portfolio-enrichment-serpapi.server";

const CACHE_DIR = path.resolve(process.cwd(), "docs/portfolio/enrichment/serpapi/destination");
/** Número institucional da 0WEB: jamais pode virar destino de cliente. */
const ZEROWEB_DIGITS = "5541997452053";

type CatalogRow = { slug: string; clientKey?: string; title?: string; city?: string; status?: string };
const CATALOG = catalog as CatalogRow[];

function arg(name: string, fallback: string | null = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const allowExternal = process.argv.includes("--allow-external");
const limit = Number(arg("limit", "999"));
const onlySlugs = (arg("slugs") ?? "").split(",").map((s) => s.trim()).filter(Boolean);

const STOP = new Set([
  "de","da","do","das","dos","e","em","a","o","as","os","the","ltda","me","mei",
  "servicos","serviço","serviços","service","services","cia","and",
]);
function tokens(v: string) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOP.has(t));
}
function matchStrength(expected: string, candidate: string | null): "STRONG" | "WEAK" | "NONE" {
  if (!candidate) return "NONE";
  const a = tokens(expected);
  const b = new Set(tokens(candidate));
  if (!a.length) return "NONE";
  const hits = a.filter((t) => b.has(t)).length;
  return hits >= 2 ? "STRONG" : hits === 1 ? "WEAK" : "NONE";
}
function digitsOf(phone: string | null | undefined) {
  const d = String(phone ?? "").replace(/\D/g, "");
  if (!d) return "";
  return d.startsWith("55") ? d : `55${d}`;
}

async function loadCandidates(slug: string, query: string, location: string) {
  const file = path.join(CACHE_DIR, `${slug}.json`);
  if (existsSync(file)) {
    const cached = JSON.parse(readFileSync(file, "utf8"));
    return { candidates: (cached.candidates ?? []) as PlaceCandidate[], calls: 0, cached: true };
  }
  if (!allowExternal) return { candidates: [] as PlaceCandidate[], calls: 0, cached: false };
  try {
    const { candidates, provenance } = await searchPlaceCandidates(query, location);
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(
      file,
      `${JSON.stringify(
        {
          slug,
          query,
          location,
          resolvedAt: new Date().toISOString(),
          callCount: 1,
          stage: candidates.length ? "SUCCESS" : "NO_RESULTS",
          provenance,
          candidates,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    return { candidates, calls: 1, cached: false };
  } catch (error) {
    console.log(`  ! falha na pesquisa de ${slug}: ${String((error as Error)?.message ?? error)}`);
    return { candidates: [] as PlaceCandidate[], calls: 1, cached: false };
  }
}

const SUPABASE_URL = process.env["SUPABASE_URL"]!;
const SERVICE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
async function upsertProposals(rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/portfolio_destination_proposals?on_conflict=slug,phone_digits`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    },
  );
  if (!res.ok) throw new Error(`proposals insert ${res.status}: ${await res.text()}`);
}

const audit = await auditPortfolioDestinations();
const pending = audit
  .filter((r) => r.publicState === "published" && r.destinationStatus === "UNRESOLVED")
  .map((r) => r.slug)
  .filter((s) => (onlySlugs.length ? onlySlugs.includes(s) : true))
  .slice(0, limit);

console.log(`PESQUISA DE DESTINOS — ${pending.length} projetos publicados sem destino`);

let calls = 0;
let proposed = 0;
for (const slug of pending) {
  const project = CATALOG.find((p) => p.slug === slug);
  const clientKey = project?.clientKey ?? slug;
  const title = project?.title ?? slug;
  const city = project?.city ?? "Curitiba";
  const query = `${title} ${city}`.trim();
  const location = `${city}, State of Parana, Brazil`;

  const { candidates, calls: c, cached } = await loadCandidates(slug, query, location);
  calls += c;

  const rows = candidates
    .map((cand) => ({ cand, strength: matchStrength(title, cand.name), digits: digitsOf(cand.phone) }))
    .filter((r) => r.digits && r.strength !== "NONE" && r.digits !== ZEROWEB_DIGITS)
    .map((r) => ({
      slug,
      client_key: clientKey,
      candidate_name: r.cand.name,
      candidate_address: r.cand.address,
      candidate_category: r.cand.category,
      place_id: r.cand.placeId,
      maps_url: r.cand.mapsUrl,
      phone_digits: r.digits,
      match_strength: r.strength,
      source: "OFFICIAL_GOOGLE",
      query,
      status: "PENDING",
    }));

  await upsertProposals(rows);
  proposed += rows.length;
  console.log(
    `  ${slug.padEnd(34)} ${cached ? "cache" : c ? "google" : "sem pesquisa"} · candidatos ${candidates.length} · propostas ${rows.length}` +
      (rows.length ? ` (${rows.map((r) => `${r.match_strength}:${maskWhatsAppDigits(r.phone_digits)}`).join(", ")})` : ""),
  );
}

console.log(`\nchamadas externas: ${calls} · propostas registradas para revisão: ${proposed}`);
console.log("Nenhum destino foi gravado: aprovação humana no painel é obrigatória.");
