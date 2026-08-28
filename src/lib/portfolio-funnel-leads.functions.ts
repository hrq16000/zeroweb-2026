import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PortfolioFunnelLead = {
  id: string;
  created_at: string;
  funnel_slug: string;
  funnel_name: string;
  client_key: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  status: string | null;
  pipeline_stage: string | null;
  order_items: string | null;
  order_total: string | null;
  fulfillment: string | null;
  customer_note: string | null;
};

const inputSchema = z
  .object({
    client_key: z.string().max(60).optional(),
    funnel_slug: z.string().max(120).optional(),
    status: z.string().max(40).optional(),
    limit: z.number().int().min(1).max(300).optional(),
  })
  .default({});

function pickOrderContext(meta: Record<string, unknown> | null) {
  const ctx = (meta?.order_context ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v ? v : null);
  return {
    order_items: str(ctx.order_items),
    order_total: str(ctx.order_total),
    fulfillment: str(ctx.fulfillment),
    customer_note: str(ctx.customer_note),
  };
}

/**
 * Lista leads dos funis de portfólio para o painel administrativo.
 * Nunca retorna o WhatsApp privado do cliente nem a mensagem final —
 * esses dados só existem no servidor, no momento do redirect.
 */
export const listPortfolioFunnelLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = (roles ?? []).some(
      (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
    );
    if (!allowed) throw new Error("forbidden");

    let q = (supabaseAdmin as any)
      .from("dynamic_form_leads")
      .select(
        "id, created_at, form_id, contact_name, contact_phone, metadata_json, pipeline_stage, whatsapp_alert_status, dynamic_forms!inner(slug, name)",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 200);
    if (data.funnel_slug && !data.funnel_slug.startsWith("portfolio-")) {
      q = q.eq("dynamic_forms.slug", data.funnel_slug);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    let leads: PortfolioFunnelLead[] = ((rows ?? []) as any[]).map((r) => {
      const meta = (r.metadata_json ?? null) as Record<string, unknown> | null;
      const clientKey = typeof meta?.client_key === "string" ? meta.client_key : null;
      const isPortfolioLead = meta?.source === "portfolio_client" && clientKey;
      return {
        id: r.id as string,
        created_at: r.created_at as string,
        funnel_slug: isPortfolioLead ? `portfolio-${clientKey}` : (r.dynamic_forms?.slug ?? "—"),
        funnel_name: isPortfolioLead
          ? (typeof meta?.studio_name === "string" ? meta.studio_name : clientKey)
          : (r.dynamic_forms?.name ?? "—"),
        client_key: clientKey,
        contact_name: r.contact_name ?? null,
        contact_phone: r.contact_phone ?? null,
        status: (r.whatsapp_alert_status as string | null) ?? null,
        pipeline_stage: (r.pipeline_stage as string | null) ?? null,
        ...pickOrderContext(meta),
      };
    });

    if (data.client_key) leads = leads.filter((l) => l.client_key === data.client_key);
    if (data.funnel_slug?.startsWith("portfolio-")) {
      leads = leads.filter((l) => l.funnel_slug === data.funnel_slug);
    }
    if (data.status) leads = leads.filter((l) => l.status === data.status);

    const funnels = Array.from(new Set(leads.map((l) => l.funnel_slug))).sort();
    const clients = Array.from(
      new Set(leads.map((l) => l.client_key).filter(Boolean) as string[]),
    ).sort();

    return { leads, funnels, clients };
  });
