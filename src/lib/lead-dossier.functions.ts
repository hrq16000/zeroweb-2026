import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Ficha completa de um lead de cliente real: dados do formulário, respostas do
 * quiz e histórico de interações (tokens de WhatsApp, aberturas reais, eventos
 * do pixel e ações administrativas registradas em auditoria).
 *
 * Somente admin/super_admin. Todo acesso fica registrado em `audit_logs`.
 */
export type LeadInteraction = {
  at: string;
  tipo: string;
  descricao: string;
  canal: "quiz" | "whatsapp" | "portal";
};

export type LeadDossier = {
  id: string;
  nome: string;
  telefone: string | null;
  segmento: string;
  etapa: string;
  intent: string;
  score: number;
  origem: string;
  createdAt: string;
  respostas: { pergunta: string; resposta: string }[];
  interacoes: LeadInteraction[];
  contatoRealizado: boolean;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

function toText(value: unknown): string {
  if (value == null) return "—";
  if (Array.isArray(value)) return value.map(toText).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function readSegment(metadata: unknown, answers: unknown): string {
  const m = (metadata ?? {}) as Record<string, any>;
  const a = (answers ?? {}) as Record<string, any>;
  const seg = m.audience_tag ?? m.segment ?? m.payload?.segment ?? a.segmento ?? a.segment ?? a.tipo_negocio;
  const value = typeof seg === "string" ? seg.trim() : "";
  return value || "não segmentado";
}

export const getLeadDossier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ leadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<LeadDossier | null> => {
    const supabaseAdmin = await assertAdmin(context.userId);

    const { data: lead, error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select(
        "id, created_at, contact_name, contact_phone, metadata_json, answers_json, pipeline_stage, intent_level, score, source",
      )
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw error;
    if (!lead) return null;

    const interacoes: LeadInteraction[] = [];

    interacoes.push({
      at: lead.created_at,
      tipo: "Lead capturado",
      descricao: "Diagnóstico enviado pelo visitante.",
      canal: "quiz",
    });

    const { data: tokens } = await supabaseAdmin
      .from("whatsapp_redirect_tokens")
      .select("created_at, used_at, use_count")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: true });
    let contatoRealizado = false;
    for (const t of tokens ?? []) {
      interacoes.push({
        at: t.created_at,
        tipo: "Intenção de contato",
        descricao: "Link de WhatsApp gerado para o lead.",
        canal: "whatsapp",
      });
      if (t.used_at || (t.use_count ?? 0) > 0) {
        contatoRealizado = true;
        interacoes.push({
          at: t.used_at ?? t.created_at,
          tipo: "Contato real",
          descricao: "O visitante abriu a conversa no WhatsApp.",
          canal: "whatsapp",
        });
      }
    }

    const { data: pixel } = await supabaseAdmin
      .from("quiz_pixel_events")
      .select("created_at, event_type, step_key, step_index, answer_label")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: true })
      .limit(200);
    for (const e of pixel ?? []) {
      interacoes.push({
        at: e.created_at,
        tipo: e.event_type,
        descricao: [e.step_key || `etapa ${e.step_index ?? 0}`, e.answer_label].filter(Boolean).join(" · "),
        canal: "quiz",
      });
    }

    const { data: audit } = await supabaseAdmin
      .from("audit_logs")
      .select("created_at, action, meta")
      .eq("entity", "dynamic_form_leads")
      .eq("entity_id", lead.id)
      .order("created_at", { ascending: true })
      .limit(100);
    for (const a of audit ?? []) {
      interacoes.push({
        at: a.created_at,
        tipo: a.action,
        descricao: "Ação registrada no portal.",
        canal: "portal",
      });
    }

    const answers = (lead.answers_json ?? {}) as Record<string, unknown>;
    const respostas = Object.entries(answers)
      .filter(([k]) => !/phone|telefone|mail/i.test(k))
      .slice(0, 40)
      .map(([pergunta, resposta]) => ({ pergunta, resposta: toText(resposta) }));

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "sensitive.read",
      entity: "dynamic_form_leads",
      entity_id: lead.id,
      meta: { view: "app/leads-clientes", detail: true } as never,
    });

    return {
      id: lead.id,
      nome: lead.contact_name?.trim() || `Lead ${lead.id.slice(0, 6)}`,
      telefone: lead.contact_phone ?? null,
      segmento: readSegment(lead.metadata_json, lead.answers_json),
      etapa: lead.pipeline_stage ?? "novo",
      intent: lead.intent_level ?? "—",
      score: lead.score ?? 0,
      origem: (lead as { source?: string }).source ?? "site",
      createdAt: lead.created_at,
      respostas,
      interacoes: interacoes.sort((a, b) => String(a.at).localeCompare(String(b.at))),
      contatoRealizado,
    };
  });
