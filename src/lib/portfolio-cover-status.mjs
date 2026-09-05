/**
 * Contrato canônico de status de capa do /portfolio.
 *
 * Fonte única de verdade para responder "este projeto tem uma capa publicável?".
 * Consumidores: scripts/build-portfolio-cover-status.mjs (gera src/config/portfolio-cover-status.json),
 * scripts/report-portfolio-cover-inventory.mjs, scripts/portfolio-originality.mjs e o admin.
 *
 * Princípios:
 *  - `socialImage != portfolioCover`: arte 1200x630 de Open Graph nunca satisfaz capa por si só.
 *  - `heroImage != cardCover`: imagem de hero só vale como capa quando aprovada para essa função.
 *  - "arquivo existe" nunca é suficiente: a capa precisa de julgamento humano registrado.
 */

/** Status canônicos. Pendência = qualquer status != VALID. */
export const COVER_STATUS = {
  VALID: "VALID",
  NEEDS_CROP: "NEEDS_CROP",
  CONTACT_OR_PII: "CONTACT_OR_PII",
  PROMOTIONAL_MATERIAL: "PROMOTIONAL_MATERIAL",
  LOGO_ONLY: "LOGO_ONLY",
  NO_REAL_ASSET: "NO_REAL_ASSET",
  UNCERTAIN_ORIGIN: "UNCERTAIN_ORIGIN",
};

export const PENDING_STATUSES = [
  COVER_STATUS.NEEDS_CROP,
  COVER_STATUS.CONTACT_OR_PII,
  COVER_STATUS.PROMOTIONAL_MATERIAL,
  COVER_STATUS.LOGO_ONLY,
  COVER_STATUS.NO_REAL_ASSET,
  COVER_STATUS.UNCERTAIN_ORIGIN,
];

const SOCIAL_PATTERN = /(^|[-_/])(og|social|share)([-_.]|$)|-og\.|hero-og/i;
const LOGO_PATTERN = /(logo|icone|icon|marca|brand)[-_.]?/i;

/** Uma imagem de catálogo pode ser cover editorial, social ou logo. */
export function classifyImageRole(path) {
  if (!path) return "NONE";
  if (SOCIAL_PATTERN.test(path)) return "SOCIAL";
  if (LOGO_PATTERN.test(path)) return "LOGO";
  return "EDITORIAL";
}

/**
 * @param {object} input
 * @param {string} input.slug
 * @param {object|null} input.review        entrada de src/config/portfolio-visual-review.json
 * @param {string|null} input.catalogImage  campo `image` do catálogo
 * @param {object|null} input.assets        entrada de src/config/portfolio-assets.json
 * @param {string[]} input.projectFiles     arquivos existentes em public/images/<slug>
 * @param {(p: string) => boolean} input.fileExists
 */
export function resolveCoverStatus({
  slug,
  review = null,
  catalogImage = null,
  assets = null,
  projectFiles = [],
  fileExists = () => false,
}) {
  const coverSource = review?.coverSource ?? null;
  const material = review?.coverMaterial ?? null;
  const decision = review?.coverReview ?? null;
  const block = review?.coverBlockReason ?? null;
  const catalogRole = classifyImageRole(catalogImage);
  const sourceRole = classifyImageRole(coverSource);

  const editorialFiles = projectFiles.filter(
    (f) => classifyImageRole(f) === "EDITORIAL" && /\.(png|jpe?g|webp|avif)$/i.test(f),
  );
  const hasOnlyBrandArt = editorialFiles.length === 0 && Boolean(assets?.icon);

  const base = {
    slug,
    asset: coverSource ?? catalogImage ?? null,
    catalogImage: catalogImage ?? null,
    catalogImageRole: catalogRole,
    origin: coverSource ? "VISUAL_REVIEW" : catalogImage ? "CATALOG" : "NONE",
    reviewedAt: review?.reviewedAt ?? null,
  };

  const pending = (status, reason) => ({ ...base, status, reason, cardValid: false });

  // 1. Aprovação humana explícita é o único caminho para VALID.
  if (decision === "APPROVED") {
    if (!coverSource) return pending(COVER_STATUS.UNCERTAIN_ORIGIN, "Aprovado sem asset de origem registrado.");
    if (!fileExists(coverSource)) return pending(COVER_STATUS.NO_REAL_ASSET, "Asset aprovado não existe no repositório.");
    if (sourceRole === "SOCIAL")
      return pending(COVER_STATUS.NEEDS_CROP, "Asset aprovado é imagem social (OG); precisa de recorte editorial de card.");
    if (sourceRole === "LOGO")
      return pending(COVER_STATUS.LOGO_ONLY, "Asset aprovado é marca/logo, não fotografia editorial.");
    return { ...base, status: COVER_STATUS.VALID, reason: null, cardValid: true };
  }

  // 2. Bloqueios registrados na revisão humana.
  if (block === "BLOCKED_CONTACT" || block === "BLOCKED_ADDRESS")
    return pending(COVER_STATUS.CONTACT_OR_PII, "Material exibe contato ou endereço.");
  if (block === "BLOCKED_PROMOTIONAL_PRICE")
    return pending(COVER_STATUS.PROMOTIONAL_MATERIAL, "Material é peça promocional com preço/campanha.");
  if (block === "BLOCKED_QUALITY") {
    if (material === "HAS_SAFE_REAL_MATERIAL")
      return pending(COVER_STATUS.NEEDS_CROP, "Material real e seguro, mas enquadramento não aprovado.");
    return pending(COVER_STATUS.NO_REAL_ASSET, "Sem material real adequado para capa editorial.");
  }

  // 3. Sem bloqueio explícito: classificar pelo material disponível.
  if (material === "MATERIAL_INSUFFICIENT" || material === "NO_SAFE_REAL_MATERIAL") {
    if (hasOnlyBrandArt) return pending(COVER_STATUS.LOGO_ONLY, "Só existe marca/logo do cliente.");
    return pending(COVER_STATUS.NO_REAL_ASSET, "Não há fotografia ou material real apropriado.");
  }
  if (material === "HAS_SAFE_REAL_MATERIAL")
    return pending(COVER_STATUS.NEEDS_CROP, "Material real e seguro aguardando aprovação de enquadramento.");

  return pending(COVER_STATUS.UNCERTAIN_ORIGIN, "Sem julgamento humano registrado para a capa.");
}

/** Agrega uma lista de status em contadores canônicos. */
export function summarizeCoverStatus(rows) {
  const byStatus = Object.fromEntries(Object.values(COVER_STATUS).map((s) => [s, 0]));
  for (const row of rows) byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
  const valid = byStatus[COVER_STATUS.VALID];
  const pending = rows.length - valid;
  return {
    total: rows.length,
    valid,
    pending,
    byStatus,
    balanced: pending === PENDING_STATUSES.reduce((acc, s) => acc + byStatus[s], 0),
  };
}
