import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, RefreshCcw } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PainelGate } from "@/components/site/PainelGate";
import { fetchAnalyticsDiscards, DEFAULT_DISCARD_THRESHOLD, type DiscardSummary } from "@/lib/analytics-discards";

export const Route = createFileRoute("/painel-auditorias")({
  head: () => ({
    meta: [
      { title: "Painel · Auditorias por rota · 0WEB" },
      {
        name: "description",
        content:
          "Consulta, filtro e exportação das auditorias por rota: prévia social, ícones, indexabilidade e Lighthouse, com histórico por deploy.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <PainelGate>
      <AuditPanel />
    </PainelGate>
  ),
  ssr: false,
});

type LighthouseRun = {
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  lcp: number | null;
  cls: number | null;
};

type AuditRow = {
  route: string;
  slug: string | null;
  status?: number | null;
  canonical?: string | null;
  robots?: string | null;
  schemas?: string[];
  icons?: number;
  ogImage?: string | null;
  twitterImage?: string | null;
  lighthouse?: LighthouseRun;
  problems: string[];
};

type Snapshot = {
  generatedAt: string;
  commit: string | null;
  runUrl: string | null;
  base: string | null;
  totals: {
    routes: number;
    routesWithProblems: number;
    problems: number;
    lighthouseRuns: number;
    sitemapUrls: number | null;
  };
  rows: AuditRow[];
};

type HistoryEntry = {
  generatedAt: string;
  commit: string | null;
  runUrl: string | null;
  totals: Snapshot["totals"];
  lighthouseAverage: Omit<LighthouseRun, "lcp" | "cls"> | null;
};

const pct = (v?: number | null) => (typeof v === "number" ? `${Math.round(v * 100)}` : "—");

function toCsv(rows: AuditRow[]) {
  const head = [
    "rota", "slug", "http", "canonical", "robots", "schemas", "icones",
    "og_image", "twitter_image", "perf", "seo", "a11y", "best_practices", "problemas",
  ];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((r) =>
    [
      r.route, r.slug ?? "", r.status ?? "", r.canonical ?? "", r.robots ?? "",
      (r.schemas ?? []).join(" | "), r.icons ?? "", r.ogImage ?? "", r.twitterImage ?? "",
      pct(r.lighthouse?.performance), pct(r.lighthouse?.seo),
      pct(r.lighthouse?.accessibility), pct(r.lighthouse?.bestPractices),
      r.problems.join(" | "),
    ].map(escape).join(","),
  );
  return [head.join(","), ...body].join("\n");
}

function download(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type SocialRegenRun = {
  runAt: string;
  actor: string;
  scope: string[] | string;
  totals: { ok: number; failed: number; skipped: number };
};

function AuditPanel() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [query, setQuery] = useState("");
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [discards, setDiscards] = useState<DiscardSummary | null>(null);
  const [windowHours, setWindowHours] = useState(24);
  const [threshold, setThreshold] = useState(DEFAULT_DISCARD_THRESHOLD);
  const [socialRuns, setSocialRuns] = useState<SocialRegenRun[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const [snapRes, histRes, socialRes] = await Promise.all([
        fetch("/audit/latest.json", { cache: "no-store" }),
        fetch("/audit/history.json", { cache: "no-store" }),
        fetch("/audit/social-regen-history.json", { cache: "no-store" }),
      ]);
      if (!snapRes.ok) {
        setMissing(true);
        setSnapshot(null);
      } else {
        setMissing(false);
        setSnapshot((await snapRes.json()) as Snapshot);
      }
      setHistory(histRes.ok ? ((await histRes.json()) as HistoryEntry[]) : []);
      setSocialRuns(socialRes.ok ? ((await socialRes.json()) as SocialRegenRun[]) : []);
    } catch {
      setMissing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    void fetchAnalyticsDiscards(windowHours, threshold).then(setDiscards);
  }, [windowHours, threshold]);


  const rows = useMemo(() => {
    const all = snapshot?.rows ?? [];
    const q = query.trim().toLowerCase();
    return all.filter((r) => {
      if (onlyProblems && r.problems.length === 0) return false;
      if (!q) return true;
      return r.route.toLowerCase().includes(q) || (r.slug ?? "").toLowerCase().includes(q);
    });
  }, [snapshot, query, onlyProblems]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Auditorias por rota</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Prévia social, ícones do <code>&lt;head&gt;</code>, indexabilidade e Lighthouse consolidados pelo CI.
              {snapshot ? (
                <>
                  {" "}Última execução: {new Date(snapshot.generatedAt).toLocaleString("pt-BR")}
                  {snapshot.commit ? ` · commit ${snapshot.commit.slice(0, 7)}` : ""}
                </>
              ) : null}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs"
            >
              <RefreshCcw className="h-3 w-3" /> {loading ? "Carregando…" : "Atualizar"}
            </button>
            <button
              disabled={!rows.length}
              onClick={() => download(`auditoria-rotas-${Date.now()}.csv`, toCsv(rows), "text/csv")}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              <Download className="h-3 w-3" /> CSV
            </button>
            <button
              disabled={!snapshot}
              onClick={() => download(`auditoria-${Date.now()}.json`, JSON.stringify(snapshot, null, 2), "application/json")}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs disabled:opacity-40"
            >
              <Download className="h-3 w-3" /> JSON
            </button>
          </div>
        </header>

        {missing && (
          <p className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Nenhum relatório publicado ainda. Rode <code>bun run audit:report</code> (ou aguarde o próximo deploy) para
            gerar <code>public/audit/latest.json</code>.
          </p>
        )}

        {snapshot && (
          <>
            <section className="mt-6 grid gap-3 sm:grid-cols-4">
              <Stat label="Rotas" value={String(snapshot.totals.routes)} />
              <Stat label="Com problemas" value={String(snapshot.totals.routesWithProblems)} />
              <Stat label="URLs no sitemap" value={String(snapshot.totals.sitemapUrls ?? "—")} />
              <Stat label="Execuções Lighthouse" value={String(snapshot.totals.lighthouseRuns)} />
            </section>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar por rota ou slug…"
                className="w-64 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} />
                Só rotas com problemas
              </label>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-2 py-2">Rota</th>
                    <th className="px-2 py-2">HTTP</th>
                    <th className="px-2 py-2 text-right">Perf</th>
                    <th className="px-2 py-2 text-right">SEO</th>
                    <th className="px-2 py-2 text-right">A11y</th>
                    <th className="px-2 py-2 text-right">BP</th>
                    <th className="px-2 py-2">Problemas</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-muted-foreground">
                        Nenhuma rota para os filtros atuais.
                      </td>
                    </tr>
                  )}
                  {rows.map((row) => (
                    <tr key={row.route} className="border-t border-border align-top">
                      <td className="px-2 py-2 font-mono text-xs">{row.route}</td>
                      <td className="px-2 py-2">{row.status ?? "—"}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{pct(row.lighthouse?.performance)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{pct(row.lighthouse?.seo)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{pct(row.lighthouse?.accessibility)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{pct(row.lighthouse?.bestPractices)}</td>
                      <td className="px-2 py-2">
                        {row.problems.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> ok
                          </span>
                        ) : (
                          <span className="inline-flex items-start gap-1 text-amber-600">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span className="text-xs">{row.problems.join("; ")}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Eventos de analytics descartados</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <label className="flex items-center gap-1">
                Janela
                <select
                  value={windowHours}
                  onChange={(e) => setWindowHours(Number(e.target.value))}
                  className="rounded-lg border border-border bg-background px-2 py-1"
                >
                  <option value={1}>1 h</option>
                  <option value={6}>6 h</option>
                  <option value={24}>24 h</option>
                  <option value={72}>72 h</option>
                  <option value={168}>7 dias</option>
                </select>
              </label>
              <label className="flex items-center gap-1">
                Alerta ≥
                <input
                  type="number"
                  min={1}
                  value={threshold}
                  onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
                  className="w-16 rounded-lg border border-border bg-background px-2 py-1"
                />
              </label>
            </div>
          </div>

          {discards === null ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Sem leitura disponível (é necessário estar autenticado como administrador).
            </p>
          ) : discards.rows.length === 0 ? (
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Nenhum evento descartado nas últimas {discards.windowHours} h.
            </p>
          ) : (
            <>
              {discards.alert && (
                <p className="mt-3 inline-flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Alerta: {discards.total} descarte(s) em {discards.windowHours} h (limiar {discards.threshold}).
                  Verifique os nomes de evento emitidos pelas rotas abaixo.
                </p>
              )}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-2 py-2">Rota</th>
                      <th className="px-2 py-2">event_name inválido</th>
                      <th className="px-2 py-2">Motivo</th>
                      <th className="px-2 py-2 text-right">Descartes</th>
                      <th className="px-2 py-2">Último</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discards.rows.map((row) => (
                      <tr key={`${row.path}|${row.originalEventName}|${row.reason}`} className="border-t border-border">
                        <td className="px-2 py-2 font-mono text-xs">{row.path}</td>
                        <td className="px-2 py-2 font-mono text-xs">{row.originalEventName}</td>
                        <td className="px-2 py-2 text-xs">{row.reason}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{row.count}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs">
                          {new Date(row.lastSeen).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Regeneração de imagens sociais</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Execute <code>bun run social:regen</code> (ou <code>bun run social:regen -- rm-fretes</code>) para regerar
            <code> og:image</code>, <code>twitter:image</code> e <code>apple-touch-icon</code> com ImageMagick. Cada
            execução fica registrada abaixo.
          </p>
          {socialRuns.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nenhuma execução registrada ainda.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-2 py-2">Quando</th>
                    <th className="px-2 py-2">Executor</th>
                    <th className="px-2 py-2">Escopo</th>
                    <th className="px-2 py-2 text-right">OK</th>
                    <th className="px-2 py-2 text-right">Falhas</th>
                    <th className="px-2 py-2 text-right">Pulados</th>
                  </tr>
                </thead>
                <tbody>
                  {socialRuns.map((run) => (
                    <tr key={run.runAt} className="border-t border-border">
                      <td className="px-2 py-2 whitespace-nowrap">{new Date(run.runAt).toLocaleString("pt-BR")}</td>
                      <td className="px-2 py-2">{run.actor}</td>
                      <td className="px-2 py-2 text-xs">
                        {Array.isArray(run.scope) ? run.scope.join(", ") : "todos"}
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">{run.totals.ok}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{run.totals.failed}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{run.totals.skipped}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Histórico por deploy</h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Sem histórico publicado ainda.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-2 py-2">Quando</th>
                    <th className="px-2 py-2">Commit</th>
                    <th className="px-2 py-2 text-right">Rotas</th>
                    <th className="px-2 py-2 text-right">Problemas</th>
                    <th className="px-2 py-2 text-right">Perf média</th>
                    <th className="px-2 py-2 text-right">SEO médio</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={`${h.generatedAt}`} className="border-t border-border">
                      <td className="px-2 py-2 whitespace-nowrap">{new Date(h.generatedAt).toLocaleString("pt-BR")}</td>
                      <td className="px-2 py-2 font-mono text-xs">
                        {h.runUrl ? (
                          <a className="hover:underline" href={h.runUrl} target="_blank" rel="noreferrer">
                            {h.commit?.slice(0, 7) ?? "run"}
                          </a>
                        ) : (
                          h.commit?.slice(0, 7) ?? "—"
                        )}
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">{h.totals.routes}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{h.totals.routesWithProblems}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{pct(h.lighthouseAverage?.performance)}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{pct(h.lighthouseAverage?.seo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
