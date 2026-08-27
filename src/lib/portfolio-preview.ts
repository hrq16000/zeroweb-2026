/** Preview da vitrine: silencia overlays da hospedagem sem alterar o site ao vivo. */
export function isPortfolioPreviewMode(search = typeof window === "undefined" ? "" : window.location.search): boolean {
  const query = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(query).get("preview") === "1";
}

export function shouldSuppressPortfolioHostOverlays(): boolean {
  if (typeof window === "undefined") return true;
  // O navegador embutido do portal pode usar iframe, mas ainda é uma visita
  // real ao portfolio. Só o modo explícito de preview deve silenciar overlays.
  return isPortfolioPreviewMode(window.location.search);
}
