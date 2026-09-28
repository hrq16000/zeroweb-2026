import portfolioCatalog from "@/config/portfolio-catalog.json";
import { SITE_URL } from "@/lib/portfolio-seo";
import { extractNeighborhood, portfolioPlaceHubs, portfolioPlacePath } from "@/lib/portfolio-places";

export type PortfolioSeoDescriptor = {
  slug: string;
  title: string;
  segment: string;
  city: string;
  state: string;
  location?: string;
  neighborhood?: string;
  tags: string[];
  summary: string;
  subtitle?: string;
  projectType?: string;
  image?: string;
  fallbackImage?: string;
  services?: string[];
};

export type PortfolioSeoContextOverride = Partial<Omit<PortfolioSeoDescriptor, "slug">>;

type CatalogItem = PortfolioSeoDescriptor & {
  status?: string;
  live?: boolean;
  location?: string;
};

const PUBLIC_STATUSES = new Set(["published", "approved"]);
const GENERIC_PLACES = new Set(["", "brasil", "região a confirmar", "regiao a confirmar"]);

const PUBLIC_ITEMS = (portfolioCatalog as CatalogItem[]).filter(
  (item) => PUBLIC_STATUSES.has(item.status ?? "") && item.live !== false,
);

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeTags(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.map((item) => normalize(String(item ?? ""))).filter(Boolean))]
    : [];
}

function normalizeLabels(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    const label = clean(String(item ?? "")).replace(/\s+/g, " ");
    const key = normalize(label);
    if (!label || !key || seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

function humanizeTag(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function isUsefulPlace(value: string): boolean {
  return !GENERIC_PLACES.has(normalize(value));
}

function descriptorFromCatalog(item: CatalogItem): PortfolioSeoDescriptor {
  const city = clean(item.city);
  const location = clean(item.location);
  return {
    slug: item.slug,
    title: clean(item.title),
    segment: clean(item.segment),
    city,
    state: clean(item.state),
    location: location || undefined,
    neighborhood: extractNeighborhood(location || undefined, city),
    tags: normalizeTags(item.tags),
    summary: clean(item.summary),
    subtitle: clean(item.subtitle) || undefined,
    projectType: clean(item.projectType) || undefined,
    image: clean((item as CatalogItem & { image?: string }).image) || undefined,
    fallbackImage: clean((item as CatalogItem & { fallbackImage?: string }).fallbackImage) || undefined,
    services: [],
  };
}

export function listPublicPortfolioSeoDescriptors(): PortfolioSeoDescriptor[] {
  return PUBLIC_ITEMS.map(descriptorFromCatalog);
}

export function resolvePortfolioSeoDescriptor(
  slug: string,
  override?: PortfolioSeoContextOverride,
): PortfolioSeoDescriptor | null {
  const base = PUBLIC_ITEMS.find((item) => item.slug === slug);
  const fallback = base ? descriptorFromCatalog(base) : null;

  const title = clean(override?.title) || fallback?.title || "";
  if (!slug || !title) return null;

  return {
    slug,
    title,
    segment: clean(override?.segment) || fallback?.segment || "",
    city: clean(override?.city) || fallback?.city || "",
    state: clean(override?.state) || fallback?.state || "",
    location: clean(override?.location) || fallback?.location,
    neighborhood:
      clean(override?.neighborhood) ||
      extractNeighborhood(clean(override?.location) || fallback?.location, clean(override?.city) || fallback?.city || "") ||
      fallback?.neighborhood,
    tags:
      normalizeTags(override?.tags).length > 0
        ? normalizeTags(override?.tags)
        : fallback?.tags ?? [],
    summary: clean(override?.summary) || fallback?.summary || "",
    subtitle: clean(override?.subtitle) || fallback?.subtitle,
    projectType: clean(override?.projectType) || fallback?.projectType,
    image: clean(override?.image) || fallback?.image,
    fallbackImage: clean(override?.fallbackImage) || fallback?.fallbackImage,
    services:
      normalizeLabels(override?.services).length > 0
        ? normalizeLabels(override?.services)
        : fallback?.services ?? [],
  };
}

function relatedScore(current: PortfolioSeoDescriptor, candidate: PortfolioSeoDescriptor): number {
  let score = 0;

  const sameCity =
    isUsefulPlace(current.city) &&
    isUsefulPlace(candidate.city) &&
    normalize(current.city) === normalize(candidate.city);

  const sameNeighborhood =
    sameCity &&
    current.neighborhood &&
    candidate.neighborhood &&
    normalize(current.neighborhood) === normalize(candidate.neighborhood);

  // O diretório é local-first: bairro e cidade pesam antes da afinidade temática.
  if (sameNeighborhood) score += 24;
  if (sameCity) score += 12;

  if (current.segment && candidate.segment && normalize(current.segment) === normalize(candidate.segment)) {
    score += 8;
  }

  if (
    current.state &&
    candidate.state &&
    normalize(current.state) === normalize(candidate.state)
  ) {
    score += 3;
  }

  const currentTags = new Set(current.tags.map(normalize));
  const overlap = candidate.tags.filter((tag) => currentTags.has(normalize(tag))).length;
  score += Math.min(8, overlap * 2);

  if (
    current.projectType &&
    candidate.projectType &&
    normalize(current.projectType) === normalize(candidate.projectType)
  ) {
    score += 1;
  }

  return score;
}

export type RelatedPortfolioSeoItem = PortfolioSeoDescriptor & {
  score: number;
  reason: "neighborhood" | "city" | "segment" | "affinity" | "state" | "discovery";
};

function relationReason(
  current: PortfolioSeoDescriptor,
  candidate: PortfolioSeoDescriptor,
): RelatedPortfolioSeoItem["reason"] {
  const sameCity =
    isUsefulPlace(current.city) &&
    isUsefulPlace(candidate.city) &&
    normalize(current.city) === normalize(candidate.city);

  if (
    sameCity &&
    current.neighborhood &&
    candidate.neighborhood &&
    normalize(current.neighborhood) === normalize(candidate.neighborhood)
  ) {
    return "neighborhood";
  }
  if (sameCity) return "city";
  if (current.segment && normalize(current.segment) === normalize(candidate.segment)) {
    return "segment";
  }
  if (candidate.tags.some((tag) => current.tags.map(normalize).includes(normalize(tag)))) {
    return "affinity";
  }
  if (current.state && normalize(current.state) === normalize(candidate.state)) return "state";
  return "discovery";
}

export function relatedPortfolioSeoItems(
  slug: string,
  override?: PortfolioSeoContextOverride,
  limit = 6,
): RelatedPortfolioSeoItem[] {
  const current = resolvePortfolioSeoDescriptor(slug, override);
  if (!current) return [];

  const requested = Math.max(0, Math.min(8, limit));
  if (requested === 0) return [];

  const all = PUBLIC_ITEMS.map(descriptorFromCatalog)
    .filter((candidate) => candidate.slug !== slug);
  const ranked = all
    .map((candidate) => ({
      ...candidate,
      score: relatedScore(current, candidate),
      reason: relationReason(current, candidate),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "pt-BR"));

  // Reserva uma aresta de cobertura determinística no grafo universal.
  // Assim todo projeto publicado recebe ao menos um backlink de outro portfolio,
  // sem fingir afinidade: quando a relação não é forte, o motivo é "discovery".
  const ring = PUBLIC_ITEMS.map(descriptorFromCatalog)
    .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  const currentIndex = ring.findIndex((candidate) => candidate.slug === slug);
  const coverage =
    ring.length > 1 && currentIndex >= 0
      ? ring[(currentIndex + 1) % ring.length]
      : undefined;

  const selected = ranked.slice(0, requested);
  if (coverage && !selected.some((item) => item.slug === coverage.slug)) {
    const scoredCoverage = {
      ...coverage,
      score: relatedScore(current, coverage),
      reason: relationReason(current, coverage),
    };
    selected[selected.length - 1] = {
      ...scoredCoverage,
      reason: scoredCoverage.score >= 3 ? scoredCoverage.reason : "discovery",
    };
  }

  return selected;
}


const SEGMENT_LABELS: Record<string, string> = {
  agencias: "Agência digital",
  beleza: "Beleza",
  comercios: "Comércio",
  construcao: "Construção",
  juridico: "Serviços jurídicos",
  "prestadores-de-servicos": "Serviços",
  restaurantes: "Gastronomia",
  saude: "Saúde",
  servicos: "Serviços",
};

const SEGMENT_SCHEMA_TYPES: Record<string, string> = {
  agencias: "ProfessionalService",
  beleza: "HealthAndBeautyBusiness",
  comercios: "Store",
  construcao: "ProfessionalService",
  juridico: "LegalService",
  "prestadores-de-servicos": "ProfessionalService",
  restaurantes: "FoodEstablishment",
  saude: "MedicalBusiness",
  servicos: "ProfessionalService",
};

export function portfolioEntitySchemaType(segment: string): string {
  return SEGMENT_SCHEMA_TYPES[normalize(segment)] ?? "Organization";
}

export function portfolioUniversalSeoTitle(
  slug: string,
  override?: PortfolioSeoContextOverride,
): string | null {
  const item = resolvePortfolioSeoDescriptor(slug, override);
  if (!item) return null;

  const city = isUsefulPlace(item.city) ? item.city : "";
  const segment = SEGMENT_LABELS[item.segment] ?? item.segment;
  const local = [item.neighborhood, city].filter(Boolean).join(" · ");
  const candidates = [
    local ? `${item.title} | ${local}` : "",
    city ? `${item.title} | ${city}` : "",
    item.subtitle ? `${item.title} | ${item.subtitle}` : "",
    segment ? `${item.title} | ${segment}` : "",
    item.title,
  ].filter(Boolean);

  return candidates.find((value) => value.length <= 65) ?? item.title;
}

export function portfolioUniversalSeoDescription(
  slug: string,
  override?: PortfolioSeoContextOverride,
): string | null {
  const item = resolvePortfolioSeoDescriptor(slug, override);
  if (!item) return null;

  const base = clean(item.summary) || clean(item.subtitle) || item.title;
  const local = [item.neighborhood, isUsefulPlace(item.city) ? item.city : "", item.state]
    .filter(Boolean)
    .join(" · ");
  const suffix = local && !normalize(base).includes(normalize(item.city))
    ? ` Em ${local}.`
    : "";
  const value = `${base.replace(/[.\s]+$/, "")}.${suffix}`.replace(/\s+/g, " ").trim();
  if (value.length <= 160) return value;

  const clipped = value.slice(0, 157).replace(/\s+\S*$/, "").replace(/[,:;\-\s]+$/, "");
  return `${clipped}...`;
}

export function portfolioUniversalKeywords(
  slug: string,
  override?: PortfolioSeoContextOverride,
): string | null {
  const item = resolvePortfolioSeoDescriptor(slug, override);
  if (!item) return null;
  const terms = [
    item.title,
    ...item.tags,
    item.segment,
    item.neighborhood ?? "",
    isUsefulPlace(item.city) ? item.city : "",
    item.state,
  ].map(clean).filter(Boolean);
  return [...new Set(terms)].join(", ");
}


export type PortfolioSemanticContext = {
  label: string;
  topics: string[];
  placeLinks: { href: string; label: string }[];
};

export function portfolioSemanticContext(
  slug: string,
  override?: PortfolioSeoContextOverride,
): PortfolioSemanticContext | null {
  const item = resolvePortfolioSeoDescriptor(slug, override);
  if (!item) return null;

  const cityNorm = normalize(item.city);
  const stateNorm = normalize(item.state);
  const blocked = new Set([
    cityNorm,
    stateNorm,
    normalize(item.title),
    normalize(item.segment),
  ]);

  const topics = item.tags
    .map(humanizeTag)
    .filter((tag) => {
      const key = normalize(tag);
      return key && !blocked.has(key) && !key.includes(cityNorm);
    })
    .filter((tag, index, all) => all.findIndex((candidate) => normalize(candidate) === normalize(tag)) === index)
    .slice(0, 5);

  const placeLinks = portfolioPlaceHubs()
    .filter(
      (hub) =>
        normalize(hub.city) === cityNorm &&
        normalize(hub.state) === stateNorm,
    )
    .sort((a, b) => {
      const aContains = a.projects.some((project) => project.slug === slug) ? 1 : 0;
      const bContains = b.projects.some((project) => project.slug === slug) ? 1 : 0;
      if (aContains !== bContains) return bContains - aContains;
      return a.kind === b.kind ? 0 : a.kind === "neighborhood" ? -1 : 1;
    })
    .slice(0, 2)
    .map((hub) => ({
      href: portfolioPlacePath(hub.slug),
      label:
        hub.kind === "neighborhood"
          ? `Projetos em ${hub.name}, ${hub.city}`
          : `Projetos em ${hub.city}`,
    }));

  const segment = SEGMENT_LABELS[item.segment] ?? humanizeTag(item.segment);
  const location = isUsefulPlace(item.city)
    ? [item.neighborhood, item.city, item.state].filter(Boolean).join(" · ")
    : "";
  const label = [segment, location].filter(Boolean).join(" em ");

  return { label, topics, placeLinks };
}


function absolutePortfolioAsset(value?: string): string | undefined {
  const src = clean(value);
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export function portfolioEntityGraphSchema(
  slug: string,
  override?: PortfolioSeoContextOverride,
) {
  const item = resolvePortfolioSeoDescriptor(slug, override);
  const semantic = portfolioSemanticContext(slug, override);
  if (!item) return null;

  const pageUrl = `${SITE_URL}/portfolio/${slug}`;
  const entityId = `${pageUrl}#entity`;
  const webpageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const image = absolutePortfolioAsset(item.image || item.fallbackImage);

  const place =
    isUsefulPlace(item.city)
      ? {
          "@type": "Place",
          "@id": `${pageUrl}#place`,
          name: [item.neighborhood, item.city, item.state].filter(Boolean).join(" · "),
          ...(item.neighborhood
            ? {
                containedInPlace: {
                  "@type": "City",
                  name: item.city,
                  ...(item.state ? { containedInPlace: { "@type": "State", name: item.state } } : {}),
                },
              }
            : item.state
              ? { containedInPlace: { "@type": "State", name: item.state } }
              : {}),
        }
      : null;

  const explicitServices = (item.services ?? []).slice(0, 8);
  const serviceNodes = explicitServices.map((service, index) => ({
    "@type": "Service",
    "@id": `${pageUrl}#service-${index + 1}`,
    name: service,
    provider: { "@id": entityId },
    ...(place ? { areaServed: { "@id": place["@id"] } } : {}),
  }));

  const topicNodes = (semantic?.topics ?? []).map((topic) => ({
    "@type": "DefinedTerm",
    name: topic,
  }));

  const about = [
    ...serviceNodes.map((service) => ({ "@id": service["@id"] })),
    ...topicNodes,
    ...(place ? [{ "@id": place["@id"] }] : []),
  ];

  const entity = {
    "@type": portfolioEntitySchemaType(item.segment),
    "@id": entityId,
    name: item.title,
    description: (portfolioUniversalSeoDescription(slug, override) ?? item.summary) || undefined,
    url: pageUrl,
    image,
    ...(item.subtitle ? { alternateName: item.subtitle } : {}),
    ...(place ? { areaServed: { "@id": place["@id"] } } : {}),
    ...(semantic?.topics.length ? { knowsAbout: semantic.topics } : {}),
    subjectOf: { "@id": webpageId },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": webpageId,
    url: pageUrl,
    name: portfolioUniversalSeoTitle(slug, override) ?? item.title,
    description: (portfolioUniversalSeoDescription(slug, override) ?? item.summary) || undefined,
    inLanguage: "pt-BR",
    mainEntity: { "@id": entityId },
    breadcrumb: { "@id": breadcrumbId },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "0WEB",
    },
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: image } } : {}),
    ...(about.length ? { about } : {}),
    ...(place ? { spatialCoverage: { "@id": place["@id"] } } : {}),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "0WEB",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfólio",
        item: `${SITE_URL}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: pageUrl,
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      webpage,
      entity,
      breadcrumb,
      ...(place ? [place] : []),
      ...serviceNodes,
    ],
  };
}

export function relatedPortfolioItemListSchema(
  slug: string,
  override?: PortfolioSeoContextOverride,
  limit = 6,
) {
  const current = resolvePortfolioSeoDescriptor(slug, override);
  const items = relatedPortfolioSeoItems(slug, override, limit);
  if (!current || !items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/portfolio/${slug}#related-portfolios`,
    name: `Projetos relacionados a ${current.title}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/portfolio/${item.slug}`,
      name: item.title,
    })),
  };
}
