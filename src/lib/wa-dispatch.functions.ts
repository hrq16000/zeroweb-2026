import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Disparo em lote pelo WhatsApp Business.
 *
 * Regras aplicadas em todo envio:
 * - somente admin/super_admin;
 * - máximo de 50 destinatários por lote e pausa entre mensagens (limites da Meta);
 * - telefones em `wa_optouts` (LGPD) são pulados e registrados como `skipped`;
 * - cada mensagem gera log em `wa_dispatch_messages` com status e erro;
 * - a tela nunca recebe o telefone completo (apenas os 4 últimos dígitos).
 */
export type DispatchBatch = {
  id: string;
  channel: string;
  status: string;
  total: number;
  sent: number;
  failed: number;
  skipped: number;
  notes: string | null;
  createdAt: string;
};

export type DispatchMessage = {
  id: string;
  telefoneMascarado: string;
  status: string;
  erro: string | null;
  enviadoEm: string | null;
};

const MAX_PER_BATCH = 50;
const DELAY_MS = 350;

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

function mask(phoneE164: string) {
  return `•••• ${phoneE164.slice(-4)}`;
}

/** Status da integração — usado pela tela para explicar o modo atual. */
export const getWhatsAppBusinessStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { whatsappBusinessConfig } = await import("@/lib/whatsapp-business.server");
    const cfg = whatsappBusinessConfig();
    return {
      configured: cfg.configured,
      mode: cfg.configured ? ("cloud_api" as const) : ("simulated" as const),
      template: cfg.templateName,
      maxPerBatch: MAX_PER_BATCH,
    };
  });

/** Dispara mensagens para os leads selecionados. */
export const dispatchWhatsAppBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { leadIds: string[]; message: string }) => ({
    leadIds: Array.isArray(data?.leadIds) ? data.leadIds.filter((id) => typeof id === "string").slice(0, MAX_PER_BATCH) : [],
    message: String(data?.message ?? "").trim().slice(0, 900),
  }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    if (!data.leadIds.length) throw new Error("nenhum lead selecionado");
    if (data.message.length < 10) throw new Error("mensagem muito curta");

    const { toE164BR, sendWhatsAppBusinessMessage, whatsappBusinessConfig } = await import(
      "@/lib/whatsapp-business.server"
    );
    const cfg = whatsappBusinessConfig();

    const [subs, dyn, optouts] = await Promise.all([
      supabaseAdmin.from("lead_submissions").select("id, phone").in("id", data.leadIds),
      supabaseAdmin.from("dynamic_form_leads").select("id, contact_phone").in("id", data.leadIds),
      supabaseAdmin.from("wa_optouts").select("phone_e164").limit(5000),
    ]);

    const blocked = new Set((optouts.data ?? []).map((r: any) => String(r.phone_e164)));
    const targets: { leadId: string; source: string; phone: string }[] = [];
    for (const row of (subs.data ?? []) as any[]) {
      const phone = toE164BR(String(row.phone ?? ""));
      if (phone) targets.push({ leadId: row.id, source: "lead_submissions", phone });
    }
    for (const row of (dyn.data ?? []) as any[]) {
      const phone = toE164BR(String(row.contact_phone ?? ""));
      if (phone) targets.push({ leadId: row.id, source: "dynamic_form_leads", phone });
    }

    const seen = new Set<string>();
    const unique = targets.filter((t) => (seen.has(t.phone) ? false : seen.add(t.phone)));

    const { data: batch, error: batchError } = await supabaseAdmin
      .from("wa_dispatch_batches")
      .insert({
        created_by: context.userId,
        channel: cfg.configured ? "cloud_api" : "simulated",
        template_name: cfg.templateName,
        status: "running",
        total_count: unique.length,
        notes: data.message.slice(0, 200),
      })
      .select("id")
      .single();
    if (batchError || !batch) throw new Error(batchError?.message ?? "falha ao criar lote");

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const target of unique) {
      if (blocked.has(target.phone)) {
        skipped += 1;
        await supabaseAdmin.from("wa_dispatch_messages").insert({
          batch_id: batch.id,
          lead_id: target.leadId,
          lead_source: target.source,
          phone_e164: target.phone,
          message_preview: data.message.slice(0, 160),
          status: "skipped_optout",
        });
        continue;
      }

      const result = await sendWhatsAppBusinessMessage(target.phone, data.message);
      if (result.ok) sent += 1;
      else failed += 1;

      await supabaseAdmin.from("wa_dispatch_messages").insert({
        batch_id: batch.id,
        lead_id: target.leadId,
        lead_source: target.source,
        phone_e164: target.phone,
        message_preview: data.message.slice(0, 160),
        status: result.ok ? (result.mode === "simulated" ? "simulated" : "sent") : "failed",
        provider_message_id: result.providerMessageId ?? null,
        error_message: result.error ?? null,
        sent_at: result.ok ? new Date().toISOString() : null,
      });

      if (DELAY_MS) await new Promise((r) => setTimeout(r, DELAY_MS));
    }

    await supabaseAdmin
      .from("wa_dispatch_batches")
      .update({
        status: failed ? "completed_with_errors" : "completed",
        sent_count: sent,
        failed_count: failed,
        skipped_count: skipped,
      })
      .eq("id", batch.id);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "whatsapp.batch_dispatch",
      entity: "wa_dispatch_batches",
      entity_id: batch.id,
      meta: { total: unique.length, sent, failed, skipped, mode: cfg.configured ? "cloud_api" : "simulated" },
    });

    return { batchId: batch.id, total: unique.length, sent, failed, skipped, mode: cfg.configured ? "cloud_api" : "simulated" };
  });

/** Histórico de lotes com contadores. */
export const listWhatsAppBatches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DispatchBatch[]> => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const { data } = await supabaseAdmin
      .from("wa_dispatch_batches")
      .select("id, channel, status, total_count, sent_count, failed_count, skipped_count, notes, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    return ((data ?? []) as any[]).map((r) => ({
      id: r.id,
      channel: r.channel,
      status: r.status,
      total: r.total_count ?? 0,
      sent: r.sent_count ?? 0,
      failed: r.failed_count ?? 0,
      skipped: r.skipped_count ?? 0,
      notes: r.notes ?? null,
      createdAt: r.created_at,
    }));
  });

/** Mensagens de um lote, com telefone mascarado. */
export const listWhatsAppBatchMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { batchId: string }) => ({ batchId: String(data?.batchId ?? "").slice(0, 64) }))
  .handler(async ({ data, context }): Promise<DispatchMessage[]> => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const { data: rows } = await supabaseAdmin
      .from("wa_dispatch_messages")
      .select("id, phone_e164, status, error_message, sent_at")
      .eq("batch_id", data.batchId)
      .order("created_at", { ascending: true })
      .limit(200);
    return ((rows ?? []) as any[]).map((r) => ({
      id: r.id,
      telefoneMascarado: mask(String(r.phone_e164 ?? "")),
      status: r.status,
      erro: r.error_message ?? null,
      enviadoEm: r.sent_at ?? null,
    }));
  });

/** Registra um telefone na lista de não perturbe (LGPD). */
export const addWhatsAppOptOut = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { phone: string; reason?: string }) => ({
    phone: String(data?.phone ?? ""),
    reason: String(data?.reason ?? "").slice(0, 200) || null,
  }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const { toE164BR } = await import("@/lib/whatsapp-business.server");
    const phone = toE164BR(data.phone);
    if (!phone) throw new Error("telefone inválido");
    const { error } = await supabaseAdmin
      .from("wa_optouts")
      .upsert({ phone_e164: phone, reason: data.reason, created_by: context.userId }, { onConflict: "phone_e164" });
    if (error) throw new Error(error.message);
    return { ok: true, telefoneMascarado: mask(phone) };
  });

/** Lista de opt-outs, sempre mascarada. */
export const listWhatsAppOptOuts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const { data } = await supabaseAdmin
      .from("wa_optouts")
      .select("id, phone_e164, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    return ((data ?? []) as any[]).map((r) => ({
      id: r.id,
      telefoneMascarado: mask(String(r.phone_e164 ?? "")),
      motivo: r.reason ?? null,
      criadoEm: r.created_at,
    }));
  });
