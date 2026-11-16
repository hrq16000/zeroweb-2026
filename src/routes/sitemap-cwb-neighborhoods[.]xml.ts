import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { CWB_NEIGHBORHOODS } from "@/lib/curitiba-neighborhoods";
import { localPlaceHasEvidence } from "@/lib/local-page-enrichment";

export const Route = createFileRoute("/sitemap-cwb-neighborhoods.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urls = [
          { path: "/bairros-cwb", changefreq: "weekly" as const, priority: "0.8" },
          ...CWB_NEIGHBORHOODS.filter((place) => localPlaceHasEvidence(place)).map((place) => ({
            path: `/bairros-cwb/${place.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
        ];
        return renderSitemap(resolveBaseUrl(request), urls);
      },
    },
  },
});
