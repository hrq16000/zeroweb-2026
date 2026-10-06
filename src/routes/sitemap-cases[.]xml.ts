import { createFileRoute } from "@tanstack/react-router";

/**
 * Os estudos de caso permanecem fora do sitemap enquanto métricas e
 * depoimentos não tiverem trilha de evidência versionada no repositório.
 * O endpoint continua válido porque já pode ter sido descoberto pelo Google.
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
