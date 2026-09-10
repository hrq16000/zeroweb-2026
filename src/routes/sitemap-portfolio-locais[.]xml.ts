import { createFileRoute } from "@tanstack/react-router";

/**
 * Consolidado em `sitemap-portfolio.xml`. Mantido como redirecionamento
 * permanente porque a URL antiga já foi enviada ao Search Console.
 */
export const Route = createFileRoute("/sitemap-portfolio-locais.xml")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        Response.redirect(new URL("/sitemap-portfolio.xml", request.url), 301),
    },
  },
});
