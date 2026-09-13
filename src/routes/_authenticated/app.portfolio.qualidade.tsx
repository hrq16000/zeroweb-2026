import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listPortfolioQuality,
  publishPortfolioQuality,
  type PortfolioQualityRow,
} from "@/lib/portfolio-quality.functions";

/**
 * Priorização das landings do portfólio.
 *
 * Mostra o perfil de qualidade avaliado (densidade visual, profundidade
 * editorial, nível de prova) ao lado da conformidade técnica e do estado do
 * funil, para decidir o que revisar/publicar primeiro. Projeto sem avaliação
 * aparece como "não avaliado" — nada aqui é estimado.
 */
export const Route = createFileRoute("/_authenticated/app/portfolio/qualidade")({
  head: () => ({
    meta: [
      { title: "Qualidade das landings · 0WEB Painel" },
      {
        name: "description",
        content: "Densidade visual, profundidade editorial e nível de prova por landing do portfólio.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: QualityPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type Filter = "ALL" | "EVALUATED" | "NOT_EVALUATED" | "BLOCKING" | "NO_FUNNEL" | "UNPUBLISHED";

const badge = "rounded-full border px-2 py-1 text-xs";

function QualityPage() {
  const load = useServerFn(listPortfolioQuality);
  const publish = useServerFn(publishPortfolioQuality);
  const [rows, setRows] = useState<PortfolioQualityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await load();
      setRows(list.rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !`${r.title} ${r.slug} ${r.city ?? ""} ${r.segment ?? ""}`.toLowerCase().includes(q)) return false;
      if (filter === "EVALUATED") return r.evaluated;
      if (filter === "NOT_EVALUATED") return !r.evaluated;
      if (filter === "BLOCKING") return r.blocking;
      if (filter === "NO_FUNNEL") return !r.funnelConfigured;
      if (filter === "UNPUBLISHED") return !r.published;
      return true;
    });
  }, [rows, query, filter]);

  const summary = useMemo(
    () => ({
      total: rows.length,
      evaluated: rows.filter((r) => r.evaluated).length,
      blocking: rows.filter((r) => r.blocking).length,
      noFunnel: rows.filter((r) => !r.funnelConfigured).length,
    }),
    [rows],
  );

  const publishOne = async (row: PortfolioQualityRow) => {
    if (!row.canPublish || row.published) return;
    setPublishing(row.slug);
    setError(null);
    setMessage(null);
    try {
      await publish({ data: { slug: row.slug } });
      setMessage(`${row.title} publicado após validação dos requisitos.`);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível publicar o projeto.");
    } finally {
      setPublishing(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Qualidade das landings</h1>
          <p className="mt-1 max-w-[75ch] text-sm text-muted-foreground">
            Densidade visual, profundidade editorial e nível de prova de cada landing avaliada, junto da
            conformidade técnica, da publicação e do estado do funil. Serve para escolher o que revisar
            ou publicar primeiro.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Só aparece perfil de qualidade onde existe avaliação registrada. Edição de conteúdo continua em{" "}
            <Link to="/app/portfolio" className="underline">
              Projetos do portfólio
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
      </header>

      <dl className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["Landings", summary.total],
          ["Com avaliação", summary.evaluated],
          ["Com pendência bloqueante", summary.blocking],
          ["Sem funil configurado", summary.noFunnel],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-border p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">Buscar</span>
          <span className="mt-1 flex min-h-11 items-center gap-2 rounded-md border border-input bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="marca, cidade ou segmento"
              className="w-56 bg-transparent outline-none"
            />
          </span>
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Filtro</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="mt-1 min-h-11 rounded-md border border-input bg-background px-3"
          >
            <option value="ALL">Todas</option>
            <option value="EVALUATED">Com avaliação</option>
            <option value="NOT_EVALUATED">Sem avaliação</option>
            <option value="BLOCKING">Com pendência bloqueante</option>
            <option value="NO_FUNNEL">Sem funil configurado</option>
            <option value="UNPUBLISHED">Fora do ar</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
          {message}
        </p>
      )}

      <section className="mt-6 overflow-x-auto">
        {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Marca</th>
              <th className="py-2">Cidade</th>
              <th className="py-2">Densidade visual</th>
              <th className="py-2">Profundidade editorial</th>
              <th className="py-2">Nível de prova</th>
              <th className="py-2">Nota</th>
              <th className="py-2">Conformidade</th>
              <th className="py-2">Situação</th>
              <th className="py-2">Publicação</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.slug} className="border-t border-border align-top">
                <td className="py-2">
                  <span className="font-medium">{r.title}</span>
                  <span className="block text-xs text-muted-foreground">/portfolio/{r.slug}</span>
                </td>
                <td className="py-2">{r.city ?? "—"}</td>
                <td className="py-2">{r.visualDensity ?? <span className="text-muted-foreground">não avaliado</span>}</td>
                <td className="py-2">{r.editorialDepth ?? <span className="text-muted-foreground">—</span>}</td>
                <td className="py-2">{r.proofLevel ?? <span className="text-muted-foreground">—</span>}</td>
                <td className="py-2">{r.score ?? "—"}</td>
                <td className="py-2">
                  <span
                    className={`${badge} ${
                      r.blocking ? "border-destructive/40 text-destructive" : "border-border text-muted-foreground"
                    }`}
                  >
                    {r.conformance}
                  </span>
                  {r.issues.length > 0 && (
                    <span className="mt-1 block text-xs text-muted-foreground">{r.issues.join(", ")}</span>
                  )}
                </td>
                <td className="py-2">
                  <span className="flex flex-wrap gap-1">
                    <span className={`${badge} ${r.published ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
                      {r.published ? "No ar" : "Fora do ar"}
                    </span>
                    <span className={`${badge} ${r.funnelConfigured ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
                      {r.funnelConfigured ? "Funil ok" : "Sem número"}
                    </span>
                  </span>
                </td>
                <td className="py-2">
                  {r.published ? (
                    <span className="text-xs text-muted-foreground">Publicado</span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      disabled={!r.canPublish || publishing === r.slug}
                      title={r.canPublish ? "Publicar após os gates" : r.publishBlockers.join(" · ")}
                      onClick={() => void publishOne(r)}
                    >
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      {publishing === r.slug ? "Validando…" : "Publicar"}
                    </Button>
                  )}
                  {!r.published && !r.canPublish && (
                    <span className="mt-1 block max-w-56 text-xs text-muted-foreground">
                      {r.publishBlockers.join(" · ")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-muted-foreground">
                  Nenhuma landing encontrada com esse filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
