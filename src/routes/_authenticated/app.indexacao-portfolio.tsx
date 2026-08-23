import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { listIndexWatch, syncIndexWatch, setIndexWatchState } from "@/lib/index-watch.functions";

export const Route = createFileRoute("/_authenticated/app/indexacao-portfolio")({
  head: () => ({
    meta: [
      { title: "Monitor de indexação do portfólio · 0WEB" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: IndexWatchPanel,
});

type Row = {
  url: string;
  sitemap: string | null;
  indexed: boolean;
  coverage_state: string | null;
  first_seen_at: string;
  days_pending: number;
  alert: boolean;
};

function IndexWatchPanel() {
  const list = useServerFn(listIndexWatch);
  const sync = useServerFn(syncIndexWatch);
  const setState = useServerFn(setIndexWatchState);
  const qc = useQueryClient();
  const [alertAfterDays, setAlertAfterDays] = useState(14);

  const { data, isLoading } = useQuery({
    queryKey: ["index-watch", alertAfterDays],
    queryFn: () => list({ data: { section: "portfolio", alertAfterDays } }),
  });

  const syncMut = useMutation({
    mutationFn: () => sync({ data: { section: "portfolio" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["index-watch"] }),
  });

  const toggleMut = useMutation({
    mutationFn: (row: Row) =>
      setState({
        data: {
          url: row.url,
          indexed: !row.indexed,
          coverageState: !row.indexed ? "Indexada (verificação manual/GSC)" : "Aguardando indexação",
        },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["index-watch"] }),
  });

  const rows = (data?.rows ?? []) as Row[];

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Indexação do portfólio</h1>
          <p className="text-sm text-muted-foreground">
            Compara as URLs do sitemap com o estado de indexação e alerta as pendentes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">
            Alertar após
            <input
              type="number"
              min={1}
              max={180}
              value={alertAfterDays}
              onChange={(e) => setAlertAfterDays(Number(e.target.value) || 14)}
              className="mx-2 w-16 rounded-md border border-border bg-background px-2 py-1 text-foreground"
            />
            dias
          </label>
          <button
            type="button"
            onClick={() => syncMut.mutate()}
            disabled={syncMut.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncMut.isPending ? "animate-spin" : ""}`} />
            Sincronizar sitemap
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="URLs no sitemap" value={data?.total ?? 0} />
        <Stat label="Indexadas" value={data?.indexed ?? 0} />
        <Stat label="Alertas (não indexadas)" value={data?.alerts ?? 0} tone="warn" />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">URL</th>
              <th className="p-3">Dias no sitemap</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={4}>
                  Carregando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={4}>
                  Nenhuma URL monitorada ainda. Clique em “Sincronizar sitemap”.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.url} className="border-t border-border/60">
                  <td className="p-3 break-all">{r.url}</td>
                  <td className="p-3">{r.days_pending}</td>
                  <td className="p-3">
                    {r.indexed ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Indexada
                      </span>
                    ) : r.alert ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-4 h-4" /> Pendente há {r.days_pending} dias
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Aguardando</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleMut.mutate(r)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      {r.indexed ? "Marcar como pendente" : "Marcar como indexada"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone === "warn" ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
