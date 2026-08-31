import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Save } from "lucide-react";
import {
  listClientSettings,
  upsertClientSettings,
  listClientSettingsHistory,
  type ClientSettings,
  type SettingsHistoryRow,
} from "@/lib/portfolio-client-settings.functions";

export const Route = createFileRoute("/_authenticated/app/metadados")({
  head: () => ({
    meta: [
      { title: "Metadados por cliente · 0WEB Painel" },
      { name: "description", content: "Título, descrição, palavras-chave e canonical por cliente do portfólio." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MetadataPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const EMPTY = {
  client_key: "",
  slug: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  canonical_url: "",
};

function MetadataPage() {
  const load = useServerFn(listClientSettings);
  const save = useServerFn(upsertClientSettings);
  const loadHistory = useServerFn(listClientSettingsHistory);

  const [rows, setRows] = useState<ClientSettings[]>([]);
  const [history, setHistory] = useState<SettingsHistoryRow[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, hist] = await Promise.all([load(), loadHistory({ data: { limit: 50 } })]);
      setRows(list.rows);
      setHistory(hist.rows.filter((h) => h.field.startsWith("seo_") || h.field === "canonical_url" || h.field === "slug"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load, loadHistory]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    try {
      await save({ data: { ...form, slug: form.slug || form.client_key } });
      setStatus(`Metadados de ${form.client_key} salvos.`);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const edit = (row: ClientSettings) =>
    setForm({
      client_key: row.client_key,
      slug: row.slug,
      seo_title: row.seo_title,
      seo_description: row.seo_description,
      seo_keywords: row.seo_keywords,
      canonical_url: row.canonical_url,
    });

  const field = (key: keyof typeof EMPTY, label: string, extra?: { textarea?: boolean; hint?: string }) => (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      {extra?.textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={3}
          className="mt-1 w-full rounded-md border border-input bg-background p-2"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
        />
      )}
      {extra?.hint && <span className="mt-1 block text-xs text-muted-foreground">{extra.hint}</span>}
    </label>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Metadados por cliente</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Fonte editável de título, descrição, palavras-chave e canonical de cada cliente do portfólio, com histórico
            auditável de alterações.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {status && <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{status}</p>}

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-lg border border-border p-4 md:grid-cols-2">
        {field("client_key", "clientKey", { hint: "Identificador único, minúsculo (ex.: rm-fretes)." })}
        {field("slug", "Slug da rota", { hint: "Usado em /portfolio/<slug>." })}
        {field("seo_title", "Título (title)")}
        {field("canonical_url", "Canonical")}
        <div className="md:col-span-2">{field("seo_description", "Descrição", { textarea: true })}</div>
        <div className="md:col-span-2">{field("seo_keywords", "Palavras-chave", { hint: "Separadas por vírgula." })}</div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Save className="h-4 w-4" aria-hidden="true" /> Salvar metadados
          </button>
        </div>
      </form>

      <section className="mt-8 overflow-x-auto">
        <h2 className="text-sm font-semibold">Clientes configurados</h2>
        {loading && <p className="mt-2 text-sm text-muted-foreground">Carregando…</p>}
        <table className="mt-3 w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Cliente</th>
              <th className="py-2">Título</th>
              <th className="py-2">Canonical</th>
              <th className="py-2">Atualizado</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.client_key} className="border-t border-border align-top">
                <td className="py-2 font-medium">{r.client_key}</td>
                <td className="py-2">{r.seo_title || "—"}</td>
                <td className="py-2 break-all">{r.canonical_url || "—"}</td>
                <td className="py-2">{new Date(r.updated_at).toLocaleString("pt-BR")}</td>
                <td className="py-2">
                  <button type="button" onClick={() => edit(r)} className="min-h-11 text-primary underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-muted-foreground">
                  Nenhum cliente configurado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Histórico de alterações</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {history.map((h) => (
            <li key={h.id}>
              {new Date(h.created_at).toLocaleString("pt-BR")} · {h.client_key} · {h.field}: “{h.old_value ?? "—"}” →
              “{h.new_value ?? "—"}”
            </li>
          ))}
          {history.length === 0 && <li>Sem alterações registradas.</li>}
        </ul>
      </section>
    </div>
  );
}
