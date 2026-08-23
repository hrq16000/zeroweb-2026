import { createFileRoute } from "@tanstack/react-router";

/**
 * Sincronização agendada do Search Console (chamada por cron externo).
 * Requer o header `x-seo-sync-secret` igual ao segredo SEO_SYNC_SECRET.
 */
export const Route = createFileRoute("/api/public/seo-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.SEO_SYNC_SECRET;
        if (!secret || request.headers.get("x-seo-sync-secret") !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const sb = supabaseAdmin as any;
        const { syncPerformance, submitAndCheckSitemaps, inspectPendingUrls } = await import(
          "@/lib/gsc-sync.server"
        );
        const { notifyPendingSeoAlerts } = await import("@/lib/seo-alerts.server");
        const { submitToIndexNow } = await import("@/lib/indexnow.server");

        const result: Record<string, unknown> = {};
        const step = async (name: string, fn: () => Promise<unknown>) => {
          try {
            result[name] = await fn();
          } catch (e) {
            result[name] = { error: (e as Error).message };
          }
        };

        await step("performance", () => syncPerformance(sb, 28));
        await step("sitemaps", () => submitAndCheckSitemaps(sb));
        await step("inspection", () => inspectPendingUrls(sb, 20));
        await step("indexnow", () => submitToIndexNow(sb));
        await step("alerts", () => notifyPendingSeoAlerts(sb));

        return Response.json({ ok: true, ranAt: new Date().toISOString(), result });
      },
    },
  },
});
