import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Funil mensurável por projeto do portfólio: VIEW → CTA → POPUP → LEAD → WHATSAPP.
 *
 * Fontes canônicas (uma por métrica, sem tracker paralelo e sem PII):
 *  - PORTFOLIO_VIEW_SOURCE  = analytics_events.event_name = 'portfolio_view'  (path /portfolio/:slug)
 *  - CTA_CLICK_SOURCE       = analytics_events.event_name IN ('funnel_open','wa_funnel_open')
 *    (abertura de funil no projeto — intenção comercial de fato. O clique do botão
 *     flutuante é etapa anterior do mesmo caminho e NÃO é somado, para não duplicar.)
 *  - POPUP_OPEN_SOURCE      = analytics_events.event_name = 'popup_view'      (pop-up comercial 0WEB)
 *  - LEAD_SOURCE            = dynamic_form_leads.metadata_json->>page_url (fallback client_key)
 *  - WHATSAPP_SOURCE        = whatsapp_redirect_tokens.used_at (token server-side do lead)
 *
 * Métricas derivadas só são calculadas quando o denominador (views) é confiável;
 * caso contrário retornam `null`, renderizado como “—/NO_DATA”, nunca como zero inventado.
 */

export const PORTFOLIO_METRIC_SOURCES = {
  PORTFOLIO_VIEW_SOURCE: "analytics_events:portfolio_view",
  CTA_CLICK_SOURCE: "analytics_events:funnel_open|wa_funnel_open",
  POPUP_OPEN_SOURCE: "analytics_events:popup_view",
  LEAD_SOURCE: "dynamic_form_leads.metadata_json.page_url|client_key",
  WHATSAPP_SOURCE: "whatsapp_redirect_tokens.used_at",
} as const;

export type PortfolioFunnelRow = {
  slug: string;
  views: number;
  ctaClicks: number;
  popupViews: number;
  leads: number;
  whatsappOpens: number;
  /** null = sem denominador confiável (NO_DATA), nunca 0 fabricado. */
  ctaRate: number | null;
  popupRate: number | null;
  leadRate: number | null;
  whatsappRate: number | null;
};

export type PortfolioFunnelMetrics = {
  windowDays: number;
  generatedAt: string;
  sources: typeof PORTFOLIO_METRIC_SOURCES;
  projects: PortfolioFunnelRow[];
  totals: Omit<PortfolioFunnelRow, "slug">;
};

const EVENT_FIELD = {
  portfolio_view: "views",
  funnel_open: "ctaClicks",
  wa_funnel_open: "ctaClicks",
  popup_view: "popupViews",
} as const;

const inputSchema = z
  .object({ days: z.number().int().min(1).max(90).default(30), slug: z.string().trim().max(120).optional() })
  .default({ days: 30 });

function slugFromPath(path: string): string | null {
  const m = /^\/portfolio\/([^/?#]+)/.exec(path || "");
  return m?.[1] ?? null;
}

/**
 * Atribuição de projeto de um lead usando a infraestrutura já existente:
 * a URL da página onde o formulário foi respondido (mesma chave do denominador
 * de visitas, que também vem do path) e, na falta dela, o `client_key` gravado
 * pelo funil. Nenhum campo novo, nenhuma base nova, nenhum dado pessoal.
 */
export function leadSlug(meta: Record<string, unknown>): string | null {
  const pageUrl = typeof meta.page_url === "string" ? meta.page_url : "";
  const fromUrl = /\/portfolio\/([^/?#]+)/.exec(pageUrl)?.[1];
  if (fromUrl) return fromUrl;
  const clientKey = typeof meta.client_key === "string" ? meta.client_key.trim() : "";
  return clientKey || null;
}

function emptyRow(slug: string): PortfolioFunnelRow {
  return {
    slug,
    views: 0,
    ctaClicks: 0,
    popupViews: 0,
    leads: 0,
    whatsappOpens: 0,
    ctaRate: null,
    popupRate: null,
    leadRate: null,
    whatsappRate: null,
  };
}

/** Proteção contra divisão por zero: sem views não existe taxa, existe NO_DATA. */
function rate(numerator: number, denominator: number): number | null {
  if (!denominator || denominator <= 0) return null;
  return numerator / denominator;
}

export const getPortfolioFunnelMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
  .handler(async ({ data, context }): Promise<PortfolioFunnelMetrics> => {
    const since = new Date(Date.now() - data.days * 86400_000).toISOString();
    const rows = new Map<string, PortfolioFunnelRow>();
    const ensure = (slug: string) => {
      const found = rows.get(slug) ?? emptyRow(slug);
      rows.set(slug, found);
      return found;
    };

    // 1) Eventos de comportamento (view, CTA do cliente, pop-up da 0WEB).
    const { data: events, error: eventsError } = await context.supabase
      .from("analytics_events")
      .select("event_name, path")
      .in("event_name", Object.keys(EVENT_FIELD))
      .gte("created_at", since)
      .limit(50000);
    if (eventsError) throw new Error(eventsError.message);

    for (const row of events ?? []) {
      const slug = slugFromPath((row.path as string) ?? "");
      if (!slug) continue;
      if (data.slug && slug !== data.slug) continue;
      const field = EVENT_FIELD[row.event_name as keyof typeof EVENT_FIELD];
      if (!field) continue;
      ensure(slug)[field] += 1;
    }

    // 2) Leads reais já persistidos (nenhuma base nova, nenhum contato exposto).
    const { data: leads, error: leadsError } = await context.supabase
      .from("dynamic_form_leads")
      .select("id, metadata_json, created_at")
      .gte("created_at", since)
      .limit(20000);
    if (leadsError) throw new Error(leadsError.message);

    const slugByLeadId = new Map<string, string>();
    for (const lead of leads ?? []) {
      const meta = (lead.metadata_json ?? {}) as Record<string, unknown>;
      const slug = leadSlug(meta);
      if (!slug) continue;
      if (data.slug && slug !== data.slug) continue;
      slugByLeadId.set(lead.id as string, slug);
      ensure(slug).leads += 1;
    }

    // 3) Aberturas de WhatsApp via redirect tokenizado server-side.
    if (slugByLeadId.size > 0) {
      const ids = [...slugByLeadId.keys()];
      const { data: tokens, error: tokensError } = await context.supabase
        .from("whatsapp_redirect_tokens")
        .select("lead_id, used_at")
        .in("lead_id", ids)
        .not("used_at", "is", null)
        .limit(20000);
      if (tokensError) throw new Error(tokensError.message);
      for (const token of tokens ?? []) {
        const slug = slugByLeadId.get(token.lead_id as string);
        if (slug) ensure(slug).whatsappOpens += 1;
      }
    }

    const projects = [...rows.values()].map((row) => ({
      ...row,
      ctaRate: rate(row.ctaClicks, row.views),
      popupRate: rate(row.popupViews, row.views),
      leadRate: rate(row.leads, row.views),
      whatsappRate: rate(row.whatsappOpens, row.views),
    }));
    projects.sort((a, b) => b.views - a.views || a.slug.localeCompare(b.slug));

    const sum = (pick: (r: PortfolioFunnelRow) => number) => projects.reduce((acc, r) => acc + pick(r), 0);
    const totalViews = sum((r) => r.views);
    const totals = {
      views: totalViews,
      ctaClicks: sum((r) => r.ctaClicks),
      popupViews: sum((r) => r.popupViews),
      leads: sum((r) => r.leads),
      whatsappOpens: sum((r) => r.whatsappOpens),
      ctaRate: rate(sum((r) => r.ctaClicks), totalViews),
      popupRate: rate(sum((r) => r.popupViews), totalViews),
      leadRate: rate(sum((r) => r.leads), totalViews),
      whatsappRate: rate(sum((r) => r.whatsappOpens), totalViews),
    };

    return {
      windowDays: data.days,
      generatedAt: new Date().toISOString(),
      sources: PORTFOLIO_METRIC_SOURCES,
      projects,
      totals,
    };
  });
