import { createFileRoute } from "@tanstack/react-router";

/**
 * Os conteúdos /blog-skyscraper ainda são blueprints editoriais.
 * O sitemap permanece acessível porque já foi enviado ao Search Console,
 * mas fica vazio até existir conteúdo editorial factual pronto para index.
 */
export const Route = createFileRoute("/sitemap-skyscraper.xml")({
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
