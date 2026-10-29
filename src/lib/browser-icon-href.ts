/**
 * Render a local asset using the current origin rather than making browser
 * previews fetch it from the public 0WEB domain as a third-party resource.
 *
 * SEO canonical, JSON-LD, and OpenGraph should still use absolute URLs.
 * External icon overrides are preserved unchanged.
 */
export function browserIconHref(href: string): string {
  if (!href) return href;
  try {
    const parsed = new URL(href);
    if (parsed.origin !== "https://0web.com.br") return href;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return href;
  }
}
