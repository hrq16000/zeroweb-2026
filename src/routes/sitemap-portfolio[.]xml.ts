import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { allPortfolioCombos, portfolioComboPath } from "@/lib/portfolio-clusters";
import { getApprovedPortfolioSitemapEntries } from "@/lib/portfolio-sitemap.server";

export const Route = createFileRoute("/sitemap-portfolio.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urls = [
          ...(await getApprovedPortfolioSitemapEntries()),
          ...allPortfolioCombos().map(({ segment, place }) => ({
            path: portfolioComboPath(segment.slug, place.slug),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];
        const unique = [...new Map(urls.map((entry) => [entry.path, entry])).values()];
        return renderSitemap(resolveBaseUrl(request), unique);
      },
    },
  },
});
