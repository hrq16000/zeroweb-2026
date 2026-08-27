/**
 * Preview interno da vitrine: silencia overlays da hospedagem sem alterar o site ao vivo.
 *
 * IMPORTANTE: o parâmetro é intencionalmente específico (`0web_preview=1`).
 * Nunca usar `preview=1` genérico: ambientes de preview, encurtadores e
 * ferramentas externas adicionam esse parâmetro e o pop-up de captação
 * desaparecia silenciosamente em visitas reais.
 */
const SUPPRESS_PARAMS = ["0web_preview", "0web_overlays_off"] as const;

export function isPortfolioPreviewMode(search = typeof window === "undefined" ? "" : window.location.search): boolean {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  return SUPPRESS_PARAMS.some((key) => params.get(key) === "1");
}

export function shouldSuppressPortfolioHostOverlays(): boolean {
  if (typeof window === "undefined") return true;
  return isPortfolioPreviewMode(window.location.search);
}
