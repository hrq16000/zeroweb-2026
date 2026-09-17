import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCcw } from "lucide-react";
import {
  listPortfolioProjectLeads,
  type PortfolioProjectLead,
} from "@/lib/portfolio-whatsapp-admin.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio/leads")({
  head: () => ({
    meta: [
      { title: "Leads por portfólio · 0WEB Painel" },
      { name: "description", content: "Leads salvos por projeto, com data, respostas e situação do WhatsApp." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortfolioLeadsByProjectPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const fmt = (iso: string) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const STATUS_LABEL: Record<PortfolioProjectLead["whatsappStatus"], string> = {
  OPENED: "WhatsApp aberto",
  PENDING: "Link gerado, ainda não aberto",
  NO_DESTINATION: "Sem número — lead guardado",
};

function PortfolioLeadsByProjectPage() {
  const load = useServerFn(listPortfolioProjectLeads);
  const [rows, setRows] = useState<PortfolioProjectLead[]>([]);
  const [days, setDays] = useState(30);
  const [clientKey, setClientKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load({ data: { days } });
      setRows(res.rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load, days]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const projects = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.clientKey).filter(Boolean) as string[])).sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [rows],
  );

  const visible = clientKey ? rows.filter((r) => r.clientKey === clientKey) : rows;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Leads por portfólio</h1>
          <p className="text-sm text-muted-foreground">
            Todos os contatos salvos pelos funis dos projetos, com as respostas preenchidas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <RefreshCcw className="h-4 w-4" /> Atualizar
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-md border px-3 py-2 text-sm"
        >
          {[7, 30, 90, 180].map((d) => (
            <option key={d} value={d}>
              Últimos {d} dias
            </option>
          ))}
        </select>
        <select
          value={clientKey}
          onChange={(e) => setClientKey(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todos os projetos</option>
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">{visible.length} leads</span>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-3">
        {loading && <div className="text-sm text-muted-foreground">Carregando…</div>}
        {!loading && visible.length === 0 && (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            Nenhum lead no período.
          </div>
        )}
        {!loading &&
          visible.map((lead) => (
            <article key={lead.id} className="rounded-lg border p-4">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{lead.name ?? "Sem nome"}</div>
                  <div className="text-xs text-muted-foreground">
                    /portfolio/{lead.slug} · {fmt(lead.createdAt)} · {lead.phoneMasked ?? "sem telefone"}
                  </div>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    lead.whatsappStatus === "OPENED"
                      ? "bg-primary/10 text-primary"
                      : lead.whatsappStatus === "PENDING"
                        ? "bg-muted text-foreground"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {STATUS_LABEL[lead.whatsappStatus]}
                </span>
              </header>
              {lead.answers.length > 0 && (
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {lead.answers.map((a) => (
                    <div key={a.label} className="rounded-md bg-muted/40 p-2">
                      <dt className="text-xs text-muted-foreground">{a.label}</dt>
                      <dd className="text-sm">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          ))}
      </div>
    </div>
  );
}
