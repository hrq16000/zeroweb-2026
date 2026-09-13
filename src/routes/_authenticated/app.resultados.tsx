/**
 * Resultados: confirmações de presença da ADHONEP e volume de pedidos por marca.
 *
 * Somente leitura e sem segunda fonte de verdade — reutiliza
 * `listPortfolioFunnelLeads`. Nenhum número completo chega ao navegador.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, CalendarCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listPortfolioFunnelLeads,
  type PortfolioFunnelLead,
} from "@/lib/portfolio-funnel-leads.functions";

export const Route = createFileRoute("/_authenticated/app/resultados")({
  head: () => ({
    meta: [
      { title: "Resultados · 0WEB Painel" },
      {
        name: "description",
        content:
          "Confirmações de presença da ADHONEP Curitiba e pedidos recebidos por marca, com data e situação.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResultadosPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const ADHONEP_KEY = "adhonep-curitiba";

const dt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const situacao = (lead: PortfolioFunnelLead) => {
  const s = (lead.status ?? "").toLowerCase();
  if (s === "sent" || s === "delivered") return "Encaminhado";
  if (s === "failed" || s === "error") return "Falha no encaminhamento";
  if (s === "pending") return "Aguardando encaminhamento";
  return "Recebido";
};

function ResultadosPage() {
  const load = useServerFn(listPortfolioFunnelLeads);
  const [leads, setLeads] = useState<PortfolioFunnelLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load({ data: { limit: 300 } });
      setLeads(res.leads);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const adhonep = useMemo(
    () =>
      leads
        .filter((l) => l.client_key === ADHONEP_KEY)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [leads],
  );

  const porMarca = useMemo(() => {
    const map = new Map<string, { name: string; total: number; comContato: number; last: string }>();
    for (const l of leads) {
      const key = l.client_key ?? l.funnel_slug;
      const cur = map.get(key) ?? { name: l.funnel_name || key, total: 0, comContato: 0, last: l.created_at };
      cur.total += 1;
      if (l.has_recovery_contact) cur.comContato += 1;
      if (l.created_at > cur.last) cur.last = l.created_at;
      map.set(key, cur);
    }
    return Array.from(map.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.last.localeCompare(a.last));
  }, [leads]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Resultados</h1>
          <p className="text-sm text-muted-foreground">
            Confirmações da ADHONEP Curitiba e pedidos recebidos por marca. Atualiza a cada
            resposta registrada nos funis.
          </p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="rounded-xl border border-border">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">ADHONEP Curitiba · confirmações</h2>
          <span className="ml-auto text-sm text-muted-foreground">{adhonep.length} no total</span>
        </div>
        {adhonep.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Nenhuma confirmação recebida até agora.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Data</th>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">WhatsApp</th>
                <th className="px-4 py-2 font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {adhonep.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-2 text-muted-foreground">{dt(l.created_at)}</td>
                  <td className="px-4 py-2 text-foreground">{l.contact_name ?? "—"}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {l.contact_phone_masked ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{situacao(l)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-xl border border-border">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Inbox className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">Pedidos por marca</h2>
          <span className="ml-auto text-sm text-muted-foreground">{porMarca.length} marcas</span>
        </div>
        {porMarca.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum pedido no período.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Marca</th>
                <th className="px-4 py-2 font-medium">Pedidos</th>
                <th className="px-4 py-2 font-medium">Com contato para retorno</th>
                <th className="px-4 py-2 font-medium">Último</th>
              </tr>
            </thead>
            <tbody>
              {porMarca.map((m) => (
                <tr key={m.key} className="border-t border-border">
                  <td className="px-4 py-2 text-foreground">{m.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{m.total}</td>
                  <td className="px-4 py-2 text-muted-foreground">{m.comContato}</td>
                  <td className="px-4 py-2 text-muted-foreground">{dt(m.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
