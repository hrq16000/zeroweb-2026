/**
 * Agregação temporal dos eventos do pop-up por slug.
 * Funções puras — testáveis sem banco.
 */

export const POPUP_GRANULARITIES = ["1m", "5m", "1h"] as const;
export type PopupGranularity = (typeof POPUP_GRANULARITIES)[number];

export const GRANULARITY_MS: Record<PopupGranularity, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "1h": 3_600_000,
};

export type PopupEventRow = { event_name: string; path: string | null; created_at: string };

export type PopupBucket = {
  bucket: string;
  impressions: number;
  clicks: number;
  dismissals: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
};

const EVENT_KEY: Record<string, keyof Pick<PopupBucket, "impressions" | "clicks" | "dismissals" | "conversions">> = {
  popup_view: "impressions",
  cta_click: "clicks",
  popup_dismiss: "dismissals",
  popup_funnel_conversion: "conversions",
  popup_whatsapp_conversion: "conversions",
};

export function slugFromPath(path: string | null | undefined): string {
  const m = /^\/portfolio\/([^/?#]+)/.exec(path ?? "");
  return m?.[1] ?? "portfolio";
}

export function bucketStart(iso: string, granularity: PopupGranularity): string {
  const ms = GRANULARITY_MS[granularity];
  return new Date(Math.floor(Date.parse(iso) / ms) * ms).toISOString();
}

/** Constrói a série temporal contínua (buckets vazios incluídos). */
export function buildTimeSeries(
  rows: PopupEventRow[],
  granularity: PopupGranularity,
  slug: string | null,
  from: number,
  to: number,
): PopupBucket[] {
  const ms = GRANULARITY_MS[granularity];
  const map = new Map<string, PopupBucket>();
  for (let t = Math.floor(from / ms) * ms; t <= to; t += ms) {
    const key = new Date(t).toISOString();
    map.set(key, {
      bucket: key,
      impressions: 0,
      clicks: 0,
      dismissals: 0,
      conversions: 0,
      ctr: 0,
      conversionRate: 0,
    });
  }
  for (const row of rows) {
    if (!(row.path ?? "").startsWith("/portfolio")) continue;
    if (slug && slugFromPath(row.path) !== slug) continue;
    const key = EVENT_KEY[row.event_name];
    if (!key) continue;
    const bucket = map.get(bucketStart(row.created_at, granularity));
    if (!bucket) continue;
    bucket[key] += 1;
  }
  const series = [...map.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
  for (const b of series) {
    b.ctr = b.impressions ? b.clicks / b.impressions : 0;
    b.conversionRate = b.clicks ? b.conversions / b.clicks : 0;
  }
  return series;
}

/** Slugs presentes nos eventos, ordenados por volume. */
export function slugsFromRows(rows: PopupEventRow[]): string[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (!(r.path ?? "").startsWith("/portfolio")) continue;
    const s = slugFromPath(r.path);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
}
