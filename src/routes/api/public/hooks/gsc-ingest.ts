/**
 * Recebe evidência de cobertura do Google Search Console por URL.
 * A autenticação usa o mesmo CRON_SECRET dos demais hooks internos.
 *
 * Mantém compatibilidade com o payload legado de issues e aceita também
 * estados positivos/observacionais, para distinguir "indexável" de
 * "observado pelo Google" sem inferir indexação a partir do código.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const IssueType = z.enum([
  "indexed",
  "discovered",
  "crawled_not_indexed",
  "discovered_not_indexed",
  "404",
  "soft_404",
  "redirect",
  "excluded",
  "server_error",
  "blocked_robots",
  "noindex",
  "other",
]);

const Body = z.object({
  rows: z.array(z.object({
    url: z.string().url().max(2000),
    issue_type: IssueType,
    status_code: z.number().int().optional(),
    message: z.string().max(2000).optional(),
  })).min(1).max(2000),
});

export const Route = createFileRoute("/api/public/hooks/gsc-ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { requireCronSecret } = await import("./-cron-auth");
        const unauth = requireCronSecret(request);
        if (unauth) return unauth;
        let body: unknown;
        try { body = await request.json(); } catch { return new Response("invalid_json", { status: 400 }); }
        const parsed = Body.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "invalid_payload", issues: parsed.error.issues }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const rows = parsed.data.rows.map((r) => ({
          url: r.url,
          issue_type: r.issue_type,
          status_code: r.status_code ?? null,
          message: r.message ?? null,
          source: "gsc_webhook",
        }));
        const { error } = await supabaseAdmin.from("index_coverage_issues").insert(rows);
        if (error) return new Response(error.message, { status: 500 });

        const portfolioRows = rows.filter((row) => {
          try {
            const url = new URL(row.url);
            return url.hostname === "0web.com.br" && /^\/portfolio\/[^/]+\/?$/.test(url.pathname);
          } catch {
            return false;
          }
        }).length;

        return Response.json({ ok: true, inserted: rows.length, portfolioRows });
      },
    },
  },
});
