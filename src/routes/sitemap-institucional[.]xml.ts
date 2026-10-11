// Sitemap do cluster "criação de site institucional" (nacional + capitais).
// As páginas locais podem ser despublicadas no painel (`local_pages`);
// nesse caso saem do sitemap automaticamente.
import { createFileRoute } from "@tanstack/react-router";
import { resolveBaseUrl, renderSitemap } from "@/lib/sitemap-utils";
import { CAPITAIS } from "@/lib/capitais";
import { selectInstitutionalCapitals } from "@/lib/sitemap-publication-policy";

export const Route = createFileRoute("/sitemap-institucional.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const today = new Date().toISOString().slice(0, 10);
        const { listPublishedLocalPages } = await import("@/lib/local-pages.server");
        const published = await listPublishedLocalPages();
        const publishedBySlug = new Map(published.map((row) => [row.slug, row]));

        // A ausência de credenciais, indisponibilidade do banco ou erro de
        // consulta não pode resultar em HTTP 500 nem em páginas locais fictícias.
        // null indica que não foi possível confirmar as exclusões.
        let unpublished: Set<string> | null = null;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("local_pages")
            .select("slug")
            .eq("published", false)
            .limit(500);
          if (error) throw new Error(error.message);
          unpublished = new Set((data ?? []).map((row) => String(row.slug)));
        } catch (error) {
          console.warn(
            "[sitemap-institucional] publicação local não verificável; mantendo somente capitais confirmadas",
            error instanceof Error ? error.message : "erro de leitura",
          );
        }

        const visibleCapitals = selectInstitutionalCapitals(
          CAPITAIS,
          new Set(published.filter((row) => row.published).map((row) => row.slug)),
          unpublished,
        );

        return renderSitemap(resolveBaseUrl(request), [
          {
            path: "/criacao-de-site-institucional",
            changefreq: "weekly",
            priority: "0.95",
            lastmod: today,
          },
          ...visibleCapitals.map((c) => ({
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
