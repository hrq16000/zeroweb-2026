import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getPortfolioDestinationAudit,
  type DestinationAudit,
} from "@/lib/portfolio-destination-audit.functions";
import { isDestinationOk, type DestinationRow } from "@/lib/portfolio-funnel-destination";

const BADGE: Record<string, string> = {
  VERIFIED: "border-primary/40 bg-primary/10 text-primary",
  AUTO_RESOLVED: "border-primary/40 bg-primary/10 text-primary",
  CONFIGURED_UNVERIFIED: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  CONFLICT: "border-destructive/40 bg-destructive/10 text-destructive",
  UNRESOLVED: "border-destructive/40 bg-destructive/10 text-destructive",
  NOT_APPLICABLE: "border-border bg-muted text-muted-foreground",
};

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-3 py-2 text-sm ${className}`}>{children}</td>;
}

/**
 * Integridade operacional da conversão: quais páginas realmente entregam o
 * lead ao destino do cliente. Número sempre mascarado.
 */
export function PortfolioDestinationPanel() {
  const load = useServerFn(getPortfolioDestinationAudit);
  const [data, setData] = useState<DestinationAudit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlyPending, setOnlyPending] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await load());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar destinos");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const all: DestinationRow[] = data?.rows ?? [];
  const rows = onlyPending ? all.filter((r) => !isDestinationOk(r.destinationStatus)) : all;

  return (
    <section aria-labelledby="destination-title" className="mt-6 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="destination-title" className="font-display text-lg font-semibold">
          Destino do funil por projeto
        </h2>
        <button
          type="button"
          onClick={() => setOnlyPending((v) => !v)}
          aria-pressed={onlyPending}
          className={`min-h-9 rounded-md border px-3 text-xs font-medium ${
            onlyPending ? "border-primary bg-primary/10 text-primary" : "border-border"
          }`}
        >
          {onlyPending ? "Mostrando pendentes" : "Mostrando todos"}
        </button>
      </div>

      {data && (
        <p className="mt-2 text-xs text-muted-foreground">
          {data.summary.total} projetos · {data.summary.published} publicados ·{" "}
          {Object.entries(data.summary.counts)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ")}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-3 text-sm text-muted-foreground">Carregando destinos…</p>}

      {!loading && !error && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-3 py-2">Projeto</th>
                <th scope="col" className="px-3 py-2">Estado público</th>
                <th scope="col" className="px-3 py-2">Funil</th>
                <th scope="col" className="px-3 py-2">Destino</th>
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
                    {r.note ? (
                      <span className="block whitespace-normal text-xs font-normal text-muted-foreground">
                        {r.note}
                      </span>
                    ) : null}
                  </Cell>
                  <Cell>{r.publicState}</Cell>
                  <Cell>{r.funnelType}</Cell>
                  <Cell>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        BADGE[r.destinationStatus] ?? BADGE.NOT_APPLICABLE
                      }`}
                    >
                      {r.destinationStatus}
                    </span>
                  </Cell>
                  <Cell>{r.destinationSource}</Cell>
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
        cliente — nenhum número é presumido.
      </p>
    </section>
  );
}
