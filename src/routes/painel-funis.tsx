import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCcw, ShoppingBag } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import {
  listPortfolioFunnelLeads,
  type PortfolioFunnelLead,
} from "@/lib/portfolio-funnel-leads.functions";

export const Route = createFileRoute("/painel-funis")({
  head: () => ({
    meta: [
      { title: "Painel · Leads dos funis de portfólio · 0WEB" },
      {
        name: "description",
        content:
          "Acompanhe os leads gerados pelos funis das páginas de portfólio, com itens do pedido, total, modalidade e observações.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <FunnelLeadsPanel />
    </PainelGate>
  ),
  ssr: false,
});

function FunnelLeadsPanel() {
  const load = useServerFn(listPortfolioFunnelLeads);
  const [leads, setLeads] = useState<PortfolioFunnelLead[]>([]);
  const [funnels, setFunnels] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const [funnelSlug, setFunnelSlug] = useState("all");
  const [clientKey, setClientKey] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load({
        data: {
          ...(funnelSlug !== "all" ? { funnel_slug: funnelSlug } : {}),
          ...(clientKey !== "all" ? { client_key: clientKey } : {}),
          limit: 200,
        },
      });
      setLeads(res.leads);
      setFunnels(res.funnels);
      setClients(res.clients);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelSlug, clientKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.contact_name, l.order_items, l.customer_note, l.funnel_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [leads, query]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Leads dos funis de portfólio
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pedidos e solicitações recebidos pelos funis individuais dos clientes. O
              número de WhatsApp de destino é resolvido apenas no servidor e nunca aparece aqui.
            </p>
          </div>
          <button
            onClick={() => void fetchLeads()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <RefreshCcw className="h-4 w-4" /> Atualizar
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <select
            aria-label="Filtrar por funil"
            value={funnelSlug}
            onChange={(e) => setFunnelSlug(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">Todos os funis</option>
            {funnels.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por cliente"
            value={clientKey}
            onChange={(e) => setClientKey(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">Todos os clientes</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            aria-label="Buscar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, item ou observação"
            className="min-w-[16rem] flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Funil</th>
                <th className="px-3 py-2">Cliente</th>
                <th className="px-3 py-2">Contato</th>
                <th className="px-3 py-2">Itens do pedido</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Modalidade</th>
                <th className="px-3 py-2">Observação</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-muted-foreground">
                    Carregando…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-muted-foreground">
                    Nenhum lead encontrado para os filtros atuais.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((l) => (
                  <tr key={l.id} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-3 py-2">
                      {new Date(l.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-3 py-2">{l.funnel_name}</td>
                    <td className="px-3 py-2">{l.client_key ?? "—"}</td>
                    <td className="px-3 py-2">
                      <div>{l.contact_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{l.contact_phone ?? ""}</div>
                    </td>
                    <td className="max-w-[22rem] px-3 py-2">{l.order_items ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {l.order_total ? `R$ ${l.order_total}` : "—"}
                    </td>
                    <td className="px-3 py-2">{l.fulfillment ?? "—"}</td>
                    <td className="max-w-[18rem] px-3 py-2">{l.customer_note ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {l.pipeline_stage ?? l.status ?? "novo"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
