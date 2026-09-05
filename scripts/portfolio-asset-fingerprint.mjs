/**
 * Assinatura REAL de assets do portfólio — métrica de originalidade v2.
 *
 * Problema da v1: o padrão de assets era derivado do BASENAME dos arquivos
 * (`hero.jpg`, `logo.svg`, `servicos.webp`). Projetos de clientes diferentes,
 * com fotos completamente diferentes, ficavam com ASSET_PATTERN = 100 apenas
 * por usarem a mesma convenção de nomes.
 *
 * Regra v2:
 *   SAME_BASENAME_ONLY != ASSET_DUPLICATION
 *
 * Identidade de um asset, em ordem de força:
 *   1. content hash  (bytes reais)          -> IDENTICAL_ASSET_CONTENT
 *   2. referência canônica (path/URL exata) -> SHARED_ASSET_REFERENCE
 *   3. metadados (mime, proporção, tamanho) -> sinal complementar, nunca prova
 *   4. basename                             -> NÃO é sinal de duplicação
 *
 * Fingerprint perceptual (mesma foto redimensionada/recomprimida) fica como
 * melhoria futura: não há tooling de imagem no projeto e não vale instalar
 * dependência pesada só para isso. Ver PERCEPTUAL_ASSET_MATCH (reservado).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ASSET_METRIC_VERSION = 2;

export const ASSET_REASONS = {
  IDENTICAL_ASSET_CONTENT: "IDENTICAL_ASSET_CONTENT",
  SHARED_ASSET_REFERENCE: "SHARED_ASSET_REFERENCE",
  PERCEPTUAL_ASSET_MATCH: "PERCEPTUAL_ASSET_MATCH", // reservado (não emitido na v2)
  SAME_BASENAME_ONLY: "SAME_BASENAME_ONLY",
  DISTINCT_ASSET: "DISTINCT_ASSET",
  NO_ASSET: "NO_ASSET",
};

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

/** Referência canônica: minúscula, sem querystring, sem `./`, sempre com `/`. */
export function normalizeAssetRef(ref) {
  const raw = String(ref ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      return `${u.protocol}//${u.host.toLowerCase()}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
    } catch {
      return raw.toLowerCase();
    }
  }
  return `/${raw.replace(/^\.?\/+/, "").split("?")[0].split("#")[0]}`.toLowerCase();
}

/** Bucket de proporção — sinal complementar, granularidade grosseira de propósito. */
export function ratioBucket(width, height) {
  if (!width || !height) return "unknown";
  const r = width / height;
  if (r >= 2.2) return "ultrawide";
  if (r >= 1.45) return "wide";
  if (r >= 1.15) return "landscape";
  if (r >= 0.87) return "square";
  if (r >= 0.6) return "portrait";
  return "tall";
}

export function sizeBucket(bytes) {
  if (!bytes) return "unknown";
  if (bytes < 20_000) return "xs";
  if (bytes < 80_000) return "s";
  if (bytes < 250_000) return "m";
  if (bytes < 800_000) return "l";
  return "xl";
}

const hashCache = new Map();

export function fileContentHash(absPath) {
  if (hashCache.has(absPath)) return hashCache.get(absPath);
  let out = null;
  try {
    out = crypto.createHash("sha256").update(fs.readFileSync(absPath)).digest("hex").slice(0, 24);
  } catch {
    out = null;
  }
  hashCache.set(absPath, out);
  return out;
}

/**
 * Descreve um asset. `absPath` só existe para assets locais; assets remotos
 * ficam identificados apenas pela referência canônica.
 */
export function describeAsset({ ref, absPath = "", role = "ASSET", dimensions = null }) {
  const canonical = normalizeAssetRef(ref);
  const basename = canonical ? path.posix.basename(canonical) : "";
  const ext = basename.includes(".") ? `.${basename.split(".").pop()}` : "";
  const remote = /^https?:\/\//i.test(canonical);
  let bytes = 0;
  if (absPath) {
    try {
      bytes = fs.statSync(absPath).size;
    } catch {
      bytes = 0;
    }
  }
  const contentHash = absPath ? fileContentHash(absPath) : null;
  return {
    role,
    ref: String(ref ?? ""),
    canonical,
    basename,
    ext,
    mime: MIME_BY_EXT[ext] ?? "application/octet-stream",
    remote,
    exists: Boolean(contentHash) || (remote && Boolean(canonical)),
    bytes,
    contentHash,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    ratioBucket: ratioBucket(dimensions?.width, dimensions?.height),
    sizeBucket: sizeBucket(bytes),
  };
}

/** Classificação de um par de assets. Nome igual NUNCA é duplicação. */
export function classifyAssetPair(a, b) {
  if (!a || !b || (!a.canonical && !b.canonical)) return ASSET_REASONS.NO_ASSET;
  if (a.contentHash && b.contentHash && a.contentHash === b.contentHash) {
    return ASSET_REASONS.IDENTICAL_ASSET_CONTENT;
  }
  if (a.canonical && a.canonical === b.canonical) return ASSET_REASONS.SHARED_ASSET_REFERENCE;
  if (a.basename && a.basename === b.basename) return ASSET_REASONS.SAME_BASENAME_ONLY;
  return ASSET_REASONS.DISTINCT_ASSET;
}

/** Tokens de IDENTIDADE do asset (o que prova duplicação real). */
export function assetIdentityTokens(descriptors) {
  const out = new Set();
  for (const d of descriptors ?? []) {
    if (d.contentHash) out.add(`content:${d.contentHash}`);
    else if (d.canonical) out.add(`ref:${d.canonical}`);
  }
  return out;
}

/** Tokens de PERFIL (composição de mídia). Sinal fraco e complementar. */
export function assetProfileTokens(descriptors) {
  const out = new Set();
  const list = descriptors ?? [];
  for (const d of list) {
    out.add(`profile:${d.mime}:${d.ratioBucket}`);
  }
  const n = list.length;
  out.add(`count:${n === 0 ? 0 : n <= 3 ? "1-3" : n <= 8 ? "4-8" : n <= 20 ? "9-20" : "20+"}`);
  return out;
}

const jaccard = (a, b) => {
  if (a.size === 0 || b.size === 0) return 0; // ausência não é identidade compartilhada
  let inter = 0;
  for (const v of a) if (b.has(v)) inter += 1;
  return inter / (a.size + b.size - inter);
};

export const ASSET_IDENTITY_WEIGHT = 0.85;
export const ASSET_PROFILE_WEIGHT = 0.15;

/**
 * Similaridade de assets v2 (0–1) + reason codes do par.
 * Identidade real domina; perfil de mídia só desempata.
 */
export function compareAssetSets(aDescriptors, bDescriptors) {
  const aId = assetIdentityTokens(aDescriptors);
  const bId = assetIdentityTokens(bDescriptors);
  const identity = jaccard(aId, bId);
  const profile = jaccard(assetProfileTokens(aDescriptors), assetProfileTokens(bDescriptors));
  const similarity = identity * ASSET_IDENTITY_WEIGHT + profile * ASSET_PROFILE_WEIGHT;

  const reasons = new Set();
  const shared = [];
  for (const a of aDescriptors ?? []) {
    for (const b of bDescriptors ?? []) {
      const r = classifyAssetPair(a, b);
      if (r === ASSET_REASONS.IDENTICAL_ASSET_CONTENT || r === ASSET_REASONS.SHARED_ASSET_REFERENCE) {
        reasons.add(r);
        shared.push({ reason: r, a: a.canonical, b: b.canonical });
      }
    }
  }
  if (!reasons.size && (aDescriptors?.length ?? 0) && (bDescriptors?.length ?? 0)) {
    const sameName = (aDescriptors ?? []).some((a) =>
      (bDescriptors ?? []).some((b) => classifyAssetPair(a, b) === ASSET_REASONS.SAME_BASENAME_ONLY));
    reasons.add(sameName ? ASSET_REASONS.SAME_BASENAME_ONLY : ASSET_REASONS.DISTINCT_ASSET);
  }
  if (!(aDescriptors?.length ?? 0) || !(bDescriptors?.length ?? 0)) reasons.add(ASSET_REASONS.NO_ASSET);

  return {
    similarity,
    identity,
    profile,
    reasons: [...reasons].sort(),
    sharedAssets: shared.slice(0, 10),
  };
}

/** Padrão v1 (preservado para comparação): basenames normalizados. */
export function assetPatternV1(files) {
  return (files ?? [])
    .filter((f) => /\.(webp|avif|jpe?g|png|svg)$/i.test(f))
    .map((f) => f.toLowerCase().replace(/\d+/g, "#"));
}
