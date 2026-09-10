import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { allPortfolioCombos, portfolioComboPath } from "@/lib/portfolio-clusters";
import { getApprovedPortfolioSitemapEntries } from "@/lib/portfolio-sitemap.server";
import { portfolioPlaceHubs, portfolioPlacePath } from "@/lib/portfolio-places";

/**
 * Mapa prioritário: apenas /portfolio, projetos e hubs de cidade/bairro.
 * Nenhuma URL de /servicos, /solucoes ou institucional entra aqui — este é o
 * arquivo enviado ao Google quando queremos concentrar rastreio no portfólio.
 */
export const Route = createFileRoute("/sitemap-portfolio-prioritario.xml")({
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
          ...allPortfolioCombos().map(({ segment, place }) => ({
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
