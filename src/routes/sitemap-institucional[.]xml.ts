// Sitemap do cluster "criação de site institucional" (nacional + capitais).
// As páginas locais podem ser despublicadas no painel (`local_pages`);
// nesse caso saem do sitemap automaticamente.
import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { CAPITAIS } from "@/lib/capitais";

export const Route = createFileRoute("/sitemap-institucional.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const today = new Date().toISOString().slice(0, 10);
        const { listPublishedLocalPages } = await import("@/lib/local-pages.server");
        const published = await listPublishedLocalPages();
        const publishedBySlug = new Map(published.map((row) => [row.slug, row]));

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server").catch(
          () => ({ supabaseAdmin: null as any }),
        );
        let unpublished = new Set<string>();
        if (supabaseAdmin) {
          const { data } = await supabaseAdmin
            .from("local_pages")
            .select("slug")
            .eq("published", false)
            .limit(500);
          unpublished = new Set((data ?? []).map((r: any) => String(r.slug)));
        }

        return renderSitemap(resolveBaseUrl(request), [
          {
            path: "/criacao-de-site-institucional",
            changefreq: "weekly",
            priority: "0.95",
            lastmod: today,
          },
          ...CAPITAIS.filter((c) => !unpublished.has(c.slug)).map((c) => ({
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
