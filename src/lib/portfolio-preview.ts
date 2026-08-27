/** Preview da vitrine: silencia overlays da hospedagem sem alterar o site ao vivo. */
export function isPortfolioPreviewMode(search = typeof window === "undefined" ? "" : window.location.search): boolean {
  const query = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(query).get("preview") === "1";
}

export function shouldSuppressPortfolioHostOverlays(): boolean {
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true;
  return isPortfolioPreviewMode(window.location.search);
}
