/**
 * FUNNEL_DESTINATION — pipeline contínua de resolução operacional (ondas).
 *
 * Rotina única e repetível por slug, sem criar segunda fonte de verdade:
 * o destino continua sendo resolvido por `whatsapp-redirect.server` e a
 * proveniência continua vivendo em `src/config/portfolio-funnel-destinations.json`.
 *
 *   bun run scripts/resolve-destination-wave.ts --slugs a,b [--allow-external] [--write]
 *   bun run scripts/resolve-destination-wave.ts --wave insufficient [--allow-external] [--write]
 *
 * Ordem obrigatória por item:
 *   1. destino configurado (server-side, nunca impresso por extenso)
 *   2. evidência local (livro-razão, catálogo, enrichment, cache de destino)
 *   3. pesquisa externa (SerpApi google_maps, 1 chamada, cacheada) só se necessário
 *   4. classificação VERIFIED | CONFLICT | INSUFFICIENT_EVIDENCE | UNRESOLVED
 *
 * Nunca inventa número, nunca promove sem correspondência inequívoca e nunca
 * imprime dígitos completos.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import catalog from "@/config/portfolio-catalog.json";
import { maskWhatsAppDigits } from "@/lib/portfolio-funnel-destination";
import {
  resolvePortfolioWhatsAppContact,
  resolvePortfolioWhatsAppContactAsync,
} from "@/lib/whatsapp-redirect.server";
import { searchPlaceCandidates, type PlaceCandidate } from "@/lib/portfolio-enrichment-serpapi.server";

const ROOT = process.cwd();
const LEDGER_PATH = path.resolve(ROOT, "src/config/portfolio-funnel-destinations.json");
const CACHE_DIR = path.resolve(ROOT, "docs/portfolio/enrichment/serpapi/destination");
const TODAY = new Date().toISOString().slice(0, 10);

/** Número institucional da 0WEB: jamais pode virar destino de cliente. */
const ZEROWEB_DIGITS = "5541997452053";

type CatalogRow = { slug: string; clientKey?: string; title?: string; city?: string; location?: string; status?: string };
const CATALOG = catalog as CatalogRow[];

function arg(name: string, fallback: string | null = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const allowExternal = process.argv.includes("--allow-external");
const write = process.argv.includes("--write");

function readLedger() {
  return JSON.parse(readFileSync(LEDGER_PATH, "utf8")) as {
    entries: Record<string, Record<string, unknown>>;
    [k: string]: unknown;
  };
}

const STOP = new Set([
  "de","da","do","das","dos","e","em","a","o","as","os","the","ltda","me","mei","studio","spa",
  "servicos","serviço","serviços","service","services","cia","and",
]);

function tokens(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOP.has(t));
}

/** Correspondência de entidade: forte, fraca ou nenhuma — nunca "quase". */
function nameMatch(expected: string, candidate: string | null): "STRONG" | "WEAK" | "NONE" {
  if (!candidate) return "NONE";
  const a = tokens(expected);
  const b = new Set(tokens(candidate));
  if (!a.length) return "NONE";
  const hits = a.filter((t) => b.has(t));
  const distinctive = hits.filter((t) => t.length >= 6);
  if (hits.length >= 2 || distinctive.length >= 1) return "STRONG";
  return hits.length === 1 ? "WEAK" : "NONE";
}

function digitsOf(phone: string | null | undefined) {
  const d = String(phone ?? "").replace(/\D/g, "");
  if (!d) return "";
  return d.startsWith("55") ? d : `55${d}`;
}

function sameNumber(a: string, b: string) {
  const norm = (v: string) => {
    let d = v.replace(/\D/g, "");
    if (d.startsWith("55")) d = d.slice(2);
    // celular brasileiro com/sem o nono dígito
    if (d.length === 11 && d[2] === "9") d = d.slice(0, 2) + d.slice(3);
    return d;
  };
  return Boolean(a && b) && norm(a) === norm(b);
}

type Outcome = {
  slug: string;
  clientKey: string;
  previous: string;
  status: "VERIFIED" | "CONFLICT" | "INSUFFICIENT_EVIDENCE" | "UNRESOLVED";
  masked: string | null;
  evidence: string[];
  externalCalls: number;
  conflict?: string;
};

async function loadCandidates(slug: string, query: string, location: string) {
  const file = path.join(CACHE_DIR, `${slug}.json`);
  if (existsSync(file)) {
    const cached = JSON.parse(readFileSync(file, "utf8"));
    return { candidates: (cached.candidates ?? []) as PlaceCandidate[], calls: 0, cached: true };
  }
  if (!allowExternal) return { candidates: [], calls: 0, cached: false };
  try {
    const { candidates, provenance } = await searchPlaceCandidates(query, location);
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(
      file,
      `${JSON.stringify({ slug, query, location, resolvedAt: new Date().toISOString(), callCount: 1, stage: candidates.length ? "SUCCESS" : "NO_RESULTS", provenance, candidates }, null, 2)}\n`,
      "utf8",
    );
    return { candidates, calls: 1, cached: false };
  } catch (error) {
    return { candidates: [], calls: 1, cached: false, error: String((error as Error)?.message ?? error) };
  }
}

async function resolveOne(slug: string, ledger: ReturnType<typeof readLedger>): Promise<Outcome> {
  const project = CATALOG.find((p) => p.slug === slug);
  const clientKey = project?.clientKey ?? slug;
  const entry = ledger.entries[clientKey] ?? ledger.entries[slug] ?? {};
  const previous = String(entry["status"] ?? "UNRESOLVED");

  // 1. destino configurado (server-side)
  const contact =
    resolvePortfolioWhatsAppContact(clientKey) ?? (await resolvePortfolioWhatsAppContactAsync(clientKey));
  const masked = contact ? maskWhatsAppDigits(contact.digits) : null;
  const evidence: string[] = [];

  if (!contact) {
    evidence.push(
      `Onda contínua (${TODAY}): nenhum destino operacional configurado (segredo do projeto e configuração privada vazios)`,
    );
    return { slug, clientKey, previous, status: "UNRESOLVED", masked, evidence, externalCalls: 0 };
  }

  if (sameNumber(contact.digits, ZEROWEB_DIGITS)) {
    return {
      slug,
      clientKey,
      previous,
      status: "CONFLICT",
      masked,
      evidence: [`Onda contínua (${TODAY}): destino configurado é o número institucional da 0WEB — fallback proibido`],
      externalCalls: 0,
      conflict: "Destino configurado = número institucional 0WEB",
    };
  }

  // 2. evidência local + 3. externa só se necessário
  const query = `${project?.title ?? slug} ${project?.city ?? ""}`.trim();
  const location = `${project?.city ?? "Curitiba"}, State of Parana, Brazil`;
  const { candidates, calls, cached } = await loadCandidates(slug, query, location);
  evidence.push(
    `Onda contínua (${TODAY}): destino presente em segredo operacional (${masked}); ${
      cached ? "evidência de entidade lida do cache local" : calls ? "1 chamada google_maps (cacheada)" : "sem pesquisa externa"
    }`,
  );

  const matched = candidates
    .map((c) => ({ c, match: nameMatch(project?.title ?? slug, c.name) }))
    .filter((r) => r.match === "STRONG");

  if (!matched.length) {
    evidence.push(
      candidates.length
        ? "Nenhum candidato Google corresponde inequivocamente à entidade — evidência insuficiente para promover"
        : "Nenhum candidato Google encontrado — evidência insuficiente para promover",
    );
    return { slug, clientKey, previous, status: "INSUFFICIENT_EVIDENCE", masked, evidence, externalCalls: calls };
  }

  const withPhone = matched.filter((r) => digitsOf(r.c.phone));
  if (!withPhone.length) {
    evidence.push(
      `Entidade Google correspondente encontrada (${matched[0]!.c.name}), mas a ficha não publica telefone — nada a cruzar`,
    );
    return { slug, clientKey, previous, status: "INSUFFICIENT_EVIDENCE", masked, evidence, externalCalls: calls };
  }

  const hit = withPhone.find((r) => sameNumber(digitsOf(r.c.phone), contact.digits));
  if (hit) {
    evidence.push(
      `Telefone da ficha Google "${hit.c.name}"${hit.c.address ? ` (${hit.c.address})` : ""} confere com o destino configurado`,
    );
    if (hit.c.placeId) evidence.push(`Place ID ${hit.c.placeId}`);
    return { slug, clientKey, previous, status: "VERIFIED", masked, evidence, externalCalls: calls };
  }

  const other = withPhone[0]!;
  if (sameNumber(digitsOf(other.c.phone), ZEROWEB_DIGITS)) {
    evidence.push(
      `Ficha Google "${other.c.name}" publica o número institucional da 0WEB — não serve como prova de titularidade do cliente`,
    );
    return { slug, clientKey, previous, status: "INSUFFICIENT_EVIDENCE", masked, evidence, externalCalls: calls };
  }
  evidence.push(
    `Ficha Google "${other.c.name}" publica telefone (${maskWhatsAppDigits(digitsOf(other.c.phone)) ?? "—"}) diferente do destino configurado (${masked})`,
  );
  return {
    slug,
    clientKey,
    previous,
    status: "CONFLICT",
    masked,
    evidence,
    externalCalls: calls,
    conflict: "Telefone da ficha Google diverge do destino configurado",
  };
}

const WAVES: Record<string, (l: ReturnType<typeof readLedger>) => string[]> = {
  insufficient: (l) =>
    Object.entries(l.entries)
      .filter(([, v]) => v["status"] === "INSUFFICIENT_EVIDENCE" || v["status"] === "CONFIGURED_UNVERIFIED")
      .map(([k]) => CATALOG.find((p) => (p.clientKey ?? p.slug) === k)?.slug ?? k),
};

const ledger = readLedger();
const slugsArg = arg("slugs");
const waveArg = arg("wave");
const slugs = slugsArg
  ? slugsArg.split(",").map((s) => s.trim()).filter(Boolean)
  : waveArg && WAVES[waveArg]
    ? WAVES[waveArg]!(ledger)
    : [];

if (!slugs.length) {
  console.error("uso: --slugs a,b | --wave insufficient  [--allow-external] [--write]");
  process.exit(1);
}

const outcomes: Outcome[] = [];
for (const slug of slugs) outcomes.push(await resolveOne(slug, ledger));

console.log(`FUNNEL_DESTINATION — pipeline contínua (${outcomes.length} projetos)`);
for (const o of outcomes) {
  console.log(
    `  ${o.previous.padEnd(22)} → ${o.status.padEnd(22)} ${o.slug.padEnd(28)} ${o.masked ?? "—"} (calls=${o.externalCalls})`,
  );
  for (const e of o.evidence) console.log(`      · ${e}`);
}
console.log(`chamadas externas nesta execução: ${outcomes.reduce((n, o) => n + o.externalCalls, 0)}`);

if (write) {
  for (const o of outcomes) {
    const prev = (ledger.entries[o.clientKey] ?? {}) as Record<string, unknown>;
    ledger.entries[o.clientKey] = {
      ...prev,
      status: o.status,
      source: o.status === "VERIFIED" ? "OPERATIONAL_SECRET+GOOGLE_ENTITY" : (prev["source"] ?? "OPERATIONAL_SECRET"),
      confidence: o.status === "VERIFIED" ? 95 : o.status === "CONFLICT" ? 60 : 40,
      verifiedAt: o.status === "VERIFIED" ? TODAY : null,
      evidence: o.evidence,
      ...(o.conflict ? { conflict: o.conflict } : {}),
    };
  }
  writeFileSync(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
  console.log(`livro-razão atualizado: ${LEDGER_PATH}`);
}
