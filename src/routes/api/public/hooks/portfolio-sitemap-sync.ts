import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  slugs: z
    .array(z.string().regex(/^[a-z0-9][a-z0-9_-]*$/))
    .max(500)
    .optional(),
});

/** Rebuilds the dynamic portfolio sitemap and notifies GSC + IndexNow. */
export const Route = createFileRoute("/api/public/hooks/portfolio-sitemap-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { requireCronSecret } = await import("./_cron-auth");
        const unauth = requireCronSecret(request);
        if (unauth) return unauth;

        let parsed: z.infer<typeof bodySchema> = {};
        try {
          const body = await request.json().catch(() => ({}));
          parsed = bodySchema.parse(body);
        } catch {
          return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { syncPortfolioSitemapAndIndexing } = await import("@/lib/portfolio-sitemap.server");
        const result = await syncPortfolioSitemapAndIndexing(supabaseAdmin, parsed.slugs ?? []);
        return Response.json({ ok: true, ...result });
      },
    },
  },
});
