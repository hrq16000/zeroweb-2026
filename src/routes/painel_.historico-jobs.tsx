import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCcw, X } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import { fetchOpsJobRuns, type OpsJobRun } from "@/lib/ops-jobs";

export const Route = createFileRoute("/painel_/historico-jobs")({
  head: () => ({
    meta: [
      { title: "Painel · Histórico de execuções de rotinas · 0WEB" },
      {
        name: "description",
        content:
          "Histórico das rotinas agendadas (imagens sociais, telemetria) com status, duração e metadados de cada execução.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <JobsHistory />
    </PainelGate>
  ),
  ssr: false,
});

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: string }) {
  const ok = status === "ok";
  const running = status === "running";
  const cls = ok
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
    : running
      ? "border-border bg-muted text-muted-foreground"
      : "border-destructive/40 bg-destructive/10 text-destructive";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {ok ? "Sucesso" : running ? "Em execução" : "Falha"}
    </span>
  );
}

function JobsHistory() {
  const [runs, setRuns] = useState<OpsJobRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ok" | "failed">("all");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<OpsJobRun | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setRuns(await fetchOpsJobRuns(200));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      runs.filter((r) =>
        filter === "all" ? true : filter === "ok" ? r.status === "ok" : r.status !== "ok",
      ),
    [runs, filter],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <Link to="/painel-auditorias" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar às auditorias
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold">Histórico de execuções</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rotinas agendadas registradas no backend: imagens sociais, telemetria descartada e demais jobs.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            Status
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as typeof filter);
                setPage(1);
              }}
              className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
            >
              <option value="all">Todos</option>
              <option value="ok">Sucesso</option>
              <option value="failed">Falha</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            <RefreshCcw className="h-4 w-4" /> Atualizar
          </button>
          <span className="text-xs text-muted-foreground">{filtered.length} execução(ões)</span>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Carregando execuções…</p>
        ) : rows.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nenhuma execução encontrada (é necessário estar autenticado como administrador).
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2">Data/Hora</th>
                  <th className="px-3 py-2">Rotina</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Duração</th>
                  <th className="px-3 py-2 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="whitespace-nowrap px-3 py-2">
                      {new Date(r.started_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{r.job}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {r.duration_ms != null ? `${r.duration_ms} ms` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setDetail(r)}
                        className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <button
              type="button"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
              className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-muted-foreground">
              Página {current} de {pages}
            </span>
            <button
              type="button"
              disabled={current >= pages}
              onClick={() => setPage(current + 1)}
              className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </main>

      {detail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Detalhes da execução"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border bg-background p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold">{detail.job}</h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(detail.started_at).toLocaleString("pt-BR")} ·{" "}
                  {detail.duration_ms != null ? `${detail.duration_ms} ms` : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                aria-label="Fechar detalhes"
                className="rounded-lg border border-border p-1 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {detail.error && (
              <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {detail.error}
              </p>
            )}
            <pre className="mt-3 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(detail.metadata ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
