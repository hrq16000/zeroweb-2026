import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw } from "lucide-react";
import {
  listPendingDestinations,
  type PendingDestinationRow,
} from "@/lib/portfolio-pending-destinations.functions";

export const Route = createFileRoute("/_authenticated/app/funis/sem-destino")({
  head: () => ({
    meta: [
      { title: "Marcas sem destino · 0WEB Painel" },
      {
        name: "description",
        content: "Fila de marcas do portfólio que ainda não têm WhatsApp próprio comprovado.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PendingDestinationsPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const STATUS_LABEL: Record<PendingDestinationRow["request_status"], string> = {
  SEM_SUGESTAO: "Sem sugestão",
  SUGESTAO_PENDENTE: "Sugestão aguardando revisão",
  SUGESTAO_RECUSADA: "Sugestão recusada",
};

function PendingDestinationsPage() {
  const load = useServerFn(listPendingDestinations);
  const [rows, setRows] = useState<PendingDestinationRow[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await load();
      setRows(result.rows);
      setCities(result.cities);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return rows.filter((r) => {
      if (city && r.city !== city) return false;
      if (status && r.request_status !== status) return false;
      if (needle && !`${r.title} ${r.client_key} ${r.slug}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [rows, city, status, term]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Marcas sem destino</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Marcas cujo funil ainda não tem número próprio comprovado. Use esta fila para acompanhar as solicitações;
            a gravação continua sendo feita pelo fluxo de confirmação em <strong>Números dos funis</strong>.
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

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">Buscar</span>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Nome ou slug"
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Cidade</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          >
            <option value="">Todas</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Status da solicitação</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          >
            <option value="">Todos</option>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {loading ? "Carregando…" : `${filtered.length} marca(s) de ${rows.length} sem destino gravado.`}
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Marca</th>
              <th className="py-2">Cidade</th>
              <th className="py-2">Publicada</th>
              <th className="py-2">Solicitação</th>
              <th className="py-2">Última atividade</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.client_key} className="border-t border-border align-top">
                <td className="py-2">
                  <span className="font-medium">{r.title}</span>
                  <span className="block text-xs text-muted-foreground">{r.client_key}</span>
                </td>
                <td className="py-2">{r.city ? `${r.city}${r.state ? `/${r.state}` : ""}` : "—"}</td>
                <td className="py-2">{r.published ? "Sim" : "Não"}</td>
                <td className="py-2">
                  {STATUS_LABEL[r.request_status]}
                  {r.proposals_pending > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">({r.proposals_pending})</span>
                  )}
                </td>
                <td className="py-2">
                  {r.last_activity_at ? new Date(r.last_activity_at).toLocaleString("pt-BR") : "—"}
                </td>
                <td className="py-2">
                  <Link to="/app/funis/numeros" className="min-h-11 text-primary underline">
                    Revisar
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-muted-foreground">
                  Nenhuma marca nesse filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
