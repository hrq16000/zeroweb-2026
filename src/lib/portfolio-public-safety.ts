/**
 * Pure public-safe portfolio helpers.
 *
 * Keep this module independent from admin registries/seeds so public routes
 * can validate runtime overrides without shipping administrative data.
 */
export const UPLOAD_PUBLIC_PREFIX = "/api/public/portfolio-asset";

const SAFE_ASSET = /^\\/(images|api\\/public\\/portfolio-asset)\\/[A-Za-z0-9/_.-]+$/;

/** Accept only internal asset paths; reject external URLs and javascript:. */
export function isSafeAssetPath(value: string): boolean {
  if (!value) return true;
  return SAFE_ASSET.test(value);
}

/** Operational contacts must never be written into public portfolio content. */
export function containsPublicContact(value: string): boolean {
  return /(wa\\.me|api\\.whatsapp\\.com|whatsapp\\.com\\/send|tel:\\+?\\d|mailto:)/i.test(value);
}
