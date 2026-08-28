import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Disparo manual de alerta de telemetria (botão "Testar alerta agora" no
 * /painel-auditorias). Restrito a administradores: usa o cliente autenticado
 * para checar o papel antes de qualquer envio ou gravação privilegiada.
 */
export const testAnalyticsAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        threshold: z.number().int().min(1).max(10_000).optional(),
        windowHours: z.number().int().min(1).max(168).optional(),
      })
      .default({})
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = (roles ?? []).some(
      (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
    );
    if (!allowed) throw new Error("forbidden");

    const threshold = data.threshold ?? 20;
    const windowHours = data.windowHours ?? 24;
    const message =
      `🧪 0WEB — Teste de alerta de telemetria\n` +
      `Simulação disparada pelo painel de auditorias.\n` +
      `Limiar configurado: ${threshold} · Janela: ${windowHours} h.`;

    const { sendWhatsAppAlert } = await import("@/lib/alerts.functions");
    const sent = await sendWhatsAppAlert(message).catch((e: unknown) => ({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }));

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("anomaly_alerts").insert({
        kind: "analytics_discards_test",
        severity: "info",
        value: 0,
        threshold,
        channel: "whatsapp",
        status: sent.ok ? "sent" : "failed",
        message,
        payload: { windowHours, test: true, actor: context.userId },
        sent_at: sent.ok ? new Date().toISOString() : null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } catch {
      /* histórico é diagnóstico: nunca deve derrubar o teste */
    }

    return { ok: sent.ok, error: "error" in sent ? sent.error : undefined, threshold, windowHours };
  });
