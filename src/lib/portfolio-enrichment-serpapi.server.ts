/**
 * SerpApi provider — Portfolio Entity Enrichment (server-only).
 *
 * Pesquisa em escada (cada etapa falha isoladamente):
 *   mapsPlace → reviews → photos → googleSearch → socialDiscovery
 *   → instagramProfile? → facebookProfile? → normalize → score → persist
 *
 * Regras:
 * - a chave vive apenas em process.env.SERPAPI_API_KEY (nunca no bundle client,
 *   nunca versionada). Este arquivo é `.server.ts` e é bloqueado do bundle.
 * - todo dado retornado carrega provenance (provider, engine, sourceUrl,
 *   fetchedAt) e nunca é convertido em fato editorial sem revisão.
 * - proibido scraper de HTML: apenas a API oficial do provider.
 * - ausência só pode ser declarada depois que a etapa específica rodou
 *   (ver §20 do padrão: NO_PHOTOS_FOUND / NO_INSTAGRAM_FOUND).
 */

const SERPAPI_BASE = "https://serpapi.com/search.json";

export type StageStatus =
  | "SUCCESS"
  | "NO_RESULTS"
  | "SKIPPED"
  | "FAILED"
  | "RATE_LIMITED"
  | "UNRESOLVED";

export type SerpApiProvenance = {
  provider: "serpapi";
  engine: string;
  requestUrl: string;
  fetchedAt: string;
  sourceUrl: string | null;
};

export type MediaClassification =
  | "REAL_BUSINESS_PUBLIC_MEDIA"
  | "GOOGLE_USER_MEDIA"
  | "OFFICIAL_BRAND_MEDIA"
  | "GENERATED_CONTEXTUAL_MEDIA"
  | "OWNER_SUPPLIED_MEDIA"
  | "UNKNOWN";

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
  category: string | null;
  author: string | null;
  authorLink: string | null;
  photoDataId: string | null;
  photoMetaLink: string | null;
  position: number | null;
  classification: MediaClassification;
  attribution: "Google — via SerpApi";
  rights: "UNVERIFIED — verificar modelo de uso antes de publicar";
};

export type SocialProfile = {
  platform: string;
  url: string;
  handle: string | null;
  source: "GOOGLE_KNOWLEDGE_GRAPH" | "GOOGLE_MAPS_LINKS" | "GOOGLE_SEARCH_TARGETED";
  confidence: number;
  status: "VERIFIED_AUTOMATICALLY" | "PROBABLE" | "UNVERIFIED";
  signals: string[];
};

export type NormalizedPlace = {
  placeId: string | null;
  dataId: string | null;
  cid: string | null;
  name: string | null;
  category: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: Record<string, string> | null;
  rating: number | null;
  reviewCount: number | null;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string | null;
  reviewsLink: string | null;
  photosLink: string | null;
  thumbnail: string | null;
  links: Record<string, unknown> | null;
  serviceOptions: Record<string, unknown> | null;
  photos: NormalizedPhoto[];
  /** Campos crus não normalizados — preservados para não perder dado novo. */
  extraFields: Record<string, unknown>;
  provenance: SerpApiProvenance;
};

export type EnrichmentSnapshot = {
  slug: string;
  placeId: string;
  generatedAt: string;
  provider: "serpapi";
  google: {
    placeId: string | null;
    dataId: string | null;
    cid: string | null;
    mapsUrl: string | null;
    photos: NormalizedPhoto[];
  };
  place: NormalizedPlace | null;
  reviews: {
    items: NormalizedReview[];
    ratingSummary: { rating: number | null; reviewCount: number | null } | null;
    provenance: SerpApiProvenance;
  } | null;
  knowledgeGraph: Record<string, unknown> | null;
  socialProfiles: SocialProfile[];
  instagram: Record<string, unknown> | null;
  facebook: Record<string, unknown> | null;
  website: { url: string | null; status: "FOUND" | "NO_OFFICIAL_WEBSITE" };
  stages: Record<string, StageStatus>;
  callLog: { engine: string; query: string }[];
  callCount: number;
  errors: string[];
  publicationPolicy: string;
};

const KNOWN_KEYS = new Set([
  "place_id",
  "data_id",
  "data_cid",
  "title",
  "type",
  "types",
  "category",
  "description",
  "address",
  "phone",
  "website",
  "hours",
  "rating",
  "reviews",
  "gps_coordinates",
  "thumbnail",
  "images",
  "photos",
  "links",
  "reviews_link",
  "photos_link",
  "service_options",
]);

function requireKey(): string {
  const key = process.env['SERPAPI_API_KEY'];
  if (!key) throw new Error("SERPAPI_API_KEY ausente no ambiente do servidor");
  return key;
}

const callLog: { engine: string; query: string }[] = [];

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

  callLog.push({ engine, query: params['q'] ?? params['place_id'] ?? params['data_id'] ?? params['profile_id'] ?? "" });

  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  const body = await response.text();
  if (response.status === 429) throw new Error(`RATE_LIMITED: SerpApi ${engine}`);
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
      sourceUrl: data['search_metadata']?.['google_maps_url'] ?? data['search_metadata']?.['google_url'] ?? null,
    },
  };
}

function normalizePhotos(raw: unknown, classification: MediaClassification): NormalizedPhoto[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 40).map((p: any, index: number) => ({
    url: p?.image ?? p?.photo ?? p?.serpapi_thumbnail ?? null,
    thumbnail: p?.thumbnail ?? null,
    title: p?.title ?? null,
    category: p?.category ?? null,
    author: p?.author?.name ?? p?.author ?? null,
    authorLink: p?.author?.link ?? p?.author_link ?? null,
    photoDataId: p?.data_id ?? null,
    photoMetaLink: p?.serpapi_photo_meta_link ?? p?.photo_meta_link ?? null,
    position: typeof p?.position === "number" ? p.position : index + 1,
    classification,
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
  const extraFields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(r)) if (!KNOWN_KEYS.has(k)) extraFields[k] = v;

  return {
    placeId: r['place_id'] ?? placeId,
    dataId: r['data_id'] ?? null,
    cid: r['data_cid'] ?? null,
    name: r['title'] ?? null,
    category: Array.isArray(r['type']) ? r['type'].join(", ") : (r['type'] ?? r['category'] ?? null),
    description: r['description']?.snippet ?? r['description'] ?? null,
    address: r['address'] ?? null,
    phone: r['phone'] ?? null,
    website: r['website'] ?? null,
    hours: normalizeHours(r['hours']),
    rating: typeof r['rating'] === "number" ? r['rating'] : null,
    reviewCount: typeof r['reviews'] === "number" ? r['reviews'] : null,
    latitude: r['gps_coordinates']?.['latitude'] ?? null,
    longitude: r['gps_coordinates']?.['longitude'] ?? null,
    mapsUrl: provenance.sourceUrl,
    reviewsLink: r['reviews_link'] ?? null,
    photosLink: r['photos_link'] ?? null,
    thumbnail: r['thumbnail'] ?? null,
    links: r['links'] ?? null,
    serviceOptions: r['service_options'] ?? null,
    photos: normalizePhotos(r['images'] ?? r['photos'], "GOOGLE_USER_MEDIA"),
    extraFields,
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

/** engine=google_maps_photos — inventário real de fotos da ficha (usa data_id). */
export async function fetchPhotos(dataId: string, limit = 40): Promise<NormalizedPhoto[]> {
  const { data } = await serpApiGet("google_maps_photos", {
    data_id: dataId,
    hl: "pt-br",
  });
  const raw = Array.isArray(data['photos'])
    ? data['photos']
    : Array.isArray(data['photos_results'])
      ? data['photos_results']
      : [];
  return normalizePhotos(raw.slice(0, limit), "GOOGLE_USER_MEDIA");
}

/** engine=google — Knowledge Graph, local results e orgânicos. */
export async function fetchGoogleSearch(query: string, location = "Sao Jose dos Pinhais, State of Parana, Brazil") {
  const { data, provenance } = await serpApiGet("google", {
    q: query,
    hl: "pt-br",
    gl: "br",
    location,
    google_domain: "google.com.br",
    num: "20",
  });
  return {
    knowledgeGraph: (data['knowledge_graph'] ?? null) as Record<string, unknown> | null,
    localResults: data['local_results'] ?? null,
    organicResults: Array.isArray(data['organic_results'])
      ? data['organic_results'].map((o: any) => ({ title: o?.title ?? null, link: o?.link ?? null, snippet: o?.snippet ?? null }))
      : [],
    provenance,
  };
}

const PLATFORMS: { platform: string; host: RegExp }[] = [
  { platform: "instagram", host: /(^|\.)instagram\.com$/i },
  { platform: "facebook", host: /(^|\.)facebook\.com$/i },
  { platform: "youtube", host: /(^|\.)youtube\.com$/i },
  { platform: "tiktok", host: /(^|\.)tiktok\.com$/i },
  { platform: "linkedin", host: /(^|\.)linkedin\.com$/i },
  { platform: "x", host: /(^|\.)(twitter|x)\.com$/i },
];

function classifyUrl(url: string): { platform: string; handle: string | null } | null {
  try {
    const u = new URL(url);
    const match = PLATFORMS.find((p) => p.host.test(u.hostname));
    if (!match) return null;
    const handle = u.pathname.split("/").filter(Boolean)[0] ?? null;
    return { platform: match.platform, handle };
  } catch {
    return null;
  }
}

function scoreProfile(signals: string[]): { confidence: number; status: SocialProfile["status"] } {
  let confidence = 40;
  if (signals.includes("knowledge_graph_profile")) confidence += 45;
  if (signals.includes("maps_link")) confidence += 40;
  if (signals.includes("exact_name")) confidence += 20;
  if (signals.includes("phone_match")) confidence += 25;
  if (signals.includes("locality_match")) confidence += 10;
  confidence = Math.min(confidence, 100);
  const status = confidence >= 90 ? "VERIFIED_AUTOMATICALLY" : confidence >= 70 ? "PROBABLE" : "UNVERIFIED";
  return { confidence, status };
}

/** engine=instagram_profile */
export async function fetchInstagramProfile(handle: string) {
  const { data } = await serpApiGet("instagram_profile", { profile_id: handle });
  return data as Record<string, unknown>;
}

/** engine=facebook_profile */
export async function fetchFacebookProfile(profileId: string) {
  const { data } = await serpApiGet("facebook_profile", { profile_id: profileId });
  return data as Record<string, unknown>;
}

/** Snapshot normalizado completo — nunca publica sozinho. */
export async function buildEnrichmentSnapshot(
  slug: string,
  placeId: string,
  options: { name?: string; phone?: string; locality?: string } = {},
): Promise<EnrichmentSnapshot> {
  callLog.length = 0;
  const errors: string[] = [];
  const stages: Record<string, StageStatus> = {
    mapsPlace: "SKIPPED",
    reviews: "SKIPPED",
    photos: "SKIPPED",
    googleSearch: "SKIPPED",
    socialDiscovery: "SKIPPED",
    instagram: "SKIPPED",
    facebook: "SKIPPED",
  };

  const fail = (stage: string, error: unknown) => {
    const message = (error as Error).message;
    stages[stage] = message.startsWith("RATE_LIMITED") ? "RATE_LIMITED" : "FAILED";
    errors.push(`${stage}: ${message}`);
  };

  let place: NormalizedPlace | null = null;
  let reviews: EnrichmentSnapshot["reviews"] = null;
  let photos: NormalizedPhoto[] = [];
  let knowledgeGraph: Record<string, unknown> | null = null;
  let instagram: Record<string, unknown> | null = null;
  let facebook: Record<string, unknown> | null = null;
  const socialProfiles: SocialProfile[] = [];

  // A — ficha Maps
  try {
    place = await fetchPlace(placeId);
    stages['mapsPlace'] = place.name ? "SUCCESS" : "NO_RESULTS";
  } catch (error) {
    fail("mapsPlace", error);
  }

  const name = options.name ?? place?.name ?? "";
  const phone = options.phone ?? place?.phone ?? "";
  const phoneDigits = phone.replace(/\D/g, "");
  const locality = options.locality ?? "";

  // reviews
  try {
    reviews = await fetchReviews(placeId);
    stages['reviews'] = reviews.items.length ? "SUCCESS" : "NO_RESULTS";
  } catch (error) {
    fail("reviews", error);
  }

  // B — fotos (só declaramos ausência depois desta etapa)
  const dataId = place?.dataId ?? null;
  if (dataId) {
    try {
      photos = await fetchPhotos(dataId);
      stages['photos'] = photos.length ? "SUCCESS" : "NO_RESULTS";
    } catch (error) {
      fail("photos", error);
    }
  } else {
    stages['photos'] = "UNRESOLVED";
    errors.push("photos: data_id não resolvido na ficha Maps");
  }

  // links da própria ficha
  const mapsLinks = place?.links && typeof place.links === "object" ? Object.values(place.links) : [];
  for (const value of mapsLinks) {
    if (typeof value !== "string") continue;
    const parsed = classifyUrl(value);
    if (!parsed) continue;
    const signals = ["maps_link"];
    const { confidence, status } = scoreProfile(signals);
    socialProfiles.push({ ...parsed, url: value, source: "GOOGLE_MAPS_LINKS", confidence, status, signals });
  }

  // C — Google Search / Knowledge Graph
  if (name) {
    try {
      const search = await fetchGoogleSearch(`"${name}" ${locality}`.trim());
      knowledgeGraph = search.knowledgeGraph;
      stages['googleSearch'] = knowledgeGraph || search.organicResults.length ? "SUCCESS" : "NO_RESULTS";

      const kgProfiles = (knowledgeGraph?.['profiles'] ?? []) as any[];
      for (const p of Array.isArray(kgProfiles) ? kgProfiles : []) {
        const link = typeof p?.link === "string" ? p.link : null;
        if (!link) continue;
        const parsed = classifyUrl(link);
        if (!parsed) continue;
        const signals = ["knowledge_graph_profile", "exact_name"];
        const { confidence, status } = scoreProfile(signals);
        socialProfiles.push({ ...parsed, url: link, source: "GOOGLE_KNOWLEDGE_GRAPH", confidence, status, signals });
      }

      // orgânicos que já apontam para redes conhecidas
      for (const o of search.organicResults) {
        if (!o.link) continue;
        const parsed = classifyUrl(o.link);
        if (!parsed) continue;
        if (socialProfiles.some((s) => s.url === o.link)) continue;
        const text = `${o.title ?? ""} ${o.snippet ?? ""}`;
        const signals: string[] = [];
        if (name && text.toLowerCase().includes(name.toLowerCase().slice(0, 10))) signals.push("exact_name");
        if (phoneDigits && text.replace(/\D/g, "").includes(phoneDigits.slice(-8))) signals.push("phone_match");
        if (locality && text.toLowerCase().includes(locality.toLowerCase().slice(0, 8))) signals.push("locality_match");
        const { confidence, status } = scoreProfile(signals);
        socialProfiles.push({ ...parsed, url: o.link, source: "GOOGLE_SEARCH_TARGETED", confidence, status, signals });
      }
    } catch (error) {
      fail("googleSearch", error);
    }
  }

  // D — descoberta social direcionada (no máximo 2 consultas)
  const hasPlatform = (platform: string) => socialProfiles.some((s) => s.platform === platform);
  const targeted: string[] = [];
  if (!hasPlatform("instagram")) targeted.push(`site:instagram.com "${name}" OR "${phone}"`);
  if (!hasPlatform("facebook")) targeted.push(`site:facebook.com "${name}" ${locality}`.trim());
  if (targeted.length) {
    stages['socialDiscovery'] = "NO_RESULTS";
    for (const q of targeted.slice(0, 2)) {
      try {
        const search = await fetchGoogleSearch(q);
        for (const o of search.organicResults) {
          if (!o.link) continue;
          const parsed = classifyUrl(o.link);
          if (!parsed || socialProfiles.some((s) => s.url === o.link)) continue;
          const text = `${o.title ?? ""} ${o.snippet ?? ""}`;
          const signals: string[] = [];
          if (name && text.toLowerCase().includes(name.toLowerCase().slice(0, 8))) signals.push("exact_name");
          if (phoneDigits && text.replace(/\D/g, "").includes(phoneDigits.slice(-8))) signals.push("phone_match");
          if (locality && text.toLowerCase().includes(locality.toLowerCase().slice(0, 8))) signals.push("locality_match");
          const { confidence, status } = scoreProfile(signals);
          socialProfiles.push({ ...parsed, url: o.link, source: "GOOGLE_SEARCH_TARGETED", confidence, status, signals });
          stages['socialDiscovery'] = "SUCCESS";
        }
      } catch (error) {
        fail("socialDiscovery", error);
      }
    }
    if (stages['socialDiscovery'] === "NO_RESULTS" && !socialProfiles.length) stages['socialDiscovery'] = "UNRESOLVED";
  }

  // Instagram / Facebook profile APIs só com handle confiável
  const bestOf = (platform: string) =>
    socialProfiles
      .filter((s) => s.platform === platform && s.status !== "UNVERIFIED" && s.handle)
      .sort((a, b) => b.confidence - a.confidence)[0] ?? null;

  const ig = bestOf("instagram");
  if (ig?.handle) {
    try {
      instagram = await fetchInstagramProfile(ig.handle);
      stages['instagram'] = "SUCCESS";
    } catch (error) {
      fail("instagram", error);
    }
  } else {
    stages['instagram'] = socialProfiles.some((s) => s.platform === "instagram") ? "UNRESOLVED" : "NO_RESULTS";
  }

  const fb = bestOf("facebook");
  if (fb?.handle) {
    try {
      facebook = await fetchFacebookProfile(fb.handle);
      stages['facebook'] = "SUCCESS";
    } catch (error) {
      fail("facebook", error);
    }
  } else {
    stages['facebook'] = socialProfiles.some((s) => s.platform === "facebook") ? "UNRESOLVED" : "NO_RESULTS";
  }

  return {
    slug,
    placeId,
    generatedAt: new Date().toISOString(),
    provider: "serpapi",
    google: {
      placeId: place?.placeId ?? placeId,
      dataId: place?.dataId ?? null,
      cid: place?.cid ?? null,
      mapsUrl: place?.mapsUrl ?? null,
      photos,
    },
    place,
    reviews,
    knowledgeGraph,
    socialProfiles,
    instagram,
    facebook,
    website: place?.website
      ? { url: place.website, status: "FOUND" }
      : { url: null, status: "NO_OFFICIAL_WEBSITE" },
    stages,
    callLog: [...callLog],
    callCount: callLog.length,
    errors,
    publicationPolicy:
      "Ingestão bruta com provenance. Publicar somente após revisão editorial: reviews exigem autoria + atribuição; fotos do Google são GOOGLE_USER_MEDIA e exigem verificação de direitos e atribuição (nunca apresentadas como mídia própria); telefone e endereço permanecem server-side.",
  };
}
