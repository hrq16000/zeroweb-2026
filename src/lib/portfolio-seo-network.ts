import portfolioCatalog from "@/config/portfolio-catalog.json";
import { SITE_URL } from "@/lib/portfolio-seo";

export type PortfolioSeoDescriptor = {
  slug: string;
  title: string;
  segment: string;
  city: string;
  state: string;
  tags: string[];
  summary: string;
  subtitle?: string;
  projectType?: string;
};

export type PortfolioSeoContextOverride = Partial<Omit<PortfolioSeoDescriptor, "slug">>;

type CatalogItem = PortfolioSeoDescriptor & {
  status?: string;
  live?: boolean;
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

function isUsefulPlace(value: string): boolean {
  return !GENERIC_PLACES.has(normalize(value));
}

function descriptorFromCatalog(item: CatalogItem): PortfolioSeoDescriptor {
  return {
    slug: item.slug,
    title: clean(item.title),
    segment: clean(item.segment),
    city: clean(item.city),
    state: clean(item.state),
    tags: normalizeTags(item.tags),
    summary: clean(item.summary),
    subtitle: clean(item.subtitle) || undefined,
    projectType: clean(item.projectType) || undefined,
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
    tags:
      normalizeTags(override?.tags).length > 0
        ? normalizeTags(override?.tags)
        : fallback?.tags ?? [],
    summary: clean(override?.summary) || fallback?.summary || "",
    subtitle: clean(override?.subtitle) || fallback?.subtitle,
    projectType: clean(override?.projectType) || fallback?.projectType,
  };
}

function relatedScore(current: PortfolioSeoDescriptor, candidate: PortfolioSeoDescriptor): number {
  let score = 0;

  if (current.segment && candidate.segment && normalize(current.segment) === normalize(candidate.segment)) {
    score += 8;
  }

  if (
    isUsefulPlace(current.city) &&
    isUsefulPlace(candidate.city) &&
    normalize(current.city) === normalize(candidate.city)
  ) {
    score += 7;
  }

  if (
    current.state &&
    candidate.state &&
    normalize(current.state) === normalize(candidate.state)
  ) {
    score += 2;
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
  reason: "city" | "segment" | "affinity" | "state" | "discovery";
};

function relationReason(
  current: PortfolioSeoDescriptor,
  candidate: PortfolioSeoDescriptor,
): RelatedPortfolioSeoItem["reason"] {
  if (
    isUsefulPlace(current.city) &&
    isUsefulPlace(candidate.city) &&
    normalize(current.city) === normalize(candidate.city)
  ) {
    return "city";
  }
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
  const ranked = PUBLIC_ITEMS.map(descriptorFromCatalog)
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => ({
      ...candidate,
      score: relatedScore(current, candidate),
      reason: relationReason(current, candidate),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "pt-BR"));

  const strong = ranked.filter((candidate) => candidate.score >= 3);
  if (strong.length >= requested) return strong.slice(0, requested);

  const selected = new Map(strong.map((item) => [item.slug, item]));
  for (const item of ranked) {
    if (selected.size >= requested) break;
    if (!selected.has(item.slug)) selected.set(item.slug, { ...item, reason: "discovery" });
  }
  return [...selected.values()].slice(0, requested);
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
