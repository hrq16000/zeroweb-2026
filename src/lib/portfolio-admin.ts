/**
 * Camada pura do admin de projetos do portfólio.
 *
 * FONTE DE VERDADE (decisão explícita, ver docs/PORTFOLIO_ADMIN_STANDARD.md):
 *  - Estrutura (slug, componente, rota, diretório de assets) → registries
 *    versionados em src/config/*.json, projetados em portfolio-admin-seed.json.
 *  - Conteúdo administrável (identidade, SEO, assets, CTA, divulgação,
 *    publicação) → tabela public.portfolio_client_settings.
 *  - Precedência em runtime/admin: BANCO > SEED. Campo vazio no banco = herda
 *    o seed. Isso mantém uma única fonte por campo e permite rollback pelo
 *    histórico auditável.
 */
import seedFile from "@/config/portfolio-admin-seed.json";

export type ConformanceCode =
  | "PORTFOLIO_BRAND_MISSING"
  | "PORTFOLIO_LOGO_MISSING"
  | "PORTFOLIO_HERO_MISSING"
  | "PORTFOLIO_SOCIAL_IMAGE_MISSING"
  | "PORTFOLIO_CTA_MISSING"
  | "PORTFOLIO_SEO_MISSING"
  | "PORTFOLIO_POPUP_MISSING"
  | "PORTFOLIO_SHARE_COPY_MISSING"
  | "PORTFOLIO_COMPONENT_MISSING";

export type ConformanceStatus = "COMPLETE" | "PARTIAL" | "LEGACY";

export type SeedProject = {
  slug: string;
  clientKey: string;
  title: string;
  segment: string;
  city: string;
  state: string;
  summary: string;
  subtitle: string;
  image: string;
  icon: string;
  socialImage: string;
  socialVersion: string;
  componentFile: string;
  routeFile: string;
  assetsDir: string;
  ctaMode: string;
  hasCta: boolean;
  gallery: string[];
  shareCopy: string;
  published: boolean;
  status: ConformanceStatus;
  issues: ConformanceCode[];
  blocking: ConformanceCode[];
};

export type LifecycleStatus = "imported" | "draft" | "published" | "archived";

/** Campos administráveis (ordem estável = ordem exibida no admin). */
export const ADMIN_EDITABLE_FIELDS = [
  "display_name",
  "segment",
  "city",
  "state",
  "summary",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "canonical_url",
  "logo_url",
  "hero_image_url",
  "hero_headline",
  "hero_subheadline",
  "social_image_url",
  "social_version",
  "cta_label",
  "share_copy",
  "gallery",
  "brand_colors",
] as const;

export type AdminEditableField = (typeof ADMIN_EDITABLE_FIELDS)[number];

export type AdminOverrides = Partial<Record<AdminEditableField, unknown>> & {
  client_key?: string;
  slug?: string;
  lifecycle_status?: LifecycleStatus;
  published?: boolean;
  content_version?: number;
  updated_at?: string;
  archived_at?: string | null;
};

export type MergedProject = {
  slug: string;
  clientKey: string;
  /** Estrutura imutável pelo admin (protege slug/rota/componente). */
  structure: {
    componentFile: string;
    routeFile: string;
    assetsDir: string;
    ctaMode: string;
    hasCta: boolean;
    hasCustomComponent: boolean;
  };
  displayName: string;
  segment: string;
  city: string;
  state: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  logoUrl: string;
  heroImageUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  socialImageUrl: string;
  socialVersion: string;
  ctaLabel: string;
  shareCopy: string;
  gallery: string[];
  brandColors: Record<string, string>;
  lifecycleStatus: LifecycleStatus;
  published: boolean;
  contentVersion: number;
  updatedAt: string | null;
  archivedAt: string | null;
  /** true quando existe linha no banco para o projeto. */
  imported: boolean;
  conformance: { status: ConformanceStatus; issues: ConformanceCode[]; blocking: ConformanceCode[] };
};

export const SEED_PROJECTS = (seedFile as { projects: SeedProject[] }).projects;
export const SEED_BLOCKING = new Set(
  (seedFile as { blocking: ConformanceCode[] }).blocking,
);

export function seedBySlug(slug: string): SeedProject | undefined {
  return SEED_PROJECTS.find((p) => p.slug === slug);
}

const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

function pick(dbValue: unknown, seedValue: string): string {
  const v = str(dbValue);
  return v.length > 0 ? v : seedValue;
}

/**
 * Reavalia conformidade sobre o registro já mesclado, usando os MESMOS códigos
 * do gate scripts/portfolio-conformance.mjs.
 */
export function evaluateConformance(project: {
  displayName: string;
  segment: string;
  summary: string;
  logoUrl: string;
  socialImageUrl: string;
  gallery: string[];
  shareCopy: string;
  seoDescription: string;
  structure: { hasCta: boolean; hasCustomComponent: boolean };
}): { status: ConformanceStatus; issues: ConformanceCode[]; blocking: ConformanceCode[] } {
  const issues: ConformanceCode[] = [];
  if (!project.displayName || !project.segment || !project.summary) {
    issues.push("PORTFOLIO_BRAND_MISSING");
  }
  if (!project.logoUrl) issues.push("PORTFOLIO_LOGO_MISSING");
  if (!project.socialImageUrl) issues.push("PORTFOLIO_SOCIAL_IMAGE_MISSING");
  if (project.gallery.length < 2) issues.push("PORTFOLIO_HERO_MISSING");
  if (!project.structure.hasCustomComponent) issues.push("PORTFOLIO_COMPONENT_MISSING");
  else if (!project.structure.hasCta) issues.push("PORTFOLIO_CTA_MISSING");
  if ((project.seoDescription || project.summary).trim().length < 80) {
    issues.push("PORTFOLIO_SEO_MISSING");
  }
  if (!project.shareCopy || project.shareCopy.trim().length < 120) {
    issues.push("PORTFOLIO_SHARE_COPY_MISSING");
  }
  const blocking = issues.filter((code) => SEED_BLOCKING.has(code));
  const status: ConformanceStatus =
    issues.length === 0 ? "COMPLETE" : blocking.length > 0 ? "LEGACY" : "PARTIAL";
  return { status, issues, blocking };
}

/** Mescla seed (registries) + overrides do banco, com precedência do banco. */
export function mergeProject(seed: SeedProject, db?: AdminOverrides | null): MergedProject {
  const gallery = Array.isArray(db?.gallery)
    ? (db!.gallery as unknown[]).filter((v): v is string => typeof v === "string" && !!v)
    : seed.gallery;
  const brandColors =
    db?.brand_colors && typeof db.brand_colors === "object" && !Array.isArray(db.brand_colors)
      ? (db.brand_colors as Record<string, string>)
      : {};

  const base = {
    slug: seed.slug,
    clientKey: seed.clientKey,
    structure: {
      componentFile: seed.componentFile,
      routeFile: seed.routeFile,
      assetsDir: seed.assetsDir,
      ctaMode: seed.ctaMode,
      hasCta: seed.hasCta,
      hasCustomComponent: Boolean(seed.componentFile),
    },
    displayName: pick(db?.display_name, seed.title),
    segment: pick(db?.segment, seed.segment),
    city: pick(db?.city, seed.city),
    state: pick(db?.state, seed.state),
    summary: pick(db?.summary, seed.summary),
    seoTitle: pick(db?.seo_title, seed.title),
    seoDescription: pick(db?.seo_description, seed.summary),
    seoKeywords: str(db?.seo_keywords),
    canonicalUrl: pick(db?.canonical_url, `https://0web.com.br/portfolio/${seed.slug}`),
    logoUrl: pick(db?.logo_url, seed.icon),
    heroImageUrl: pick(db?.hero_image_url, seed.image),
    heroHeadline: str(db?.hero_headline),
    heroSubheadline: str(db?.hero_subheadline),
    socialImageUrl: pick(db?.social_image_url, seed.socialImage),
    socialVersion: pick(db?.social_version, seed.socialVersion),
    ctaLabel: str(db?.cta_label),
    shareCopy: pick(db?.share_copy, seed.shareCopy),
    gallery,
    brandColors,
    lifecycleStatus: (db?.lifecycle_status ?? (seed.published ? "published" : "imported")) as LifecycleStatus,
    published: db ? Boolean(db.published) : seed.published,
    contentVersion: Number(db?.content_version ?? 0),
    updatedAt: db?.updated_at ?? null,
    archivedAt: db?.archived_at ?? null,
    imported: Boolean(db),
  };

  return { ...base, conformance: evaluateConformance(base) };
}

/** Diferenças entre o seed dos registries e o que está gravado no banco. */
export function diffAgainstSeed(seed: SeedProject, merged: MergedProject): string[] {
  const diffs: string[] = [];
  const compare = (field: string, a: string, b: string) => {
    if (a.trim() !== b.trim()) diffs.push(field);
  };
  compare("title", seed.title, merged.displayName);
  compare("segment", seed.segment, merged.segment);
  compare("socialImage", seed.socialImage, merged.socialImageUrl);
  compare("icon", seed.icon, merged.logoUrl);
  compare("shareCopy", seed.shareCopy, merged.shareCopy);
  if (seed.gallery.length !== merged.gallery.length) diffs.push("gallery");
  return diffs;
}

export const UPLOAD_PUBLIC_PREFIX = "/api/public/portfolio-asset";

const SAFE_ASSET = /^\/(images|api\/public\/portfolio-asset)\/[A-Za-z0-9/_.-]+$/;

/** Aceita apenas caminhos internos de asset — bloqueia URL externa e javascript:. */
export function isSafeAssetPath(value: string): boolean {
  if (!value) return true;
  return SAFE_ASSET.test(value);
}

/** Contatos operacionais nunca podem ser gravados por telas administrativas. */
export function containsPublicContact(value: string): boolean {
  return /(wa\.me|api\.whatsapp\.com|whatsapp\.com\/send|tel:\+?\d|mailto:)/i.test(value);
}
