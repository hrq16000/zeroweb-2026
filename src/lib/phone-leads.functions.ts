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

/**
 * Leads do quiz institucional e demais formulários do site ficam em
 * `lead_submissions`. Eles precisam aparecer nas mesmas telas dos leads dos
 * funis dinâmicos (`dynamic_form_leads`), por isso são normalizados aqui.
 */
type QuizLeadRow = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  audience_tag: string | null;
  payload_json: unknown;
  status: string | null;
  temperature: string | null;
  score: number | null;
  source: string | null;
};

async function fetchQuizLeadRows(
  supabaseAdmin: any,
  filters: ReturnType<typeof sanitize>,
  limit: number,
): Promise<QuizLeadRow[]> {
  let q = supabaseAdmin
    .from("lead_submissions")
    .select("id, created_at, name, phone, audience_tag, payload_json, status, temperature, score, source")
    .not("phone", "is", null)
    .neq("phone", "")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (filters.etapa) q = q.eq("status", filters.etapa);
  if (filters.from) q = q.gte("created_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) q = q.lte("created_at", `${filters.to}T23:59:59.999Z`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as QuizLeadRow[];
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

    const quizRows = await fetchQuizLeadRows(supabaseAdmin, filters, filters.limit);

    const ids = [...(rows ?? []).map((r) => r.id), ...quizRows.map((r) => r.id)];
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

// ============================================================================
// Conversa real com o lead (admin) — abre o WhatsApp DO LEAD, nunca expõe o
// número operacional da 0WEB. A URL é montada no servidor e o acesso fica
// registrado em `audit_logs`.
// ============================================================================

function toWhatsAppDigits(raw: string): string | null {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.length <= 11) return `55${digits}`;
  return digits;
}

export const startLeadConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { leadId: string }) => {
    const id = String(data?.leadId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("invalid_lead");
    return { leadId: id };
  })
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.userId);

    const { data: lead, error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("id, contact_name, contact_phone, metadata_json, answers_json")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw error;
    if (!lead?.contact_phone) return { ok: false as const, reason: "sem_telefone" };

    const digits = toWhatsAppDigits(lead.contact_phone);
    if (!digits) return { ok: false as const, reason: "telefone_invalido" };

    const nome = lead.contact_name?.trim()?.split(/\s+/)[0] ?? "";
    const segmento = readSegment(lead.metadata_json, lead.answers_json);
    const texto =
      `Olá${nome ? ` ${nome}` : ""}! Aqui é da 0WEB. Recebemos seu diagnóstico` +
      `${segmento && segmento !== "não segmentado" ? ` sobre ${segmento}` : ""}` +
      ` e preparei os próximos passos. Posso te explicar por aqui?`;

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "lead.conversation_started",
      entity: "dynamic_form_leads",
      entity_id: lead.id,
      meta: { view: "app/leads-telefone", segmento } as never,
    });

    return {
      ok: true as const,
      url: `https://wa.me/${digits}?text=${encodeURIComponent(texto)}`,
    };
  });

// ============================================================================
// Conversão do quiz até o contato real — por segmento e por período.
// ============================================================================

export type QuizConversionPoint = { chave: string; leads: number; intencao: number; contato: number };
export type QuizConversionStats = {
  total: { leads: number; intencao: number; contato: number };
  porSegmento: QuizConversionPoint[];
  porPeriodo: QuizConversionPoint[];
};

export const quizConversionStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: PhoneLeadFilters = {}) => data)
  .handler(async ({ data, context }): Promise<QuizConversionStats> => {
    const filters = sanitize({ ...data, limit: 500 });
    const supabaseAdmin = await assertAdmin(context.userId);

    let q = supabaseAdmin
      .from("dynamic_form_leads")
      .select("id, created_at, metadata_json, answers_json")
      .order("created_at", { ascending: false })
      .limit(500);
    if (filters.from) q = q.gte("created_at", `${filters.from}T00:00:00.000Z`);
    if (filters.to) q = q.lte("created_at", `${filters.to}T23:59:59.999Z`);

    const { data: rows, error } = await q;
    if (error) throw error;

    const ids = (rows ?? []).map((r) => r.id);
    const intencao = new Set<string>();
    const contato = new Set<string>();
    if (ids.length) {
      const { data: tokens } = await supabaseAdmin
        .from("whatsapp_redirect_tokens")
        .select("lead_id, used_at, use_count")
        .in("lead_id", ids);
      for (const t of tokens ?? []) {
        if (!t.lead_id) continue;
        intencao.add(t.lead_id);
        if (t.used_at || (t.use_count ?? 0) > 0) contato.add(t.lead_id);
      }
    }

    const bump = (map: Map<string, QuizConversionPoint>, chave: string, id: string) => {
      const cur = map.get(chave) ?? { chave, leads: 0, intencao: 0, contato: 0 };
      cur.leads += 1;
      if (intencao.has(id)) cur.intencao += 1;
      if (contato.has(id)) cur.contato += 1;
      map.set(chave, cur);
    };

    const seg = new Map<string, QuizConversionPoint>();
    const per = new Map<string, QuizConversionPoint>();
    for (const r of rows ?? []) {
      const segmento = readSegment(r.metadata_json, r.answers_json);
      if (filters.segmento && segmento !== filters.segmento) continue;
      bump(seg, segmento, r.id);
      bump(per, String(r.created_at).slice(0, 10), r.id);
    }

    const consideradas = Array.from(seg.values());
    return {
      total: {
        leads: consideradas.reduce((a, b) => a + b.leads, 0),
        intencao: consideradas.reduce((a, b) => a + b.intencao, 0),
        contato: consideradas.reduce((a, b) => a + b.contato, 0),
      },
      porSegmento: consideradas.sort((a, b) => b.leads - a.leads).slice(0, 12),
      porPeriodo: Array.from(per.values()).sort((a, b) => a.chave.localeCompare(b.chave)),
    };
  });
