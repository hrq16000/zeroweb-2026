/**
 * Documento de descoberta por projeto do `/portfolio`.
 *
 * Objetivo: permitir que a busca interna entenda intenção ("meu notebook não
 * liga", "recarga de toner", "assistência técnica") e ainda assim só devolva
 * projetos que realmente prestam aquele serviço.
 *
 * Regras:
 * - não substitui o catálogo canônico — é apenas um índice de descoberta;
 * - o documento é derivado automaticamente do que o projeto já publica
 *   (nome, segmento, tags, subtítulo, resumo, cidade/estado);
 * - `src/config/portfolio-discovery.json` permite enriquecer manualmente um
 *   projeto com serviços, equipamentos, problemas e apelidos reais.
 */
import catalog from "@/config/portfolio-catalog.json";
import discoveryConfig from "@/config/portfolio-discovery.json";

export type PortfolioDiscoveryDocument = {
  slug: string;
  name: string;
  aliases: string[];
  segment: string;
  categories: string[];
  services: string[];
  equipment: string[];
  problems: string[];
  useCases: string[];
  locality: string[];
  tags: string[];
  keywords: string[];
};

type ManualEntry = Partial<Omit<PortfolioDiscoveryDocument, "slug" | "name" | "segment">>;

type CatalogEntry = {
  slug: string;
  clientKey?: string;
  title: string;
  segment?: string;
  city?: string;
  state?: string;
  location?: string;
  subtitle?: string;
  summary?: string;
  tags?: string[];
};

const manual = (discoveryConfig as { projects?: Record<string, ManualEntry> }).projects ?? {};

/** "/portfolio/carecas-infotec" e "carecas-infotec" apontam para o mesmo doc. */
export function discoverySlug(value: string): string {
  return value.replace(/^\/+|\/+$/g, "").split("/").pop() ?? value;
}

function humanize(value: string): string {
  return value.replace(/-/g, " ").trim();
}

function unique(values: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const v = value?.trim();
    if (!v) continue;
    const key = v.toLocaleLowerCase("pt-BR");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

/** Apelidos triviais derivados do nome: apóstrofo, hífen e acento. */
function nameAliases(name: string): string[] {
  return unique([
    name,
    name.replace(/['’´`]/g, ""),
    name.replace(/['’´`]s\b/gi, "s"),
    name.replace(/[-]/g, " "),
  ]);
}

function buildDocument(entry: CatalogEntry): PortfolioDiscoveryDocument {
  const slug = discoverySlug(entry.slug);
  const extra = manual[slug] ?? manual[entry.clientKey ?? ""] ?? {};
  const segment = entry.segment ?? "";
  const tags = (entry.tags ?? []).map(humanize);
  return {
    slug,
    name: entry.title,
    aliases: unique([...nameAliases(entry.title), ...(extra.aliases ?? [])]),
    segment,
    categories: unique([humanize(segment), ...(extra.categories ?? [])]),
    services: unique([...tags, ...(extra.services ?? [])]),
    equipment: unique(extra.equipment ?? []),
    problems: unique(extra.problems ?? []),
    useCases: unique(extra.useCases ?? []),
    locality: unique([entry.city, entry.state, entry.location, ...(extra.locality ?? [])]),
    tags: unique([...tags, ...(extra.tags ?? [])]),
    keywords: unique([entry.subtitle, entry.summary, ...(extra.keywords ?? [])]),
  };
}

const INDEX = new Map<string, PortfolioDiscoveryDocument>();
for (const entry of catalog as CatalogEntry[]) {
  const doc = buildDocument(entry);
  INDEX.set(doc.slug, doc);
  if (entry.clientKey) INDEX.set(discoverySlug(entry.clientKey), doc);
}

export function getDiscoveryDocument(slug?: string): PortfolioDiscoveryDocument | undefined {
  if (!slug) return undefined;
  return INDEX.get(discoverySlug(slug));
}

export function allDiscoveryDocuments(): PortfolioDiscoveryDocument[] {
  return Array.from(new Set(INDEX.values()));
}
