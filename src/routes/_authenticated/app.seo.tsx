import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, BarChart3, RefreshCw, Search, FileText } from "lucide-react";
import { getSeoDashboard } from "@/lib/seo-dashboard.functions";

export const Route = createFileRoute("/_authenticated/app/seo")({
  component: SeoDashboard,
});

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

function SeoDashboard() {
  const fetchDashboard = useServerFn(getSeoDashboard);
  const [threshold, setThreshold] = useState(20);
  const [tab, setTab] = useState<"search" | "conteudo">("search");

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["seo-dashboard", threshold],
    queryFn: () => fetchDashboard({ data: { alertThresholdPct: threshold } }),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Painel SEO
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dados do Search Console gerados por <code>bun run gsc:export</code> e auditoria dos
            metadados do cluster de conteúdo.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted inline-flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </header>

      {isLoading && <p className="text-muted-foreground">Carregando…</p>}

      {data && (
        <>
          {data.status === "pending" && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 mb-6 text-sm">
              <p className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Snapshot do Search Console ainda não gerado
              </p>
              <p className="mt-1 text-muted-foreground">
                Rode <code>bun run gsc:export</code> (ou a rotina diária de CI) com as credenciais
                do conector para preencher <code>seo-reports/gsc-latest.json</code>. Até lá, nenhum
                número é exibido — o painel não estima dados.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            <span className="text-muted-foreground">
              Propriedade: <strong>{data.siteUrl}</strong>
            </span>
            {data.refreshedAt && (
              <span className="text-muted-foreground">
                Atualizado: {new Date(data.refreshedAt).toLocaleString("pt-BR")}
              </span>
            )}
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Alerta de queda acima de
              <input
                type="number"
                min={5}
                max={90}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm"
              />
              %
            </label>
          </div>

          {data.totals && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <Stat label="Cliques" value={String(data.totals.clicks)} />
              <Stat label="Impressões" value={String(data.totals.impressions)} />
              <Stat label="CTR" value={pct(data.totals.ctr)} />
              <Stat label="Posição média" value={data.totals.position.toFixed(1)} />
            </div>
          )}

          {data.alerts.length > 0 && (
            <section className="mb-6 space-y-2">
              {data.alerts.map((a, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 text-sm ${
                    a.level === "critical"
                      ? "border-destructive/40 bg-destructive/10"
                      : "border-amber-500/40 bg-amber-500/10"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  {a.message}
                </div>
              ))}
            </section>
          )}

          <div className="flex gap-2 mb-4">
            <TabButton active={tab === "search"} onClick={() => setTab("search")} icon={<Search className="w-4 h-4" />}>
              Search Console
            </TabButton>
            <TabButton active={tab === "conteudo"} onClick={() => setTab("conteudo")} icon={<FileText className="w-4 h-4" />}>
              Conteúdo do cluster
            </TabButton>
          </div>

          {tab === "search" ? (
            <div className="space-y-6">
              <Panel title="Priorização automática de otimizações">
                {data.priorities.length === 0 ? (
                  <Empty />
                ) : (
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="text-left py-2">Consulta</th>
                        <th className="text-right">Impr.</th>
                        <th className="text-right">CTR</th>
                        <th className="text-right">Pos.</th>
                        <th className="text-left pl-4">Ação sugerida</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.priorities.map((p) => (
                        <tr key={p.query} className="border-t border-border">
                          <td className="py-2 font-medium">{p.query}</td>
                          <td className="text-right tabular-nums">{p.impressions}</td>
                          <td className="text-right tabular-nums">{pct(p.ctr)}</td>
                          <td className="text-right tabular-nums">{p.position.toFixed(1)}</td>
                          <td className="pl-4 text-muted-foreground">{p.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Panel>

              <Panel title="Consultas">
                <RowsTable rows={data.queries} label="Consulta" />
              </Panel>

              <Panel title="Páginas">
                <RowsTable rows={data.pages} label="URL" />
              </Panel>
            </div>
          ) : (
            <Panel title="Metadados e schema por post">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Post</th>
                    <th className="text-left">Schema</th>
                    <th className="text-left">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((c) => (
                    <tr key={c.slug} className="border-t border-border align-top">
                      <td className="py-3 pr-4">
                        <a href={c.path} className="font-medium text-primary hover:underline">
                          {c.title}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xl">{c.description}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {c.schemas.map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {c.issues.length === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Sem apontamentos</span>
                        ) : (
                          <ul className="list-disc pl-4 space-y-1">
                            {c.issues.map((i) => (
                              <li key={i}>{i}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

function RowsTable({ rows, label }: { rows: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[]; label: string }) {
  if (rows.length === 0) return <Empty />;
  return (
    <table className="w-full text-sm">
      <thead className="text-xs uppercase text-muted-foreground">
        <tr>
          <th className="text-left py-2">{label}</th>
          <th className="text-right">Cliques</th>
          <th className="text-right">Impr.</th>
          <th className="text-right">CTR</th>
          <th className="text-right">Pos.</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.keys[0]} className="border-t border-border">
            <td className="py-2 break-all">{r.keys[0]}</td>
            <td className="text-right tabular-nums">{r.clicks}</td>
            <td className="text-right tabular-nums">{r.impressions}</td>
            <td className="text-right tabular-nums">{pct(r.ctr)}</td>
            <td className="text-right tabular-nums">{r.position.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Empty() {
  return <p className="text-sm text-muted-foreground py-6">Sem dados no snapshot atual.</p>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 overflow-x-auto">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-3 py-2 rounded-lg border inline-flex items-center gap-2 ${
        active ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border hover:bg-muted"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
