/**
 * SerpApi provider — Portfolio Entity Enrichment (server-only).
 *
 * Regras:
 * - a chave vive apenas em process.env.SERPAPI_API_KEY (nunca no bundle client,
 *   nunca versionada). Este arquivo é `.server.ts` e é bloqueado do bundle.
 * - todo dado retornado carrega provenance (provider, engine, sourceUrl,
 *   fetchedAt) e nunca é convertido em fato editorial sem revisão.
 * - proibido scraper de HTML: apenas a API oficial do provider.
 */

const SERPAPI_BASE = "https://serpapi.com/search.json";

export type SerpApiProvenance = {
  provider: "serpapi";
  engine: string;
  requestUrl: string;
  fetchedAt: string;
  sourceUrl: string | null;
};

export type NormalizedReview = {
  author: string | null;
  authorProfileUrl: string | null;
  rating: number | null;
  text: string | null;
  publishedAtLabel: string | null;
  publishedAtIso: string | null;
  sourceUrl: string | null;
  attribution: "Google — via SerpApi";
};

export type NormalizedPhoto = {
  url: string | null;
  thumbnail: string | null;
  title: string | null;
  attribution: "Google — via SerpApi";
  rights: "UNVERIFIED — verificar modelo de uso antes de publicar";
};

export type NormalizedPlace = {
  placeId: string | null;
  dataId: string | null;
  name: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: Record<string, string> | null;
  rating: number | null;
  reviewCount: number | null;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string | null;
  serviceOptions: Record<string, unknown> | null;
  photos: NormalizedPhoto[];
  provenance: SerpApiProvenance;
};

export type EnrichmentSnapshot = {
  slug: string;
  placeId: string;
  generatedAt: string;
  provider: "serpapi";
  place: NormalizedPlace | null;
  reviews: {
    items: NormalizedReview[];
    ratingSummary: { rating: number | null; reviewCount: number | null } | null;
    provenance: SerpApiProvenance;
  } | null;
  errors: string[];
  publicationPolicy: string;
};

function requireKey(): string {
  const key = process.env['SERPAPI_API_KEY'];
  if (!key) throw new Error("SERPAPI_API_KEY ausente no ambiente do servidor");
  return key;
}

async function serpApiGet(
  engine: string,
  params: Record<string, string>,
): Promise<{ data: Record<string, any>; provenance: SerpApiProvenance }> {
  const key = requireKey();
  const url = new URL(SERPAPI_BASE);
  url.searchParams.set("engine", engine);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const redacted = `${url.origin}${url.pathname}?${url.searchParams.toString()}`;
  url.searchParams.set("api_key", key);

  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`SerpApi ${engine} falhou [${response.status}]: ${body.slice(0, 500)}`);
  }
  const data = JSON.parse(body) as Record<string, any>;
  if (data['error']) throw new Error(`SerpApi ${engine}: ${String(data['error'])}`);

  return {
    data,
    provenance: {
      provider: "serpapi",
      engine,
      requestUrl: redacted,
      fetchedAt: new Date().toISOString(),
      sourceUrl: data['search_metadata']?.['google_maps_url'] ?? null,
    },
  };
}

function normalizePhotos(raw: unknown): NormalizedPhoto[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 20).map((p: any) => ({
    url: p?.image ?? p?.photo ?? null,
    thumbnail: p?.thumbnail ?? null,
    title: p?.title ?? null,
    attribution: "Google — via SerpApi" as const,
    rights: "UNVERIFIED — verificar modelo de uso antes de publicar" as const,
  }));
}

function normalizeHours(raw: unknown): Record<string, string> | null {
  if (!Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const entry of raw as any[]) {
    if (entry && typeof entry === "object") {
      for (const [day, value] of Object.entries(entry)) {
        if (typeof value === "string") out[day] = value;
      }
    }
  }
  return Object.keys(out).length ? out : null;
}

/** engine=google_maps — ficha da empresa (dados + descoberta). */
export async function fetchPlace(placeId: string): Promise<NormalizedPlace> {
  const { data, provenance } = await serpApiGet("google_maps", {
    type: "place",
    place_id: placeId,
    hl: "pt-br",
    gl: "br",
  });
  const r = (data['place_results'] ?? {}) as Record<string, any>;
  return {
    placeId: r['place_id'] ?? placeId,
    dataId: r['data_id'] ?? null,
    name: r['title'] ?? null,
    category: r['type'] ?? (Array.isArray(r['types']) ? r['types'][0] : null) ?? null,
    address: r['address'] ?? null,
    phone: r['phone'] ?? null,
    website: r['website'] ?? null,
    hours: normalizeHours(r['hours']),
    rating: typeof r['rating'] === "number" ? r['rating'] : null,
    reviewCount: typeof r['reviews'] === "number" ? r['reviews'] : null,
    latitude: r['gps_coordinates']?.['latitude'] ?? null,
    longitude: r['gps_coordinates']?.['longitude'] ?? null,
    mapsUrl: provenance.sourceUrl,
    serviceOptions: r['service_options'] ?? null,
    photos: normalizePhotos(r['images'] ?? r['photos']),
    provenance,
  };
}

/** engine=google_maps_reviews — avaliações com autoria e atribuição. */
export async function fetchReviews(placeId: string, limit = 20) {
  const { data, provenance } = await serpApiGet("google_maps_reviews", {
    place_id: placeId,
    hl: "pt-br",
    sort_by: "qualityScore",
  });
  const items: NormalizedReview[] = (Array.isArray(data['reviews']) ? data['reviews'] : [])
    .slice(0, limit)
    .map((rev: any) => ({
      author: rev?.user?.name ?? null,
      authorProfileUrl: rev?.user?.link ?? null,
      rating: typeof rev?.rating === "number" ? rev.rating : null,
      text: rev?.snippet ?? rev?.extracted_snippet?.original ?? null,
      publishedAtLabel: rev?.date ?? null,
      publishedAtIso: rev?.iso_date ?? null,
      sourceUrl: rev?.link ?? null,
      attribution: "Google — via SerpApi" as const,
    }));
  const summary = data['place_info'] ?? {};
  return {
    items,
    ratingSummary: {
      rating: typeof summary['rating'] === "number" ? summary['rating'] : null,
      reviewCount: typeof summary['reviews'] === "number" ? summary['reviews'] : null,
    },
    provenance,
  };
}

/** Snapshot normalizado completo — nunca publica sozinho. */
export async function buildEnrichmentSnapshot(
  slug: string,
  placeId: string,
): Promise<EnrichmentSnapshot> {
  const errors: string[] = [];
  let place: NormalizedPlace | null = null;
  let reviews: EnrichmentSnapshot["reviews"] = null;

  try {
    place = await fetchPlace(placeId);
  } catch (error) {
    errors.push(`place: ${(error as Error).message}`);
  }
  try {
    reviews = await fetchReviews(placeId);
  } catch (error) {
    errors.push(`reviews: ${(error as Error).message}`);
  }

  return {
    slug,
    placeId,
    generatedAt: new Date().toISOString(),
    provider: "serpapi",
    place,
    reviews,
    errors,
    publicationPolicy:
      "Ingestão bruta com provenance. Publicar somente após revisão editorial: reviews exigem autoria + atribuição; fotos do Google exigem verificação de direitos; telefone e endereço permanecem server-side.",
  };
}
