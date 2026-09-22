import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Filter,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import {
  listPortfolioFunnels,
  provisionPortfolioFunnel,
  setPortfolioFunnelStatus,
  type PortfolioFunnelAdminRow,
} from "@/lib/portfolio-funnel-admin.functions";

export const Route = createFileRoute("/_authenticated/app/funis/portfolios")({
  head: () => ({
    meta: [
      { title: "Funis por portfólio · 0WEB Painel" },
      {
        name: "description",
        content: "Visão operacional dos funis individuais, destinos e leads dos projetos de portfólio.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortfolioFunnelsPage,
});

type FilterValue = "all" | "missing" | "draft" | "no_destination" | "lead_only";

function StatusPill({ status }: { status: PortfolioFunnelAdminRow["formStatus"] }) {
  const style =
    status === "published"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      : status === "draft"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : status === "archived"
          ? "bg-muted text-muted-foreground"
          : "bg-destructive/10 text-destructive";
  const label =
    status === "published"
      ? "publicado"
      : status === "draft"
        ? "rascunho"
        : status === "archived"
          ? "arquivado"
          : "sem funil";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>;
}

function PortfolioFunnelsPage() {
  const list = useServerFn(listPortfolioFunnels);
  const provision = useServerFn(provisionPortfolioFunnel);
  const setStatus = useServerFn(setPortfolioFunnelStatus);

  const [rows, setRows] = useState<PortfolioFunnelAdminRow[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await list());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar funis.");
    } finally {
      setLoading(false);
    }
  }, [list]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const summary = useMemo(
    () => ({
      total: rows.length,
      own: rows.filter((row) => row.formId).length,
      published: rows.filter((row) => row.formStatus === "published").length,
      missing: rows.filter((row) => row.formStatus === "missing").length,
      noDestination: rows.filter((row) => row.destinationStatus === "lead_only").length,
      leads: rows.reduce((sum, row) => sum + row.leadCount, 0),
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return rows.filter((row) => {
      if (filter === "missing" && row.formStatus !== "missing") return false;
      if (filter === "draft" && row.formStatus !== "draft") return false;
      if (filter === "no_destination" && row.destinationStatus !== "lead_only") return false;
      if (filter === "lead_only" && row.destinationStatus !== "lead_only") return false;
      if (!term) return true;
      return `${row.title} ${row.slug} ${row.clientKey}`.toLocaleLowerCase("pt-BR").includes(term);
    });
  }, [rows, filter, query]);

  const createFunnel = async (row: PortfolioFunnelAdminRow, publish: boolean) => {
    if (
      publish &&
      !window.confirm(
        `Criar e publicar o funil individual de "${row.title}"? A página não será alterada; apenas o funil do próprio clientKey será criado.`,
      )
    ) {
      return;
    }
    setBusy(row.clientKey);
    try {
      const result = await provision({ data: { clientKey: row.clientKey, publish } });
      toast.success(
        result.created
          ? publish
            ? "Funil individual criado e publicado."
            : "Funil individual criado como rascunho."
          : "O projeto já possui funil individual.",
      );
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao criar funil.");
    } finally {
      setBusy(null);
    }
  };

  const toggleStatus = async (row: PortfolioFunnelAdminRow) => {
    if (!row.formId) return;
    const next = row.formStatus === "published" ? "draft" : "published";
    if (
      next === "published" &&
      !window.confirm(
        `Publicar o funil de "${row.title}"? Isso não publica nem altera a landing page.`,
      )
    ) {
      return;
    }
    setBusy(row.clientKey);
    try {
      await setStatus({ data: { clientKey: row.clientKey, status: next } });
      toast.success(next === "published" ? "Funil publicado." : "Funil movido para rascunho.");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao alterar status.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Funis por portfólio</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Visão única de funil, destino e leads por clientKey. Esta tela não altera HTML, SEO,
            imagens ou publicação das páginas do portfólio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/app/funis"
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            <Settings2 className="h-4 w-4" aria-hidden="true" /> Editor de funis
          </Link>
          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Atualizar
          </button>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6" aria-label="Resumo">
        {[
          ["Portfólios", summary.total],
          ["Com funil próprio", summary.own],
          ["Funis publicados", summary.published],
          ["Sem funil próprio", summary.missing],
          ["Modo lead-only", summary.noDestination],
          ["Leads nos funis próprios", summary.leads],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </section>

      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Compatibilidade preservada</p>
        <p className="mt-1 text-muted-foreground">
          O slug canônico criado por esta tela é <code>funnel-&lt;clientKey&gt;</code>, que é o padrão
          já usado pelos funis individuais existentes. O alias antigo <code>portfolio-&lt;clientKey&gt;</code>
          é reconhecido somente para leitura, evitando duplicação. O WhatsApp exibido é sempre mascarado
          e continua vindo da configuração versionada do próprio projeto.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por projeto, slug ou clientKey…"
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Filtro</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterValue)}
            className="bg-transparent outline-none"
          >
            <option value="all">Todos</option>
            <option value="missing">Sem funil próprio</option>
            <option value="draft">Funil em rascunho</option>
            <option value="no_destination">Sem destino WhatsApp</option>
            <option value="lead_only">Modo lead-only</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando…
          </div>
        ) : (
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-muted/45 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3">Projeto</th>
                <th className="px-3 py-3">Página</th>
                <th className="px-3 py-3">Funil próprio</th>
                <th className="px-3 py-3">Perguntas</th>
                <th className="px-3 py-3">Destino</th>
                <th className="px-3 py-3">Leads</th>
                <th className="px-3 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const working = busy === row.clientKey;
                return (
                  <tr key={row.clientKey} className="border-t border-border align-top">
                    <td className="px-3 py-3">
                      <div className="font-medium">{row.title}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{row.clientKey}</div>
                      {row.isAlias && (
                        <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                          alias antigo detectado: {row.formSlug}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={row.pagePublished ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}>
                        {row.pagePublished ? "publicada" : "não publicada"}
                      </span>
                      <div className="text-[11px] text-muted-foreground">{row.projectType ?? "—"}</div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={row.formStatus} />
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground">{row.formSlug}</div>
                    </td>
                    <td className="px-3 py-3 tabular-nums">{row.questionCount}</td>
                    <td className="px-3 py-3">
                      {row.destinationStatus === "configured" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          {row.destinationMasked}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                          lead-only
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums">{row.leadCount}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1.5">
                        {row.formId ? (
                          <>
                            <Link
                              to="/app/funis/$id"
                              params={{ id: row.formId }}
                              className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted"
                            >
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Editar
                            </Link>
                            <button
                              type="button"
                              disabled={working || row.formStatus === "archived"}
                              onClick={() => void toggleStatus(row)}
                              className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                            >
                              {working ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              {row.formStatus === "published" ? "Rascunho" : "Publicar"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={working}
                              onClick={() => void createFunnel(row, false)}
                              className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Criar rascunho
                            </button>
                            <button
                              type="button"
                              disabled={working}
                              onClick={() => void createFunnel(row, true)}
                              className="inline-flex min-h-9 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                            >
                              {working ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                              Criar e publicar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum portfólio corresponde aos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Criar/publicar um funil aqui não altera a landing page. A ação cria apenas o formulário individual
        do clientKey no banco, usando a configuração de perguntas já conhecida pelo próprio projeto. Destinos
        ausentes permanecem em modo lead-only: o lead e o protocolo continuam salvos, sem fallback para outro cliente.
      </p>
    </div>
  );
}
