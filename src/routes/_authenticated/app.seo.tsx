import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Save, Search } from "lucide-react";
import {
  listClientSettings,
  upsertClientSettings,
  type ClientSettings,
} from "@/lib/portfolio-client-settings.functions";

/**
 * Tela única de metadados + sitemap.
 *
 * Reúne, por landing, título, descrição, palavras-chave, canonical, dados
 * estruturados (JSON-LD) e a situação no sitemap, com edição e publicação na
 * própria linha. Não substitui telas existentes: é a visão consolidada.
 */
export const Route = createFileRoute("/_authenticated/app/seo")({
  head: () => ({
    meta: [
      { title: "Metadados & Sitemap · 0WEB Painel" },
      {
        name: "description",
        content: "Título, descrição, schema e situação no sitemap de cada landing, em uma tela só.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SeoHubPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type Draft = {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
  seo_schema: string;
  published: boolean;
};

function toDraft(row: ClientSettings): Draft {
  return {
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    seo_keywords: row.seo_keywords,
    canonical_url: row.canonical_url,
    seo_schema: row.seo_schema,
    published: row.published,
  };
}

function SeoHubPage() {
  const load = useServerFn(listClientSettings);
  const save = useServerFn(upsertClientSettings);

  const [rows, setRows] = useState<ClientSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "SITEMAP" | "OUT" | "NO_META" | "WITH_SCHEMA">("ALL");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      if (q && !`${r.client_key} ${r.slug} ${r.display_name} ${r.seo_title}`.toLowerCase().includes(q)) {
        return false;
      }
      if (filter === "SITEMAP") return r.published;
      if (filter === "OUT") return !r.published;
      if (filter === "NO_META") return !r.seo_title || !r.seo_description;
      if (filter === "WITH_SCHEMA") return Boolean(r.seo_schema);
      return true;
    });
  }, [rows, query, filter]);

  const summary = useMemo(
    () => ({
      total: rows.length,
      sitemap: rows.filter((r) => r.published).length,
      semMeta: rows.filter((r) => !r.seo_title || !r.seo_description).length,
      comSchema: rows.filter((r) => Boolean(r.seo_schema)).length,
    }),
    [rows],
  );

  const open = (row: ClientSettings) => {
    setStatus(null);
    setError(null);
    if (openKey === row.client_key) {
      setOpenKey(null);
      setDraft(null);
      return;
    }
    setOpenKey(row.client_key);
    setDraft(toDraft(row));
  };

  const submit = async (row: ClientSettings, publishedOverride?: boolean) => {
    if (!draft) return;
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      if (draft.seo_schema.trim()) {
        try {
          JSON.parse(draft.seo_schema);
        } catch {
          throw new Error("O schema precisa ser um JSON válido.");
        }
      }
      await save({
        data: {
          client_key: row.client_key,
          slug: row.slug || row.client_key,
          seo_title: draft.seo_title,
          seo_description: draft.seo_description,
          seo_keywords: draft.seo_keywords,
          canonical_url: draft.canonical_url,
          seo_schema: draft.seo_schema,
          published: publishedOverride ?? draft.published,
        },
      });
      setStatus(
        publishedOverride === undefined
          ? `Metadados de ${row.client_key} salvos.`
          : publishedOverride
            ? `${row.client_key} publicado no sitemap.`
            : `${row.client_key} removido do sitemap.`,
      );
      await refresh();
      if (publishedOverride !== undefined) {
        setDraft((d) => (d ? { ...d, published: publishedOverride } : d));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const input = (label: string, key: keyof Draft, textarea?: boolean, hint?: string) => (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={String(draft?.[key] ?? "")}
          onChange={(e) => setDraft((d) => (d ? { ...d, [key]: e.target.value } : d))}
          rows={key === "seo_schema" ? 10 : 3}
          className={`mt-1 w-full rounded-md border border-input bg-background p-2 ${
            key === "seo_schema" ? "font-mono text-xs" : ""
          }`}
        />
      ) : (
        <input
          value={String(draft?.[key] ?? "")}
          onChange={(e) => setDraft((d) => (d ? { ...d, [key]: e.target.value } : d))}
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
        />
      )}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );

  return (
    <div className="p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Metadados &amp; Sitemap</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Título, descrição, palavras-chave, canonical e dados estruturados de cada landing, com a
            situação no sitemap ao lado. Edite e publique sem abrir cada página.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Conteúdo de blocos da landing continua em{" "}
            <Link to="/app/landing-overrides" className="underline">
              Landing Overrides
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
          ["No sitemap", summary.sitemap],
          ["Sem título/descrição", summary.semMeta],
          ["Com schema próprio", summary.comSchema],
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
              placeholder="cliente, slug ou título"
              className="w-56 bg-transparent outline-none"
            />
          </span>
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Situação</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="mt-1 min-h-11 rounded-md border border-input bg-background px-3"
          >
            <option value="ALL">Todas</option>
            <option value="SITEMAP">No sitemap</option>
            <option value="OUT">Fora do sitemap</option>
            <option value="NO_META">Sem título ou descrição</option>
            <option value="WITH_SCHEMA">Com schema próprio</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {status && <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{status}</p>}

      <section className="mt-6 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        {!loading && visible.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma landing encontrada com esse filtro.</p>
        )}
        {visible.map((row) => (
          <article key={row.client_key} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{row.display_name || row.client_key}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /portfolio/{row.slug || row.client_key} · {row.seo_title || "sem título"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`rounded-full border px-2 py-1 ${
                    row.published ? "border-primary/40 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  {row.published ? "No sitemap" : "Fora do sitemap"}
                </span>
                <span className="rounded-full border border-border px-2 py-1 text-muted-foreground">
                  {row.seo_schema ? "Schema próprio" : "Schema padrão"}
                </span>
                <button
                  type="button"
                  onClick={() => open(row)}
                  className="min-h-11 rounded-md border border-border px-3 font-medium"
                >
                  {openKey === row.client_key ? "Fechar" : "Editar"}
                </button>
              </div>
            </div>

            {openKey === row.client_key && draft && (
              <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-2">
                {input("Título (title)", "seo_title")}
                {input("Canonical", "canonical_url", false, `https://0web.com.br/portfolio/${row.slug}`)}
                <div className="md:col-span-2">{input("Descrição", "seo_description", true)}</div>
                <div className="md:col-span-2">
                  {input("Palavras-chave", "seo_keywords", false, "Separadas por vírgula.")}
                </div>
                <div className="md:col-span-2">
                  {input(
                    "Dados estruturados (JSON-LD)",
                    "seo_schema",
                    true,
                    "JSON válido do schema.org. Vazio = a página usa o schema padrão dela.",
                  )}
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submit(row)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" /> Salvar
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submit(row, !row.published)}
                    className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium disabled:opacity-60"
                  >
                    {row.published ? "Remover do sitemap" : "Publicar no sitemap"}
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
