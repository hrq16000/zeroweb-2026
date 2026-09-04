import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Inbox, Filter, Download, Loader2 } from "lucide-react";
import {
  listPortfolioHostLeads,
  updatePortfolioHostLeadStatus,
  getPortfolioHostLeadSummary,
  type HostLead,
} from "@/lib/portfolio-host-leads.functions";
import { HOST_LEAD_STATUSES, HOST_LEAD_STATUS_LABEL } from "@/lib/portfolio-host-leads";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/app/leads/portfolio")({
  component: PortfolioLeadsPage,
  head: () => ({
    meta: [
      { title: "Leads do portfólio · 0WEB" },
      { name: "description", content: "Contatos gerados pelo pop-up comercial da 0WEB nas páginas de portfólio." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

function toCsv(rows: HostLead[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["criado_em", "nome", "whatsapp", "cidade", "projeto", "status", "utm_source", "utm_campaign", "referrer"];
  const body = rows.map((l) =>
    [l.createdAt, l.name, l.phone, l.city, l.portfolioSlug, l.status, l.utm.source, l.utm.campaign, l.referrer]
      .map(esc)
      .join(","),
  );
  return [head.join(","), ...body].join("\n");
}

function PortfolioLeadsPage() {
  const fetchLeads = useServerFn(listPortfolioHostLeads);
  const fetchSummary = useServerFn(getPortfolioHostLeadSummary);
  const setStatus = useServerFn(updatePortfolioHostLeadStatus);

  const [days, setDays] = useState(30);
  const [slug, setSlug] = useState("");
  const [status, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<HostLead | null>(null);
  const [note, setNote] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["host-leads", days, slug, status, search],
    queryFn: () =>
      fetchLeads({
        data: { days, slug: slug || undefined, status: status || undefined, search: search || undefined },
      }),
  });
  const summary = useQuery({
    queryKey: ["host-leads-summary", days],
    queryFn: () => fetchSummary({ data: { days } }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { leadId: string; status: string; note?: string }) => setStatus({ data: vars }),
    onSuccess: () => {
      setNote("");
      setOpen(null);
      void refetch();
      void summary.refetch();
    },
  });

  const leads = data?.leads ?? [];

  const exportCsv = () => {
    const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-portfolio-0web-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Inbox className="w-5 h-5 text-primary" aria-hidden="true" /> Leads do portfólio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contatos gerados pelo pop-up comercial da 0WEB dentro de /portfolio/:slug, com origem atribuída.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!leads.length}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
        </button>
      </header>

      <section aria-label="Filtros" className="mt-6 flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <select
          aria-label="Período"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value={7}>7 dias</option>
          <option value={30}>30 dias</option>
          <option value={90}>90 dias</option>
        </select>
        <select
          aria-label="Projeto"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">Todos os projetos</option>
          {(data?.slugs ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">Todos os status</option>
          {HOST_LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {HOST_LEAD_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          aria-label="Buscar por nome ou telefone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nome ou telefone"
          className="min-h-11 flex-1 min-w-[180px] rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        />
      </section>

      <section aria-label="Resumo por projeto" className="mt-6 grid gap-3 sm:grid-cols-3">
        {(summary.data?.rows ?? []).slice(0, 6).map((r) => (
          <div key={r.slug} className="rounded-xl border border-border bg-card p-4">
            <p className="truncate text-sm font-semibold text-foreground">{r.slug}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {r.leads} lead(s) · {r.whatsapp} abriram o WhatsApp
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Criado</th>
              <th scope="col" className="px-3 py-2 font-medium">Nome</th>
              <th scope="col" className="px-3 py-2 font-medium">WhatsApp</th>
              <th scope="col" className="px-3 py-2 font-medium">Cidade</th>
              <th scope="col" className="px-3 py-2 font-medium">Projeto</th>
              <th scope="col" className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  <Loader2 className="mx-auto w-4 h-4 animate-spin" aria-hidden="true" />
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  Nenhum lead no período selecionado.
                </td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setOpen(l)}
                  className="cursor-pointer border-t border-border hover:bg-muted/40"
                >
                  <td className="px-3 py-2 text-muted-foreground">{fmt(l.createdAt)}</td>
                  <td className="px-3 py-2 text-foreground">{l.name ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{l.phoneMasked}</td>
                  <td className="px-3 py-2 text-muted-foreground">{l.city ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{l.portfolioSlug ?? "—"}</td>
                  <td className="px-3 py-2 text-foreground">{HOST_LEAD_STATUS_LABEL[l.status]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <Sheet open={Boolean(open)} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{open?.name ?? "Lead"}</SheetTitle>
          </SheetHeader>
          {open ? (
            <div className="mt-4 space-y-4 text-sm">
              <dl className="space-y-1">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">WhatsApp</dt>
                  <dd className="text-foreground">{open.phone ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Cidade</dt>
                  <dd className="text-foreground">{open.city ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Projeto</dt>
                  <dd className="text-foreground">{open.portfolioSlug ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Origem</dt>
                  <dd className="max-w-[60%] truncate text-foreground">{open.utm.source ?? open.referrer ?? "direto"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Campanha</dt>
                  <dd className="text-foreground">{open.utm.campaign ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">WhatsApp aberto</dt>
                  <dd className="text-foreground">{fmt(open.whatsappOpenedAt)}</dd>
                </div>
              </dl>

              <div>
                <label className="block text-sm font-medium text-foreground" htmlFor="lead-note">
                  Nota (opcional)
                </label>
                <textarea
                  id="lead-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={400}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-2 text-sm text-foreground"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {HOST_LEAD_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={mutation.isPending}
                      onClick={() => mutation.mutate({ leadId: open.id, status: s, note: note || undefined })}
                      className={`min-h-11 rounded-full border px-3 text-sm transition ${
                        open.status === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {HOST_LEAD_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {open.history.map((h, i) => (
                    <li key={`${h.at}-${i}`}>
                      {fmt(h.at)} · {h.detail ?? h.kind}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </main>
  );
}
