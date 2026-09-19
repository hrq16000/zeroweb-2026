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

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs text-muted-foreground">Receita confirmada no período</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{brl(metrics.paidRevenue)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Conversão carrinho → pago: {metrics.rates.cartToPaid}%.
              </p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold mb-2">Itens mais adicionados</p>
              {metrics.topProducts.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem adições no período.</p>
              ) : (
                <ul className="space-y-1.5">
                  {metrics.topProducts.map((item) => (
                    <li
                      key={`${item.serviceSlug}::${item.variantId}`}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="truncate">
                        {item.serviceSlug}
                        {item.variantId !== "base" ? ` · ${item.variantId}` : ""}
                      </span>
                      <strong className="tabular-nums">{item.count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
