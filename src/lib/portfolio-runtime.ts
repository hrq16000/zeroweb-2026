/**
 * RESOLVER ÚNICO DE RUNTIME DO PORTFÓLIO (Frente A).
 *
 * Política central de precedência — não repetir `db || json` em componentes:
 *
 *   effective.campo = override_do_banco_válido ?? valor_do_registry/rota
 *
 * "Válido" significa: string não vazia, sem contato operacional, e — para
 * assets — caminho interno permitido. Campo vazio no banco = herda registry,
 * então limpar o override no admin é o rollback natural.
 *
 * Este módulo é puro (sem I/O) para poder ser usado no SSR, no cliente,
 * nos testes e no gate `check:portfolio-runtime-overrides`.
 */
import { containsPublicContact, isSafeAssetPath } from "@/lib/portfolio-admin";

export type PortfolioLifecycle = "imported" | "draft" | "published" | "archived";

/** Linha crua vinda de public.portfolio_client_settings (colunas públicas). */
export type PortfolioRuntimeRow = {
  slug?: string | null;
  client_key?: string | null;
  display_name?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  canonical_url?: string | null;
  logo_url?: string | null;
  hero_image_url?: string | null;
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  social_image_url?: string | null;
  social_version?: string | null;
  cta_label?: string | null;
  share_copy?: string | null;
  gallery?: unknown;
  brand_colors?: unknown;
  lifecycle_status?: string | null;
  published?: boolean | null;
  archived_at?: string | null;
  content_version?: number | null;
};

/** Overrides já sanitizados: só entra aqui o que pode ir ao runtime público. */
export type PortfolioRuntimeOverrides = {
  displayName?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  socialImageUrl?: string;
  socialVersion?: string;
  ctaLabel?: string;
  shareCopy?: string;
  gallery?: string[];
  brandColors?: Record<string, string>;
  lifecycle: PortfolioLifecycle;
  published: boolean;
  contentVersion: number;
};

/** Valores derivados dos registries/rota, usados como fallback. */
export type PortfolioRuntimeBase = {
  slug: string;
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  socialImage: string;
  logoUrl?: string;
  heroImageUrl?: string;
  shareCopy?: string;
};

export type PortfolioRuntimeEffective = PortfolioRuntimeBase & {
  heroHeadline?: string;
  heroSubheadline?: string;
  ctaLabel?: string;
  gallery: string[];
  brandColors: Record<string, string>;
  lifecycle: PortfolioLifecycle;
  published: boolean;
  indexable: boolean;
  robots: string;
  /** Campos que vieram do banco (para a matriz de suporte e para o gate). */
  overriddenFields: string[];
};

const HEX = /^#[0-9a-fA-F]{3,8}$/;

function text(value: unknown, max = 400): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().replace(/\s+/g, " ");
  if (!v || v.length > max) return undefined;
  if (containsPublicContact(v)) return undefined;
  if (/[<>]/.test(v)) return undefined; // sem HTML/XSS em campo administrável
  return v;
}

function asset(value: unknown): string | undefined {
  const v = text(value, 300);
  if (!v) return undefined;
  return isSafeAssetPath(v) ? v : undefined;
}

function lifecycleOf(row: PortfolioRuntimeRow): PortfolioLifecycle {
  const raw = String(row.lifecycle_status ?? "").trim();
  if (raw === "draft" || raw === "published" || raw === "archived" || raw === "imported") return raw;
  return row.published ? "published" : "imported";
}

/**
 * Sanitiza a linha do banco. Nada aqui confia no admin:
 * contato operacional, HTML, URL externa e canonical arbitrária são descartados.
 */
export function sanitizePortfolioRuntimeRow(
  slug: string,
  row: PortfolioRuntimeRow | null | undefined,
): PortfolioRuntimeOverrides | null {
  if (!row) return null;
  const canonicalAllowed = `https://0web.com.br/portfolio/${slug}`;
  const canonical = text(row.canonical_url, 300);

  const gallery = Array.isArray(row.gallery)
    ? (row.gallery as unknown[]).map(asset).filter((v): v is string => Boolean(v))
    : undefined;

  const brandColors: Record<string, string> = {};
  if (row.brand_colors && typeof row.brand_colors === "object" && !Array.isArray(row.brand_colors)) {
    for (const [key, value] of Object.entries(row.brand_colors as Record<string, unknown>)) {
      if (/^[a-z0-9_-]{2,32}$/i.test(key) && typeof value === "string" && HEX.test(value.trim())) {
        brandColors[key] = value.trim();
      }
    }
  }

  return {
    displayName: text(row.display_name, 160),
    seoTitle: text(row.seo_title, 160),
    seoDescription: text(row.seo_description, 400),
    seoKeywords: text(row.seo_keywords, 400),
    // Canonical é derivada do slug protegido: só aceitamos a própria URL.
    canonicalUrl: canonical === canonicalAllowed ? canonical : undefined,
    logoUrl: asset(row.logo_url),
    heroImageUrl: asset(row.hero_image_url),
    heroHeadline: text(row.hero_headline, 160),
    heroSubheadline: text(row.hero_subheadline, 300),
    socialImageUrl: asset(row.social_image_url),
    socialVersion: /^[A-Za-z0-9._-]{1,40}$/.test(String(row.social_version ?? ""))
      ? String(row.social_version)
      : undefined,
    ctaLabel: text(row.cta_label, 80),
    shareCopy:
      typeof row.share_copy === "string" &&
      row.share_copy.trim() &&
      row.share_copy.trim().length <= 2000 &&
      !containsPublicContact(row.share_copy) &&
      !/[<>]/.test(row.share_copy)
        ? row.share_copy.trim()
        : undefined,
    gallery: gallery && gallery.length > 0 ? gallery : undefined,
    brandColors: Object.keys(brandColors).length ? brandColors : undefined,
    lifecycle: lifecycleOf(row),
    published: Boolean(row.published),
    contentVersion: Number(row.content_version ?? 0),
  };
}

/** Aplica a precedência BANCO > REGISTRY sobre os valores da rota. */
export function applyPortfolioRuntime(
  base: PortfolioRuntimeBase,
  overrides: PortfolioRuntimeOverrides | null | undefined,
): PortfolioRuntimeEffective {
  const overridden: string[] = [];
  const take = <T,>(field: string, value: T | undefined, fallback: T): T => {
    if (value === undefined) return fallback;
    overridden.push(field);
    return value;
  };

  const lifecycle = overrides?.lifecycle ?? "published";
  const published = overrides ? overrides.published : true;
  // Sem linha no banco o projeto segue exatamente como hoje (indexável).
  const indexable = !overrides ? true : lifecycle === "published" && published;

  const socialVersion = overrides?.socialVersion;
  let socialImage = take("socialImage", overrides?.socialImageUrl, base.socialImage);
  if (socialVersion && socialImage) {
    overridden.push("socialVersion");
    socialImage = `${socialImage}${socialImage.includes("?") ? "&" : "?"}v=${socialVersion}`;
  }

  return {
    slug: base.slug,
    title: take("title", overrides?.seoTitle ?? overrides?.displayName, base.title),
    description: take("description", overrides?.seoDescription, base.description),
    keywords: take("keywords", overrides?.seoKeywords, base.keywords),
    canonicalUrl: overrides?.canonicalUrl ?? base.canonicalUrl,
    socialImage,
    logoUrl: take("logo", overrides?.logoUrl, base.logoUrl),
    heroImageUrl: take("hero", overrides?.heroImageUrl, base.heroImageUrl),
    heroHeadline: overrides?.heroHeadline,
    heroSubheadline: overrides?.heroSubheadline,
    ctaLabel: overrides?.ctaLabel,
    shareCopy: take("shareCopy", overrides?.shareCopy, base.shareCopy),
    gallery: overrides?.gallery ?? [],
    brandColors: overrides?.brandColors ?? {},
    lifecycle,
    published,
    indexable,
    robots: indexable ? "index,follow,max-image-preview:large" : "noindex,nofollow",
    overriddenFields: [...new Set(overridden)],
  };
}
