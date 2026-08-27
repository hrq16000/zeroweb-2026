import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import {
  getPortfolioPopupMetrics,
  type PopupMetricsResult,
} from "@/lib/portfolio-popup-metrics.functions";

export const Route = createFileRoute("/painel-portfolio")({
  head: () => ({
    meta: [
      { title: "Painel · Performance dos portfólios · 0WEB" },
      {
        name: "description",
        content:
          "Impressões, cliques e conversões do pop-up de captação da 0WEB segmentados por projeto de portfólio.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <PortfolioPerformancePanel />
    </PainelGate>
  ),
  ssr: false,
});

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

function PortfolioPerformancePanel() {
  const load = useServerFn(getPortfolioPopupMetrics);
  const [days, setDays] = useState(30);
  const [data, setData] = useState<PopupMetricsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load({ data: { days } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar métricas");
    } finally {
      setLoading(false);
    }
  }, [days, load]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Performance dos portfólios</h1>
        <p className="mt-2 max-w-[65ch] text-sm text-muted-foreground">
          Pop-up de captação da 0WEB por projeto: impressões, cliques, descartes e conversões
          (funil e WhatsApp). Nenhum contato de cliente é exibido aqui.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted-foreground" htmlFor="window-days">
            Janela
          </label>
          <select
            id="window-days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
          <button
            type="button"
            onClick={() => void fetchData()}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Atualizar
          </button>
        </div>

        {loading && <p className="mt-8 text-sm text-muted-foreground">Carregando métricas…</p>}
        {error && (
          <p role="alert" className="mt-8 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
            {error}
          </p>
        )}

        {data && !loading && (
          <>
            <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                ["Impressões", data.totals.impressions.toString()],
                ["Cliques", data.totals.clicks.toString()],
                ["CTR", pct(data.totals.ctr)],
                ["Conv. funil", data.totals.funnelConversions.toString()],
                ["Conv. WhatsApp", data.totals.whatsappConversions.toString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-xl font-bold">{value}</dd>
                </div>
              ))}
            </dl>

            {data.alerts.length > 0 && (
              <section className="mt-8 rounded-lg border border-border bg-muted/40 p-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
                  Quedas detectadas
                </h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {data.alerts.map((a) => (
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
                      <span>{a.message}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-8 overflow-x-auto">
              <h2 className="text-sm font-semibold">Por projeto</h2>
              <table className="mt-3 w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="py-2">Projeto</th>
                    <th className="py-2">Impressões</th>
                    <th className="py-2">Cliques</th>
                    <th className="py-2">CTR</th>
                    <th className="py-2">Descartes</th>
                    <th className="py-2">Funil</th>
                    <th className="py-2">WhatsApp</th>
                    <th className="py-2">Conversão</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.map((p) => (
                    <tr key={p.slug} className="border-t border-border">
                      <td className="py-2 font-medium">{p.slug}</td>
                      <td className="py-2">{p.impressions}</td>
                      <td className="py-2">{p.clicks}</td>
                      <td className="py-2">{pct(p.ctr)}</td>
                      <td className="py-2">{p.dismissals}</td>
                      <td className="py-2">{p.funnelConversions}</td>
                      <td className="py-2">{p.whatsappConversions}</td>
                      <td className="py-2">{pct(p.conversionRate)}</td>
                    </tr>
                  ))}
                  {data.projects.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-muted-foreground">
                        Sem eventos de pop-up no período selecionado.
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
