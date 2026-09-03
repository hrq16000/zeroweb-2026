import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Pedidos de um cliente do portfólio (ex.: Heloá Gás) para o painel interno.
 *
 * Privacidade: o WhatsApp operacional do cliente e o número do consumidor
 * nunca trafegam para o bundle público. Aqui, dentro de rota autenticada,
 * exibimos apenas o conteúdo do pedido; qualquer valor que pareça telefone
 * nas respostas é mascarado antes de sair do servidor.
 */
export const ORDER_STAGES = [
  "novo",
  "em_separacao",
  "em_rota",
  "entregue",
  "cancelado",
] as const;
export type OrderStage = (typeof ORDER_STAGES)[number];

export type ClientOrder = {
  id: string;
  created_at: string;
  client_key: string | null;
  funnel_slug: string;
  stage: OrderStage;
  answers: Record<string, string>;
  order_items: string | null;
  fulfillment: string | null;
  customer_note: string | null;
  city: string | null;
  history: { stage: string; at: string; by?: string | null }[];
};

const PHONE_RE = /(\+?\d[\d\s().-]{7,})/g;

function maskPhones(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return text.replace(PHONE_RE, (m) => {
    const digits = m.replace(/\D/g, "");
    return digits.length >= 8 ? `••••${digits.slice(-4)}` : m;
  });
}

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some(
    (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
  );
  if (!allowed) throw new Error("forbidden");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

function normalizeStage(value: unknown): OrderStage {
  const v = String(value ?? "").toLowerCase();
  return (ORDER_STAGES as readonly string[]).includes(v) ? (v as OrderStage) : "novo";
}

export const listClientOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        clientKey: z.string().min(1).max(60).default("heloa-gas"),
        limit: z.number().int().min(1).max(300).default(120),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ orders: ClientOrder[] }> => {
    const supabaseAdmin = await assertAdmin(context.supabase, context.userId);

    const { data: rows, error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select(
        "id, created_at, answers_json, metadata_json, pipeline_stage, dynamic_forms!inner(slug, name)",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);

    const orders: ClientOrder[] = ((rows ?? []) as any[])
      .filter((r) => {
        const meta = (r.metadata_json ?? {}) as Record<string, unknown>;
        const slug = String(r.dynamic_forms?.slug ?? "");
        return (
          meta.client_key === data.clientKey ||
          slug === `funnel-${data.clientKey}` ||
          slug === `portfolio-${data.clientKey}`
        );
      })
      .map((r) => {
        const meta = (r.metadata_json ?? {}) as Record<string, unknown>;
        const ctx = (meta.order_context ?? {}) as Record<string, unknown>;
        const rawAnswers = (r.answers_json ?? {}) as Record<string, unknown>;
        const answers: Record<string, string> = {};
        for (const [k, v] of Object.entries(rawAnswers)) answers[k] = maskPhones(v);
        const history = Array.isArray(meta.status_history)
          ? (meta.status_history as { stage: string; at: string }[])
          : [];
        return {
          id: r.id as string,
          created_at: r.created_at as string,
          client_key: (meta.client_key as string) ?? null,
          funnel_slug: String(r.dynamic_forms?.slug ?? "—"),
          stage: normalizeStage(r.pipeline_stage),
          answers,
          order_items: (ctx.order_items as string) ?? null,
          fulfillment: (ctx.fulfillment as string) ?? null,
          customer_note: ctx.customer_note ? maskPhones(ctx.customer_note) : null,
          city: (meta.city as string) ?? null,
          history: [
            { stage: "novo", at: r.created_at as string },
            ...history,
          ],
        } satisfies ClientOrder;
      });

    return { orders };
  });

export const setClientOrderStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        stage: z.enum(ORDER_STAGES),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertAdmin(context.supabase, context.userId);

    const { data: current, error: readError } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("metadata_json")
      .eq("id", data.id)
      .single();
    if (readError) throw new Error(readError.message);

    const meta = ((current?.metadata_json ?? {}) as Record<string, unknown>) || {};
    const history = Array.isArray(meta.status_history) ? (meta.status_history as unknown[]) : [];
    const nextMeta = {
      ...meta,
      status_history: [...history, { stage: data.stage, at: new Date().toISOString() }].slice(-50),
    };

    const { error } = await supabaseAdmin
      .from("dynamic_form_leads")
      .update({ pipeline_stage: data.stage, metadata_json: nextMeta })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "client_order.stage",
      entity: "dynamic_form_leads",
      entity_id: data.id,
    });

    return { ok: true, stage: data.stage };
  });
