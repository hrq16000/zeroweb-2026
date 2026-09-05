import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getPortfolioFunnelMetrics,
  type PortfolioFunnelMetrics,
  type PortfolioFunnelRow,
} from "@/lib/portfolio-funnel-metrics.functions";

const PERIODS = [7, 30, 90] as const;

/** Sem fonte contínua não existe zero: existe NO_DATA. */
function pct(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-3 py-2 text-sm tabular-nums ${className}`}>{children}</td>;
}

/**
 * Painel de desempenho do funil por projeto (VIEW → CTA → POPUP → LEAD → WHATSAPP).
 * Reutiliza a infraestrutura existente; nenhum dado pessoal é lido ou exibido.
 */
export function PortfolioFunnelPanel({ slug, title = "Desempenho" }: { slug?: string; title?: string }) {
  const load = useServerFn(getPortfolioFunnelMetrics);
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<PortfolioFunnelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load({ data: slug ? { days, slug } : { days } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar métricas");
    } finally {
      setLoading(false);
    }
  }, [load, days, slug]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const rows: PortfolioFunnelRow[] = data?.projects ?? [];

  return (
    <section aria-labelledby="funnel-title" className="mt-6 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="funnel-title" className="font-display text-lg font-semibold">
          {title}
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
      {loading && <p className="mt-3 text-sm text-muted-foreground">Carregando desempenho…</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          NO_DATA — nenhum sinal registrado nesta janela. Nada é exibido como zero fabricado.
        </p>
      )}

      {!loading && rows.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-3 py-2">Projeto</th>
                <th scope="col" className="px-3 py-2">Views</th>
                <th scope="col" className="px-3 py-2">CTA</th>
                <th scope="col" className="px-3 py-2">Pop-up</th>
                <th scope="col" className="px-3 py-2">Leads</th>
                <th scope="col" className="px-3 py-2">WhatsApp</th>
                <th scope="col" className="px-3 py-2">Lead rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b border-border/60">
                  <Cell className="font-medium">{r.slug}</Cell>
                  <Cell>{r.views}</Cell>
                  <Cell>{r.ctaClicks}</Cell>
                  <Cell>{r.popupViews}</Cell>
                  <Cell>{r.leads}</Cell>
                  <Cell>{r.whatsappOpens}</Cell>
                  <Cell>{pct(r.leadRate)}</Cell>
                </tr>
              ))}
            </tbody>
            {data && !slug && (
              <tfoot>
                <tr className="text-sm font-semibold">
                  <Cell>Total</Cell>
                  <Cell>{data.totals.views}</Cell>
                  <Cell>{data.totals.ctaClicks}</Cell>
                  <Cell>{data.totals.popupViews}</Cell>
                  <Cell>{data.totals.leads}</Cell>
                  <Cell>{data.totals.whatsappOpens}</Cell>
                  <Cell>{pct(data.totals.leadRate)}</Cell>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Fontes: visita e CTA pelo registro interno de eventos do projeto, pop-up pelo evento comercial da
        0WEB, leads pela base de leads existente e WhatsApp pelo redirecionamento com token. Uma visita
        por visitante/sessão por projeto. Taxas só aparecem quando há base de cálculo.
      </p>
    </section>
  );
}
