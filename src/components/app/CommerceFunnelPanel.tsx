import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  CreditCard,
  Headphones,
  ShoppingCart,
  Store,
} from "lucide-react";
import { getCommerceFunnelMetrics } from "@/lib/commerce-funnel.functions";

function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function CommerceFunnelPanel() {
  const [days, setDays] = useState(30);
  const fetchMetrics = useServerFn(getCommerceFunnelMetrics);
  const { data, isLoading, error } = useQuery({
    queryKey: ["commerce-funnel", days],
    queryFn: () => fetchMetrics({ data: { days } }),
  });

  const metrics = data?.metrics;
  const cards = metrics
    ? [
        {
          label: "Adicionou ao carrinho",
          value: metrics.counts.cartAdded,
          detail: "base de jornadas",
          icon: <ShoppingCart className="w-4 h-4" />,
        },
        {
          label: "Checkout iniciado",
          value: metrics.counts.checkoutStarted,
          detail: `${metrics.rates.cartToCheckout}% dos carrinhos`,
          icon: <Store className="w-4 h-4" />,
        },
        {
          label: "Atendimento solicitado",
          value: metrics.counts.assisted,
          detail: `${metrics.rates.cartToAssisted}% dos carrinhos`,
          icon: <Headphones className="w-4 h-4" />,
        },
        {
          label: "Pagamento iniciado",
          value: metrics.counts.paymentStarted,
          detail: `${metrics.rates.cartToPaymentStarted}% dos carrinhos`,
          icon: <CreditCard className="w-4 h-4" />,
        },
        {
          label: "Pagamento confirmado",
          value: metrics.counts.paid,
          detail: `${metrics.rates.paymentStartedToPaid}% dos pagamentos iniciados`,
          icon: <CheckCircle2 className="w-4 h-4" />,
        },
      ]
    : [];

  return (
    <section className="rounded-2xl border border-border bg-card p-4 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold">Funil comercial da loja</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Sessões únicas de /servicos. Atendimento e pagamento são saídas alternativas do checkout.
          </p>
        </div>
        <label className="text-xs text-muted-foreground flex items-center gap-2">
          Período
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          >
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-4">Carregando métricas comerciais…</p>
      ) : error ? (
        <p className="text-sm text-destructive py-4">Não foi possível carregar o funil comercial.</p>
      ) : metrics ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <div key={card.label} className="rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {card.icon}
                  <span>{card.label}</span>
                </div>
                <div className="mt-2 text-2xl font-bold tabular-nums">{card.value}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{card.detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Saída explícita do checkout</p>
              <p className="mt-1 text-lg font-bold tabular-nums">{metrics.counts.checkoutExited}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.rates.checkoutExitRate}% dos checkouts iniciados.
              </p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Pagamento cancelado</p>
              <p className="mt-1 text-lg font-bold tabular-nums">{metrics.counts.paymentCancelled}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.rates.paymentCancelRate}% dos pagamentos iniciados.
              </p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Falha confirmada pelo provedor</p>
              <p className="mt-1 text-lg font-bold tabular-nums">{metrics.counts.paymentFailed}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {metrics.rates.paymentFailureRate}% dos pagamentos iniciados.
              </p>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            Abandono não é inferido por tempo. A saída só conta quando o visitante deixa o checkout explicitamente;
            cancelamento e falha de pagamento vêm de sinais próprios.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Receita confirmada no período</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{brl(metrics.paidRevenue)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Conversão carrinho → pago: {metrics.rates.cartToPaid}%.
              </p>
            </div>
            <div className="rounded-xl border border-border p-3 overflow-x-auto">
              <p className="text-xs font-semibold mb-2">Conversão por produto / variante</p>
              {metrics.productPerformance.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem adições no período.</p>
              ) : (
                <table className="w-full min-w-[520px] text-xs">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="text-left py-1 pr-3">Produto</th>
                      <th className="text-right px-2">Carrinho</th>
                      <th className="text-right px-2">Checkout</th>
                      <th className="text-right px-2">Resultado</th>
                      <th className="text-right pl-2">Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.productPerformance.slice(0, 8).map((item) => (
                      <tr key={`${item.serviceSlug}::${item.variantId}`} className="border-t border-border/60">
                        <td className="py-1.5 pr-3">
                          <span className="font-medium">{item.serviceSlug}</span>
                          {item.variantId !== "base" ? (
                            <span className="text-muted-foreground"> · {item.variantId}</span>
                          ) : null}
                        </td>
                        <td className="text-right px-2 tabular-nums">{item.added}</td>
                        <td className="text-right px-2 tabular-nums">{item.checkoutRate}%</td>
                        <td className="text-right px-2 tabular-nums">{item.resultRate}%</td>
                        <td className="text-right pl-2 tabular-nums">{item.paidRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border p-3 overflow-x-auto">
            <p className="text-xs font-semibold mb-2">Origem de aquisição</p>
            {metrics.sourcePerformance.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem origem comercial no período.</p>
            ) : (
              <table className="w-full min-w-[620px] text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left py-1 pr-3">Origem / campanha</th>
                    <th className="text-right px-2">Carrinhos</th>
                    <th className="text-right px-2">Checkout</th>
                    <th className="text-right px-2">Resultado</th>
                    <th className="text-right px-2">Pago</th>
                    <th className="text-right pl-2">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.sourcePerformance.slice(0, 8).map((item) => (
                    <tr
                      key={`${item.source}::${item.campaign ?? ""}`}
                      className="border-t border-border/60"
                    >
                      <td className="py-1.5 pr-3">
                        <span className="font-medium">{item.source}</span>
                        {item.campaign ? <span className="text-muted-foreground"> · {item.campaign}</span> : null}
                      </td>
                      <td className="text-right px-2 tabular-nums">{item.carts}</td>
                      <td className="text-right px-2 tabular-nums">{item.checkoutRate}%</td>
                      <td className="text-right px-2 tabular-nums">{item.resultRate}%</td>
                      <td className="text-right px-2 tabular-nums">{item.paidRate}%</td>
                      <td className="text-right pl-2 tabular-nums">{brl(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">
            {metrics.quality.canonicalJourneys} jornada(s) usam a chave canônica do carrinho.
            {metrics.quality.legacyJourneys > 0
              ? ` ${metrics.quality.legacyJourneys} jornada(s) antigas usam sessão analítica como compatibilidade.`
              : ""}
            {data?.truncated ? " O recorte atingiu o limite técnico de 10.000 eventos." : ""}
          </p>
        </>
      ) : null}
    </section>
  );
}
