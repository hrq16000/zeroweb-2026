import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Leads com telefone informado, agrupados por segmento do diagnóstico, com o
 * funil até o contato real (lead → intenção de contato → clique no WhatsApp).
 *
 * O telefone completo só é devolvido para admin/super_admin e todo acesso é
 * registrado em `audit_logs` (metadados apenas, sem conteúdo do lead).
 */
export type PhoneLead = {
  id: string;
  nome: string;
  telefone: string;
  segmento: string;
  etapa: string;
  intent: string;
  score: number;
  /** Houve token de redirecionamento gerado (intenção de contato). */
  contato_gerado: boolean;
  /** O token foi consumido: o visitante realmente abriu o WhatsApp. */
  contato_realizado: boolean;
  contato_em: string | null;
  created_at: string;
};

export type PhoneLeadFilters = {
  segmento?: string;
  etapa?: string;
  /** Somente quem chegou ao contato real. */
  somenteContatados?: boolean;
  from?: string;
  to?: string;
  limit?: number;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function sanitize(raw: PhoneLeadFilters = {}): Required<Pick<PhoneLeadFilters, "limit">> & PhoneLeadFilters {
  return {
    segmento: typeof raw.segmento === "string" && raw.segmento !== "all" ? raw.segmento.slice(0, 60) : undefined,
    etapa: typeof raw.etapa === "string" && raw.etapa !== "all" ? raw.etapa.slice(0, 60) : undefined,
    somenteContatados: raw.somenteContatados === true,
    from: raw.from && ISO.test(raw.from) ? raw.from : undefined,
    to: raw.to && ISO.test(raw.to) ? raw.to : undefined,
    limit: Math.min(Math.max(Number(raw.limit) || 200, 1), 500),
  };
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

function readSegment(metadata: unknown, answers: unknown): string {
  const m = (metadata ?? {}) as Record<string, any>;
  const a = (answers ?? {}) as Record<string, any>;
  const seg =
    m.audience_tag ?? m.segment ?? m.payload?.segment ?? a.segmento ?? a.segment ?? a.tipo_negocio;
  const value = typeof seg === "string" ? seg.trim() : "";
  return value || "não segmentado";
}

export const listPhoneLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: PhoneLeadFilters = {}) => data)
  .handler(async ({ data, context }) => {
    const filters = sanitize(data);
    const supabaseAdmin = await assertAdmin(context.userId);

    let q = supabaseAdmin
      .from("dynamic_form_leads")
      .select(
        "id, created_at, contact_name, contact_phone, metadata_json, answers_json, pipeline_stage, intent_level, score",
      )
      .not("contact_phone", "is", null)
      .neq("contact_phone", "")
      .order("created_at", { ascending: false })
      .limit(filters.limit);
    if (filters.etapa) q = q.eq("pipeline_stage", filters.etapa);
    if (filters.from) q = q.gte("created_at", `${filters.from}T00:00:00.000Z`);
    if (filters.to) q = q.lte("created_at", `${filters.to}T23:59:59.999Z`);

    const { data: rows, error } = await q;
    if (error) throw error;

    const ids = (rows ?? []).map((r) => r.id);
    const tokensByLead = new Map<string, { used: boolean; usedAt: string | null }>();
    if (ids.length) {
      const { data: tokens } = await supabaseAdmin
        .from("whatsapp_redirect_tokens")
        .select("lead_id, used_at, use_count")
        .in("lead_id", ids);
      for (const t of tokens ?? []) {
        if (!t.lead_id) continue;
        const prev = tokensByLead.get(t.lead_id);
        const used = Boolean(t.used_at) || (t.use_count ?? 0) > 0;
        tokensByLead.set(t.lead_id, {
          used: used || Boolean(prev?.used),
          usedAt: t.used_at ?? prev?.usedAt ?? null,
        });
      }
    }

    let leads: PhoneLead[] = (rows ?? []).map((r) => {
      const token = tokensByLead.get(r.id);
      return {
        id: r.id,
        nome: r.contact_name?.trim() || `Lead ${r.id.slice(0, 6)}`,
        telefone: String(r.contact_phone),
        segmento: readSegment(r.metadata_json, r.answers_json),
        etapa: r.pipeline_stage ?? "novo",
        intent: r.intent_level ?? "—",
        score: r.score ?? 0,
        contato_gerado: Boolean(token),
        contato_realizado: Boolean(token?.used),
        contato_em: token?.usedAt ?? null,
        created_at: r.created_at,
      };
    });

    if (filters.segmento) leads = leads.filter((l) => l.segmento === filters.segmento);
    if (filters.somenteContatados) leads = leads.filter((l) => l.contato_realizado);

    const segmentos = Array.from(new Set(leads.map((l) => l.segmento))).sort();
    const etapas = Array.from(new Set((rows ?? []).map((r) => r.pipeline_stage ?? "novo"))).sort();

    const funil = {
      leads: leads.length,
      comTelefone: leads.length,
      intencaoContato: leads.filter((l) => l.contato_gerado).length,
      contatoReal: leads.filter((l) => l.contato_realizado).length,
    };

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "sensitive.read",
      entity: "dynamic_form_leads",
      entity_id: null,
      meta: { view: "app/leads-telefone", rows: leads.length } as never,
    });

    return { leads, segmentos, etapas, funil };
  });
