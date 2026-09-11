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

/**
 * Página aberta dentro de um iframe (pré-visualização da vitrine `/portfolio`).
 *
 * O catálogo embute a landing com `?preview=1`; esse parâmetro genérico não é
 * — e não deve ser — tratado como supressão global. A detecção de embed cobre
 * o caso sem reintroduzir o parâmetro genérico: dentro do iframe a camada da
 * hospedagem não aparece e, principalmente, não consome a cota "uma vez por
 * sessão" que pertence à visita real da página.
 */
export function isPortfolioEmbedded(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin: o acesso lança, o que já indica que estamos embutidos.
    return true;
  }
}

export function shouldSuppressPortfolioHostOverlays(): boolean {
  if (typeof window === "undefined") return true;
  if (isPortfolioEmbedded()) return true;
  return isPortfolioPreviewMode(window.location.search);
}
