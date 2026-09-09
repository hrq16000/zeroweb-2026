/**
 * Agregação administrativa das buscas em `/portfolio`.
 *
 * Fonte canônica: `analytics_events` (`portfolio_search` e
 * `portfolio_search_click`), emitidos por `src/lib/portfolio-search-tracking.ts`.
 * Nenhum dado pessoal é lido: apenas termo, contagem e slug clicado.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SearchTermRow = {
  term: string;
  searches: number;
  visitors: number;
  clicks: number;
  zeroResults: number;
  topProjects: Array<{ slug: string; clicks: number }>;
};

const Input = z.object({
  days: z.number().int().min(1).max(180).default(30),
  terms: z.array(z.string().max(60)).max(20).optional(),
});

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const allowed = (roles ?? []).some(
    (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
  );
  if (!allowed) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin;
}

export const getPortfolioSearchMetrics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input ?? {}))
  .handler(async ({ data, context }): Promise<{ rows: SearchTermRow[]; days: number; totalSearches: number }> => {
    const admin = await assertAdmin(context.userId);
    const since = new Date(Date.now() - data.days * 86400000).toISOString();

    const { data: events, error } = await admin
      .from("analytics_events")
      .select("event_name, visitor_id, metadata_json, created_at")
      .in("event_name", ["portfolio_search", "portfolio_search_click"])
      .gte("created_at", since)
      .limit(50000);
    if (error) throw new Error(error.message);

    const filter = data.terms?.map((t) => t.toLowerCase());
    const acc = new Map<
      string,
      SearchTermRow & { _visitors: Set<string>; _projects: Map<string, number> }
    >();

    for (const ev of (events ?? []) as Array<Record<string, unknown>>) {
      const meta = (ev.metadata_json ?? {}) as Record<string, unknown>;
      const term = String(meta.search_term ?? "").trim();
      if (!term) continue;
      if (filter && !filter.includes(term)) continue;

      let row = acc.get(term);
      if (!row) {
        row = {
          term,
          searches: 0,
          visitors: 0,
          clicks: 0,
          zeroResults: 0,
          topProjects: [],
          _visitors: new Set<string>(),
          _projects: new Map<string, number>(),
        };
        acc.set(term, row);
      }

      if (ev.event_name === "portfolio_search") {
        row.searches += 1;
        if (ev.visitor_id) row._visitors.add(String(ev.visitor_id));
        if (meta.has_results === false) row.zeroResults += 1;
      } else {
        row.clicks += 1;
        const slug = String(meta.portfolio_slug ?? "").trim();
        if (slug) row._projects.set(slug, (row._projects.get(slug) ?? 0) + 1);
      }
    }

    const rows = [...acc.values()]
      .map(({ _visitors, _projects, ...r }) => ({
        ...r,
        visitors: _visitors.size,
        topProjects: [..._projects.entries()]
          .map(([slug, clicks]) => ({ slug, clicks }))
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 5),
      }))
      .sort((a, b) => b.searches - a.searches);

    return {
      rows,
      days: data.days,
      totalSearches: rows.reduce((sum, r) => sum + r.searches, 0),
    };
  });
