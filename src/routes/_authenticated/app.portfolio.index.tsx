import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Download, RefreshCcw, Search } from "lucide-react";
import {
  importPortfolioAdminProjects,
  listPortfolioAdminProjects,
} from "@/lib/portfolio-admin.functions";
import type { MergedProject } from "@/lib/portfolio-admin";

export const Route = createFileRoute("/_authenticated/app/portfolio")({
  component: PortfolioAdminList,
});

type Row = MergedProject & { driftFromSeed: string[] };

const STATUS_STYLE: Record<string, string> = {
  COMPLETE: "bg-primary/10 text-primary",
  PARTIAL: "bg-muted text-foreground",
  LEGACY: "bg-destructive/10 text-destructive",
};

function PortfolioAdminList() {
  const load = useServerFn(listPortfolioAdminProjects);
  const runImport = useServerFn(importPortfolioAdminProjects);

  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Record<string, number> | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load();
      setRows(res.projects as Row[]);
      setSummary(res.summary as unknown as Record<string, number>);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar projetos");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (status !== "all" && r.conformance.status !== status) return false;
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          r.slug.includes(q) ||
          r.displayName.toLowerCase().includes(q) ||
          r.segment.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
        );
      }),
    [rows, query, status],
  );

  const onImport = async () => {
    setMessage(null);
    setError(null);
    try {
      const res = await runImport();
      setMessage(
        `Importação concluída: ${res.created.length} novo(s), ${res.skipped.length} já existente(s), ${res.drift.length} com divergência em relação aos registries.`,
      );
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao importar");
    }
  };

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Projetos do portfólio</h1>
      <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
        Administração dos {rows.length || 68} projetos de <code>/portfolio/:slug</code>. Estrutura
        (slug, componente, rota) vem dos registries versionados; conteúdo, SEO, assets e publicação
        são editáveis aqui. Contatos de clientes continuam apenas no funil, no servidor.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            aria-label="Buscar projeto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, slug, cidade…"
            className="min-h-11 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <select
          aria-label="Filtrar por conformidade"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todas as conformidades</option>
          <option value="COMPLETE">COMPLETE</option>
          <option value="PARTIAL">PARTIAL</option>
          <option value="LEGACY">LEGACY</option>
        </select>
        <button
          type="button"
          onClick={() => void fetchData()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
        <button
          type="button"
          onClick={() => void onImport()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Importar registries
        </button>
      </div>

      {summary && (
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["Projetos", summary.total],
            ["COMPLETE", summary.complete],
            ["PARTIAL", summary.partial],
            ["LEGACY", summary.legacy],
            ["Importados", summary.imported],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {message && (
        <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{message}</p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-6 text-sm text-muted-foreground">Carregando projetos…</p>}

      <div className="mt-6 space-y-2">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            to="/app/portfolio/$slug"
            params={{ slug: p.slug }}
            className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-medium">{p.displayName}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  /portfolio/{p.slug} · {p.segment || "sem segmento"} · {p.city || "sem cidade"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {p.driftFromSeed.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px]">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {p.driftFromSeed.length} campo(s) editado(s)
                  </span>
                )}
                <span className={`rounded px-2 py-1 text-[11px] font-semibold ${STATUS_STYLE[p.conformance.status]}`}>
                  {p.conformance.status}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px]">
                  {p.published ? (
                    <CheckCircle2 className="h-3 w-3 text-primary" aria-hidden="true" />
                  ) : null}
                  {p.lifecycleStatus}
                </span>
              </div>
            </div>
            {p.conformance.issues.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">{p.conformance.issues.join(", ")}</p>
            )}
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhum projeto encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
}
