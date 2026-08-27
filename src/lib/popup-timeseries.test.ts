import { describe, expect, test } from "bun:test";
import { bucketStart, buildTimeSeries, slugFromPath, slugsFromRows } from "./popup-timeseries";

const base = Date.parse("2026-03-01T10:00:00.000Z");
const iso = (offsetMs: number) => new Date(base + offsetMs).toISOString();

const rows = [
  { event_name: "popup_view", path: "/portfolio/dyz", created_at: iso(0) },
  { event_name: "popup_view", path: "/portfolio/dyz", created_at: iso(30_000) },
  { event_name: "cta_click", path: "/portfolio/dyz", created_at: iso(45_000) },
  { event_name: "popup_funnel_conversion", path: "/portfolio/dyz", created_at: iso(50_000) },
  { event_name: "popup_view", path: "/portfolio/rm-fretes", created_at: iso(120_000) },
  { event_name: "popup_view", path: "/servicos", created_at: iso(10_000) },
];

describe("slug", () => {
  test("extrai slug do path do portfólio", () => {
    expect(slugFromPath("/portfolio/dyz?x=1")).toBe("dyz");
    expect(slugFromPath("/portfolio")).toBe("portfolio");
    expect(slugFromPath(null)).toBe("portfolio");
  });

  test("lista slugs por volume ignorando rotas fora de /portfolio", () => {
    expect(slugsFromRows(rows)).toEqual(["dyz", "rm-fretes"]);
  });
});

describe("buckets", () => {
  test("alinha ao início da granularidade", () => {
    expect(bucketStart(iso(45_000), "1m")).toBe("2026-03-01T10:00:00.000Z");
    expect(bucketStart(iso(45_000), "5m")).toBe("2026-03-01T10:00:00.000Z");
    expect(bucketStart(iso(3_700_000), "1h")).toBe("2026-03-01T11:00:00.000Z");
  });

  test("série 1m separa minutos e calcula taxas", () => {
    const series = buildTimeSeries(rows, "1m", "dyz", base, base + 180_000);
    expect(series).toHaveLength(4);
    expect(series[0]!.impressions).toBe(2);
    expect(series[0]!.clicks).toBe(1);
    expect(series[0]!.conversions).toBe(1);
    expect(series[0]!.ctr).toBeCloseTo(0.5);
    expect(series[0]!.conversionRate).toBeCloseTo(1);
    expect(series[1]!.impressions).toBe(0);
  });

  test("série 1h agrupa tudo em um bucket", () => {
    const series = buildTimeSeries(rows, "1h", null, base, base + 120_000);
    expect(series).toHaveLength(1);
    expect(series[0]!.impressions).toBe(3);
  });

  test("filtra por slug", () => {
    const series = buildTimeSeries(rows, "5m", "rm-fretes", base, base + 300_000);
    const total = series.reduce((a, b) => a + b.impressions, 0);
    expect(total).toBe(1);
  });
});
