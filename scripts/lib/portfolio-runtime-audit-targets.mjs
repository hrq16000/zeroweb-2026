/**
 * Classificação determinística das URLs de /portfolio/:slug para auditoria HTTP.
 * O sitemap público é a única descoberta sem credenciais do painel Managed.
 * Slugs não versionados são candidatos runtime, não prova de origem no banco.
 */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function selectPortfolioRuntimeAuditTargets({
  sitemapSlugs,
  versionedSlugs,
  requestedSlug = "",
}) {
  const requested = String(requestedSlug ?? "").trim();
  if (requested && (requested.length > 80 || !SLUG.test(requested))) {
    throw new Error("PORTFOLIO_AUDIT_SLUG deve ser slug simples, sem path, query, espaços ou URL.");
  }
  const publishedSitemapSlugs = new Set(sitemapSlugs.filter((slug) => SLUG.test(slug)));
  const versioned = new Set(versionedSlugs);
  const runtimeSlugs = [...publishedSitemapSlugs].filter((slug) => !versioned.has(slug)).sort();
  const requestedMissingSitemap =
    requested && !publishedSitemapSlugs.has(requested) ? requested : null;

  // Targeted audit includes the URL even if the sitemap is missing: this is a
  // failure to fix, never an excuse to skip the URL's live HTTP diagnostics.
  const requestedExtraSlugs =
    requested && !versioned.has(requested) && !runtimeSlugs.includes(requested)
      ? [requested]
      : [];

  return {
    runtimeSlugs,
    requestedSlug: requested || null,
    requestedMissingSitemap,
    requestedExtraSlugs,
  };
}
