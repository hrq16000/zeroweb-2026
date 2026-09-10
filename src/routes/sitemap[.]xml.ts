// Sitemap INDEX — lists all specialized sitemaps. Sprint 5.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://0web.com.br";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Sem lastmod sintético: uma data "hoje" em todos os filhos é sinal falso
        // de frescor e faz o Google desconfiar do mapa inteiro.
        const children = [
          // Portfólio primeiro: é a prioridade de rastreamento atual.
          "sitemap-portfolio-prioritario.xml",
          "sitemap-portfolio.xml",
          "sitemap-portfolio-locais.xml",
          "sitemap-services.xml",
          "sitemap-pages.xml",
          "sitemap-solutions.xml",
          "sitemap-cities.xml",
          "sitemap-city-services.xml",
          "sitemap-blog.xml",
          "sitemap-cases.xml",
          "sitemap-marketplace.xml",
          "sitemap-editorial.xml",
          "sitemap-bh-neighborhoods.xml",
          "sitemap-cwb-neighborhoods.xml",
          "sitemap-skyscraper.xml",
          "sitemap-institucional.xml",
        ];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...children.map((c) => `  <sitemap><loc>${BASE_URL}/${c}</loc></sitemap>`),
          `</sitemapindex>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
