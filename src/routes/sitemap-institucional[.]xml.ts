// Sitemap do cluster "criação de site institucional" (nacional + capitais).
import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { CAPITAIS } from "@/lib/capitais";

export const Route = createFileRoute("/sitemap-institucional.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const today = new Date().toISOString().slice(0, 10);
        return renderSitemap(resolveBaseUrl(request), [
          {
            path: "/criacao-de-site-institucional",
            changefreq: "weekly",
            priority: "0.95",
            lastmod: today,
          },
          ...CAPITAIS.map((c) => ({
            path: `/criacao-de-site-institucional/${c.slug}`,
            changefreq: "monthly" as const,
            priority: "0.8",
            lastmod: today,
          })),
        ]);
      },
    },
  },
});
