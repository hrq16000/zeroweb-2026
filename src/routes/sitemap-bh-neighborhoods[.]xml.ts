// Sitemap dos bairros de BH (hub + 30 leaves).
import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { BH_NEIGHBORHOODS } from "@/lib/bh-neighborhoods";
import { localPlaceHasEvidence } from "@/lib/local-page-enrichment";

export const Route = createFileRoute("/sitemap-bh-neighborhoods.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urls = [
          { path: "/bairros-bh", changefreq: "weekly" as const, priority: "0.8" },
          ...BH_NEIGHBORHOODS
            .map((place) => ({ ...place, city: "Belo Horizonte" }))
            .filter((place) => localPlaceHasEvidence(place))
            .map((place) => ({
              path: `/bairros-bh/${place.slug}`,
              changefreq: "monthly" as const,
              priority: "0.7",
            })),
        ];
        return renderSitemap(resolveBaseUrl(request), urls);
      },
    },
  },
});
