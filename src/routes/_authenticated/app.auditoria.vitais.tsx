import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { getPortfolioWebVitals, type VitalsResult } from "@/lib/portfolio-vitals-metrics.functions";

export const Route = createFileRoute("/_authenticated/app/auditoria/vitais")({
  head: () => ({
    meta: [
      { title: "Web Vitals por slug · 0WEB Painel" },
      { name: "description", content: "LCP, CLS e INP (p75, p90, p95) por projeto de portfólio, com alertas." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: VitalsPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

function fmt(metric: string, value: number | null) {
  if (value === null || value === undefined) return "—";
  return metric === "CLS" ? value.toFixed(3) : `${Math.round(value)} ms`;
}

function VitalsPage() {
  const load = useServerFn(getPortfolioWebVitals);
  const [days, setDays] = useState(7);
  const [data, setData] = useState<VitalsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load({ data: { days } }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [days, load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const alerts = (data?.projects ?? []).flatMap((p) => p.alerts.map((a) => ({ ...a, slug: p.slug })));

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold">Web Vitals por slug</h1>
      <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
        Medições de campo das rotas <code>/portfolio/&lt;slug&gt;</code>, agregadas em p75, p90 e p95. Nenhum dado
        pessoal (telefone, e-mail ou IP) é coletado ou armazenado.
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
          onClick={() => void refresh()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-muted-foreground">Carregando medições…</p>}
      {error && (
        <p role="alert" className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}

      {data && !loading && (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {data.totalSamples} amostra(s) em {data.windowDays} dia(s).
          </p>

          {alerts.length > 0 && (
            <section className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" /> Alertas acima do budget
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {alerts.map((a) => (
                  <li key={`${a.slug}-${a.metric}`}>
                    <strong>{a.severity === "critical" ? "crítico" : "atenção"}</strong> · {a.slug} · {a.metric} p75{" "}
                    {fmt(a.metric, a.p75)} (budget {fmt(a.metric, a.budget)})
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8 overflow-x-auto">
            <table className="mt-3 w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2">Projeto</th>
                  <th className="py-2">LCP p75 / p90 / p95</th>
                  <th className="py-2">CLS p75 / p90 / p95</th>
                  <th className="py-2">INP p75 / p90 / p95</th>
                  <th className="py-2">Amostras</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.map((p) => (
                  <tr key={p.slug} className="border-t border-border">
                    <td className="py-2 font-medium">{p.slug}</td>
                    {(["LCP", "CLS", "INP"] as const).map((m) => (
                      <td key={m} className="py-2">
                        {fmt(m, p.metrics[m].p75)} / {fmt(m, p.metrics[m].p90)} / {fmt(m, p.metrics[m].p95)}
                      </td>
                    ))}
                    <td className="py-2">{p.samples}</td>
                  </tr>
                ))}
                {data.projects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-muted-foreground">
                      Sem amostras no período selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
