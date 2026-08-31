import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { listAccessAudit } from "@/lib/access-audit.functions";

export const Route = createFileRoute("/_authenticated/app/auditoria/acessos")({
  head: () => ({
    meta: [
      { title: "Trilha de acessos · 0WEB Painel" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccessAuditPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type Row = {
  id: string;
  created_at: string;
  action: string;
  entity: string;
  entity_id: string | null;
  kind: "read" | "write";
  actor: string;
  meta: string;
};

const ENTITY_LABEL: Record<string, string> = {
  lead_submissions: "Leads",
  service_catalog: "Catálogo de serviços",
};

function AccessAuditPage() {
  const fetchRows = useServerFn(listAccessAudit);
  const [rows, setRows] = useState<Row[]>([]);
  const [entity, setEntity] = useState<"all" | "lead_submissions" | "service_catalog">("all");
  const [kind, setKind] = useState<"all" | "read" | "write">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRows({ data: { entity, kind, limit: 200 } });
      setRows(res.rows as Row[]);
    } catch (e) {
      setError((e as Error).message || "Falha ao carregar a trilha de acessos.");
    } finally {
      setLoading(false);
    }
  }, [fetchRows, entity, kind]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <header className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
          <h1 className="text-xl font-bold">Trilha de acessos</h1>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 min-h-11 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Atualizar
        </button>
      </header>

      <p className="text-sm text-muted-foreground max-w-2xl">
        Registro de leituras e escritas em dados sensíveis. Por política de privacidade, o contexto
        técnico não contém nomes, e-mails, telefones, notas ou mensagens.
      </p>

      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="block mb-1 text-muted-foreground">Recurso</span>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value as typeof entity)}
            className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Todos</option>
            <option value="lead_submissions">Leads</option>
            <option value="service_catalog">Catálogo de serviços</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="block mb-1 text-muted-foreground">Tipo de ação</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
            className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Todas</option>
            <option value="read">Leitura</option>
            <option value="write">Escrita</option>
          </select>
        </label>
      </div>

      {loading && (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Carregando trilha de acessos…
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive"
        >
          {error}
          <button type="button" onClick={() => void load()} className="ml-3 underline min-h-11">
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Nenhum registro de acesso para os filtros selecionados.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <caption className="sr-only">Registros de leitura e escrita em dados sensíveis</caption>
            <thead className="bg-muted/50 text-left">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Data/hora
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Tipo
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Recurso
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Ação
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Responsável
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Contexto técnico
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.kind === "write"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r.kind === "write" ? "Escrita" : "Leitura"}
                    </span>
                  </td>
                  <td className="px-3 py-2">{ENTITY_LABEL[r.entity] ?? r.entity}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.action}</td>
                  <td className="px-3 py-2">{r.actor}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground break-all max-w-md">
                    {r.meta}
                    {r.entity_id ? ` · id:${r.entity_id.slice(0, 8)}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
