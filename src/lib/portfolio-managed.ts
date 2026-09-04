/**
 * PROJETOS MANAGED DO PORTFÓLIO (criados pelo painel, sem código).
 *
 * Módulo puro: sanitização, presets, conformidade e ciclo de vida.
 * Usado no SSR, no admin, nos testes e nos scripts de fixture — sem I/O.
 *
 * Regra central: nada que venha do banco é confiável. Todo texto passa por
 * `containsPublicContact` (LGPD/privacidade) e bloqueio de HTML; todo asset
 * precisa ser um caminho interno permitido (`isSafeAssetPath`).
 */
import { containsPublicContact, isSafeAssetPath } from "@/lib/portfolio-admin";

export const MANAGED_PRESETS = [
  "editorial",
  "impact",
  "minimal",
  "immersive",
  "service_focused",
] as const;
export type ManagedPreset = (typeof MANAGED_PRESETS)[number];

export const MANAGED_LIFECYCLES = ["draft", "ready", "published", "archived"] as const;
export type ManagedLifecycle = (typeof MANAGED_LIFECYCLES)[number];

export type ManagedFocal = { x: number; y: number };
export type ManagedService = { title: string; description: string };
export type ManagedGalleryItem = { url: string; alt: string; focal: ManagedFocal };
export type ManagedContentBlocks = {
  about: string;
  differentials: string[];
  steps: Array<{ title: string; description: string }>;
  faq: Array<{ q: string; a: string }>;
};

export type ManagedProject = {
  slug: string;
  clientKey: string;
  displayName: string;
  segment: string;
  city: string;
  state: string;
  summary: string;
  preset: ManagedPreset;
  brandColors: Record<string, string>;
  logoUrl: string;
  heroImageUrl: string;
  heroFocal: ManagedFocal;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  services: ManagedService[];
  gallery: ManagedGalleryItem[];
  content: ManagedContentBlocks;
  catalogCoverUrl: string;
  coverFocal: ManagedFocal;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  socialImage: string;
  socialVersion: string;
  shareCopy: string;
  lifecycle: ManagedLifecycle;
  published: boolean;
  indexable: boolean;
  robots: string;
  contentVersion: number;
};

const HEX = /^#[0-9a-fA-F]{3,8}$/;
export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/;

/** Slugs que não podem virar projeto (colidem com rotas ou com o catálogo). */
export const RESERVED_SLUGS = new Set([
  "index",
  "novo",
  "new",
  "admin",
  "app",
  "api",
  "sitemap",
  "assets",
  "images",
  "r",
  "painel",
]);

export function text(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  const v = value.trim().replace(/\s+/g, " ");
  if (!v || v.length > max) return "";
  if (/[<>]/.test(v)) return "";
  if (containsPublicContact(v)) return "";
  return v;
}

export function asset(value: unknown): string {
  const v = text(value, 300);
  if (!v) return "";
  return isSafeAssetPath(v) ? v : "";
}

function focal(value: unknown): ManagedFocal {
  const raw = (value ?? {}) as Record<string, unknown>;
  const clamp = (n: unknown) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return 50;
    return Math.min(100, Math.max(0, Math.round(v)));
  };
  return { x: clamp(raw.x), y: clamp(raw.y) };
}

function preset(value: unknown): ManagedPreset {
  const v = String(value ?? "").trim();
  return (MANAGED_PRESETS as readonly string[]).includes(v) ? (v as ManagedPreset) : "editorial";
}

function lifecycle(value: unknown, published: boolean): ManagedLifecycle {
  const v = String(value ?? "").trim();
  if ((MANAGED_LIFECYCLES as readonly string[]).includes(v)) return v as ManagedLifecycle;
  return published ? "published" : "draft";
}

function services(value: unknown): ManagedService[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const raw = (item ?? {}) as Record<string, unknown>;
      return { title: text(raw.title, 90), description: text(raw.description, 260) };
    })
    .filter((item) => Boolean(item.title))
    .slice(0, 12);
}

function gallery(value: unknown): ManagedGalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") {
        return { url: asset(item), alt: "", focal: { x: 50, y: 50 } };
      }
      const raw = (item ?? {}) as Record<string, unknown>;
      return { url: asset(raw.url), alt: text(raw.alt, 160), focal: focal(raw.focal) };
    })
    .filter((item) => Boolean(item.url))
    .slice(0, 24);
}

function content(value: unknown): ManagedContentBlocks {
  const raw = (value ?? {}) as Record<string, unknown>;
  const list = (input: unknown, max: number, len: number) =>
    Array.isArray(input)
      ? input.map((v) => text(v, len)).filter(Boolean).slice(0, max)
      : [];
  const pairs = (input: unknown, keys: [string, string], max: number) =>
    Array.isArray(input)
      ? input
          .map((item) => {
            const obj = (item ?? {}) as Record<string, unknown>;
            return {
              [keys[0]]: text(obj[keys[0]], 140),
              [keys[1]]: text(obj[keys[1]], 400),
            } as Record<string, string>;
          })
          .filter((item) => Boolean(item[keys[0]] && item[keys[1]]))
          .slice(0, max)
      : [];
  return {
    about: text(raw.about, 1200),
    differentials: list(raw.differentials, 8, 160),
    steps: pairs(raw.steps, ["title", "description"], 6) as ManagedContentBlocks["steps"],
    faq: pairs(raw.faq, ["q", "a"], 8) as ManagedContentBlocks["faq"],
  };
}

function brandColors(value: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      if (/^[a-z0-9_-]{2,32}$/i.test(key) && typeof raw === "string" && HEX.test(raw.trim())) {
        out[key] = raw.trim();
      }
    }
  }
  return out;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Converte a linha bruta do banco no projeto Managed público e seguro. */
export function sanitizeManagedProject(row: any): ManagedProject | null {
  if (!row) return null;
  const slug = String(row.slug ?? "").trim();
  if (!SLUG_RE.test(slug) || RESERVED_SLUGS.has(slug)) return null;

  const published = Boolean(row.published);
  const status = lifecycle(row.lifecycle_status, published);
  const indexable = status === "published" && published;
  const displayName = text(row.display_name, 160) || slug;
  const socialImage = asset(row.social_image_url);
  const socialVersion = /^[A-Za-z0-9._-]{1,40}$/.test(String(row.social_version ?? ""))
    ? String(row.social_version)
    : "";

  return {
    slug,
    clientKey: text(row.client_key, 80) || slug,
    displayName,
    segment: text(row.segment, 60),
    city: text(row.city, 80),
    state: text(row.state, 4),
    summary: text(row.summary, 300),
    preset: preset(row.preset),
    brandColors: brandColors(row.brand_colors),
    logoUrl: asset(row.logo_url),
    heroImageUrl: asset(row.hero_image_url),
    heroFocal: focal(row.hero_focal),
    heroHeadline: text(row.hero_headline, 160) || displayName,
    heroSubheadline: text(row.hero_subheadline, 300),
    ctaLabel: text(row.cta_label, 80) || "Falar com a equipe",
    services: services(row.services),
    gallery: gallery(row.gallery_items ?? row.gallery),
    content: content(row.content_blocks),
    catalogCoverUrl: asset(row.catalog_cover_url),
    coverFocal: focal(row.cover_focal),
    seoTitle: text(row.seo_title, 160) || displayName,
    seoDescription: text(row.seo_description, 400) || text(row.summary, 300),
    seoKeywords: text(row.seo_keywords, 400),
    canonicalUrl: `https://0web.com.br/portfolio/${slug}`,
    socialImage: socialImage
      ? socialVersion
        ? `${socialImage}${socialImage.includes("?") ? "&" : "?"}v=${socialVersion}`
        : socialImage
      : "",
    socialVersion,
    shareCopy:
      typeof row.share_copy === "string" &&
      row.share_copy.trim().length > 0 &&
      row.share_copy.trim().length <= 2000 &&
      !containsPublicContact(row.share_copy) &&
      !/[<>]/.test(row.share_copy)
        ? row.share_copy.trim()
        : "",
    lifecycle: status,
    published,
    indexable,
    robots: indexable ? "index,follow,max-image-preview:large" : "noindex,nofollow",
    contentVersion: Number(row.content_version ?? 1),
  };
}

export type ManagedConformanceIssue = {
  code: string;
  level: "blocker" | "warning";
  message: string;
};

/** Conformidade específica de projeto Managed (gate para READY/PUBLISHED). */
export function evaluateManagedConformance(project: ManagedProject): ManagedConformanceIssue[] {
  const issues: ManagedConformanceIssue[] = [];
  const blocker = (code: string, message: string) =>
    issues.push({ code, level: "blocker", message });
  const warn = (code: string, message: string) => issues.push({ code, level: "warning", message });

  if (!project.displayName || project.displayName === project.slug) {
    blocker("PORTFOLIO_BRAND_MISSING", "Informe o nome comercial do cliente.");
  }
  if (!project.logoUrl) blocker("PORTFOLIO_LOGO_MISSING", "Envie a logo do cliente.");
  if (!project.heroImageUrl) blocker("PORTFOLIO_HERO_MISSING", "Envie a imagem de destaque.");
  if (!project.catalogCoverUrl) {
    blocker("PORTFOLIO_COVER_MISSING", "Envie a capa própria usada no catálogo.");
  }
  if (!project.socialImage) {
    blocker("PORTFOLIO_SOCIAL_IMAGE_MISSING", "Envie a imagem de compartilhamento (1200x630).");
  }
  if (!project.seoTitle || !project.seoDescription) {
    blocker("PORTFOLIO_SEO_MISSING", "Preencha título e descrição de SEO.");
  }
  if (project.seoDescription && project.seoDescription.length < 60) {
    warn("PORTFOLIO_SEO_SHORT", "A descrição de SEO está curta (ideal: 120-160 caracteres).");
  }
  if (project.services.length < 3) {
    blocker("PORTFOLIO_SERVICES_MISSING", "Cadastre pelo menos 3 serviços ou produtos.");
  }
  if (!project.ctaLabel) blocker("PORTFOLIO_CTA_MISSING", "Defina o texto do botão de contato.");
  if (!project.shareCopy) {
    blocker("PORTFOLIO_SHARE_COPY_MISSING", "Escreva a copy de divulgação do projeto.");
  }
  if (project.gallery.length < 2) {
    warn("PORTFOLIO_GALLERY_THIN", "Poucas imagens na galeria; o projeto fica menos convincente.");
  }
  if (!project.content.about) {
    warn("PORTFOLIO_ABOUT_MISSING", "Sem texto institucional (bloco 'sobre').");
  }
  if (!project.city || !project.state) {
    warn("PORTFOLIO_LOCATION_MISSING", "Informe cidade e estado para SEO local.");
  }
  return issues;
}

export function managedStatus(project: ManagedProject) {
  const issues = evaluateManagedConformance(project);
  const blockers = issues.filter((issue) => issue.level === "blocker");
  return {
    issues,
    blockers,
    canBeReady: blockers.length === 0,
    state: blockers.length === 0 ? ("COMPLETE" as const) : ("PARTIAL" as const),
  };
}

/** Transições permitidas do ciclo de vida (o admin não pode pular etapas). */
export const LIFECYCLE_TRANSITIONS: Record<ManagedLifecycle, ManagedLifecycle[]> = {
  draft: ["ready", "archived"],
  ready: ["published", "draft", "archived"],
  published: ["ready", "archived"],
  archived: ["draft"],
};

export function canTransition(from: ManagedLifecycle, to: ManagedLifecycle): boolean {
  return LIFECYCLE_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Linha de banco a partir dos dados do wizard (usada pelo admin e pela fixture). */
export function buildManagedRow(input: Record<string, unknown>) {
  return {
    client_key: String(input.clientKey ?? input.slug ?? ""),
    slug: String(input.slug ?? ""),
    project_kind: "managed",
    preset: preset(input.preset),
    display_name: text(input.displayName, 160),
    segment: text(input.segment, 60),
    city: text(input.city, 80),
    state: text(input.state, 4),
    summary: text(input.summary, 300),
    seo_title: text(input.seoTitle, 160),
    seo_description: text(input.seoDescription, 400),
    seo_keywords: text(input.seoKeywords, 400),
    canonical_url: `https://0web.com.br/portfolio/${String(input.slug ?? "")}`,
    logo_url: asset(input.logoUrl),
    hero_image_url: asset(input.heroImageUrl),
    hero_focal: focal(input.heroFocal),
    hero_headline: text(input.heroHeadline, 160),
    hero_subheadline: text(input.heroSubheadline, 300),
    catalog_cover_url: asset(input.catalogCoverUrl),
    cover_focal: focal(input.coverFocal),
    social_image_url: asset(input.socialImageUrl),
    social_version: /^[A-Za-z0-9._-]{1,40}$/.test(String(input.socialVersion ?? ""))
      ? String(input.socialVersion)
      : "",
    cta_label: text(input.ctaLabel, 80),
    share_copy: text(input.shareCopy, 2000),
    services: services(input.services),
    gallery_items: gallery(input.gallery),
    content_blocks: content(input.content),
    brand_colors: brandColors(input.brandColors),
  };
}
