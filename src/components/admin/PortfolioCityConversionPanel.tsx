import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getPortfolioFunnelMetrics,
  type PortfolioFunnelMetrics,
} from "@/lib/portfolio-funnel-metrics.functions";
import portfolioAdminSeed from "@/config/portfolio-admin-seed.json";

const PERIODS = [7, 30, 90] as const;

type SeedProject = { slug: string; city?: string; state?: string };

const CITY_BY_SLUG: Record<string, string> = Object.fromEntries(
  ((portfolioAdminSeed as { projects: SeedProject[] }).projects ?? [])
    .filter((p) => p.slug && p.city)
    .map((p) => [p.slug, p.state ? `${p.city} — ${p.state}` : String(p.city)]),
);

type CityRow = {
  city: string;
  projects: number;
  views: number;
  leads: number;
  whatsappOpens: number;
  /** null = sem visitas no período; nunca 0% fabricado. */
  conversion: number | null;
};

/**
 * Conversão por cidade: agrega o desempenho já medido por projeto
 * (views → leads → WhatsApp) usando a cidade registrada no catálogo.
 * Não cria rastreador novo nem lê dado pessoal.
 */
export function PortfolioCityConversionPanel() {
  const load = useServerFn(getPortfolioFunnelMetrics);
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<PortfolioFunnelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load({ data: { days } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar conversão por cidade");
    } finally {
      setLoading(false);
    }
  }, [load, days]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const rows: CityRow[] = useMemo(() => {
    const map = new Map<string, CityRow>();
    for (const p of data?.projects ?? []) {
      const city = CITY_BY_SLUG[p.slug] ?? "Sem cidade registrada";
      const row =
        map.get(city) ??
        ({ city, projects: 0, views: 0, leads: 0, whatsappOpens: 0, conversion: null } as CityRow);
      row.projects += 1;
      row.views += p.views;
      row.leads += p.leads;
      row.whatsappOpens += p.whatsappOpens;
      map.set(city, row);
    }
    return [...map.values()]
      .map((r) => ({ ...r, conversion: r.views > 0 ? r.leads / r.views : null }))
      .filter((r) => r.views > 0 || r.leads > 0)
      .sort((a, b) => b.views - a.views || b.leads - a.leads);
  }, [data]);

  const maxViews = rows.reduce((m, r) => Math.max(m, r.views), 0);

  return (
    <section aria-labelledby="city-conversion" className="mt-6 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="city-conversion" className="font-display text-lg font-semibold">
          Conversão por cidade
        </h2>
        <div className="flex items-center gap-1" role="group" aria-label="Período">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDays(p)}
              aria-pressed={days === p}
              className={`min-h-9 rounded-md border px-3 text-xs font-medium ${
                days === p ? "border-primary bg-primary/10 text-primary" : "border-border"
              }`}
            >
              {p} dias
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-3 text-sm text-muted-foreground">Carregando conversão por cidade…</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          Ainda não há visitas ou solicitações registradas neste período.
        </p>
      )}

      {!loading && !error && rows.length > 0 && (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.city}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{r.city}</span>
                <span className="tabular-nums text-muted-foreground">
                  {r.views} visitas · {r.leads} solicitações · {r.whatsappOpens} WhatsApp ·{" "}
                  {r.conversion === null ? "—" : `${(r.conversion * 100).toFixed(1)}%`}
                </span>
              </div>
              <div
                className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`${r.city}: ${r.views} visitas, ${r.leads} solicitações`}
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${maxViews > 0 ? Math.max(2, (r.views / maxViews) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
