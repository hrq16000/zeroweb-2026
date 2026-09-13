import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { maskPhoneForDisplay } from "@/lib/portfolio-host-leads";

export type PortfolioFunnelLead = {
  id: string;
  created_at: string;
  funnel_slug: string;
  funnel_name: string;
  client_key: string | null;
  contact_name: string | null;
  /** Somente máscara. O número completo nunca é serializado nesta listagem. */
  contact_phone_masked: string | null;
  has_recovery_contact: boolean;
  status: string | null;
  pipeline_stage: string | null;
  order_items: string | null;
  order_total: string | null;
  fulfillment: string | null;
  customer_note: string | null;
  source_kind: "portfolio_funnel" | "capture";
  delivery_status: string | null;
  recoverability_status: string | null;
};

const inputSchema = z
  .object({
    client_key: z.string().max(60).optional(),
    funnel_slug: z.string().max(120).optional(),
    status: z.string().max(40).optional(),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    recoverability: z.string().max(60).optional(),
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
    if (data.from) q = q.gte("created_at", `${data.from}T00:00:00.000Z`);
    if (data.to) q = q.lte("created_at", `${data.to}T23:59:59.999Z`);
    if (data.funnel_slug && !data.funnel_slug.startsWith("portfolio-")) {
      q = q.eq("dynamic_forms.slug", data.funnel_slug);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const dynamicRows = (rows ?? []) as any[];
    const dynamicIds = dynamicRows.map((row) => row.id as string);
    const { data: ledgerRows, error: ledgerError } = dynamicIds.length
      ? await (supabaseAdmin as any)
          .from("lead_delivery_ledger")
          .select("lead_id, delivery_status, recoverability_status")
          .eq("lead_table", "dynamic_form_leads")
          .in("lead_id", dynamicIds)
      : { data: [], error: null };
    if (ledgerError) throw new Error(ledgerError.message);
    const ledgerByLead = new Map(
      ((ledgerRows ?? []) as any[]).map((row) => [row.lead_id as string, row]),
    );

    let leads: PortfolioFunnelLead[] = dynamicRows.map((r) => {
      const meta = (r.metadata_json ?? null) as Record<string, unknown> | null;
      const clientKey = typeof meta?.client_key === "string" ? meta.client_key : null;
      const isPortfolioLead = meta?.source === "portfolio_client" && clientKey;
      const portfolioFunnelSlug = typeof meta?.funnel_slug === "string"
        ? meta.funnel_slug
        : (clientKey ? `portfolio-${clientKey}` : null);
      const ledger = ledgerByLead.get(r.id as string) as any;
      return {
        id: r.id as string,
        created_at: r.created_at as string,
        funnel_slug: isPortfolioLead && portfolioFunnelSlug ? portfolioFunnelSlug : (r.dynamic_forms?.slug ?? "—"),
        funnel_name: isPortfolioLead
          ? (typeof meta?.studio_name === "string" ? meta.studio_name : clientKey)
          : (r.dynamic_forms?.name ?? "—"),
        client_key: clientKey,
        contact_name: r.contact_name ?? null,
        contact_phone_masked: r.contact_phone ? maskPhoneForDisplay(r.contact_phone) : null,
        has_recovery_contact: Boolean(r.contact_phone),
        status: (r.whatsapp_alert_status as string | null) ?? null,
        pipeline_stage: (r.pipeline_stage as string | null) ?? null,
        ...pickOrderContext(meta),
        source_kind: "portfolio_funnel" as const,
        delivery_status: ledger?.delivery_status ?? null,
        recoverability_status: ledger?.recoverability_status ?? null,
      };
    });

    let captureQuery = (supabaseAdmin as any)
      .from("lead_submissions")
      .select("id, created_at, name, phone, source, status, payload_json")
      .like("source", "captacao_%")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 200);
    if (data.from) captureQuery = captureQuery.gte("created_at", `${data.from}T00:00:00.000Z`);
    if (data.to) captureQuery = captureQuery.lte("created_at", `${data.to}T23:59:59.999Z`);
    const { data: captureRows, error: captureError } = await captureQuery;
    if (captureError) throw new Error(captureError.message);
    leads.push(
      ...((captureRows ?? []) as any[]).map((row) => ({
        id: row.id as string,
        created_at: row.created_at as string,
        funnel_slug: row.source as string,
        funnel_name: `Captação · ${String(row.source ?? "captacao").replace("captacao_", "")}`,
        client_key: "0web-captacao",
        contact_name: row.name ?? null,
        contact_phone_masked: row.phone ? maskPhoneForDisplay(row.phone) : null,
        has_recovery_contact: Boolean(row.phone),
        status: row.status ?? null,
        pipeline_stage: row.status ?? null,
        order_items: null,
        order_total: null,
        fulfillment: null,
        customer_note:
          typeof row.payload_json?.message === "string" ? row.payload_json.message : null,
        source_kind: "capture" as const,
        delivery_status: null,
        recoverability_status: row.phone ? "RECOVERABLE" : "DELIVERY_PENDING",
      })),
    );

    if (data.client_key) leads = leads.filter((l) => l.client_key === data.client_key);
    if (data.funnel_slug?.startsWith("portfolio-")) {
      leads = leads.filter((l) => l.funnel_slug === data.funnel_slug);
    }
    if (data.status) leads = leads.filter((l) => l.status === data.status);
    if (data.recoverability) {
      leads = leads.filter((l) => l.recoverability_status === data.recoverability);
    }

    const funnels = Array.from(new Set(leads.map((l) => l.funnel_slug))).sort();
    const clients = Array.from(
      new Set(leads.map((l) => l.client_key).filter(Boolean) as string[]),
    ).sort();

    return { leads, funnels, clients };
  });
