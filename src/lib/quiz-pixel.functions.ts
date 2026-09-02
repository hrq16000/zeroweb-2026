import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Pixel próprio do quiz (LGPD-safe).
 *
 * Só grava identificadores anônimos de sessão, etapa e rótulo da alternativa —
 * nunca nome, telefone, e-mail ou IP. A leitura é exclusiva do portal admin.
 */
export const QUIZ_EVENT_TYPES = [
  "quiz_view",
  "step_view",
  "answer_click",
  "step_complete",
  "abandon",
  "submit",
  "whatsapp_intent",
  "whatsapp_open",
] as const;

export type QuizEventType = (typeof QUIZ_EVENT_TYPES)[number];

const eventSchema = z.object({
  sessionKey: z.string().min(8).max(64),
  quizKey: z.string().min(2).max(64),
  stepKey: z.string().max(64).default(""),
  stepIndex: z.number().int().min(0).max(99).default(0),
  eventType: z.enum(QUIZ_EVENT_TYPES),
  answerLabel: z.string().max(120).nullable().optional(),
  pagePath: z.string().max(200).nullable().optional(),
  leadId: z.string().uuid().nullable().optional(),
});

/** Registra um evento do quiz. Público — não exige sessão. */
export const trackQuizEvent = createServerFn({ method: "POST" })
  .inputValidator((d) => eventSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quiz_pixel_events").insert({
      session_key: data.sessionKey,
      quiz_key: data.quizKey,
      step_key: data.stepKey ?? "",
      step_index: data.stepIndex ?? 0,
      event_type: data.eventType,
      answer_label: data.answerLabel ?? null,
      page_path: data.pagePath ?? null,
      lead_id: data.leadId ?? null,
    } as never);
    if (error) return { ok: false as const };
    return { ok: true as const };
  });

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("forbidden");
  return supabaseAdmin;
}

export type QuizStepStat = {
  stepIndex: number;
  stepKey: string;
  visualizacoes: number;
  cliques: number;
  concluiram: number;
  abandono: number;
  taxaAbandono: number;
};

export type QuizPixelStats = {
  sessoes: number;
  submissoes: number;
  intencaoWhatsapp: number;
  aberturaWhatsapp: number;
  taxaConversao: number;
  etapas: QuizStepStat[];
  respostas: { label: string; cliques: number }[];
  atualizadoEm: string;
};

/** Agrega o funil do quiz por etapa para a tela /app/leads. */
export const quizPixelStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { days?: number; quizKey?: string } = {}) => ({
    days: Math.min(Math.max(Number(d?.days) || 30, 1), 180),
    quizKey: typeof d?.quizKey === "string" && d.quizKey !== "all" ? d.quizKey.slice(0, 64) : undefined,
  }))
  .handler(async ({ data, context }): Promise<QuizPixelStats> => {
    const supabaseAdmin = await assertAdmin(context.userId);
    const since = new Date(Date.now() - data.days * 86400000).toISOString();

    let q = supabaseAdmin
      .from("quiz_pixel_events")
      .select("session_key, quiz_key, step_key, step_index, event_type, answer_label")
      .gte("created_at", since)
      .limit(20000);
    if (data.quizKey) q = q.eq("quiz_key", data.quizKey);

    const { data: rows, error } = await q;
    if (error) throw error;

    const events = (rows ?? []) as Array<{
      session_key: string;
      step_key: string | null;
      step_index: number | null;
      event_type: string;
      answer_label: string | null;
    }>;

    const sessoes = new Set<string>();
    const submissoes = new Set<string>();
    const intencao = new Set<string>();
    const abertura = new Set<string>();
    const steps = new Map<number, QuizStepStat>();
    const respostas = new Map<string, number>();

    const step = (idx: number, key: string) => {
      const cur =
        steps.get(idx) ??
        ({ stepIndex: idx, stepKey: key, visualizacoes: 0, cliques: 0, concluiram: 0, abandono: 0, taxaAbandono: 0 } as QuizStepStat);
      if (key && !cur.stepKey) cur.stepKey = key;
      steps.set(idx, cur);
      return cur;
    };

    for (const e of events) {
      sessoes.add(e.session_key);
      const idx = e.step_index ?? 0;
      const key = e.step_key ?? "";
      switch (e.event_type) {
        case "step_view":
          step(idx, key).visualizacoes += 1;
          break;
        case "answer_click": {
          step(idx, key).cliques += 1;
          if (e.answer_label) respostas.set(e.answer_label, (respostas.get(e.answer_label) ?? 0) + 1);
          break;
        }
        case "step_complete":
          step(idx, key).concluiram += 1;
          break;
        case "submit":
          submissoes.add(e.session_key);
          break;
        case "whatsapp_intent":
          intencao.add(e.session_key);
          break;
        case "whatsapp_open":
          abertura.add(e.session_key);
          break;
        default:
          break;
      }
    }

    const etapas = Array.from(steps.values())
      .sort((a, b) => a.stepIndex - b.stepIndex)
      .map((s) => {
        const abandono = Math.max(s.visualizacoes - s.concluiram, 0);
        return {
          ...s,
          abandono,
          taxaAbandono: s.visualizacoes ? Math.round((abandono / s.visualizacoes) * 1000) / 10 : 0,
        };
      });

    return {
      sessoes: sessoes.size,
      submissoes: submissoes.size,
      intencaoWhatsapp: intencao.size,
      aberturaWhatsapp: abertura.size,
      taxaConversao: sessoes.size ? Math.round((abertura.size / sessoes.size) * 1000) / 10 : 0,
      etapas,
      respostas: Array.from(respostas.entries())
        .map(([label, cliques]) => ({ label, cliques }))
        .sort((a, b) => b.cliques - a.cliques)
        .slice(0, 12),
      atualizadoEm: new Date().toISOString(),
    };
  });
