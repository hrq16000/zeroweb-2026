/**
 * Rastreamento de busca e de cliques em `/portfolio`.
 *
 * Usa a infraestrutura canônica (`trackEvent` → `analytics_events`), sem criar
 * um segundo sistema de medição. Só trafega o termo digitado (normalizado,
 * truncado) — nunca dado pessoal.
 */
import { trackEvent } from "@/lib/analytics";

export const PORTFOLIO_SEARCH_EVENT = "portfolio_search";
export const PORTFOLIO_SEARCH_CLICK_EVENT = "portfolio_search_click";

/** Normaliza o termo: minúsculas, sem acento, espaços colapsados, 60 chars. */
export function normalizeSearchTerm(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

/**
 * Uma contagem por termo × sessão: refinar a busca letra a letra não pode
 * inflar o número de "pessoas que chegaram buscando pastel".
 */
export function trackPortfolioSearch(rawTerm: string, resultCount: number): void {
  if (typeof window === "undefined") return;
  const term = normalizeSearchTerm(rawTerm);
  if (term.length < 3) return;

  const key = `0web:portfolio_search:${term}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponível: mede mesmo assim (degradação segura).
  }

  trackEvent(PORTFOLIO_SEARCH_EVENT, {
    search_term: term,
    result_count: resultCount,
    has_results: resultCount > 0,
    location: "portfolio_index",
  });
}

/** Clique em um projeto a partir de um resultado de busca. */
export function trackPortfolioSearchClick(params: {
  rawTerm: string;
  slug: string;
  position: number;
  target: "preview" | "site";
}): void {
  const term = normalizeSearchTerm(params.rawTerm);
  if (!term) return;
  trackEvent(PORTFOLIO_SEARCH_CLICK_EVENT, {
    search_term: term,
    portfolio_slug: params.slug,
    position: params.position,
    target: params.target,
    location: "portfolio_index",
  });
}
