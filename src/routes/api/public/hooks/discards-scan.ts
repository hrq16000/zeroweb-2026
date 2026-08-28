/**
 * Rotina agendada: avalia eventos de analytics descartados na janela recente
 * e dispara alerta quando o total cruza o limiar. Executa sob o runner
 * `runJob` (single-flight, pausa manual, circuit breaker, histórico).
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/discards-scan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { requireCronSecret } = await import("./_cron-auth");
        const unauth = requireCronSecret(request);
        if (unauth) return unauth;

        const url = new URL(request.url);
        const windowHours = Math.min(168, Math.max(1, Number(url.searchParams.get("hours")) || 24));
        const threshold = Math.max(1, Number(url.searchParams.get("threshold")) || 20);

        const { runJob } = await import("@/lib/ops-jobs.server");
        const outcome = await runJob("analytics_discards_scan", async () => {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { DISCARD_EVENT_NAME } = await import("@/lib/analytics-queue");
          const since = new Date(Date.now() - windowHours * 3_600_000).toISOString();

          const { data, error } = await supabaseAdmin
            .from("analytics_events")
            .select("path, metadata_json")
            .eq("event_name", DISCARD_EVENT_NAME)
            .gte("created_at", since)
            .limit(5000);
          if (error) throw new Error(error.message);

          const byPath = new Map<string, number>();
          for (const row of data ?? []) {
            const path = (row.path as string) || "(sem rota)";
            byPath.set(path, (byPath.get(path) ?? 0) + 1);
          }
          const total = data?.length ?? 0;
          const top = [...byPath.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([path, count]) => ({ path, count }));

          let alerted = false;
          if (total >= threshold) {
            const { sendWhatsAppAlert } = await import("@/lib/alerts.functions");
            const lines = top.map((t) => `• ${t.path}: ${t.count}`).join("\n");
            const msg = `⚠️ 0WEB — Telemetria descartada\n${total} evento(s) inválido(s) nas últimas ${windowHours}h (limiar ${threshold}).\n\n${lines}`;
            const sent = await sendWhatsAppAlert(msg).catch(() => ({ ok: false }));
            await supabaseAdmin.from("anomaly_alerts").insert({
              kind: "analytics_discards",
              severity: total >= threshold * 3 ? "critical" : "warning",
              value: total,
              threshold,
              channel: "whatsapp",
              status: (sent as { ok: boolean }).ok ? "sent" : "failed",
              message: msg,
              payload: { windowHours, top },
              sent_at: (sent as { ok: boolean }).ok ? new Date().toISOString() : null,
            });
            alerted = true;
          }

          return { windowHours, threshold, total, top, alerted };
        });

        return Response.json(outcome, { status: outcome.ok || outcome.skipped ? 200 : 500 });
      },
    },
  },
});
