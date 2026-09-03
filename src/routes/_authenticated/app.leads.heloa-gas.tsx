import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Flame, RefreshCw } from "lucide-react";
import {
  listClientOrders,
  setClientOrderStage,
  ORDER_STAGES,
  type ClientOrder,
  type OrderStage,
} from "@/lib/client-orders.functions";

export const Route = createFileRoute("/_authenticated/app/leads/heloa-gas")({
  component: HeloaOrdersPage,
});

const STAGE_LABEL: Record<OrderStage, string> = {
  novo: "Novo",
  em_separacao: "Em separação",
  em_rota: "Em rota",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

function HeloaOrdersPage() {
  const fetchOrders = useServerFn(listClientOrders);
  const updateStage = useServerFn(setClientOrderStage);
  const [stage, setStage] = useState<"all" | OrderStage>("all");
  const [open, setOpen] = useState<ClientOrder | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["heloa-orders"],
    queryFn: () => fetchOrders({ data: { clientKey: "heloa-gas", limit: 200 } }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string; stage: OrderStage }) => updateStage({ data: vars }),
    onSuccess: () => void refetch(),
  });

  const orders = useMemo(() => {
    const rows = data?.orders ?? [];
    return stage === "all" ? rows : rows.filter((o) => o.stage === stage);
  }, [data, stage]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of data?.orders ?? []) map.set(o.stage, (map.get(o.stage) ?? 0) + 1);
    return map;
  }, [data]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" /> Pedidos · Heloá Gás
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pedidos recebidos pelo funil do cliente. Telefones são mascarados: o contato acontece
            pelo redirecionamento seguro do servidor.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {ORDER_STAGES.map((s) => (
          <div key={s} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{STAGE_LABEL[s]}</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">{counts.get(s) ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-xs text-muted-foreground mr-2" htmlFor="stage-filter">
          Status
        </label>
        <select
          id="stage-filter"
          value={stage}
          onChange={(e) => setStage(e.target.value as typeof stage)}
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="all">Todos</option>
          {ORDER_STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Pedido</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Entrega</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Recebido</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  Carregando…
                </td>
              </tr>
            )}
            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  Nenhum pedido no recorte atual.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {o.order_items || o.answers.service || o.answers.product || "Pedido"}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                  {o.fulfillment || o.answers.period || "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.stage}
                    onChange={(e) =>
                      mutation.mutate({ id: o.id, stage: e.target.value as OrderStage })
                    }
                    aria-label={`Status do pedido ${o.id}`}
                    className="text-xs rounded-lg border border-border bg-background px-2 py-1"
                  >
                    {ORDER_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {STAGE_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                  {new Date(o.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setOpen(o)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Histórico do pedido</h2>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="text-xs text-muted-foreground hover:underline"
            >
              Fechar
            </button>
          </div>
          <ol className="mt-3 space-y-2 text-sm">
            {open.history.map((h, i) => (
              <li key={`${h.stage}-${i}`} className="flex items-center justify-between">
                <span>{STAGE_LABEL[h.stage as OrderStage] ?? h.stage}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(h.at).toLocaleString("pt-BR")}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mt-4 mb-1">
            Respostas do funil
          </p>
          <pre className="bg-muted/40 rounded-lg p-3 text-xs overflow-auto max-h-80">
            {JSON.stringify(open.answers, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
