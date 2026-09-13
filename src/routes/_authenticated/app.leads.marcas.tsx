/**
 * Contatos por marca: todos os pedidos recebidos pelos funis do portfólio,
 * agrupados por cliente, com data, hora e status.
 *
 * Somente leitura. Reutiliza `listPortfolioFunnelLeads` (já existente) —
 * nenhuma segunda fonte de verdade, nenhum número completo no bundle.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Search, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listPortfolioFunnelLeads,
  type PortfolioFunnelLead,
} from "@/lib/portfolio-funnel-leads.functions";

export const Route = createFileRoute("/_authenticated/app/leads/marcas")({
  head: () => ({
    meta: [
      { title: "Contatos por marca · 0WEB Painel" },
      {
        name: "description",
        content:
          "Pedidos dos funis do portfólio agrupados por marca, com data, hora e status de retorno.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LeadsPorMarcaPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const dt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const statusLabel = (lead: PortfolioFunnelLead) => {
  const s = (lead.status ?? "").toLowerCase();
  if (s === "sent" || s === "delivered") return "Encaminhado";
  if (s === "failed" || s === "error") return "Falha no envio";
  if (s === "pending") return "Aguardando encaminhamento";
  if (lead.pipeline_stage) return lead.pipeline_stage;
  return "Recebido";
};

type Brand = {
  key: string;
  name: string;
  leads: PortfolioFunnelLead[];
  last: string;
  withContact: number;
};

function LeadsPorMarcaPage() {
  const load = useServerFn(listPortfolioFunnelLeads);
  const [leads, setLeads] = useState<PortfolioFunnelLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [recoverability, setRecoverability] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load({ data: { limit: 300, from: from || undefined, to: to || undefined, recoverability: recoverability || undefined } });
      setLeads(res.leads);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load, from, to, recoverability]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const brands = useMemo<Brand[]>(() => {
    const map = new Map<string, Brand>();
    for (const lead of leads) {
      const key = lead.client_key ?? lead.funnel_slug ?? "—";
      const current = map.get(key);
      if (current) {
        current.leads.push(lead);
        if (lead.created_at > current.last) current.last = lead.created_at;
        if (lead.has_recovery_contact) current.withContact += 1;
      } else {
        map.set(key, {
          key,
          name: lead.funnel_name || key,
          leads: [lead],
          last: lead.created_at,
          withContact: lead.has_recovery_contact ? 1 : 0,
        });
      }
    }
    const q = term.trim().toLowerCase();
    return [...map.values()]
      .filter((b) => !q || b.name.toLowerCase().includes(q) || b.key.toLowerCase().includes(q))
      .sort((a, b) => b.last.localeCompare(a.last));
  }, [leads, term]);

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Contatos por marca</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} pedidos · {brands.length} marcas. Número completo permanece no servidor.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void refresh()}
        >
          <RefreshCw className="h-4 w-4" /> Atualizar
        </Button>
      </header>

      <section aria-label="Filtros" className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-4">
        <label className="flex items-center gap-2 rounded-md border border-border px-3 text-sm md:col-span-2">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Buscar marca</span>
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar marca ou clientKey" className="min-h-11 w-full bg-transparent outline-none" />
        </label>
        <label className="text-xs text-muted-foreground">De<input aria-label="Data inicial" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground" /></label>
        <label className="text-xs text-muted-foreground">Até<input aria-label="Data final" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground" /></label>
        <label className="text-xs text-muted-foreground md:col-span-2">Recuperabilidade<select value={recoverability} onChange={(e) => setRecoverability(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"><option value="">Todos</option><option value="RECOVERABLE">Contato recuperável</option><option value="DELIVERED">Entregue</option><option value="DELIVERY_PENDING">Pendente</option><option value="UNRECOVERABLE_LEGACY">Legado sem contato</option></select></label>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {!loading && brands.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Inbox className="h-4 w-4" /> Nenhum pedido registrado ainda.
        </p>
      )}

      <div className="space-y-3">
        {brands.map((brand) => {
          const expanded = open === brand.key;
          return (
            <section key={brand.key} className="rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : brand.key)}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/50"
              >
                <span>
                  <span className="font-medium">{brand.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{brand.key}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {brand.leads.length} pedidos · {brand.withContact} com contato de retorno · último{" "}
                  {dt(brand.last)}
                </span>
              </button>

              {expanded && (
                <div className="overflow-x-auto border-t border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2">Data e hora</th>
                        <th className="px-4 py-2">Nome</th>
                        <th className="px-4 py-2">Contato</th>
                        <th className="px-4 py-2">Pedido</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Recuperabilidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brand.leads.map((lead) => (
                        <tr key={lead.id} className="border-t border-border/60">
                          <td className="px-4 py-2 whitespace-nowrap">{dt(lead.created_at)}</td>
                          <td className="px-4 py-2">{lead.contact_name ?? "—"}</td>
                          <td className="px-4 py-2">{lead.contact_phone_masked ?? "—"}</td>
                          <td className="px-4 py-2">
                            {lead.order_items ?? lead.customer_note ?? "—"}
                            {lead.order_total ? ` · ${lead.order_total}` : ""}
                          </td>
                          <td className="px-4 py-2">{statusLabel(lead)}</td>
                          <td className="px-4 py-2">{lead.recoverability_status ?? (lead.has_recovery_contact ? "RECOVERABLE" : "—")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
