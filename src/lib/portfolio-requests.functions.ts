/**
 * Pedidos e solicitações por portfolio (painel administrativo).
 *
 * Fonte única: `dynamic_form_leads` (leads reais dos funis de cada
 * `/portfolio/:slug`) + `lead_delivery_ledger` (situação de entrega).
 * Nada é estimado: o que não existe volta como `null`.
 *
 * Privacidade: o telefone do visitante só sai mascarado e o WhatsApp do
 * cliente nunca é serializado.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { maskPhoneForDisplay } from "@/lib/portfolio-host-leads";

export type PortfolioRequestRow = {
  id: string;
  created_at: string;
  client_key: string;
  brand_name: string | null;
  protocol: string | null;
  contact_name: string | null;
  contact_phone_masked: string | null;
  city: string | null;
  order_items: string | null;
  order_total: string | null;
  customer_note: string | null;
  pipeline_stage: string | null;
  delivery_status: string | null;
  recoverability_status: string | null;
  /** Portfolio sem WhatsApp próprio: site publicado como amostra. */
  sample_mode: boolean;
};

export type PortfolioRequestGroup = {
  client_key: string;
  brand_name: string | null;
  sample_mode: boolean;
  total: number;
  rows: PortfolioRequestRow[];
};

const inputSchema = z
  .object({
    client_key: z.string().max(80).optional(),
    days: z.number().int().min(1).max(365).optional(),
    limit: z.number().int().min(1).max(500).optional(),
    only_sample: z.boolean().optional(),
  })
  .default({});

const str = (v: unknown) => (typeof v === "string" && v ? v : null);

/**
 * Lista as requisições de cada landing agrupadas por cliente.
 * Somente admin/super_admin.
 */
export const listPortfolioRequests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
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
    const { resolveVersionedPortfolioWhatsApp, getPortfolioContactClientKeys } = await import(
      "@/lib/portfolio-whatsapp-registry.server"
    );

    const days = data.days ?? 90;
    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    const { data: rows, error } = await (supabaseAdmin as any)
      .from("dynamic_form_leads")
      .select("id, created_at, contact_name, contact_phone, metadata_json, pipeline_stage")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 500);
    if (error) throw new Error(error.message);

    const leadRows = ((rows ?? []) as any[]).filter(
      (r) => typeof r.metadata_json?.client_key === "string",
    );
    const ids = leadRows.map((r) => r.id as string);
    const { data: ledger } = ids.length
      ? await (supabaseAdmin as any)
          .from("lead_delivery_ledger")
          .select("lead_id, delivery_status, recoverability_status")
          .eq("lead_table", "dynamic_form_leads")
          .in("lead_id", ids)
      : { data: [] };
    const ledgerByLead = new Map(
      ((ledger ?? []) as any[]).map((r) => [r.lead_id as string, r]),
    );

    let requests: PortfolioRequestRow[] = leadRows.map((r) => {
      const meta = (r.metadata_json ?? {}) as Record<string, any>;
      const clientKey = meta.client_key as string;
      const order = (meta.order_context ?? {}) as Record<string, unknown>;
      const led = ledgerByLead.get(r.id as string);
      return {
        id: r.id as string,
        created_at: r.created_at as string,
        client_key: clientKey,
        brand_name: str(meta.studio_name) ?? str(meta.recipient_name),
        protocol: str(meta.protocol),
        contact_name: r.contact_name ?? null,
        contact_phone_masked: r.contact_phone ? maskPhoneForDisplay(r.contact_phone) : null,
        city: str(meta.city),
        order_items: str(order.order_items),
        order_total: str(order.order_total),
        customer_note: str(order.customer_note),
        pipeline_stage: (r.pipeline_stage as string | null) ?? null,
        delivery_status: led?.delivery_status ?? null,
        recoverability_status: led?.recoverability_status ?? null,
        sample_mode: !resolveVersionedPortfolioWhatsApp(clientKey),
      };
    });

    if (data.client_key) requests = requests.filter((r) => r.client_key === data.client_key);
    if (data.only_sample) requests = requests.filter((r) => r.sample_mode);

    const groups = new Map<string, PortfolioRequestGroup>();
    for (const row of requests) {
      const g = groups.get(row.client_key) ?? {
        client_key: row.client_key,
        brand_name: row.brand_name,
        sample_mode: row.sample_mode,
        total: 0,
        rows: [],
      };
      g.total += 1;
      g.brand_name = g.brand_name ?? row.brand_name;
      g.rows.push(row);
      groups.set(row.client_key, g);
    }

    const sampleClients = getPortfolioContactClientKeys().filter(
      (key) => !resolveVersionedPortfolioWhatsApp(key),
    );

    return {
      requests,
      groups: [...groups.values()].sort((a, b) => b.total - a.total),
      sampleClients: [...sampleClients],
    };
  });
