import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CAPITAIS } from "@/lib/capitais";

/**
 * Ranking local das páginas `/criacao-de-site-institucional/<cidade>`.
 *
 * Junta três fontes já existentes, sem tabela nova:
 *  - `gsc_page_metrics`  → cliques, impressões, posição média e melhores termos
 *  - `analytics_events`  → visitas registradas na página da cidade
 *  - `dynamic_form_leads`→ diagnósticos/leads originados naquela página
 *
 * Só admin/super_admin acessa; nenhum dado pessoal é retornado (apenas
 * contagens agregadas por cidade).
 */
export type LocalRankingRow = {
  slug: string;
  city: string;
  uf: string;
  path: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number | null;
  visits: number;
  leads: number;
  conversion: number;
  topQueries: { query: string; clicks: number; impressions: number; position: number }[];
};

const BASE_PATH = "/criacao-de-site-institucional";

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some(
    (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
  );
  if (!allowed) throw new Error("forbidden");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

function slugFromPath(value: unknown): string | null {
  const text = String(value ?? "");
  const idx = text.indexOf(`${BASE_PATH}/`);
  if (idx === -1) return null;
  const rest = text.slice(idx + BASE_PATH.length + 1);
  const slug = rest.split(/[/?#]/)[0]?.toLowerCase() ?? "";
  return slug || null;
}

export const listLocalRanking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ days: z.number().int().min(1).max(180).default(28) }).parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<{ rows: LocalRankingRow[]; days: number }> => {
    const supabaseAdmin = await assertAdmin(context.supabase, context.userId);
    const since = new Date(Date.now() - data.days * 86400000).toISOString();
    const sinceDate = since.slice(0, 10);

    const base = new Map<string, LocalRankingRow>(
      CAPITAIS.map((c) => [
        c.slug,
        {
          slug: c.slug,
          city: c.name,
          uf: c.uf,
          path: `${BASE_PATH}/${c.slug}`,
          clicks: 0,
          impressions: 0,
          ctr: 0,
          position: null,
          visits: 0,
          leads: 0,
          conversion: 0,
          topQueries: [],
        },
      ]),
    );

    // 1. Search Console
    const { data: gsc } = await supabaseAdmin
      .from("gsc_page_metrics")
      .select("page, query, clicks, impressions, position")
      .gte("date", sinceDate)
      .ilike("page", `%${BASE_PATH}/%`)
      .limit(5000);

    const posAcc = new Map<string, { sum: number; weight: number }>();
    for (const row of (gsc ?? []) as any[]) {
      const slug = slugFromPath(row.page);
      const target = slug ? base.get(slug) : undefined;
      if (!target) continue;
      const clicks = Number(row.clicks ?? 0);
      const impressions = Number(row.impressions ?? 0);
      if (!row.query) {
        target.clicks += clicks;
        target.impressions += impressions;
        const acc = posAcc.get(slug!) ?? { sum: 0, weight: 0 };
        acc.sum += Number(row.position ?? 0) * Math.max(impressions, 1);
        acc.weight += Math.max(impressions, 1);
        posAcc.set(slug!, acc);
      } else {
        const existing = target.topQueries.find((q) => q.query === row.query);
        if (existing) {
          existing.clicks += clicks;
          existing.impressions += impressions;
        } else {
          target.topQueries.push({
            query: String(row.query),
            clicks,
            impressions,
            position: Number(row.position ?? 0),
          });
        }
      }
    }

    // 2. Visitas
    const { data: events } = await supabaseAdmin
      .from("analytics_events")
      .select("path")
      .gte("created_at", since)
      .ilike("path", `${BASE_PATH}/%`)
      .limit(5000);
    for (const row of (events ?? []) as any[]) {
      const slug = slugFromPath(row.path);
      const target = slug ? base.get(slug) : undefined;
      if (target) target.visits += 1;
    }

    // 3. Leads originados na página local
    const { data: leads } = await supabaseAdmin
      .from("dynamic_form_leads")
      .select("metadata_json")
      .gte("created_at", since)
      .limit(2000);
    for (const row of (leads ?? []) as any[]) {
      const meta = (row.metadata_json ?? {}) as Record<string, unknown>;
      const slug = slugFromPath(meta.page_url);
      const target = slug ? base.get(slug) : undefined;
      if (target) target.leads += 1;
    }

    const rows = [...base.values()].map((row) => {
      const acc = posAcc.get(row.slug);
      row.position = acc && acc.weight ? Number((acc.sum / acc.weight).toFixed(1)) : null;
      row.ctr = row.impressions ? Number(((row.clicks / row.impressions) * 100).toFixed(2)) : 0;
      const denominator = row.visits || row.clicks;
      row.conversion = denominator ? Number(((row.leads / denominator) * 100).toFixed(2)) : 0;
      row.topQueries = row.topQueries.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 5);
      return row;
    });

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: "local_ranking.read",
      entity: "gsc_page_metrics",
      entity_id: null,
    });

    return { rows, days: data.days };
  });
