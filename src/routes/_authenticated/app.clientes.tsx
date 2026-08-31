import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Rocket, Save } from "lucide-react";
import {
  listClientSettings,
  upsertClientSettings,
  type ClientSettings,
} from "@/lib/portfolio-client-settings.functions";

export const Route = createFileRoute("/_authenticated/app/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes do portfólio · 0WEB Painel" },
      { name: "description", content: "Cadastro de clientes, funis e publicação do portfólio sem editar o catálogo." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ClientsPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const EMPTY = { client_key: "", slug: "", display_name: "", funnel_recipient: "" };

function ClientsPage() {
  const load = useServerFn(listClientSettings);
  const save = useServerFn(upsertClientSettings);

  const [rows, setRows] = useState<ClientSettings[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows((await load()).rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    try {
      await save({
        data: {
          client_key: form.client_key.trim(),
          slug: (form.slug || form.client_key).trim(),
          display_name: form.display_name.trim(),
          funnel_recipient: form.funnel_recipient.replace(/\D/g, ""),
        },
      });
      setStatus(`Cliente ${form.client_key} salvo.`);
      setForm({ ...EMPTY });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const togglePublish = async (row: ClientSettings) => {
    setStatus(null);
    setError(null);
    try {
      await save({ data: { client_key: row.client_key, published: !row.published } });
      setStatus(`${row.client_key} ${row.published ? "despublicado" : "publicado"}.`);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Clientes do portfólio</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Cadastre cliente, slug e funil e publique a vitrine sem editar o catálogo manualmente. Metadados detalhados
            ficam em <Link to="/app/metadados" className="text-primary underline">Metadados</Link>; números de funil em{" "}
            <Link to="/app/funis/numeros" className="text-primary underline">Números dos funis</Link>.
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

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-lg border border-border p-4 md:grid-cols-4">
        {(
          [
            ["client_key", "clientKey", true],
            ["slug", "Slug", false],
            ["display_name", "Nome do cliente", false],
            ["funnel_recipient", "Número do funil (dígitos)", false],
          ] as const
        ).map(([key, label, required]) => (
          <label key={key} className="block text-sm">
            <span className="text-muted-foreground">{label}</span>
            <input
              value={form[key]}
              required={required}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
            />
          </label>
        ))}
        <div className="md:col-span-4">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Save className="h-4 w-4" aria-hidden="true" /> Salvar cliente
          </button>
        </div>
      </form>

      <section className="mt-8 overflow-x-auto">
        {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        <table className="mt-3 w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Cliente</th>
              <th className="py-2">Slug</th>
              <th className="py-2">Funil</th>
              <th className="py-2">Publicado</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.client_key} className="border-t border-border">
                <td className="py-2 font-medium">{r.display_name || r.client_key}</td>
                <td className="py-2">{r.slug}</td>
                <td className="py-2">
                  {r.funnel_configured ? r.funnel_recipient_masked : "sem número"}
                  {r.funnel_configured && !r.funnel_enabled ? " (desativado)" : ""}
                </td>
                <td className="py-2">{r.published ? "sim" : "não"}</td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => void togglePublish(r)}
                    className="inline-flex min-h-11 items-center gap-2 text-primary underline"
                  >
                    <Rocket className="h-4 w-4" aria-hidden="true" />
                    {r.published ? "Despublicar" : "Publicar"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-muted-foreground">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
