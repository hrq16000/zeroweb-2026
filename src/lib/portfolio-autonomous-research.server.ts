/**
 * Pesquisa autônoma de um comércio a partir do mínimo: nome + localização.
 *
 * Objetivo: procurar primeiro, perguntar depois. A ausência de presença digital
 * é um resultado válido e nunca autoriza inventar fatos.
 *
 * Server-only: usa o provider de enrichment já existente e devolve um snapshot
 * compacto para source_snapshot do projeto Managed.
 */

import { extractAutonomousStructuredEvidence } from "@/lib/portfolio-autonomous-evidence";
import {
  buildEnrichmentSnapshot,
  fetchGoogleSearch,
  searchPlaceCandidates,
  type PlaceCandidate,
} from "@/lib/portfolio-enrichment-serpapi.server";

export type AutonomousResolutionStatus =
  | "VERIFIED"
  | "RESOLVED"
  | "FOUND"
  | "UNRESOLVED"
  | "CONFLICT"
  | "PROVIDER_BLOCKED";

export type AutonomousResearchResult = {
  input: { name: string; locationText: string };
  researchedAt: string;
  resolution: {
    status: AutonomousResolutionStatus;
    confidence: number;
    reason: string;
    placeId: string | null;
  };
  footprint: "STRONG" | "PARTIAL" | "NONE" | "PROVIDER_BLOCKED";
  locality: { city: string; state: string; searchLocation: string };
  categoryHint: string;
  segmentHint: string;
  funnelIntentHint: "orcamento" | "agendamento" | "pedido" | "contato" | "reserva" | "diagnostico";
  facts: Array<{
    field: string;
    value: string;
    sourceType: "OWNER_SUPPLIED" | "GOOGLE" | "PUBLIC_WEB" | "OFFICIAL_SOCIAL";
    confidence: number;
    sourceUrl: string | null;
  }>;
  mapCandidates: Array<PlaceCandidate & { score: number }>;
  webResults: Array<{ title: string; link: string; snippet: string; query: string }>;
  socialProfiles: Array<{
    platform: string;
    url: string;
    handle: string | null;
    confidence: number;
    source: string;
  }>;
  mediaCandidates: Array<{
    url: string | null;
    thumbnail: string | null;
    classification: string;
    rights: string;
  }>;
  reviewEvidence: Array<{
    rating: number | null;
    text: string | null;
    author: string | null;
    sourceUrl: string | null;
  }>;
  website: string | null;
  providerCalls: string[];
  providerErrors: string[];
  missing: string[];
  policy: string;
};

function norm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return [...new Set(norm(value).split(/\s+/).filter((t) => t.length >= 2))];
}

function overlap(a: string, b: string): number {
  const aa = new Set(tokens(a));
  const bb = new Set(tokens(b));
  if (!aa.size || !bb.size) return 0;
  let hit = 0;
  for (const t of aa) if (bb.has(t)) hit += 1;
  return hit / Math.max(aa.size, Math.min(aa.size + 2, bb.size || 1));
}

function parseLocality(locationText: string) {
  const clean = locationText.trim();
  const stateMatch = clean.match(/(?:-|,|\/|\s)([A-Za-z]{2})\s*$/);
  const state = stateMatch?.[1]?.toUpperCase() ?? "";
  const withoutState = stateMatch ? clean.slice(0, stateMatch.index).trim().replace(/[,-]\s*$/, "") : clean;
  const parts = withoutState.split(",").map((p) => p.trim()).filter(Boolean);
  const city = parts.length >= 2 ? parts[parts.length - 1] : "";
  const searchLocation = city
    ? `${city}${state ? `, ${state}` : ""}, Brazil`
    : clean || "Brazil";
  return { city, state, searchLocation };
}

function scoreCandidate(name: string, locationText: string, candidate: PlaceCandidate): number {
  const candidateName = candidate.name ?? "";
  const candidateAddress = candidate.address ?? "";
  const nameOverlap = overlap(name, candidateName);
  const locationOverlap = overlap(locationText, candidateAddress);
  const exactName = norm(name) === norm(candidateName);
  let score = Math.round(nameOverlap * 55 + locationOverlap * 35 + (exactName ? 10 : 0));
  if (candidate.phone) score += 2;
  if (candidate.website) score += 2;
  return Math.min(100, score);
}

function classifySocial(url: string): { platform: string; handle: string | null } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const platform =
      host === "instagram.com"
        ? "instagram"
        : host === "facebook.com"
          ? "facebook"
          : host === "tiktok.com"
            ? "tiktok"
            : host === "youtube.com"
              ? "youtube"
              : null;
    if (!platform) return null;
    return { platform, handle: u.pathname.split("/").filter(Boolean)[0] ?? null };
  } catch {
    return null;
  }
}

function inferCategory(name: string, mapCategory: string | null) {
  const raw = norm(`${name} ${mapCategory ?? ""}`);
  const rules: Array<[RegExp, string, string, AutonomousResearchResult["funnelIntentHint"]]> = [
    [/presente|gift|papelaria|cosmetic|acessorio|loja|boutique|varejo/, "comércio local", "comercios", "pedido"],
    [/restaurante|lanchonete|pizza|pastel|marmita|confeitaria|doces|salgados|food/, "alimentação", "restaurantes", "pedido"],
    [/salao|beleza|estetica|barbearia|manicure|cabeleireir/, "beleza", "beleza", "agendamento"],
    [/clinica|odont|nutri|fisioter|saude|terapia/, "saúde", "saude", "agendamento"],
    [/eletric|hidraul|reparo|manutenc|construc|marcen|moveis|tecnico/, "serviços", "servicos", "orcamento"],
    [/hotel|pousada|hosped/, "hospedagem", "servicos", "reserva"],
    [/informatica|notebook|computador|celular|assistencia tecnica/, "assistência técnica", "servicos", "diagnostico"],
  ];
  for (const [re, categoryHint, segmentHint, funnelIntentHint] of rules) {
    if (re.test(raw)) return { categoryHint, segmentHint, funnelIntentHint };
  }
  return { categoryHint: mapCategory || "negócio local", segmentHint: "servicos", funnelIntentHint: "contato" as const };
}

export async function runAutonomousPortfolioResearch(input: {
  name: string;
  locationText: string;
}): Promise<AutonomousResearchResult> {
  const name = input.name.trim();
  const locationText = input.locationText.trim();
  const locality = parseLocality(locationText);
  const providerCalls: string[] = [];
  const providerErrors: string[] = [];
  const webResults: AutonomousResearchResult["webResults"] = [];
  const socialProfiles: AutonomousResearchResult["socialProfiles"] = [];
  let rawCandidates: PlaceCandidate[] = [];

  try {
    providerCalls.push(`google_maps: ${name} | ${locality.searchLocation}`);
    const maps = await searchPlaceCandidates(name, locality.searchLocation, 8);
    rawCandidates = maps.candidates;
  } catch (error) {
    providerErrors.push(`google_maps: ${error instanceof Error ? error.message : String(error)}`);
  }

  const mapCandidates = rawCandidates
    .map((candidate) => ({ ...candidate, score: scoreCandidate(name, locationText, candidate) }))
    .sort((a, b) => b.score - a.score);

  const first = mapCandidates[0] ?? null;
  const second = mapCandidates[1] ?? null;
  const conflict = Boolean(first && second && first.score >= 60 && second.score >= 60 && first.score - second.score <= 7);

  let resolution: AutonomousResearchResult["resolution"] = {
    status: "UNRESOLVED",
    confidence: first?.score ?? 0,
    reason: first ? "Candidato encontrado, mas sem sinais suficientes para resolução automática." : "Nenhuma ficha local correspondente foi encontrada.",
    placeId: first?.placeId ?? null,
  };

  if (conflict) {
    resolution = {
      status: "CONFLICT",
      confidence: first?.score ?? 0,
      reason: "Há candidatos locais próximos demais; o sistema não deve escolher silenciosamente.",
      placeId: null,
    };
  } else if (first?.placeId && first.score >= 85) {
    resolution = { status: "VERIFIED", confidence: first.score, reason: "Nome e localização convergem fortemente.", placeId: first.placeId };
  } else if (first?.placeId && first.score >= 70) {
    resolution = { status: "RESOLVED", confidence: first.score, reason: "Nome e localização convergem de forma suficiente.", placeId: first.placeId };
  } else if (first && first.score >= 55) {
    resolution = { status: "FOUND", confidence: first.score, reason: "Entidade provável encontrada, ainda sem confiança para tratá-la como verificada.", placeId: first.placeId };
  }

  let enrichment: Awaited<ReturnType<typeof buildEnrichmentSnapshot>> | null = null;
  if (!conflict && resolution.placeId && resolution.confidence >= 70) {
    try {
      providerCalls.push(`enrichment: place_id=${resolution.placeId}`);
      enrichment = await buildEnrichmentSnapshot(name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), resolution.placeId, {
        name,
        locality: locality.searchLocation,
      });
      providerCalls.push(...enrichment.callLog.map((x) => `${x.engine}: ${x.query}`));
      providerErrors.push(...enrichment.errors);
    } catch (error) {
      providerErrors.push(`enrichment: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Se não existe ficha local confiável, ampliar a busca para web/social.
  if (!enrichment) {
    const queries = [
      `"${name}" "${locationText}"`,
      `site:instagram.com "${name}" "${locality.city || locationText}"`,
      `site:facebook.com "${name}" "${locality.city || locationText}"`,
      `site:tiktok.com "${name}" "${locality.city || locationText}"`,
    ];
    for (const query of queries) {
      try {
        providerCalls.push(`google: ${query}`);
        const result = await fetchGoogleSearch(query, locality.searchLocation);
        for (const row of result.organicResults.slice(0, 12)) {
          if (!row.link) continue;
          if (!webResults.some((existing) => existing.link === row.link)) {
            webResults.push({
              title: row.title ?? "",
              link: row.link,
              snippet: row.snippet ?? "",
              query,
            });
          }
        }
      } catch (error) {
        providerErrors.push(`google: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  if (enrichment) {
    for (const profile of enrichment.socialProfiles) {
      socialProfiles.push({
        platform: profile.platform,
        url: profile.url,
        handle: profile.handle,
        confidence: profile.confidence,
        source: profile.source,
      });
    }
  } else {
    for (const result of webResults) {
      const social = classifySocial(result.link);
      if (!social || socialProfiles.some((p) => p.url === result.link)) continue;
      const text = norm(`${result.title} ${result.snippet}`);
      const nameSignal = overlap(name, text);
      const localitySignal = overlap(locationText, text);
      const confidence = Math.min(95, Math.round(40 + nameSignal * 35 + localitySignal * 20));
      socialProfiles.push({ ...social, url: result.link, confidence, source: "GOOGLE_SEARCH_TARGETED" });
    }
  }

  const bestPlace = enrichment?.place ?? first ?? null;
  const inferred = inferCategory(name, enrichment?.place?.category ?? first?.category ?? null);
  const facts: AutonomousResearchResult["facts"] = [
    { field: "name", value: name, sourceType: "OWNER_SUPPLIED", confidence: 100, sourceUrl: null },
    { field: "location", value: locationText, sourceType: "OWNER_SUPPLIED", confidence: 100, sourceUrl: null },
  ];
  if (bestPlace?.address) {
    facts.push({ field: "address", value: bestPlace.address, sourceType: "GOOGLE", confidence: resolution.confidence, sourceUrl: enrichment?.google.mapsUrl ?? first?.mapsUrl ?? null });
  }
  if (enrichment?.place?.category) {
    facts.push({ field: "category", value: enrichment.place.category, sourceType: "GOOGLE", confidence: resolution.confidence, sourceUrl: enrichment.google.mapsUrl });
  }
  if (enrichment?.place?.website) {
    facts.push({ field: "website", value: enrichment.place.website, sourceType: "GOOGLE", confidence: resolution.confidence, sourceUrl: enrichment.google.mapsUrl });
  }
  facts.push(
    ...extractAutonomousStructuredEvidence({
      resolutionConfidence: resolution.confidence,
      sourceUrl: enrichment?.google.mapsUrl ?? first?.mapsUrl ?? null,
      placeServiceOptions: enrichment?.place?.serviceOptions,
      placeExtraFields: enrichment?.place?.extraFields,
      knowledgeGraph: enrichment?.knowledgeGraph,
    }),
  );
  for (const profile of socialProfiles.filter((p) => p.confidence >= 70).slice(0, 4)) {
    facts.push({ field: profile.platform, value: profile.url, sourceType: "OFFICIAL_SOCIAL", confidence: profile.confidence, sourceUrl: profile.url });
  }

  const mediaCandidates = (enrichment?.google.photos ?? []).slice(0, 16).map((photo) => ({
    url: photo.url,
    thumbnail: photo.thumbnail,
    classification: photo.classification,
    rights: photo.rights,
  }));
  const reviewEvidence = (enrichment?.reviews?.items ?? []).slice(0, 6).map((review) => ({
    rating: review.rating,
    text: review.text,
    author: review.author,
    sourceUrl: review.sourceUrl,
  }));

  const hasProviderSuccess = Boolean(rawCandidates.length || webResults.length || enrichment);
  const hasStrongIdentity = resolution.status === "VERIFIED" || resolution.status === "RESOLVED";
  const hasExtraFootprint = Boolean(
    enrichment?.website.url ||
    socialProfiles.length ||
    webResults.length ||
    mediaCandidates.length,
  );
  const allProviderBlocked = !hasProviderSuccess && providerErrors.length > 0;
  const footprint: AutonomousResearchResult["footprint"] = allProviderBlocked
    ? "PROVIDER_BLOCKED"
    : hasStrongIdentity && hasExtraFootprint
      ? "STRONG"
      : rawCandidates.length || webResults.length || socialProfiles.length
        ? "PARTIAL"
        : "NONE";

  if (allProviderBlocked) {
    resolution = {
      ...resolution,
      status: "PROVIDER_BLOCKED",
      reason: "Os providers de pesquisa não responderam; o rascunho pode existir, mas a pesquisa deve ser reexecutada.",
    };
  }

  const missing: string[] = [];
  if (!hasStrongIdentity) missing.push("verified_entity");
  if (!socialProfiles.length) missing.push("official_social");
  if (!mediaCandidates.length) missing.push("usable_real_media");
  if (!enrichment?.place?.website && !webResults.some((r) => !classifySocial(r.link))) missing.push("official_website_or_public_reference");
  if (!enrichment?.place?.phone) missing.push("verified_phone");
  missing.push("verified_whatsapp");

  return {
    input: { name, locationText },
    researchedAt: new Date().toISOString(),
    resolution,
    footprint,
    locality,
    categoryHint: inferred.categoryHint,
    segmentHint: inferred.segmentHint,
    funnelIntentHint: inferred.funnelIntentHint,
    facts,
    mapCandidates: mapCandidates.slice(0, 5),
    webResults: webResults.slice(0, 20),
    socialProfiles: socialProfiles.sort((a, b) => b.confidence - a.confidence).slice(0, 10),
    mediaCandidates,
    reviewEvidence,
    website: enrichment?.website.url ?? null,
    providerCalls,
    providerErrors,
    missing: [...new Set(missing)],
    policy:
      "Nome e localização fornecidos pelo administrador são fatos de entrada. Dados públicos só viram conteúdo após resolução/confiança. Ausência de presença digital não autoriza invenção. Telefone público não é presumido WhatsApp. Fotos públicas permanecem evidência/mídia candidata com direitos não verificados.",
  };
}
