import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Download, RefreshCcw, Search } from "lucide-react";
import {
  importPortfolioAdminProjects,
  listPortfolioAdminProjects,
} from "@/lib/portfolio-admin.functions";
import type { MergedProject } from "@/lib/portfolio-admin";
import { PortfolioFunnelPanel } from "@/components/admin/PortfolioFunnelPanel";

import {
  getVisualQuality,
  VISUAL_BADGE_STYLE,
  visualQuality,
} from "@/lib/portfolio-visual-quality";
import {
  EXPERIENCE_BADGE_STYLE,
  EXPERIENCE_LABEL,
  getExperienceLevel,
} from "@/lib/portfolio-experience";

export const Route = createFileRoute("/_authenticated/app/portfolio/")({
  component: PortfolioAdminList,
});

type Row = MergedProject & { driftFromSeed: string[] };

const STATUS_STYLE: Record<string, string> = {
  COMPLETE: "bg-primary/10 text-primary",
  PARTIAL: "bg-muted text-foreground",
  LEGACY: "bg-destructive/10 text-destructive",
};


function PortfolioAdminList() {
  const load = useServerFn(listPortfolioAdminProjects);
  const runImport = useServerFn(importPortfolioAdminProjects);

  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Record<string, number> | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [visual, setVisual] = useState("all");
  const [cover, setCover] = useState("all");
  const [experience, setExperience] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load();
      setRows(res.projects as Row[]);
      setSummary(res.summary as unknown as Record<string, number>);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar projetos");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (status !== "all" && r.conformance.status !== status) return false;
        if (visual !== "all") {
          const vq = getVisualQuality(r.slug);
          if (visual === "P0P1") {
            if (!vq || vq.severities.P0 + vq.severities.P1 === 0) return false;
          } else if ((vq?.visual ?? "NEEDS_UPGRADE") !== visual) return false;
        }
        if (cover !== "all") {
          const vq = getVisualQuality(r.slug);
          if ((vq?.coverReview ?? "UNREVIEWED") !== cover) return false;
        }
        if (experience !== "all" && getExperienceLevel(r.slug) !== experience) return false;
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          r.slug.includes(q) ||
          r.displayName.toLowerCase().includes(q) ||
          r.segment.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
        );
      }),
    [rows, query, status, visual, cover, experience],
  );

  const onImport = async () => {
    setMessage(null);
    setError(null);
    try {
      const res = await runImport();
      setMessage(
        `Importação concluída: ${res.created.length} novo(s), ${res.skipped.length} já existente(s), ${res.drift.length} com divergência em relação aos registries.`,
      );
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao importar");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Projetos do portfólio</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Administração dos {rows.length || 68} projetos de <code>/portfolio/:slug</code>. Estrutura
            (slug, componente, rota) vem dos registries versionados; conteúdo, SEO, assets e publicação
            são editáveis aqui. Contatos de clientes continuam apenas no funil, no servidor.
          </p>
        </div>
        <Link
          to="/app/portfolio/novo"
          search={{ slug: undefined }}
          className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Novo projeto
        </Link>
      </div>


      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            aria-label="Buscar projeto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, slug, cidade…"
            className="min-h-11 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <select
          aria-label="Filtrar por conformidade"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todas as conformidades</option>
          <option value="COMPLETE">COMPLETE</option>
          <option value="PARTIAL">PARTIAL</option>
          <option value="LEGACY">LEGACY</option>
        </select>
        <select
          aria-label="Filtrar por qualidade visual"
          value={visual}
          onChange={(e) => setVisual(e.target.value)}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todas as qualidades</option>
          <option value="PREMIUM">PREMIUM</option>
          <option value="STANDARD">STANDARD</option>
          <option value="NEEDS_UPGRADE">NEEDS_UPGRADE</option>
          <option value="P0P1">Com issue P0/P1</option>
        </select>
        <select
          aria-label="Filtrar por revisão de capa"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todas as capas</option>
          <option value="APPROVED">Capa aprovada</option>
          <option value="NEEDS_REVIEW">Capa em revisão</option>
          <option value="UNREVIEWED">Capa não revisada</option>
          <option value="REJECTED">Capa rejeitada</option>
        </select>
        <select
          aria-label="Filtrar por experiência"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todas as experiências</option>
          <option value="PREMIUM">IMMERSIVE</option>
          <option value="SIGNATURE">SIGNATURE</option>
          <option value="BASELINE">BASIC</option>
          <option value="STATIC">STATIC</option>
        </select>
        <button
          type="button"
          onClick={() => void fetchData()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
        <button
          type="button"
          onClick={() => void onImport()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Importar registries
        </button>
        <Link
          to="/app/portfolio/originalidade"
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          Originalidade
        </Link>
      </div>

      {summary && (
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["Projetos", summary.total],
            ["COMPLETE", summary.complete],
            ["PARTIAL", summary.partial],
            ["LEGACY", summary.legacy],
            ["Importados", summary.imported],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <section aria-labelledby="vq-title" className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="vq-title" className="font-display text-lg font-semibold">
            Qualidade visual
          </h2>
          <p className="text-xs text-muted-foreground">
            Camada separada da conformidade técnica · score médio {visualQuality.summary.averageScore} ·
            auditoria de {new Date(visualQuality.generatedAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["PREMIUM", visualQuality.summary.visual.PREMIUM],
            ["STANDARD", visualQuality.summary.visual.STANDARD],
            ["NEEDS_UPGRADE", visualQuality.summary.visual.NEEDS_UPGRADE],
            ["Issues P0+P1", visualQuality.summary.issues.P0 + visualQuality.summary.issues.P1],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-border p-3">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          COMPLETE + NEEDS_UPGRADE é um estado válido: tecnicamente correto, visualmente abaixo do
          padrão. Só issues P0 bloqueiam o gate.
        </p>
      </section>

      <PortfolioFunnelPanel title="Desempenho por projeto" />


      {message && (
        <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{message}</p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-6 text-sm text-muted-foreground">Carregando projetos…</p>}

      <div className="mt-6 space-y-2">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            to="/app/portfolio/$slug"
            params={{ slug: p.slug }}
            className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-medium">{p.displayName}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  /portfolio/{p.slug} · {p.segment || "sem segmento"} · {p.city || "sem cidade"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {p.driftFromSeed.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px]">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {p.driftFromSeed.length} campo(s) editado(s)
                  </span>
                )}
                <span className={`rounded px-2 py-1 text-[11px] font-semibold ${STATUS_STYLE[p.conformance.status]}`}>
                  {p.conformance.status}
                </span>
                {(() => {
                  const level = getExperienceLevel(p.slug);
                  if (!level) return null;
                  return (
                    <span
                      className={`rounded px-2 py-1 text-[11px] font-semibold ${EXPERIENCE_BADGE_STYLE[level]}`}
                      title="Nível de experiência (check:experience-standard)"
                    >
                      {EXPERIENCE_LABEL[level]}
                    </span>
                  );
                })()}
                {(() => {
                  const vq = getVisualQuality(p.slug);
                  if (!vq) return null;
                  return (
                    <span
                      className={`rounded px-2 py-1 text-[11px] font-semibold ${VISUAL_BADGE_STYLE[vq.visual]}`}
                      title={`Score visual ${vq.score}/100`}
                    >
                      {vq.visual} {vq.score}
                    </span>
                  );
                })()}
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px]">
                  {p.published ? (
                    <CheckCircle2 className="h-3 w-3 text-primary" aria-hidden="true" />
                  ) : null}
                  {p.lifecycleStatus}
                </span>
              </div>
            </div>
            {p.conformance.issues.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">{p.conformance.issues.join(", ")}</p>
            )}
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhum projeto encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
}
