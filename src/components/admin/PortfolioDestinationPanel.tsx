import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getLeadDeliveryOverview,
  getPortfolioDestinationAudit,
  type DestinationAudit,
} from "@/lib/portfolio-destination-audit.functions";
import { isDestinationOk, type DestinationRow } from "@/lib/portfolio-funnel-destination";

const BADGE: Record<string, string> = {
  VERIFIED: "border-primary/40 bg-primary/10 text-primary",
  AUTO_RESOLVED: "border-primary/40 bg-primary/10 text-primary",
  CONFIGURED_UNVERIFIED: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  INSUFFICIENT_EVIDENCE: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  CONFLICT: "border-destructive/40 bg-destructive/10 text-destructive",
  UNRESOLVED: "border-destructive/40 bg-destructive/10 text-destructive",
  NOT_APPLICABLE: "border-border bg-muted text-muted-foreground",
};

const PRIORITY_BADGE: Record<string, string> = {
  P0: "border-destructive/40 bg-destructive/10 text-destructive",
  P1: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  P2: "border-border bg-muted text-muted-foreground",
  P3: "border-border bg-muted text-muted-foreground",
  OK: "border-primary/40 bg-primary/10 text-primary",
};

type Filter = "pending" | "p0" | "risk" | "all";

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-3 py-2 text-sm ${className}`}>{children}</td>;
}

/**
 * Integridade operacional da conversão: quais páginas realmente entregam o
 * lead ao destino do cliente, ordenadas por risco real (nunca alfabético).
 * Número sempre mascarado.
 */
export function PortfolioDestinationPanel() {
  const load = useServerFn(getPortfolioDestinationAudit);
  const loadDelivery = useServerFn(getLeadDeliveryOverview);
  const [data, setData] = useState<DestinationAudit | null>(null);
  const [delivery, setDelivery] = useState<Awaited<ReturnType<typeof loadDelivery>> | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("p0");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load());
      setDelivery(await loadDelivery().catch(() => null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar destinos");
    } finally {
      setLoading(false);
    }
  }, [load, loadDelivery]);


  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const all: DestinationRow[] = data?.rows ?? [];
  const rows =
    filter === "all"
      ? all
      : filter === "p0"
        ? all.filter((r) => r.priority === "P0")
        : filter === "risk"
          ? all.filter((r) => r.deliveryNotConfigured)
          : all.filter((r) => !isDestinationOk(r.destinationStatus));

  const options: { id: Filter; label: string }[] = [
    { id: "p0", label: "P0 sem destino" },
    { id: "risk", label: "Com conclusões e sem entrega" },
    { id: "pending", label: "Pendentes" },
    { id: "all", label: "Todos" },
  ];

  return (
    <section aria-labelledby="destination-title" className="mt-6 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="destination-title" className="font-display text-lg font-semibold">
          Destino do funil por projeto
        </h2>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setFilter(o.id)}
              aria-pressed={filter === o.id}
              className={`min-h-9 rounded-md border px-3 text-xs font-medium ${
                filter === o.id ? "border-primary bg-primary/10 text-primary" : "border-border"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <p className="mt-2 text-xs text-muted-foreground">
          {data.summary.total} projetos · {data.summary.published} publicados ·{" "}
          {Object.entries(data.summary.counts)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ")}
        </p>
      )}
      {data && data.summary.conversionsAtRisk > 0 && (
        <p className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          DELIVERY_NOT_CONFIGURED — {data.summary.conversionsAtRisk} conclusão(ões) de funil em{" "}
          {data.summary.projectsWithDeliveryNotConfigured} projeto(s) nos últimos 90 dias sem destino
          operacional. O lead continua salvo, mas não foi entregue ao cliente.
        </p>
      )}

      {delivery && (
        <div className="mt-3 rounded-md border border-border bg-muted/30 p-3">
          <h3 className="text-sm font-semibold">Entrega dos pedidos</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {delivery.totals.total} pedidos registrados · {delivery.totals.delivered} entregues ·{" "}
            {delivery.totals.pending} aguardando abertura ·{" "}
            {delivery.totals.configurationRequired} aguardando configuração de destino ·{" "}
            {delivery.totals.failed} com falha · {delivery.totals.recoverable} recuperáveis ·{" "}
            {delivery.totals.unrecoverable} históricos irrecuperáveis.
          </p>
        </div>
      )}


      {error && (
        <p role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-3 text-sm text-muted-foreground">Carregando destinos…</p>}

      {!loading && !error && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-3 py-2">Projeto</th>
                <th scope="col" className="px-3 py-2">Prioridade</th>
                <th scope="col" className="px-3 py-2">Destino</th>
                <th scope="col" className="px-3 py-2">Views 30d</th>
                <th scope="col" className="px-3 py-2">Funis concluídos</th>
                <th scope="col" className="px-3 py-2">Leads 90d</th>
                <th scope="col" className="px-3 py-2">Origem</th>
                <th scope="col" className="px-3 py-2">Número</th>
                <th scope="col" className="px-3 py-2">Verificado em</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b border-border/60 align-top">
                  <Cell className="font-medium">
                    {r.slug}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {r.publicState} · {r.funnelType}
                    </span>
                    {r.note ? (
                      <span className="block whitespace-normal text-xs font-normal text-muted-foreground">
                        {r.note}
                      </span>
                    ) : null}
                  </Cell>
                  <Cell>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        PRIORITY_BADGE[r.priority] ?? PRIORITY_BADGE.OK
                      }`}
                    >
                      {r.priority}
                    </span>
                    {r.deliveryNotConfigured ? (
                      <span className="mt-1 block text-xs font-semibold text-destructive">
                        DELIVERY_NOT_CONFIGURED
                      </span>
                    ) : null}
                  </Cell>
                  <Cell>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        BADGE[r.destinationStatus] ?? BADGE.NOT_APPLICABLE
                      }`}
                    >
                      {r.destinationStatus}
                    </span>
                  </Cell>
                  <Cell className="tabular-nums">{r.telemetry.views30}</Cell>
                  <Cell className="tabular-nums">
                    {r.telemetry.funnelCompletes90}
                    {r.conversionsAtRisk > 0 ? (
                      <span className="ml-1 text-xs text-destructive">({r.conversionsAtRisk} sem entrega)</span>
                    ) : null}
                  </Cell>
                  <Cell className="tabular-nums">{r.telemetry.leads90}</Cell>
                  <Cell>
                    {r.destinationSource}
                    {r.evidenceSource ? (
                      <span className="block text-xs text-muted-foreground">{r.evidenceSource}</span>
                    ) : null}
                  </Cell>
                  <Cell className="tabular-nums">{r.destinationValueMasked ?? "—"}</Cell>
                  <Cell>{r.lastVerifiedAt ?? "—"}</Cell>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <Cell className="text-muted-foreground">Nenhum projeto neste filtro.</Cell>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        O número completo permanece server-side; aqui ele aparece sempre mascarado. UNRESOLVED
        significa que o funil registra o lead e devolve protocolo, mas não entrega no WhatsApp do
        cliente — nenhum número é presumido e a 0WEB nunca é usada como destino substituto.
      </p>
    </section>
  );
}
