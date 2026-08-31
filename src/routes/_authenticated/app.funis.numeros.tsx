import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, RefreshCw, Save } from "lucide-react";
import {
  listClientSettings,
  upsertClientSettings,
  listClientSettingsHistory,
  type ClientSettings,
  type SettingsHistoryRow,
} from "@/lib/portfolio-client-settings.functions";

export const Route = createFileRoute("/_authenticated/app/funis/numeros")({
  head: () => ({
    meta: [
      { title: "Números dos funis · 0WEB Painel" },
      { name: "description", content: "Destinatário real de cada funil de cliente, com histórico e alertas." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: FunnelNumbersPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

function FunnelNumbersPage() {
  const load = useServerFn(listClientSettings);
  const save = useServerFn(upsertClientSettings);
  const loadHistory = useServerFn(listClientSettingsHistory);

  const [rows, setRows] = useState<ClientSettings[]>([]);
  const [history, setHistory] = useState<SettingsHistoryRow[]>([]);
  const [clientKey, setClientKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, hist] = await Promise.all([load(), loadHistory({ data: { limit: 80 } })]);
      setRows(list.rows);
      setHistory(hist.rows.filter((h) => h.field === "funnel_recipient" || h.field === "funnel_enabled"));
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
      await save({
        data: {
          client_key: clientKey.trim(),
          funnel_recipient: recipient.replace(/\D/g, ""),
          funnel_enabled: enabled,
        },
      });
      setStatus(`Funil de ${clientKey} atualizado. O número fica apenas no servidor.`);
      setRecipient("");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const unavailable = rows.filter((r) => !r.funnel_configured || !r.funnel_enabled);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Números dos funis</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Cada cliente tem um destinatário próprio. O número é gravado no servidor e nunca aparece no bundle público
            nem no histórico — apenas os quatro últimos dígitos são exibidos.
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

      {unavailable.length > 0 && (
        <section className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" /> Funis indisponíveis
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {unavailable.map((r) => (
              <li key={r.client_key}>
                {r.client_key} · {!r.funnel_configured ? "sem destinatário configurado" : "funil desativado"}
              </li>
            ))}
          </ul>
        </section>
      )}

      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-lg border border-border p-4 md:grid-cols-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">clientKey</span>
          <input
            value={clientKey}
            onChange={(e) => setClientKey(e.target.value)}
            required
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Número do funil (somente dígitos, com DDI/DDD)</span>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            inputMode="numeric"
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          />
        </label>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4" />
          Funil ativo
        </label>
        <div className="md:col-span-3">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Save className="h-4 w-4" aria-hidden="true" /> Salvar funil
          </button>
        </div>
      </form>

      <section className="mt-8 overflow-x-auto">
        <h2 className="text-sm font-semibold">Funis por cliente</h2>
        {loading && <p className="mt-2 text-sm text-muted-foreground">Carregando…</p>}
        <table className="mt-3 w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Cliente</th>
              <th className="py-2">Destinatário</th>
              <th className="py-2">Status</th>
              <th className="py-2">Atualizado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.client_key} className="border-t border-border">
                <td className="py-2 font-medium">{r.client_key}</td>
                <td className="py-2">{r.funnel_recipient_masked || "—"}</td>
                <td className="py-2">
                  {r.funnel_configured && r.funnel_enabled ? "ativo" : !r.funnel_configured ? "sem número" : "desativado"}
                </td>
                <td className="py-2">{new Date(r.updated_at).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-muted-foreground">
                  Nenhum funil configurado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Histórico</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {history.map((h) => (
            <li key={h.id}>
              {new Date(h.created_at).toLocaleString("pt-BR")} · {h.client_key} · {h.field}: {h.old_value || "—"} →{" "}
              {h.new_value || "—"}
            </li>
          ))}
          {history.length === 0 && <li>Sem alterações registradas.</li>}
        </ul>
      </section>
    </div>
  );
}
