import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { allPortfolioCombos, portfolioComboPath } from "@/lib/portfolio-clusters";
import { PORTFOLIO_PROTOTYPES } from "@/lib/portfolio-site-registry";

export const Route = createFileRoute("/sitemap-portfolio.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urls = [
          { path: "/portfolio", changefreq: "weekly" as const, priority: "0.9" },
          { path: "/portfolio/renata-beauty", changefreq: "monthly" as const, priority: "0.8" },
          { path: "/portfolio/r_beauty", changefreq: "monthly" as const, priority: "0.7" },
          { path: "/portfolio/dyzpromo", changefreq: "monthly" as const, priority: "0.8" },
          ...PORTFOLIO_PROTOTYPES.filter((site) => site.indexable).map((site) => ({
            path: `/portfolio/${site.slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...allPortfolioCombos().map(({ segment, place }) => ({
            path: portfolioComboPath(segment.slug, place.slug),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];
        return renderSitemap(resolveBaseUrl(request), urls);
      },
    },
  },
});
