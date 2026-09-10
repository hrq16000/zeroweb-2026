/**
 * Locais reais do portfólio, derivados exclusivamente do catálogo versionado.
 *
 * Nada aqui é inventado: cidade, estado e bairro vêm dos campos `city`,
 * `state` e `location` de `portfolio-catalog.json`. Serve para gerar hubs
 * regionais (/portfolio-em/<local>) que apontam para os projetos daquele
 * lugar, dando ao Google um caminho de rastreamento por região.
 */
import portfolioCatalog from "@/config/portfolio-catalog.json";

export type PortfolioPlaceProject = {
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  segment?: string;
  image?: string;
  location?: string;
  city: string;
  state: string;
  neighborhood?: string;
};

export type PortfolioPlaceHub = {
  /** slug da URL: "curitiba-pr" ou "sitio-cercado-curitiba-pr" */
  slug: string;
  kind: "city" | "neighborhood";
  /** Nome curto: "Curitiba" ou "Sítio Cercado" */
  name: string;
  city: string;
  state: string;
  /** Rótulo completo para títulos. */
  label: string;
  projects: PortfolioPlaceProject[];
  /** Para bairros: slug do hub da cidade. */
  parentSlug?: string;
};

type CatalogItem = {
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  segment?: string;
  image?: string;
  location?: string;
  city?: string;
  state?: string;
  status?: string;
  live?: boolean;
};

export function slugifyPlace(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extrai o bairro do rótulo "Bairro · Cidade — UF", quando existir. */
function extractNeighborhood(location: string | undefined, city: string): string | undefined {
  if (!location) return undefined;
  const head = location.split("·")[0]?.trim();
  if (!head) return undefined;
  const clean = head.replace(/—.*$/, "").trim();
  if (!clean) return undefined;
  const normalized = slugifyPlace(clean);
  if (!normalized || normalized === slugifyPlace(city)) return undefined;
  // Descarta descrições genéricas ("Curitiba e região", "Loja online", ...).
  if (/(regiao|region|online|atendimento|brasil|litoral|metropolitana)/.test(normalized)) return undefined;
  if (clean.split(/\s+/).length > 4) return undefined;
  return clean.replace(/^Bairro\s+/i, "").trim();
}

function isPublished(item: CatalogItem) {
  return (item.status === "published" || item.status === "approved") && item.live !== false;
}

let cache: PortfolioPlaceHub[] | null = null;

export function portfolioPlaceHubs(): PortfolioPlaceHub[] {
  if (cache) return cache;
  const byCity = new Map<string, PortfolioPlaceHub>();
  const byNeighborhood = new Map<string, PortfolioPlaceHub>();

  for (const raw of portfolioCatalog as CatalogItem[]) {
    if (!isPublished(raw)) continue;
    const city = (raw.city ?? "").trim();
    const state = (raw.state ?? "").trim();
    if (!city || !state) continue;
    const neighborhood = extractNeighborhood(raw.location, city);
    const project: PortfolioPlaceProject = {
      slug: raw.slug,
      title: raw.title,
      subtitle: raw.subtitle,
      summary: raw.summary,
      segment: raw.segment,
      image: raw.image,
      location: raw.location,
      city,
      state,
      neighborhood,
    };

    const citySlug = `${slugifyPlace(city)}-${state.toLowerCase()}`;
    const cityHub =
      byCity.get(citySlug) ??
      ({
        slug: citySlug,
        kind: "city",
        name: city,
        city,
        state,
        label: `${city} — ${state}`,
        projects: [],
      } satisfies PortfolioPlaceHub);
    cityHub.projects.push(project);
    byCity.set(citySlug, cityHub);

    if (neighborhood) {
      const hoodSlug = `${slugifyPlace(neighborhood)}-${citySlug}`;
      const hoodHub =
        byNeighborhood.get(hoodSlug) ??
        ({
          slug: hoodSlug,
          kind: "neighborhood",
          name: neighborhood,
          city,
          state,
          label: `${neighborhood} · ${city} — ${state}`,
          projects: [],
          parentSlug: citySlug,
        } satisfies PortfolioPlaceHub);
      hoodHub.projects.push(project);
      byNeighborhood.set(hoodSlug, hoodHub);
    }
  }

  cache = [...byCity.values(), ...byNeighborhood.values()]
    .filter((hub) => hub.projects.length > 0)
    .sort((a, b) => b.projects.length - a.projects.length || a.label.localeCompare(b.label, "pt-BR"));
  return cache;
}

export function findPortfolioPlaceHub(slug: string): PortfolioPlaceHub | undefined {
  return portfolioPlaceHubs().find((hub) => hub.slug === slug);
}

export function portfolioPlacePath(slug: string): string {
  return `/portfolio-em/${slug}`;
}

export function portfolioCityHubs(): PortfolioPlaceHub[] {
  return portfolioPlaceHubs().filter((hub) => hub.kind === "city");
}

export function portfolioNeighborhoodHubs(city?: string): PortfolioPlaceHub[] {
  return portfolioPlaceHubs().filter(
    (hub) => hub.kind === "neighborhood" && (!city || hub.city === city),
  );
}
