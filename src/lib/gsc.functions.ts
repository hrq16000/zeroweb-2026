import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import {
  assertAdmin,
  diagnose,
  inspectPendingUrls,
  monthlyReport,
  readSitemaps,
  resolveProperty,
  submitAndCheckSitemaps,
  syncPerformance,
  PROPERTY_SETTING_KEY,
} from "@/lib/gsc-sync.server";

export const gscStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const property = await resolveProperty();
    const { data: log } = await supabase
      .from("gsc_sync_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    return { property, log: log ?? [] };
  });

export const gscSelectProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { siteUrl: string }) =>
    z.object({ siteUrl: z.string().min(3).max(300) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("app_settings")
      .upsert({ key: PROPERTY_SETTING_KEY, value: data.siteUrl }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    const { invalidateSettingsCache } = await import("@/lib/settings.functions");
    invalidateSettingsCache([PROPERTY_SETTING_KEY]);
    return { ok: true, siteUrl: data.siteUrl };
  });

export const gscSyncPerformance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { days?: number }) =>
    z.object({ days: z.number().int().min(1).max(180).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    return syncPerformance(supabase, data.days ?? 28);
  });

export const gscPerformanceReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { days?: number }) =>
    z.object({ days: z.number().int().min(1).max(180).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const days = data.days ?? 28;
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

    const { data: rows } = await supabase
      .from("gsc_page_metrics")
      .select("date, page, page_type, clicks, impressions, position")
      .is("query", null)
      .gte("date", since)
      .order("date", { ascending: true })
      .limit(5000);

    const { data: queries } = await supabase
      .from("gsc_page_metrics")
      .select("query, page, clicks, impressions, position")
      .not("query", "is", null)
      .gte("date", since)
      .limit(5000);

    return { since, rows: rows ?? [], queries: queries ?? [] };
  });

export const gscSubmitSitemaps = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    return submitAndCheckSitemaps(supabase);
  });

export const gscSitemaps = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    return readSitemaps();
  });

export const gscInspectPending = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { limit?: number }) =>
    z.object({ limit: z.number().int().min(1).max(50).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    return inspectPendingUrls(supabase, data.limit ?? 10);
  });

export const gscDiagnose = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    return diagnose(supabase);
  });

export const gscMonthlyReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { month?: string }) =>
    z.object({ month: z.string().regex(/^\d{4}-\d{2}$/).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const month = data.month ?? new Date().toISOString().slice(0, 7);
    return monthlyReport(supabase, month);
  });

export const listSeoAlerts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { onlyOpen?: boolean }) =>
    z.object({ onlyOpen: z.boolean().optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    let q = supabase
      .from("seo_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.onlyOpen !== false) q = q.is("resolved_at", null);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { alerts: rows ?? [] };
  });

export const resolveSeoAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const { error } = await supabase
      .from("seo_alerts")
      .update({ resolved_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const notifySeoAlerts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const { notifyPendingSeoAlerts } = await import("@/lib/seo-alerts.server");
    return notifyPendingSeoAlerts(supabase);
  });

export const indexNowPing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { urls?: string[] }) =>
    z.object({ urls: z.array(z.string().url()).max(500).optional() }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    await assertAdmin(supabase, userId);
    const { submitToIndexNow } = await import("@/lib/indexnow.server");
    return submitToIndexNow(supabase, data.urls);
  });
