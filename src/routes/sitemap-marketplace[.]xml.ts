import { createFileRoute } from "@tanstack/react-router";
import { listSitemapEntries } from "@/lib/marketplace.functions";
import { ORIGIN } from "@/lib/seo";

export const Route = createFileRoute("/sitemap-marketplace.xml")({
  server: {
    handlers: {
      GET: async () => {
        // O sitemap deve continuar disponível sem credenciais de escrita.
        // Em falha da fonte de dados, não inventa prestadores ou categorias.
        let providers: Array<{ slug: string }> = [];
        let companies: Array<{ slug: string }> = [];
        let categories: Array<{ slug: string }> = [];
        try {
          const entries = await listSitemapEntries();
          providers = entries.providers ?? [];
          companies = entries.companies ?? [];
          categories = entries.categories ?? [];
        } catch (error) {
          console.warn(
            "[sitemap-marketplace] catálogo indisponível; publicando apenas URLs estáveis",
            error instanceof Error ? error.message : "erro de leitura",
          );
        }
        const urls: string[] = [
          `${ORIGIN}/marketplace`,
          `${ORIGIN}/solicitar-orcamento`,
        ];
        for (const c of categories) urls.push(`${ORIGIN}/categoria/${c.slug}`);
        for (const p of providers) urls.push(`${ORIGIN}/profissional/${p.slug}`);
        for (const co of companies) urls.push(`${ORIGIN}/empresa/${co.slug}`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
