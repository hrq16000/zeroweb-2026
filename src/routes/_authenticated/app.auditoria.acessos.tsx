import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listSensitiveAuditTrail, type SensitiveAuditRow } from "@/lib/sensitive-audit.functions";

export const Route = createFileRoute("/_authenticated/app/auditoria/acessos")({
  head: () => ({
    meta: [
      { title: "Trilha de acessos sensíveis · 0WEB" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SensitiveAccessAudit,
});

function labelFor(row: SensitiveAuditRow) {
  if (row.entity === "lead_submissions") return "Leads";
  return "Catálogo de serviços";
}

function SensitiveAccessAudit() {
  const load = useServerFn(listSensitiveAuditTrail);
  const [rows, setRows] = useState<SensitiveAuditRow[]>([]);
  const [entity, setEntity] = useState<"" | "lead_submissions" | "service_catalog">("");
  const [action, setAction] = useState<"" | "sensitive.read" | "sensitive.write">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    void load({ data: { entity: entity || undefined, action: action || undefined, limit: 200 } })
      .then((result) => {
        setRows(result.rows);
        setError(null);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [action, entity, load, refresh]);

  const stats = useMemo(
    () => ({
      reads: rows.filter((row) => row.action === "sensitive.read").length,
      writes: rows.filter((row) => row.action === "sensitive.write").length,
    }),
    [rows],
  );

  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" /> Governança de dados
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Trilha de acessos sensíveis</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Registra ações administrativas sobre leads e o catálogo. O histórico guarda contexto
            técnico, nunca o conteúdo sensível acessado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefresh((value) => value + 1)}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="size-4" /> Atualizar
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Eventos exibidos</p>
          <p className="mt-1 text-2xl font-bold">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Leituras</p>
          <p className="mt-1 text-2xl font-bold">{stats.reads}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Escritas</p>
          <p className="mt-1 text-2xl font-bold">{stats.writes}</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-3 rounded-xl border border-border p-4">
        <label className="grid gap-1 text-xs">
          <span className="text-muted-foreground">Dado</span>
          <select
            value={entity}
            onChange={(event) => setEntity(event.target.value as typeof entity)}
            className="min-h-11 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            <option value="lead_submissions">Leads</option>
            <option value="service_catalog">Catálogo</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs">
          <span className="text-muted-foreground">Ação</span>
          <select
            value={action}
            onChange={(event) => setAction(event.target.value as typeof action)}
            className="min-h-11 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todas</option>
            <option value="sensitive.read">Leitura</option>
            <option value="sensitive.write">Escrita</option>
          </select>
        </label>
      </section>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <section className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3">Quando</th>
              <th className="p-3">Ação</th>
              <th className="p-3">Dado</th>
              <th className="p-3">Responsável</th>
              <th className="p-3">Contexto</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Carregando trilha…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Nenhum acesso registrado para estes filtros.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border align-top">
                <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">
                  {new Date(row.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="p-3">
                  <span
                    className={
                      row.action === "sensitive.write"
                        ? "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                        : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground"
                    }
                  >
                    {row.action === "sensitive.write" ? "Escrita" : "Leitura"}
                  </span>
                </td>
                <td className="p-3 font-medium">{labelFor(row)}</td>
                <td className="p-3 font-mono text-xs">
                  {row.actor_id ? row.actor_id.slice(0, 12) + "…" : "Sistema"}
                </td>
                <td className="max-w-md p-3 text-xs text-muted-foreground">
                  <code>{JSON.stringify(row.meta ?? {})}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="size-3.5" /> Retenção, exportação e alertas entram no próximo ciclo de
        governança.
      </p>
    </main>
  );
}
