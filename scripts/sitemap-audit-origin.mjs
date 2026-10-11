/**
 * Resolve sitemap index children against the audited deployment.
 *
 * Production sitemap indices advertise the canonical host 0web.com.br.
 * When auditing a local/preview build, following those <loc> links
 * directly would silently read production and invalidate the comparison.
 * Restrict the published child to the canonical/audit origin and fetch
 * its identical path from the actual target under audit.
 */
export function resolveSitemapChildFetchUrl(
  childLocation,
  auditBase,
  canonicalOrigin = "https://0web.com.br",
) {
  const audit = new URL(auditBase);
  const canonical = new URL(canonicalOrigin);
  const child = new URL(childLocation);

  if (!["http:", "https:"].includes(audit.protocol)) {
    throw new Error("auditoria exige URL HTTP(S)");
  }
  if (!["http:", "https:"].includes(child.protocol) || child.username || child.password) {
    throw new Error("URL filha do sitemap é inválida");
  }
  if (child.origin !== canonical.origin && child.origin !== audit.origin) {
    throw new Error("sitemap filho referencia uma origem não autorizada");
  }
  return new URL(child.pathname + child.search, audit.origin).href;
}
