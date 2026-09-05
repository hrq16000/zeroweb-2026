import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Evento canônico de visualização de um projeto `/portfolio/:slug`.
 *
 * Usa a infraestrutura existente (`trackEvent` → `analytics_events`), sem criar
 * um segundo sistema de medição. Deduplicado por sessão + slug para não inflar
 * a contagem em navegação client-side ou re-render.
 */
export function PortfolioView({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) return;
    const key = `0web:portfolio_view:${slug}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage indisponível: ainda assim registra uma vez por montagem.
    }
    trackEvent("portfolio_view", {
      portfolio_slug: slug,
      source: "portfolio_standard_shell",
    });
  }, [slug]);

  return null;
}
