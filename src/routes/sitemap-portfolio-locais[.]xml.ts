import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { portfolioPlaceHubs, portfolioPlacePath } from "@/lib/portfolio-places";

export const Route = createFileRoute("/sitemap-portfolio-locais.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urls = [
          { path: "/portfolio-em", changefreq: "weekly" as const, priority: "0.8" },
          ...portfolioPlaceHubs().map((hub) => ({
            path: portfolioPlacePath(hub.slug),
            changefreq: "weekly" as const,
            priority: hub.kind === "city" ? "0.8" : "0.7",
          })),
        ];
        return renderSitemap(resolveBaseUrl(request), urls);
      },
    },
  },
});
