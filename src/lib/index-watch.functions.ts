import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertIndexWatchAdmin, fetchSitemapUrls } from "@/lib/index-watch.server";

/** Sincroniza as URLs dos sitemaps monitorados com a tabela url_index_watch. */
export const syncIndexWatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { section?: string }) =>
    z.object({ section: z.string().min(1).max(40).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertIndexWatchAdmin(supabase, userId);

    const section = data.section ?? "portfolio";
    const sitemap =
      section === "portfolio" ? "sitemap-portfolio.xml" : "sitemap-pages.xml";
    const urls = await fetchSitemapUrls(sitemap);

    const rows = urls.map((url) => ({ url, section, sitemap }));
    if (rows.length > 0) {
      const { error } = await supabase
        .from("url_index_watch")
        .upsert(rows, { onConflict: "url", ignoreDuplicates: true });
      if (error) throw new Error(error.message);
    }
    return { sitemap, discovered: rows.length };
  });

/** Lista o estado atual do monitoramento, com alerta por tempo sem indexação. */
export const listIndexWatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { section?: string; alertAfterDays?: number }) =>
    z
      .object({
        section: z.string().min(1).max(40).optional(),
        alertAfterDays: z.number().int().min(1).max(180).optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertIndexWatchAdmin(supabase, userId);

    const alertAfterDays = data.alertAfterDays ?? 14;
    let q = supabase
      .from("url_index_watch")
      .select("*")
      .order("indexed", { ascending: true })
      .order("first_seen_at", { ascending: true })
      .limit(500);
    if (data.section) q = q.eq("section", data.section);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const now = Date.now();
    const enriched = (rows ?? []).map((r: any) => {
      const days = Math.floor((now - new Date(r.first_seen_at).getTime()) / 86400000);
      return { ...r, days_pending: days, alert: !r.indexed && days >= alertAfterDays };
    });

    return {
      alertAfterDays,
      total: enriched.length,
      indexed: enriched.filter((r: any) => r.indexed).length,
      alerts: enriched.filter((r: any) => r.alert).length,
      rows: enriched,
    };
  });

/** Marca manualmente (ou via GSC) o estado de cobertura de uma URL. */
export const setIndexWatchState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { url: string; indexed: boolean; coverageState?: string; notes?: string }) =>
    z
      .object({
        url: z.string().url().max(400),
        indexed: z.boolean(),
        coverageState: z.string().max(80).optional(),
        notes: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertIndexWatchAdmin(supabase, userId);

    const { error } = await supabase
      .from("url_index_watch")
      .update({
        indexed: data.indexed,
        indexed_at: data.indexed ? new Date().toISOString() : null,
        coverage_state: data.coverageState ?? null,
        notes: data.notes ?? null,
        last_checked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("url", data.url);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Atualiza o estado de indexação lendo a Inspeção de URL do Google.
 *
 * Não pede rastreamento nem teste ao vivo: apenas lê o que o Google já tem
 * indexado. Prioriza as URLs ainda não indexadas e as verificadas há mais
 * tempo, em lotes pequenos para respeitar a cota da API.
 */
export const refreshIndexWatchFromGsc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { section?: string; limit?: number }) =>
    z
      .object({
        section: z.string().min(1).max(40).optional(),
        limit: z.number().int().min(1).max(25).optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertIndexWatchAdmin(supabase, userId);

    const section = data.section ?? "portfolio";
    const limit = data.limit ?? 15;

    const { resolveSiteUrl, inspectUrl, explainCoverage } = await import("@/lib/gsc.server");
    const property = await resolveSiteUrl("https://0web.com.br/");
    if (property.status !== "selected") {
      return { status: property.status, checked: 0, indexed: 0, rows: [] as unknown[] };
    }

    const { data: pending, error } = await supabase
      .from("url_index_watch")
      .select("url,indexed,last_checked_at")
      .eq("section", section)
      .order("indexed", { ascending: true })
      .order("last_checked_at", { ascending: true, nullsFirst: true })
      .limit(limit);
    if (error) throw new Error(error.message);

    const results: Array<{ url: string; indexed: boolean; coverageState: string }> = [];
    for (const row of pending ?? []) {
      try {
        const inspection: any = await inspectUrl(property.siteUrl, row.url);
        const verdict = inspection?.inspectionResult?.indexStatusResult?.verdict ?? "UNKNOWN";
        const { coverageState, probableCause } = explainCoverage(inspection);
        const indexed = verdict === "PASS";
        await supabase
          .from("url_index_watch")
          .update({
            indexed,
            indexed_at: indexed ? new Date().toISOString() : null,
            coverage_state: coverageState || verdict,
            notes: indexed ? null : probableCause,
            last_checked_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("url", row.url);
        results.push({ url: row.url, indexed, coverageState: coverageState || verdict });
      } catch (e) {
        results.push({
          url: row.url,
          indexed: false,
          coverageState: e instanceof Error ? e.message.slice(0, 80) : "erro",
        });
      }
    }

    return {
      status: "ok",
      property: property.siteUrl,
      checked: results.length,
      indexed: results.filter((r) => r.indexed).length,
      rows: results,
    };
  });
