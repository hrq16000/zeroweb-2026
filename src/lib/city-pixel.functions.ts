/**
 * Agregação por cidade dos eventos anônimos do pixel (`quiz_pixel_events`).
 *
 * Só lê eventos das páginas locais (`institucional-<slug>`) e devolve números
 * agregados — nenhum dado pessoal trafega. Acesso restrito a admin/super_admin.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getCapital } from "@/lib/capitais";

export type CityPixelRow = {
  slug: string;
  city: string;
  uf: string;
  sessoes: number;
  visualizacoes: number;
  cliquesCta: number;
  abandonos: number;
  submissoes: number;
  conversao: number;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  if (!allowed) throw new Error("Acesso restrito a administradores.");
  return supabaseAdmin;
}

export const cityPixelStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ days: z.number().int().min(1).max(180).default(30) }).parse(d ?? {}))
  .handler(async ({ data, context }): Promise<{ rows: CityPixelRow[]; days: number }> => {
    const admin = await assertAdmin(context.userId);
    const since = new Date(Date.now() - data.days * 86400000).toISOString();

    const { data: events, error } = await (admin as never as {
      from: (t: string) => {
        select: (c: string) => {
          like: (c: string, v: string) => {
            gte: (c: string, v: string) => {
              limit: (n: number) => Promise<{ data: Array<Record<string, string>> | null; error: { message: string } | null }>;
            };
          };
        };
      };
    })
      .from("quiz_pixel_events")
      .select("quiz_key, session_key, event_type, step_key")
      .like("quiz_key", "institucional-%")
      .gte("created_at", since)
      .limit(50000);
    if (error) throw new Error(error.message);

    const acc = new Map<string, CityPixelRow & { _sessions: Set<string> }>();
    for (const ev of events ?? []) {
      const slug = String(ev.quiz_key ?? "").replace(/^institucional-/, "");
      if (!slug) continue;
      const capital = getCapital(slug);
      let row = acc.get(slug);
      if (!row) {
        row = {
          slug,
          city: capital?.name ?? slug,
          uf: capital?.uf ?? "",
          sessoes: 0,
          visualizacoes: 0,
          cliquesCta: 0,
          abandonos: 0,
          submissoes: 0,
          conversao: 0,
          _sessions: new Set<string>(),
        };
        acc.set(slug, row);
      }
      if (ev.session_key) row._sessions.add(ev.session_key);
      if (ev.step_key === "page_view") row.visualizacoes += 1;
      if (ev.step_key === "cta_click") row.cliquesCta += 1;
      if (ev.event_type === "abandon") row.abandonos += 1;
      if (ev.event_type === "submit") row.submissoes += 1;
    }

    const rows = [...acc.values()]
      .map(({ _sessions, ...r }) => ({
        ...r,
        sessoes: _sessions.size,
        conversao: _sessions.size ? Math.round((r.submissoes / _sessions.size) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.sessoes - a.sessoes);

    return { rows, days: data.days };
  });
