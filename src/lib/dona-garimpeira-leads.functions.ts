// Central de leads da Dona Garimpeira. Somente painel: toda função exige
// sessão + papel de administrador conferido no servidor. Os dados ficam em
// `lead_submissions`, isolados pela origem do próprio brechó.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { recordSensitiveAudit } from "@/lib/sensitive-audit.functions";
import { persistCrmHistoryAtomic } from "@/lib/crm-history-atomic";
import {
  DG_CLIENT_KEY,
  DG_INTERACTIONS,
  DG_LEAD_SOURCE,
  DG_ORIGINS,
  DG_STATUSES,
  filterDgLeads,
  normalizeDgPhone,
  normalizeDgStatus,
  toHistoryEntry,
  type DgLeadRow,
  type DgOrigin,
} from "@/lib/dona-garimpeira-leads";

const COLUMNS = "id,created_at,name,phone,email,status,assignee,last_interaction,payload_json,source";
type RawLead = {
  id: string; created_at: string; name: string | null; phone: string | null; email: string | null;
  status: string | null; assignee: string | null; last_interaction: string | null;
  payload_json: Record<string, unknown> | null; source: string | null;
};

function toRow(raw: RawLead): DgLeadRow {
  const payload = raw.payload_json ?? {};
  const str = (value: unknown) => (typeof value === "string" && value.trim() ? value : null);
  const origin = (DG_ORIGINS as readonly unknown[]).includes(payload["origin"]) ? (payload["origin"] as DgOrigin) : "outro";
  return {
    id: raw.id, created_at: raw.created_at, name: raw.name, phone: raw.phone, email: raw.email,
    status: normalizeDgStatus(raw.status), assignee: raw.assignee, last_interaction: raw.last_interaction,
    product: str(payload["product_interest"]), origin, message: str(payload["message"]),
  };
}

async function adminContext(context: unknown) {
  const { supabase, userId } = context as { supabase: never; userId: string };
  const { requireAdmin } = await import("@/lib/admin-access.server");
  await requireAdmin(supabase, userId);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return { supabase, userId, supabaseAdmin };
}

/** Garante que o lead pertence ao brechó antes de qualquer leitura ou escrita. */
async function loadOwnLead(supabaseAdmin: Awaited<ReturnType<typeof adminContext>>["supabaseAdmin"], id: string) {
  const { data, error } = await supabaseAdmin
    .from("lead_submissions").select(COLUMNS).eq("id", id).eq("source", DG_LEAD_SOURCE).maybeSingle();
  if (error || !data) throw new Error("Lead não encontrado na central da Dona Garimpeira.");
  return data as unknown as RawLead;
}

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const FiltersSchema = z.object({
  status: z.enum(DG_STATUSES).optional(),
  origin: z.enum(DG_ORIGINS).optional(),
  product: z.string().trim().max(120).optional(),
  from: date.optional(),
  to: date.optional(),
  search: z.string().trim().max(120).optional(),
});

export const listDgLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => FiltersSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin, userId } = await adminContext(context);
    const { data: rows, error } = await supabaseAdmin
      .from("lead_submissions").select(COLUMNS).eq("source", DG_LEAD_SOURCE)
      .order("created_at", { ascending: false }).limit(1000);
    if (error) throw new Error("Não foi possível ler os leads.");
    const all = ((rows ?? []) as unknown as RawLead[]).map(toRow);
    const filters = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined && value !== ""));
    const leads = filterDgLeads(all, filters);
    const byStatus = Object.fromEntries(DG_STATUSES.map((status) => [status, all.filter((row) => row.status === status).length]));
    await recordSensitiveAudit({
      actorId: userId, action: "sensitive.read", entity: "lead_submissions",
      meta: { scope: "dona-garimpeira-list", result_count: leads.length },
    });
    return { leads, total: all.length, byStatus };
  });

export const getDgLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin, userId } = await adminContext(context);
    const lead = toRow(await loadOwnLead(supabaseAdmin, data.id));
    const { data: history, error } = await supabaseAdmin
      .from("lead_history").select("id,kind,from_value,to_value,note,actor,created_at")
      .eq("lead_id", data.id).order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error("Não foi possível ler o histórico.");
    await recordSensitiveAudit({
      actorId: userId, action: "sensitive.read", entity: "lead_submissions", entityId: data.id,
      meta: { scope: "dona-garimpeira-detail" },
    });
    return { lead, history: history ?? [] };
  });

const CreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  product: z.string().trim().max(200).optional(),
  origin: z.enum(DG_ORIGINS),
  message: z.string().trim().max(2000).optional(),
  assignee: z.string().trim().max(120).optional(),
});

export const createDgLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin, userId } = await adminContext(context);
    const phone = normalizeDgPhone(data.phone);
    if (!phone) throw new Error("Telefone inválido. Informe DDD e número.");

    // Evita duplicar: o mesmo telefone já cadastrado no brechó abre a ficha existente.
    const { data: same } = await supabaseAdmin
      .from("lead_submissions").select("id,phone").eq("source", DG_LEAD_SOURCE).limit(1000);
    const existing = (same ?? []).find((row) => normalizeDgPhone(String(row.phone ?? "")) === phone);
    if (existing) return { created: false as const, duplicate: true as const, id: existing.id as string };

    const { data: inserted, error } = await supabaseAdmin
      .from("lead_submissions")
      .insert({
        name: data.name, phone, email: data.email || null, source: DG_LEAD_SOURCE,
        landing_page: "/portfolio/dona-garimpeira-brecho", status: "novo",
        assignee: data.assignee || null,
        payload_json: {
          client_key: DG_CLIENT_KEY, intake: "manual",
          origin: data.origin, product_interest: data.product || null, message: data.message || null,
        },
      })
      .select("id");
    if (error) throw new Error("Não foi possível cadastrar o lead.");
    const id = inserted?.[0]?.id as string | undefined;
    // A regra geral de duplicidade do banco ignora o mesmo telefone no mesmo dia.
    if (!id) return { created: false as const, duplicate: true as const, id: null };
    await recordSensitiveAudit({
      actorId: userId, action: "sensitive.write", entity: "lead_submissions", entityId: id,
      meta: { operation: "dona-garimpeira-create" },
    });
    return { created: true as const, duplicate: false as const, id };
  });

export const updateDgLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(DG_STATUSES).optional(),
      assignee: z.string().trim().max(120).nullable().optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin, userId } = await adminContext(context);
    await loadOwnLead(supabaseAdmin, data.id);
    const patch: { status?: string; assignee?: string | null } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.assignee !== undefined) patch.assignee = data.assignee || null;
    if (!Object.keys(patch).length) return { ok: true };
    const { error } = await supabaseAdmin
      .from("lead_submissions").update(patch).eq("id", data.id).eq("source", DG_LEAD_SOURCE);
    if (error) throw new Error("Não foi possível atualizar o lead.");
    await recordSensitiveAudit({
      actorId: userId, action: "sensitive.write", entity: "lead_submissions", entityId: data.id,
      meta: { operation: "dona-garimpeira-update", fields: Object.keys(patch) },
    });
    return { ok: true };
  });

const InteractionSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(DG_INTERACTIONS),
  note: z.string().trim().max(4000).default(""),
});

export const addDgInteraction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InteractionSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, supabaseAdmin, userId } = await adminContext(context);
    await loadOwnLead(supabaseAdmin, data.id);
    // Resposta enviada só entra com a comprovação descrita por quem atendeu.
    if (data.kind === "resposta_enviada" && data.note.length < 3) {
      throw new Error("Descreva a comprovação da resposta enviada.");
    }
    const entry = toHistoryEntry(data.kind, data.note);
    const reader = supabase as unknown as Parameters<typeof persistCrmHistoryAtomic>[0];
    const writer = supabaseAdmin as unknown as Parameters<typeof persistCrmHistoryAtomic>[1];
    await persistCrmHistoryAtomic(reader, writer, { lead_id: data.id, kind: entry.kind, note: entry.note, actor: userId });
    await recordSensitiveAudit({
      actorId: userId, action: "sensitive.write", entity: "lead_submissions", entityId: data.id,
      meta: { operation: "dona-garimpeira-interaction", kind: data.kind },
    });
    return { ok: true };
  });

/**
 * Grava a mensagem preparada e devolve o endereço da conversa com o próprio
 * contato do lead. Nada é enviado: a pessoa do atendimento envia pelo WhatsApp.
 */
export const prepareDgWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), message: z.string().trim().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, supabaseAdmin, userId } = await adminContext(context);
    const lead = await loadOwnLead(supabaseAdmin, data.id);
    const phone = normalizeDgPhone(String(lead.phone ?? ""));
    if (!phone) throw new Error("Este lead não tem telefone válido para o WhatsApp.");
    const entry = toHistoryEntry("mensagem_preparada", data.message);
    const reader = supabase as unknown as Parameters<typeof persistCrmHistoryAtomic>[0];
    const writer = supabaseAdmin as unknown as Parameters<typeof persistCrmHistoryAtomic>[1];
    await persistCrmHistoryAtomic(reader, writer, { lead_id: data.id, kind: entry.kind, note: entry.note, actor: userId });
    const { assembleWaMeUrl } = await import("@/lib/whatsapp-redirect.server");
    await recordSensitiveAudit({
      actorId: userId, action: "sensitive.write", entity: "lead_submissions", entityId: data.id,
      meta: { operation: "dona-garimpeira-prepare-whatsapp" },
    });
    return { url: assembleWaMeUrl(phone, data.message) };
  });
