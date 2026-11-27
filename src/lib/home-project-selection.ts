/** Institutional showcase only. Never changes client catalog status or routes. */
export type HomeProject = {
  slug: string;
  clientKey?: string;
  title: string;
  subtitle?: string;
  segment?: string;
  location?: string;
  city?: string;
  state?: string;
  status?: string;
  live?: boolean;
  image?: string;
  fallbackImage?: string;
};

export const HOME_SHOWCASE_SIZE = 6;

// Two larger examples and four complementary sectors, all from the real catalog.
// Missing/unpublished projects are skipped rather than hardcoded into the UI.
const FEATURED_SLUGS = [
  "garagem-girassol",
  "rj-servicos-drywall",
  "sos-presentes-cosmeticos",
  "renata-beauty",
  "dyzpromo",
  "rm-fretes",
];

export function orderHomeProjects(catalog: readonly HomeProject[]): HomeProject[] {
  const live = new Map<string, HomeProject>();
  for (const item of catalog) {
    if (item.status === "published" && item.live !== false && item.slug && !live.has(item.slug)) {
      live.set(item.slug, item);
    }
  }

  const featured = FEATURED_SLUGS.flatMap((slug) => {
    const project = live.get(slug);
    if (!project) return [];
    live.delete(slug);
    return [project];
  });
  return [...featured, ...live.values()];
}

/** Stable on SSR/hydration. Only the explicit next-selection action changes it. */
export function homeProjectPage(items: readonly HomeProject[], page: number): HomeProject[] {
  const start = page * HOME_SHOWCASE_SIZE;
  return items.slice(start, start + HOME_SHOWCASE_SIZE);
}
