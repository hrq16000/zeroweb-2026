// Centralized SEO helpers, shared dictionaries and JSON-LD builders.
// Sprint 3 — technical SEO foundation.

export const ORIGIN = "https://0web.com.br";

export function absUrl(path: string): string {
  if (!path) return ORIGIN + "/";
  if (/^https?:\/\//i.test(path)) return path;
  return ORIGIN + (path.startsWith("/") ? path : "/" + path);
}

/**
 * Mantém a copy editorial completa na página/JSON-LD, mas limita a meta
 * description ao tamanho útil para SERP. O corte acontece em fronteira de
 * palavra e nunca ultrapassa o teto informado.
 */
export function compactMetaDescription(value: string, maxLength = 160): string {
  const clean = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!clean || clean.length <= maxLength) return clean;

  const budget = Math.max(24, maxLength - 1);
  const slice = clean.slice(0, budget + 1);
  const breakAt = slice.lastIndexOf(" ");
  const base = (breakAt >= Math.floor(budget * 0.72) ? slice.slice(0, breakAt) : clean.slice(0, budget))
    .replace(/[\s,;:–—-]+$/g, "")
    .trim();

  return `${base}…`;
}

// Default brand share image (fallback when route has no real image).
// Lives at /favicon.png via the favicon asset; safe absolute URL.
export const DEFAULT_OG_IMAGE = `${ORIGIN}/og-default.jpg`;

export function breadcrumbLd(items: { name: string; path: string }[]) {
  // Designed to be embedded inside a parent `@graph` — no nested `@context`
  // (rich-results validators flag duplicated @context inside graph nodes).
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export const ORG_REF = {
  "@type": "Organization",
  "@id": `${ORIGIN}/#org`,
  name: "0WEB",
  url: ORIGIN,
  logo: `${ORIGIN}/favicon.ico`,
  taxID: "41.723.708/0001-58",
  areaServed: "BR",
};

// ----------------------------------------------------------------------------
// Backward-compatible re-exports.
// The rich, single-source-of-truth dictionaries live in:
//   - src/lib/services-data.ts  (SERVICES, ALL_SERVICE_SLUGS, GEO_SERVICE_SLUGS)
//   - src/lib/geo-data.ts       (CITIES, ALL_CITY_SLUGS, STATES)
// `SERVICES_DICT` and `CITIES_DICT` are kept for older callers (sitemap, etc.).
// ----------------------------------------------------------------------------

import { SERVICES, type ServiceData } from "./services-data";
import { CITIES } from "./geo-data";

export type ServiceInfo = {
  slug: string;
  name: string;
  title: string;
  description: string;
  serviceType: string;
};

export const SERVICES_DICT: Record<string, ServiceInfo> = Object.fromEntries(
  Object.entries(SERVICES).map(([slug, s]: [string, ServiceData]) => [
    slug,
    {
      slug: s.slug,
      name: s.name,
      title: s.title,
      description: s.description,
      serviceType: s.serviceType,
    },
  ]),
);

export const CITIES_DICT: Record<string, string> = Object.fromEntries(
  Object.entries(CITIES).map(([slug, c]) => [slug, c.name]),
);

