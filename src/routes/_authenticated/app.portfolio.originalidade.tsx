import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import originality from "@/config/portfolio-originality.json";
import coverStatus from "@/config/portfolio-cover-status.json";

export const Route = createFileRoute("/_authenticated/app/portfolio/originalidade")({
  component: PortfolioOriginalityView,
  head: () => ({
    meta: [
      { title: "Originalidade do portfólio · 0WEB" },
      {
        name: "description",
        content:
          "Score de originalidade, clusters de similaridade e sinais de capa e logo dos projetos do portfólio.",
      },
    ],
  }),
});

type Project = (typeof originality.projects)[number];

type Cluster = {
  id: string;
  reason: string;
  averageScore: number;
  risk: string;
  baseComponent: string;
  members: string[];
};

// A lista pode ficar vazia quando não há cluster; mantemos o tipo explícito.
const clusters = originality.clusters as unknown as Cluster[];

const STATUS_STYLE: Record<string, string> = {
  ORIGINAL: "bg-primary/10 text-primary",
  ACCEPTABLE: "bg-primary/5 text-primary",
  ATTENTION: "bg-muted text-foreground",
  HIGH_SIMILARITY: "bg-destructive/10 text-destructive",
  CLONE: "bg-destructive/20 text-destructive",
  SHARED_FALLBACK: "bg-destructive/10 text-destructive",
};

const NEXT_ACTION: Record<string, string> = {
  ORIGINAL: "Manter",
  ACCEPTABLE: "Manter e monitorar",
  ATTENTION: "Diferenciar composição",
  HIGH_SIMILARITY: "Reestruturar seções",
  CLONE: "Redesenhar a partir de arquétipo próprio",
  SHARED_FALLBACK: "Criar componente próprio do cliente",
};

type CoverRow = (typeof coverStatus.projects)[number];

const COVER_STATUS_LABEL: Record<string, string> = {
  VALID: "Capa válida",
  NEEDS_CROP: "Precisa de recorte",
  CONTACT_OR_PII: "Contato ou endereço visível",
  PROMOTIONAL_MATERIAL: "Peça promocional",
  LOGO_ONLY: "Só marca/logo",
  NO_REAL_ASSET: "Sem material real",
  UNCERTAIN_ORIGIN: "Origem incerta",
};

/** Bloco compacto de capas: uma fonte de verdade, sem inventário paralelo. */
function CoverStatusBlock() {
  const [coverFilter, setCoverFilter] = useState("PENDING");
  const cs = coverStatus.summary;
  const all = coverStatus.projects as CoverRow[];
  const rows = useMemo(
    () =>
      all
        .filter((r) =>
          coverFilter === "all"
            ? true
            : coverFilter === "PENDING"
              ? r.status !== "VALID"
              : r.status === coverFilter,
        )
        .sort((a, b) => a.slug.localeCompare(b.slug)),
    [all, coverFilter],
  );

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold">Capas</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fonte única de verdade derivada do catálogo, da revisão visual e dos arquivos reais
        (<code>bun run build:portfolio-cover-status</code>). Imagem social e hero não contam como
        capa. Total {cs.total} · válidas {cs.valid} · pendentes {cs.pending}.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {["PENDING", "all", ...Object.keys(COVER_STATUS_LABEL)].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCoverFilter(key)}
            className={`rounded-full border px-3 py-1 text-xs ${
              coverFilter === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {key === "PENDING"
              ? `Pendentes (${cs.pending})`
              : key === "all"
                ? `Todas (${cs.total})`
                : `${COVER_STATUS_LABEL[key]} (${(cs.byStatus as Record<string, number>)[key] ?? 0})`}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.slug} className="rounded-lg border border-border bg-card p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>{r.businessName}</strong>
              <span className="text-xs text-muted-foreground">
                {COVER_STATUS_LABEL[r.status] ?? r.status} · última auditoria{" "}
                {r.reviewedAt ?? "—"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <code>{r.slug}</code> · {r.reason ?? "Aprovada em revisão humana."}
            </p>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="rounded-lg border border-border bg-card p-3 text-muted-foreground">
            Nenhuma capa neste estado.
          </li>
        ) : null}
      </ul>
    </section>
  );
}

function PortfolioOriginalityView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const projects = originality.projects as Project[];
  const rows = useMemo(
    () =>
      [...projects]
        .filter((p) => (status === "all" ? true : p.originalityStatus === status))
        .filter((p) => (query.trim() ? p.slug.includes(query.trim().toLowerCase()) : true))
        .sort((a, b) => b.score - a.score),
    [projects, query, status],
  );

  const s = originality.summary;

  return (
    <div className="max-w-6xl">
      <Link
        to="/app/portfolio"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Projetos do portfólio
      </Link>

      <h1 className="mt-3 font-display text-3xl font-bold">Originalidade</h1>
      <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
        Gate independente da conformidade: um projeto pode ser <strong>COMPLETE</strong> e ainda
        assim ser um clone estrutural. O score mede a repetição da composição final percebida pelo
        visitante — reutilizar infraestrutura compartilhada não penaliza. Gerado por{" "}
        <code>bun run check:portfolio-originality</code>, em modo relatório.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {[
          ["Projetos", s.total],
          ["ORIGINAL", s.original],
          ["ACCEPTABLE", s.acceptable],
          ["ATTENTION", s.attention],
          ["HIGH_SIMILARITY", s.highSimilarity],
          ["CLONE", s.clone],
          ["SHARED_FALLBACK", s.sharedFallback],
          ["Clusters", s.clusters],
          ["Logos placeholder", s.placeholderLogos],
          ["Capas sem arquivo (legado)", s.missingCovers],
          ["Capa = imagem social", s.coversAsSocialImage],
          ["Crop severo", s.severeCrop],
          ["Marca cruzada", (s as Record<string, number>).invalidCrossClientAssets ?? 0],
          ["Asset suspeito", (s as Record<string, number>).suspiciousSharedAssets ?? 0],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <CoverStatusBlock />


      <h2 className="mt-10 font-display text-xl font-bold">Clusters de similaridade</h2>
      <div className="mt-3 space-y-3">
        {clusters.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium">
                {c.id} · {c.reason}
              </h3>
              <span className="text-xs text-muted-foreground">
                média {c.averageScore} · risco {c.risk} · base <code>{c.baseComponent}</code>
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.members.join(" · ")}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-bold">Assets percebidos compartilhados</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Marca, capa e imagem social comparadas por conteúdo entre clientes. Infraestrutura
        compartilhada não entra aqui — apenas material que o visitante percebe como identidade.
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {projects.flatMap((p) =>
          ((p as unknown as { assetSharing?: { kind: string; path: string; classification: string; sharedWith: string[] }[] }).assetSharing ?? []).map(
            (x) => (
              <li key={`${p.slug}-${x.kind}`} className="rounded-lg border border-border bg-card p-3">
                <strong>{p.slug}</strong> · {x.kind} · {x.classification} —{" "}
                <code>{x.path}</code> também em {x.sharedWith.join(", ")}
              </li>
            ),
          ),
        ).length === 0 ? (
          <li className="rounded-lg border border-border bg-card p-3 text-muted-foreground">
            Nenhum asset de identidade compartilhado entre clientes.
          </li>
        ) : (
          projects.flatMap((p) =>
            ((p as unknown as { assetSharing?: { kind: string; path: string; classification: string; sharedWith: string[] }[] }).assetSharing ?? []).map(
              (x) => (
                <li key={`${p.slug}-${x.kind}`} className="rounded-lg border border-border bg-card p-3">
                  <strong>{p.slug}</strong> · {x.kind} · {x.classification} —{" "}
                  <code>{x.path}</code> também em {x.sharedWith.join(", ")}
                </li>
              ),
            ),
          )
        )}
      </ul>

      <h2 className="mt-10 font-display text-xl font-bold">Projetos</h2>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            aria-label="Buscar projeto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por slug…"
            className="min-h-11 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <select
          aria-label="Filtrar por originalidade"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-11 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todos os status</option>
          {["ORIGINAL", "ACCEPTABLE", "ATTENTION", "HIGH_SIMILARITY", "CLONE", "SHARED_FALLBACK"].map(
            (v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[900px] text-left text-sm">
          <caption className="sr-only">
            Score de originalidade, projeto mais semelhante e sinais de identidade
          </caption>
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2">Projeto</th>
              <th scope="col" className="px-3 py-2">Score</th>
              <th scope="col" className="px-3 py-2">Status</th>
              <th scope="col" className="px-3 py-2">Mais parecido</th>
              <th scope="col" className="px-3 py-2">Motivo</th>
              <th scope="col" className="px-3 py-2">Dimensões</th>
              <th scope="col" className="px-3 py-2">Capa</th>
              <th scope="col" className="px-3 py-2">Logo</th>
              <th scope="col" className="px-3 py-2">Ação sugerida</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.slug} className="border-t border-border align-top">
                <td className="px-3 py-2">
                  <Link
                    to="/app/portfolio/$slug"
                    params={{ slug: p.slug }}
                    className="font-medium hover:underline"
                  >
                    {p.slug}
                  </Link>
                </td>
                <td className="px-3 py-2 font-semibold">{p.score}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded px-2 py-1 text-[11px] font-semibold ${STATUS_STYLE[p.originalityStatus] ?? "bg-muted"}`}
                  >
                    {p.originalityStatus}
                  </span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {p.nearestMatch ?? "—"} ({p.nearestMatchScore})
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {p.reasons[0] ?? "DISTINCT"}
                  {p.fallbackVertical ? ` · ${p.fallbackVertical}` : ""}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {Object.entries((p.dimensions ?? {}) as Record<string, number>)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([k, v]) => `${k.replace("_SIMILARITY", "")} ${v}`)
                    .join(" · ") || "—"}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {p.coverSignals.length ? p.coverSignals.join(", ") : "—"}
                </td>
                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                  {p.logoSignals.length ? p.logoSignals.join(", ") : "—"}
                </td>
                <td className="px-3 py-2 text-[11px]">{NEXT_ACTION[p.originalityStatus]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
