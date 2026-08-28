import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import {
  getPortfolioWebVitals,
  type VitalsResult,
} from "@/lib/portfolio-vitals-metrics.functions";

export const Route = createFileRoute("/painel-web-vitals")({
  head: () => ({
    meta: [
      { title: "Painel · Web Vitals dos portfólios · 0WEB" },
      {
        name: "description",
        content:
          "LCP, CLS e INP reais (p75) por projeto de portfólio, com volume de amostras e alertas de regressão.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <WebVitalsPanel />
    </PainelGate>
  ),
  ssr: false,
});

function fmt(metric: string, value: number | null) {
  if (value === null) return "—";
  return metric === "CLS" ? value.toFixed(3) : `${Math.round(value)} ms`;
}

function WebVitalsPanel() {
  const load = useServerFn(getPortfolioWebVitals);
  const [days, setDays] = useState(7);
  const [data, setData] = useState<VitalsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load({ data: { days } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar Web Vitals");
    } finally {
      setLoading(false);
    }
  }, [days, load]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const alerts = (data?.projects ?? []).flatMap((p) =>
    p.alerts.map((a) => ({ ...a, slug: p.slug })),
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Web Vitals por projeto</h1>
        <p className="mt-2 max-w-[65ch] text-sm text-muted-foreground">
          Medições de campo coletadas nas rotas <code>/portfolio/&lt;slug&gt;</code>. Valores em p75,
          comparados aos budgets LCP 2500&nbsp;ms, CLS 0,1 e INP 200&nbsp;ms. Nenhum dado pessoal é
          coletado.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted-foreground" htmlFor="vitals-window">
            Janela
          </label>
          <select
            id="vitals-window"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={1}>24 horas</option>
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
          </select>
          <button
            type="button"
            onClick={() => void fetchData()}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Atualizar
          </button>
        </div>

        {loading && <p className="mt-8 text-sm text-muted-foreground">Carregando medições…</p>}
        {error && (
          <p
            role="alert"
            className="mt-8 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm"
          >
            {error}
          </p>
        )}

        {data && !loading && (
          <>
            <p className="mt-8 text-sm text-muted-foreground">
              {data.totalSamples} amostra(s) em {data.windowDays} dia(s).
            </p>

            {alerts.length > 0 && (
              <section className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
                  Regressões acima do budget
                </h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {alerts.map((a) => (
                    <li key={`${a.slug}-${a.metric}`} className="flex items-start gap-2">
                      <span
                        className={
                          a.severity === "critical"
                            ? "mt-0.5 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-semibold uppercase text-destructive-foreground"
                            : "mt-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-foreground"
                        }
                      >
                        {a.severity === "critical" ? "crítico" : "atenção"}
                      </span>
                      <span>
                        {a.slug} · {a.metric} p75 {fmt(a.metric, a.p75)} (budget{" "}
                        {fmt(a.metric, a.budget)})
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-8 overflow-x-auto">
              <h2 className="text-sm font-semibold">Por projeto</h2>
              <table className="mt-3 w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="py-2">Projeto</th>
                    <th className="py-2">LCP p75</th>
                    <th className="py-2">CLS p75</th>
                    <th className="py-2">INP p75</th>
                    <th className="py-2">Amostras</th>
                    <th className="py-2">Alertas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.map((p) => (
                    <tr key={p.slug} className="border-t border-border">
                      <td className="py-2 font-medium">{p.slug}</td>
                      <td className="py-2">{fmt("LCP", p.metrics.LCP.p75)}</td>
                      <td className="py-2">{fmt("CLS", p.metrics.CLS.p75)}</td>
                      <td className="py-2">{fmt("INP", p.metrics.INP.p75)}</td>
                      <td className="py-2">{p.samples}</td>
                      <td className="py-2">{p.alerts.length || "—"}</td>
                    </tr>
                  ))}
                  {data.projects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-muted-foreground">
                        Sem amostras de Web Vitals no período selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
