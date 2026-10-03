// Sitemap do cluster "criação de site institucional" (nacional + capitais).
// As páginas locais podem ser despublicadas no painel (`local_pages`);
// nesse caso saem do sitemap automaticamente.
import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { CAPITAIS } from "@/lib/capitais";
import { institutionalCapitalHasEvidence } from "@/lib/institutional-capital-evidence";
import {
  listLocalPagePublicationStates,
  localPageIsPublished,
} from "@/lib/local-pages.server";

export const Route = createFileRoute("/sitemap-institucional.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const today = new Date().toISOString().slice(0, 10);
        const { listPublishedLocalPages } = await import("@/lib/local-pages.server");
        const published = await listPublishedLocalPages();
        const publishedBySlug = new Map(published.map((row) => [row.slug, row]));

        const publicationStates = await listLocalPagePublicationStates();

        return renderSitemap(resolveBaseUrl(request), [
          {
            path: "/criacao-de-site-institucional",
            changefreq: "weekly",
            priority: "0.95",
            lastmod: today,
          },
          ...CAPITAIS
            .filter((c) => institutionalCapitalHasEvidence(c))
            .filter((c) => localPageIsPublished(c.slug, publicationStates))
            .map((c) => ({
            path: `/criacao-de-site-institucional/${c.slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
            lastmod: (publishedBySlug.get(c.slug)?.updated_at ?? today).slice(0, 10),
          })),
        ]);
      },
    },
  },
});
