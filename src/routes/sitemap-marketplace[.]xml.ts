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
        try {
          const entries = await listSitemapEntries();
          providers = entries.providers ?? [];
          companies = entries.companies ?? [];
        } catch (error) {
          console.warn(
            "[sitemap-marketplace] catálogo indisponível; publicando apenas URLs estáveis",
            error instanceof Error ? error.message : "erro de leitura",
          );
        }
        const urls: string[] = [
          `${ORIGIN}/servicos/marketplace`,
          `${ORIGIN}/solicitar-orcamento`,
        ];
        // As categorias sem perfis ativos retornam noindex; somente URLs\n        // comprovadamente elegíveis devem aparecer em sitemaps.\n        // Manter as páginas acessíveis e promover categorias em rodada própria,\n        // quando a fonte confirmar perfis ativos e canonical próprio.\n        for (const p of providers) urls.push(`${ORIGIN}/profissional/${p.slug}`);
        for (const co of companies) urls.push(`${ORIGIN}/empresa/${co.slug}`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
