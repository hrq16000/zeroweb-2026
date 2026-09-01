import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  listUnifiedLeads,
  emailLeadsDigest,
  type UnifiedLead,
} from "@/lib/unified-leads.functions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Inbox, Filter, ShoppingCart, ClipboardList, Download, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/leads")({
  component: LeadsPage,
});

function toCsv(rows: UnifiedLead[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["nome", "origem", "etapa_atual", "criado_em", "atualizado_em"];
  const body = rows.map((l) =>
    [l.nome, l.origem, l.etapa_atual, l.created_at, l.updated_at].map(esc).join(","),
  );
  return [head.join(","), ...body].join("\n");
}

function LeadsPage() {
  const fetchLeads = useServerFn(listUnifiedLeads);
  const sendDigest = useServerFn(emailLeadsDigest);
  const [origem, setOrigem] = useState<"all" | "carrinho" | "funil">("all");
  const [etapa, setEtapa] = useState<string>("all");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mailState, setMailState] = useState<string | null>(null);
  const [open, setOpen] = useState<UnifiedLead | null>(null);

  const filters = { origem, etapa, q: q || undefined, from: from || undefined, to: to || undefined };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["unified-leads", origem, etapa, q, from, to],
    queryFn: () => fetchLeads({ data: filters }),
  });

  const leads = data?.leads ?? [];
  const etapas = data?.etapas ?? [];

  const exportCsv = () => {
    const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-0web-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const emailReport = async () => {
    setMailState("Enviando…");
    try {
      const r = await sendDigest({ data: filters });
      setMailState(r.sent ? `Enviado (${r.count} lead(s)) para o e-mail da sua conta.` : "Não enviado.");
    } catch {
      setMailState("Falha ao enviar o resumo.");
    }
  };


  const stats = useMemo(() => {
    const total = leads.length;
    const carrinho = leads.filter((l) => l.origem === "carrinho").length;
    const funil = leads.filter((l) => l.origem === "funil").length;
    return { total, carrinho, funil };
  }, [leads]);

  /** Agrupamento por segmento do quiz de diagnóstico (audience_tag / payload.segment). */
  const segments = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) {
      const extra = (l.dados_extras ?? {}) as Record<string, any>;
      const seg =
        extra.audience_tag ??
        extra.segment ??
        extra.payload?.segment ??
        "não segmentado";
      map.set(String(seg), (map.get(String(seg)) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  /** Funil de conversão simples por etapa, ordenado por volume. */
  const funnelStages = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) map.set(l.etapa_atual, (map.get(l.etapa_atual) ?? 0) + 1);
    const rows = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const max = rows[0]?.[1] ?? 1;
    return rows.map(([etapa, count]) => ({ etapa, count, pct: Math.round((count / max) * 100) }));
  }, [leads]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" /> Leads Unificados
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Carrinho + funis dinâmicos em uma única tabela. Clique num lead para ver os dados completos.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted"
        >
          Atualizar
        </button>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Total" value={stats.total} />
        <Stat label="Carrinho" value={stats.carrinho} icon={<ShoppingCart className="w-4 h-4" />} />
        <Stat label="Funis" value={stats.funil} icon={<ClipboardList className="w-4 h-4" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3">Segmentos do diagnóstico</h2>
          {segments.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sem leads no recorte atual.</p>
          ) : (
            <ul className="space-y-2">
              {segments.map(([seg, count]) => (
                <li key={seg} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{seg}</span>
                  <span className="font-semibold tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3">Funil de conversão por etapa</h2>
          {funnelStages.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sem etapas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {funnelStages.map((s) => (
                <li key={s.etapa}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>{s.etapa}</span>
                    <span className="font-semibold tabular-nums">{s.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${s.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>


      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select
          value={origem}
          onChange={(e) => setOrigem(e.target.value as any)}
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="all">Todas as origens</option>
          <option value="carrinho">Carrinho</option>
          <option value="funil">Funis dinâmicos</option>
        </select>
        <select
          value={etapa}
          onChange={(e) => setEtapa(e.target.value)}
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="all">Todas as etapas</option>
          {etapas.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome"
          aria-label="Buscar leads por nome"
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        />
        <label className="text-xs text-muted-foreground flex items-center gap-2">
          De
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="text-xs text-muted-foreground flex items-center gap-2">
          Até
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <button
          type="button"
          onClick={exportCsv}
          disabled={leads.length === 0}
          className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
        <button
          type="button"
          onClick={emailReport}
          className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted inline-flex items-center gap-2"
        >
          <Mail className="w-4 h-4" /> Enviar por e-mail
        </button>
        {mailState && <span className="text-xs text-muted-foreground">{mailState}</span>}
      </div>


      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Origem</th>
              <th className="text-left px-4 py-3">Etapa</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Atualizado</th>
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
            {!isLoading && leads.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  Nenhum lead encontrado para os filtros atuais.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={`${l.origem}-${l.id_lead}`} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{l.nome}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      l.origem === "carrinho"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {l.origem === "carrinho" ? <ShoppingCart className="w-3 h-3" /> : <ClipboardList className="w-3 h-3" />}
                    {l.origem}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {l.etapa_atual}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                  {new Date(l.updated_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setOpen(l)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{open?.nome}</SheetTitle>
          </SheetHeader>
          {open && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Origem" value={open.origem} />
                <Field label="Etapa" value={open.etapa_atual} />
                <Field label="Criado" value={new Date(open.created_at).toLocaleString("pt-BR")} />
                <Field label="Atualizado" value={new Date(open.updated_at).toLocaleString("pt-BR")} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Dados extras</p>
                <pre className="bg-muted/40 rounded-lg p-3 text-xs overflow-auto max-h-[60vh]">
                  {JSON.stringify(open.dados_extras, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  );
}
