/**
 * Pedidos e leads por portfolio: protocolo, dados e situação de cada
 * requisição vinda de uma landing `/portfolio/:slug`.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listPortfolioRequests,
  type PortfolioRequestGroup,
} from "@/lib/portfolio-requests.functions";

export const Route = createFileRoute("/_authenticated/app/leads/por-portfolio")({
  head: () => ({
    meta: [
      { title: "Pedidos por portfólio · 0WEB Painel" },
      {
        name: "description",
        content:
          "Protocolo, dados e situação de cada pedido recebido pelas landings de portfólio.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortfolioRequestsPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const dt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

function PortfolioRequestsPage() {
  const load = useServerFn(listPortfolioRequests);
  const [groups, setGroups] = useState<PortfolioRequestGroup[]>([]);
  const [sampleClients, setSampleClients] = useState<string[]>([]);
  const [days, setDays] = useState(90);
  const [onlySample, setOnlySample] = useState(false);
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await load({
        data: { days, only_sample: onlySample || undefined, client_key: client || undefined },
      });
      setGroups(r.groups);
      setSampleClients(r.sampleClients);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load, days, onlySample, client]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const total = useMemo(() => groups.reduce((s, g) => s + g.total, 0), [groups]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Inbox className="h-5 w-5 text-primary" aria-hidden="true" /> Pedidos por portfólio
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} requisição(ões) em {groups.length} projeto(s). {sampleClients.length} projetos
            estão publicados como amostra (sem atendimento direto).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Período"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="min-h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
            <option value={365}>12 meses</option>
          </select>
          <select
            aria-label="Projeto"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="min-h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">Todos os projetos</option>
            {groups.map((g) => (
              <option key={g.client_key} value={g.client_key}>
                {g.client_key}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={onlySample}
              onChange={(e) => setOnlySample(e.target.checked)}
            />
            Só amostras
          </label>
          <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && groups.length === 0 && (
        <p className="rounded-xl border border-border px-4 py-6 text-sm text-muted-foreground">
          Nenhuma requisição registrada no período selecionado.
        </p>
      )}

      {groups.map((g) => (
        <section key={g.client_key} className="rounded-xl border border-border">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
            <h2 className="font-medium text-foreground">{g.brand_name ?? g.client_key}</h2>
            <span className="text-xs text-muted-foreground">{g.client_key}</span>
            {g.sample_mode && (
              <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground">
                amostra · sem atendimento direto
              </span>
            )}
            <span className="ml-auto text-sm text-muted-foreground">{g.total} pedido(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Protocolo</th>
                  <th className="px-4 py-2 font-medium">Recebido</th>
                  <th className="px-4 py-2 font-medium">Contato</th>
                  <th className="px-4 py-2 font-medium">Pedido</th>
                  <th className="px-4 py-2 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="px-4 py-2 font-mono text-xs text-foreground">
                      {r.protocol ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{dt(r.created_at)}</td>
                    <td className="px-4 py-2 text-foreground">
                      {r.contact_name ?? "—"}
                      <span className="block text-xs text-muted-foreground">
                        {r.contact_phone_masked ?? "sem telefone"}
                        {r.city ? ` · ${r.city}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.order_items ?? "—"}
                      {r.order_total && (
                        <span className="block text-xs text-foreground">{r.order_total}</span>
                      )}
                      {r.customer_note && (
                        <span className="block text-xs">{r.customer_note}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.pipeline_stage ?? "—"}
                      <span className="block text-xs">
                        {r.delivery_status ?? "—"} · {r.recoverability_status ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
