import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type VitalMetric = "LCP" | "CLS" | "INP";

export type VitalSlugMetrics = {
  slug: string;
  samples: number;
  metrics: Record<VitalMetric, { p75: number | null; samples: number }>;
  alerts: Array<{ metric: VitalMetric; p75: number; budget: number; severity: "warning" | "critical" }>;
};

export type VitalsResult = {
  windowDays: number;
  generatedAt: string;
  totalSamples: number;
  projects: VitalSlugMetrics[];
  budgets: Record<VitalMetric, number>;
};

/** Budgets Core Web Vitals (bom / needs improvement). */
export const VITALS_BUDGETS: Record<VitalMetric, number> = { LCP: 2500, CLS: 0.1, INP: 200 };
const CRITICAL_FACTOR = 1.6;
const METRICS: VitalMetric[] = ["LCP", "CLS", "INP"];

const inputSchema = z
  .object({ days: z.number().int().min(1).max(90).default(7) })
  .default({ days: 7 });

function p75(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.75) - 1);
  return sorted[Math.max(0, index)];
}

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    supabaseAdmin.rpc("is_super_admin", { _uid: userId }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin;
}

/**
 * Web Vitals reais por slug de portfólio (p75 por métrica + alertas de regressão).
 * A tabela é service_role-only: nenhum dado de visitante ou PII é armazenado.
 */
export const getPortfolioWebVitals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
  .handler(async ({ data, context }): Promise<VitalsResult> => {
    const admin = await assertAdmin(context.userId);
    const since = new Date(Date.now() - data.days * 86400_000).toISOString();
    const { data: rows, error } = await (admin as any)
      .from("portfolio_web_vitals")
      .select("slug, metric, value")
      .gte("captured_at", since)
      .limit(50000);
    if (error) throw new Error(error.message);

    const bySlug = new Map<string, Record<VitalMetric, number[]>>();
    for (const row of (rows ?? []) as Array<{ slug: string; metric: VitalMetric; value: number }>) {
      const entry = bySlug.get(row.slug) ?? { LCP: [], CLS: [], INP: [] };
      if (METRICS.includes(row.metric)) entry[row.metric].push(Number(row.value));
      bySlug.set(row.slug, entry);
    }

    const projects: VitalSlugMetrics[] = [...bySlug.entries()].map(([slug, values]) => {
      const metrics = {} as VitalSlugMetrics["metrics"];
      const alerts: VitalSlugMetrics["alerts"] = [];
      let samples = 0;
      for (const metric of METRICS) {
        const value = p75(values[metric]);
        metrics[metric] = { p75: value, samples: values[metric].length };
        samples += values[metric].length;
        const budget = VITALS_BUDGETS[metric];
        if (value !== null && value > budget) {
          alerts.push({
            metric,
            p75: value,
            budget,
            severity: value > budget * CRITICAL_FACTOR ? "critical" : "warning",
          });
        }
      }
      return { slug, samples, metrics, alerts };
    });
    projects.sort((a, b) => b.samples - a.samples);

    return {
      windowDays: data.days,
      generatedAt: new Date().toISOString(),
      totalSamples: projects.reduce((acc, p) => acc + p.samples, 0),
      projects,
      budgets: VITALS_BUDGETS,
    };
  });
