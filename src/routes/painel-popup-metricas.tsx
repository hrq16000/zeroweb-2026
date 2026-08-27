import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCcw } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import { Button } from "@/components/ui/button";
import { getPopupTimeSeries, type PopupTimeSeriesResult } from "@/lib/popup-timeseries.functions";
import { POPUP_GRANULARITIES, type PopupGranularity } from "@/lib/popup-timeseries";
import {
  getPortfolioPopupMetrics,
  type PopupMetricsResult,
} from "@/lib/portfolio-popup-metrics.functions";

export const Route = createFileRoute("/painel-popup-metricas")({
  head: () => ({
    meta: [
      { title: "Painel · Métricas do pop-up · 0WEB" },
      {
        name: "description",
        content:
          "Impressões, cliques, CTR, conversão e alertas do pop-up de captação por projeto, com séries de 1 minuto, 5 minutos e 1 hora.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <PopupMetricsPanel />
    </PainelGate>
  ),
  ssr: false,
});

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

function PopupMetricsPanel() {
  const loadSeries = useServerFn(getPopupTimeSeries);
  const loadMetrics = useServerFn(getPortfolioPopupMetrics);

  const [granularity, setGranularity] = useState<PopupGranularity>("5m");
  const [slug, setSlug] = useState<string | null>(null);
  const [series, setSeries] = useState<PopupTimeSeriesResult | null>(null);
  const [metrics, setMetrics] = useState<PopupMetricsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, m] = await Promise.all([
        loadSeries({ data: { granularity, slug, buckets: 48 } }),
        loadMetrics({ data: { days: 7 } }),
      ]);
      setSeries(s);
      setMetrics(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar métricas");
    } finally {
      setLoading(false);
    }
  }, [granularity, slug, loadSeries, loadMetrics]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const project = metrics?.projects.find((p) => p.slug === slug) ?? null;
  const slugAlerts = (metrics?.alerts ?? []).filter((a) => !slug || a.slug === slug);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28">
        <h1 className="text-2xl font-semibold">Métricas do pop-up por projeto</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Dados reais de eventos agregados. Nenhum contato ou dado pessoal é exibido aqui.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {POPUP_GRANULARITIES.map((g) => (
            <Button
              key={g}
              size="sm"
              className="min-h-11"
              variant={granularity === g ? "default" : "outline"}
              onClick={() => setGranularity(g)}
            >
              {g === "1m" ? "1 minuto" : g === "5m" ? "5 minutos" : "1 hora"}
            </Button>
          ))}
          <Button size="sm" variant="outline" className="min-h-11" onClick={() => void refresh()} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Atualizar
          </Button>
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="min-h-11"
            variant={slug === null ? "default" : "outline"}
            onClick={() => setSlug(null)}
          >
            Todos os projetos
          </Button>
          {(series?.slugs ?? []).map((s) => (
            <Button
              key={s}
              size="sm"
              className="min-h-11"
              variant={slug === s ? "default" : "outline"}
              onClick={() => setSlug(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        {loading && !series && <p className="mt-8 text-sm text-muted-foreground">Carregando métricas…</p>}

        {series && series.series.every((b) => b.impressions === 0) && (
          <p className="mt-8 rounded-lg border border-border p-4 text-sm text-muted-foreground">
            Nenhum evento registrado na janela selecionada.
          </p>
        )}

        {series && (
          <section aria-labelledby="chart-heading" className="mt-8">
            <h2 id="chart-heading" className="text-sm font-semibold">
              Série temporal ({granularity})
            </h2>
            <div className="mt-3 h-72 w-full rounded-lg border border-border p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series.series}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="bucket"
                    tickFormatter={(v: string) => new Date(v).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    fontSize={11}
                  />
                  <YAxis allowDecimals={false} fontSize={11} />
                  <Tooltip
                    labelFormatter={(v) => new Date(String(v)).toLocaleString("pt-BR")}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="impressions" name="Impressões" stroke="currentColor" dot={false} />
                  <Line type="monotone" dataKey="clicks" name="Cliques" stroke="currentColor" strokeDasharray="4 2" dot={false} />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    name="Conversões"
                    stroke="currentColor"
                    strokeDasharray="1 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {metrics && (
          <section aria-labelledby="rates-heading" className="mt-8">
            <h2 id="rates-heading" className="text-sm font-semibold">
              Taxas (últimos 7 dias){slug ? ` — ${slug}` : ""}
            </h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Impressões", (project ?? metrics.totals).impressions.toString()],
                ["Cliques", (project ?? metrics.totals).clicks.toString()],
                ["CTR", pct((project ?? metrics.totals).ctr)],
                ["Conversão", pct((project ?? metrics.totals).conversionRate)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border p-4">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section aria-labelledby="alerts-heading" className="mt-8">
          <h2 id="alerts-heading" className="text-sm font-semibold">
            Status dos alertas
          </h2>
          {slugAlerts.length === 0 ? (
            <p className="mt-3 rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Nenhum alerta ativo para o recorte selecionado.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {slugAlerts.map((a, i) => (
                <li key={`${a.slug}-${a.metric}-${i}`} className="rounded-lg border border-border p-3 text-sm">
                  <span
                    className={`mr-2 rounded px-2 py-0.5 text-xs font-semibold ${
                      a.severity === "critical"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-amber-700 text-white"
                    }`}
                  >
                    {a.severity === "critical" ? "crítico" : "atenção"}
                  </span>
                  {a.message}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
