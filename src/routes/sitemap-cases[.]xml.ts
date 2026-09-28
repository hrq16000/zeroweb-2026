import { createFileRoute } from "@tanstack/react-router";

/**
 * Cases ficam fora do sitemap enquanto métricas/depoimentos não possuem
 * evidência versionada por estudo.
 */
export const Route = createFileRoute("/sitemap-cases.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
          {
            headers: {
              "Content-Type": "application/xml",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
