import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Revelação explícita do contato de retorno de um lead.
 *
 * Regra: o número completo NUNCA sai em listagens. Ele só é devolvido nesta
 * ação administrativa, sob papel admin/super_admin, com registro em
 * `audit_logs` (sem gravar o número no log) e finalidade única: responder à
 * solicitação enviada pelo próprio visitante.
 */
export const revealLeadRecoveryContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ leadId: z.string().uuid(), reason: z.string().min(3).max(200) }).parse(data),
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

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead, error } = await (supabaseAdmin as any)
      .from("dynamic_form_leads")
      .select("id, contact_phone, metadata_json")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!lead) throw new Error("not_found");

    const digits = String(lead.contact_phone ?? "").replace(/\D/g, "");
    const meta = (lead.metadata_json ?? {}) as Record<string, unknown>;

    await (supabaseAdmin as any).from("audit_logs").insert({
      actor_id: context.userId,
      action: "lead_recovery_contact_revealed",
      entity: "dynamic_form_leads",
      entity_id: data.leadId,
      // Nunca gravamos o número no log de auditoria.
      meta: { reason: data.reason, had_contact: Boolean(digits) },
    });

    if (!digits) return { available: false as const, contact: null, purpose: null };
    return {
      available: true as const,
      contact: digits,
      purpose:
        typeof meta.recovery_contact_purpose === "string" ? meta.recovery_contact_purpose : null,
    };
  });
