import { sendWhatsAppAlert } from "@/lib/alerts.functions";

const SITE_URL = "https://0web.com.br";

/** Envia por e-mail (se houver domínio configurado) e por WhatsApp os alertas ainda não notificados. */
export async function notifyPendingSeoAlerts(supabase: any) {
  const { data: alerts } = await supabase
    .from("seo_alerts")
    .select("*")
    .is("notified_at", null)
    .is("resolved_at", null)
    .order("created_at", { ascending: false })
    .limit(50);

  const list = alerts ?? [];
  if (list.length === 0) return { notified: 0, channels: [] as string[] };

  const lines = list
    .slice(0, 15)
    .map(
      (a: any) =>
        `• [${a.severity}] ${a.title}\n  ${a.url ?? SITE_URL}\n  Motivo: ${a.probable_cause ?? "—"}\n  Correção: ${a.suggested_fix ?? "—"}`,
    )
    .join("\n\n");
  const text = `ALERTA SEO 0WEB — ${list.length} pendência(s)\n\n${lines}`;

  const channels: string[] = [];

  const wa = await sendWhatsAppAlert(text).catch(() => ({ ok: false }));
  if ((wa as { ok: boolean }).ok) channels.push("whatsapp");

  const email = await sendEmailAlert(text, list.length).catch(() => false);
  if (email) channels.push("email");

  await supabase
    .from("seo_alerts")
    .update({ notified_at: new Date().toISOString() })
    .in(
      "id",
      list.map((a: any) => a.id),
    );

  return { notified: list.length, channels };
}

async function sendEmailAlert(text: string, count: number): Promise<boolean> {
  const to = process.env.SEO_ALERT_EMAIL;
  if (!to) return false;
  try {
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const result = await sendTemplateEmail("seo-alert", to, {
      templateData: { count, body: text },
      idempotencyKey: `seo-alert-${new Date().toISOString().slice(0, 13)}-${count}`,
    });
    return result.sent;
  } catch (e) {
    console.error("[seo-alerts] email falhou:", e);
    return false;
  }
}
