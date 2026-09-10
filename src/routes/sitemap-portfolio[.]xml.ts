import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { portfolioCombosWithContent, portfolioComboPath } from "@/lib/portfolio-clusters";
import { getApprovedPortfolioSitemapEntries } from "@/lib/portfolio-sitemap.server";
import { portfolioPlaceHubs, portfolioPlacePath } from "@/lib/portfolio-places";

/**
 * Mapa ÚNICO do portfólio: /portfolio, projetos aprovados, hubs de
 * cidade/bairro e combinações segmento×região.
 *
 * Ele substitui `sitemap-portfolio-prioritario.xml` e
 * `sitemap-portfolio-locais.xml`, que agora redirecionam para cá. Cada URL do
 * portfólio aparece em exatamente um mapa: quando a mesma URL estava em
 * quatro arquivos, o Google diluía o rastreio em vez de concentrá-lo.
 */
export const Route = createFileRoute("/sitemap-portfolio.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urls = [
          { path: "/portfolio", changefreq: "daily" as const, priority: "1.0" },
          ...(await getApprovedPortfolioSitemapEntries()),
          { path: "/portfolio-em", changefreq: "weekly" as const, priority: "0.9" },
          ...portfolioPlaceHubs().map((hub) => ({
            path: portfolioPlacePath(hub.slug),
            changefreq: "weekly" as const,
            priority: hub.kind === "city" ? "0.8" : "0.7",
          })),
          ...portfolioCombosWithContent().map(({ segment, place }) => ({
            path: portfolioComboPath(segment.slug, place.slug),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ].filter((entry) => !entry.path.startsWith("/servicos"));

        const unique = [...new Map(urls.map((entry) => [entry.path, entry])).values()];
        return renderSitemap(resolveBaseUrl(request), unique);
      },
    },
  },
});
