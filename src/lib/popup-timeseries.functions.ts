import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  buildTimeSeries,
  slugsFromRows,
  POPUP_GRANULARITIES,
  GRANULARITY_MS,
  type PopupBucket,
  type PopupGranularity,
} from "./popup-timeseries";

export type PopupTimeSeriesResult = {
  granularity: PopupGranularity;
  slug: string | null;
  slugs: string[];
  series: PopupBucket[];
  generatedAt: string;
};

/** Série temporal (1m / 5m / 1h) dos eventos do pop-up, opcionalmente por slug. */
export const getPopupTimeSeries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        granularity: z.enum(POPUP_GRANULARITIES).default("5m"),
        slug: z.string().trim().max(80).nullable().default(null),
        buckets: z.number().int().min(6).max(120).default(48),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<PopupTimeSeriesResult> => {
    const to = Date.now();
    const from = to - GRANULARITY_MS[data.granularity] * data.buckets;
    const { data: rows, error } = await context.supabase
      .from("analytics_events")
      .select("event_name, path, created_at")
      .in("event_name", [
        "popup_view",
        "cta_click",
        "popup_dismiss",
        "popup_funnel_conversion",
        "popup_whatsapp_conversion",
      ])
      .gte("created_at", new Date(from).toISOString())
      .limit(50000);
    if (error) throw new Error(error.message);

    const list = (rows ?? []) as { event_name: string; path: string | null; created_at: string }[];
    return {
      granularity: data.granularity,
      slug: data.slug,
      slugs: slugsFromRows(list),
      series: buildTimeSeries(list, data.granularity, data.slug, from, to),
      generatedAt: new Date().toISOString(),
    };
  });
