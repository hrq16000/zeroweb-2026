import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, BarChart3, RefreshCw, Search, FileText } from "lucide-react";
import { getSeoDashboard } from "@/lib/seo-dashboard.functions";
import {
  listBlogSeoOverrides,
  saveBlogSeoOverride,
  type BlogSeoOverride,
} from "@/lib/blog-seo.functions";
import { posts } from "@/lib/blog-data";

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

          <section className="mb-6 rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-1 text-sm font-semibold text-foreground">Palavras-chave monitoradas</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Posição, impressões e CTR reais do Search Console para os termos prioritários do portal.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.watched.map((w) => (
                <div key={w.keyword} className="rounded-lg bg-muted/30 p-3">
                  <p className="text-sm font-medium text-foreground">{w.keyword}</p>
                  {w.found ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Posição {w.position?.toFixed(1)} · {w.impressions} impressões · CTR {pct(w.ctr)} · {w.clicks} cliques
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">Sem dados no período — ainda não aparece nas buscas.</p>
                  )}
                  <span className="mt-2 inline-block rounded-full bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </section>


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
            <div className="space-y-6">
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

            <BlogSeoEditor />
            </div>
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

/**
 * Edição inline de title, description e schema JSON-LD por artigo do blog.
 * Grava em `blog_seo_overrides`; o conteúdo do post continua versionado.
 */
function BlogSeoEditor() {
  const list = useServerFn(listBlogSeoOverrides);
  const save = useServerFn(saveBlogSeoOverride);
  const queryClient = useQueryClient();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const { data: overrides = [], isLoading } = useQuery({
    queryKey: ["blog-seo-overrides"],
    queryFn: () => list(),
  });

  const bySlug = new Map(overrides.map((o) => [o.slug, o]));

  return (
    <Panel title="Ajustes de SEO por artigo (editável)">
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-4">Carregando ajustes…</p>
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((post) => {
            const override = bySlug.get(post.slug) ?? null;
            const open = openSlug === post.slug;
            return (
              <li key={post.slug} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{override?.title ?? post.title}</p>
                    <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {override && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        ajustado
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpenSlug(open ? null : post.slug)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted"
                    >
                      {open ? "Fechar" : "Editar"}
                    </button>
                  </div>
                </div>
                {open && (
                  <BlogSeoForm
                    slug={post.slug}
                    fallbackTitle={post.title}
                    fallbackDescription={post.excerpt}
                    override={override}
                    onSaved={() => {
                      void queryClient.invalidateQueries({ queryKey: ["blog-seo-overrides"] });
                      setOpenSlug(null);
                    }}
                    save={save}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function BlogSeoForm({
  slug,
  fallbackTitle,
  fallbackDescription,
  override,
  onSaved,
  save,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  override: BlogSeoOverride | null;
  onSaved: () => void;
  save: (opts: { data: { slug: string; title: string; description: string; schemaExtra: string } }) => Promise<unknown>;
}) {
  const [title, setTitle] = useState(override?.title ?? "");
  const [description, setDescription] = useState(override?.description ?? "");
  const [schemaExtra, setSchemaExtra] = useState(
    override?.schemaExtra ? JSON.stringify(override.schemaExtra, null, 2) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await save({ data: { slug, title, description, schemaExtra } });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 grid gap-3 rounded-xl border border-border bg-muted/30 p-3">
      <label className="grid gap-1 text-xs">
        <span className="font-medium">Title ({title.length}/120)</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={fallbackTitle}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="grid gap-1 text-xs">
        <span className="font-medium">Meta description ({description.length}/320)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={fallbackDescription}
          rows={3}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="grid gap-1 text-xs">
        <span className="font-medium">Schema JSON-LD adicional (opcional)</span>
        <textarea
          value={schemaExtra}
          onChange={(e) => setSchemaExtra(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "HowTo"\n}'}
          className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
        />
      </label>
      <p className="text-xs text-muted-foreground">
        Campos vazios voltam a usar o conteúdo versionado do artigo. Salvar tudo em branco remove o
        ajuste.
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={saving}
          className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar ajuste"}
        </button>
      </div>
    </form>
  );
}
