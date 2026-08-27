import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PopupProjectMetrics = {
  slug: string;
  path: string;
  impressions: number;
  clicks: number;
  dismissals: number;
  funnelConversions: number;
  whatsappConversions: number;
  ctr: number;
  conversionRate: number;
};

export type PopupAlert = {
  slug: string;
  severity: "critical" | "warning";
  metric: "impressions" | "clicks" | "ctr" | "conversionRate";
  value: number;
  threshold: number;
  windowDays: number;
  message: string;
};

export type PopupMetricsResult = {
  windowDays: number;
  totals: Omit<PopupProjectMetrics, "slug" | "path">;
  projects: PopupProjectMetrics[];
  alerts: PopupAlert[];
  generatedAt: string;
};

/** Limites padrão — sobrescritos por slug em popup_configs.alert_thresholds. */
export const DEFAULT_POPUP_THRESHOLDS = {
  minImpressions: 1,
  minCtr: 0.02,
  minConversionRate: 0.05,
} as const;

const EVENTS = {
  popup_view: "impressions",
  cta_click: "clicks",
  popup_dismiss: "dismissals",
  popup_funnel_conversion: "funnelConversions",
  popup_whatsapp_conversion: "whatsappConversions",
} as const;

const inputSchema = z.object({ days: z.number().int().min(1).max(90).default(30) }).default({ days: 30 });

function slugFromPath(path: string) {
  const m = /^\/portfolio\/([^/?#]+)/.exec(path || "");
  return m?.[1] ?? "portfolio";
}

/**
 * Métricas do pop-up de captação segmentadas por projeto/slug.
 * Lê apenas eventos agregados — nenhum dado de contato é exposto.
 */
export const getPortfolioPopupMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
  .handler(async ({ data, context }): Promise<PopupMetricsResult> => {
    const since = new Date(Date.now() - data.days * 86400_000).toISOString();
    const { data: rows, error } = await context.supabase
      .from("analytics_events")
      .select("event_name, path, created_at")
      .in("event_name", Object.keys(EVENTS))
      .gte("created_at", since)
      .limit(50000);
    if (error) throw new Error(error.message);

    const byProject = new Map<string, PopupProjectMetrics>();
    for (const row of rows ?? []) {
      const path = (row.path as string) ?? "";
      if (!path.startsWith("/portfolio")) continue;
      const slug = slugFromPath(path);
      const entry =
        byProject.get(slug) ??
        {
          slug,
          path,
          impressions: 0,
          clicks: 0,
          dismissals: 0,
          funnelConversions: 0,
          whatsappConversions: 0,
          ctr: 0,
          conversionRate: 0,
        };
      const key = EVENTS[row.event_name as keyof typeof EVENTS];
      if (key) entry[key] += 1;
      byProject.set(slug, entry);
    }

    const projects = [...byProject.values()].map((p) => ({
      ...p,
      ctr: p.impressions ? p.clicks / p.impressions : 0,
      conversionRate: p.clicks ? (p.funnelConversions + p.whatsappConversions) / p.clicks : 0,
    }));
    projects.sort((a, b) => b.impressions - a.impressions);

    const totals = projects.reduce(
      (acc, p) => ({
        impressions: acc.impressions + p.impressions,
        clicks: acc.clicks + p.clicks,
        dismissals: acc.dismissals + p.dismissals,
        funnelConversions: acc.funnelConversions + p.funnelConversions,
        whatsappConversions: acc.whatsappConversions + p.whatsappConversions,
        ctr: 0,
        conversionRate: 0,
      }),
      {
        impressions: 0,
        clicks: 0,
        dismissals: 0,
        funnelConversions: 0,
        whatsappConversions: 0,
        ctr: 0,
        conversionRate: 0,
      },
    );
    totals.ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
    totals.conversionRate = totals.clicks
      ? (totals.funnelConversions + totals.whatsappConversions) / totals.clicks
      : 0;

    // Limites por projeto (painel administrativo) com fallback global.
    const thresholdsBySlug = new Map<string, Partial<typeof DEFAULT_POPUP_THRESHOLDS>>();
    const { data: configs } = await context.supabase
      .from("popup_configs")
      .select("slug, alert_thresholds");
    for (const c of (configs ?? []) as Array<{ slug: string; alert_thresholds: unknown }>) {
      thresholdsBySlug.set(c.slug, (c.alert_thresholds ?? {}) as Partial<typeof DEFAULT_POPUP_THRESHOLDS>);
    }

    const alerts: PopupAlert[] = [];
    const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
    for (const p of projects) {
      const t = { ...DEFAULT_POPUP_THRESHOLDS, ...(thresholdsBySlug.get(p.slug) ?? {}) };
      const push = (
        severity: PopupAlert["severity"],
        metric: PopupAlert["metric"],
        value: number,
        threshold: number,
        message: string,
      ) => alerts.push({ slug: p.slug, severity, metric, value, threshold, windowDays: data.days, message });

      if (p.impressions < t.minImpressions) {
        push(
          "critical",
          "impressions",
          p.impressions,
          t.minImpressions,
          `${p.slug}: ${p.impressions} impressão(ões) em ${data.days}d (mínimo ${t.minImpressions}) — verifique tracking ou exibição do pop-up`,
        );
        continue;
      }
      if (p.clicks === 0) {
        push("critical", "clicks", 0, 1, `${p.slug}: ${p.impressions} impressões e nenhum clique em ${data.days}d`);
        continue;
      }
      if (p.ctr < t.minCtr) {
        push(
          "warning",
          "ctr",
          p.ctr,
          t.minCtr,
          `${p.slug}: CTR ${pct(p.ctr)} abaixo do limite ${pct(t.minCtr)} em ${data.days}d`,
        );
      }
      if (p.conversionRate < t.minConversionRate) {
        push(
          "warning",
          "conversionRate",
          p.conversionRate,
          t.minConversionRate,
          `${p.slug}: conversão ${pct(p.conversionRate)} abaixo do limite ${pct(t.minConversionRate)} em ${data.days}d`,
        );
      }
    }
    alerts.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "critical" ? -1 : 1));

    return {
      windowDays: data.days,
      totals,
      projects,
      alerts,
      generatedAt: new Date().toISOString(),
    };
  });
