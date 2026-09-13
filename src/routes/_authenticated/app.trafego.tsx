/**
 * Tráfego por landing: visitas, confirmações (leads) e conversões de WhatsApp
 * por `/portfolio/:slug`.
 *
 * Fonte única: `getPortfolioFunnelMetrics` (padrão de métricas do funil). Taxas
 * sem denominador confiável aparecem como “—”, nunca como zero fabricado.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Activity, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  getPortfolioFunnelMetrics,
  type PortfolioFunnelMetrics,
} from "@/lib/portfolio-funnel-metrics.functions";

export const Route = createFileRoute("/_authenticated/app/trafego")({
  head: () => ({
    meta: [
      { title: "Tráfego por landing · 0WEB Painel" },
      {
        name: "description",
        content:
          "Visitas, confirmações e conversões de cada landing do portfólio, com taxas calculadas apenas sobre dados reais.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TrafegoPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const pct = (value: number | null) =>
  value === null ? "—" : `${(value * 100).toFixed(1)}%`;

function TrafegoPage() {
  const load = useServerFn(getPortfolioFunnelMetrics);
  const [data, setData] = useState<PortfolioFunnelMetrics | null>(null);
  const [days, setDays] = useState(30);
  const [term, setTerm] = useState("");
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
  }, [load, days]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (data?.projects ?? [])
      .filter((p) => !q || p.slug.toLowerCase().includes(q))
      .sort((a, b) => b.views - a.views || b.leads - a.leads);
  }, [data, term]);

  const chart = useMemo(
    () =>
      rows.slice(0, 12).map((p) => ({
        slug: p.slug.length > 16 ? `${p.slug.slice(0, 15)}…` : p.slug,
        Visitas: p.views,
        Confirmações: p.leads,
        Conversões: p.whatsappOpens,
      })),
    [rows],
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tráfego por landing</h1>
          <p className="text-sm text-muted-foreground">
            Visitas, confirmações recebidas e conversões em WhatsApp de cada página do portfólio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="min-h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Período"
          >
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
          <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {data && (
        <section className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Visitas", value: data.totals.views },
            { label: "Aberturas de funil", value: data.totals.ctaClicks },
            { label: "Confirmações", value: data.totals.leads },
            { label: "Conversões no WhatsApp", value: data.totals.whatsappOpens },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{c.value}</p>
            </div>
          ))}
        </section>
      )}

      {chart.length > 0 && (
        <section className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium text-foreground">12 landings com mais visitas</h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 8, right: 8, bottom: 48, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="slug" angle={-35} textAnchor="end" interval={0} height={70} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Visitas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Confirmações" fill="hsl(var(--chart-2, 160 60% 45%))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conversões" fill="hsl(var(--chart-3, 40 90% 55%))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <label className="flex max-w-sm items-center gap-2 rounded-md border border-border px-3 text-sm">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Buscar landing</span>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar landing"
          className="min-h-11 w-full bg-transparent outline-none"
        />
      </label>

      <section className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Landing</th>
              <th className="px-4 py-2 font-medium">Visitas</th>
              <th className="px-4 py-2 font-medium">Aberturas de funil</th>
              <th className="px-4 py-2 font-medium">Confirmações</th>
              <th className="px-4 py-2 font-medium">Conversões</th>
              <th className="px-4 py-2 font-medium">Taxa de confirmação</th>
              <th className="px-4 py-2 font-medium">Canal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.slug} className="border-t border-border">
                <td className="px-4 py-2 text-foreground">{p.slug}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.views}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.ctaClicks}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.leads}</td>
                <td className="px-4 py-2 text-muted-foreground">{p.whatsappOpens}</td>
                <td className="px-4 py-2 text-muted-foreground">{pct(p.leadRate)}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {p.whatsappChannel === "CONFIGURED" ? "Ativo" : "Sem destino"}
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhuma visita registrada no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
