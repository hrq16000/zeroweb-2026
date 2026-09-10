import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImageOff, ImageIcon, ShieldAlert, TrendingUp } from "lucide-react";
import coverStatus from "@/config/portfolio-cover-status.json";
import { getPortfolioFunnelMetrics } from "@/lib/portfolio-funnel-metrics.functions";


export const Route = createFileRoute("/_authenticated/app/portfolio-capas")({
  component: PortfolioCoversPage,
  head: () => ({
    meta: [
      { title: "Capas pendentes do portfólio · 0WEB" },
      {
        name: "description",
        content:
          "Situação de cada capa do catálogo /portfolio, com o motivo de cada pendência e o material que falta.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type CoverRow = {
  slug: string;
  asset: string | null;
  catalogImage: string | null;
  status: string;
  reason: string | null;
  cardValid: boolean;
  businessName?: string;
  segment?: string;
};

const STATUS_LABEL: Record<string, string> = {
  VALID: "Publicada",
  NEEDS_CROP: "Só falta recorte",
  CONTACT_OR_PII: "Imagem mostra contato ou endereço",
  PROMOTIONAL_MATERIAL: "Peça promocional com preço",
  LOGO_ONLY: "Só existe a logo",
  NO_REAL_ASSET: "Sem foto real do negócio",
  UNCERTAIN_ORIGIN: "Falta conferência humana",
};

const STATUS_ACTION: Record<string, string> = {
  VALID: "Nada a fazer.",
  NEEDS_CROP: "Recortar em 16:10 com ponto focal e aprovar.",
  CONTACT_OR_PII: "Pedir a mesma foto sem telefone, endereço ou QR visível.",
  PROMOTIONAL_MATERIAL: "Pedir foto do produto ou do espaço, sem preço nem campanha.",
  LOGO_ONLY: "Pedir foto real do trabalho, produto ou fachada.",
  NO_REAL_ASSET: "Pedir material fotográfico oficial ao cliente.",
  UNCERTAIN_ORIGIN: "Conferir a origem da imagem e registrar a decisão.",
};

const STATUS_TONE: Record<string, string> = {
  VALID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  NEEDS_CROP: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  CONTACT_OR_PII: "bg-red-500/10 text-red-600 border-red-500/30",
  PROMOTIONAL_MATERIAL: "bg-red-500/10 text-red-600 border-red-500/30",
  LOGO_ONLY: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  NO_REAL_ASSET: "bg-muted text-muted-foreground border-border",
  UNCERTAIN_ORIGIN: "bg-violet-500/10 text-violet-600 border-violet-500/30",
};

function PortfolioCoversPage() {
  const rows = (coverStatus.projects as CoverRow[]) ?? [];
  const [filter, setFilter] = useState<string>("PENDING");
  const [term, setTerm] = useState("");

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const r of rows) acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, [rows]);

  const pendingTotal = rows.filter((r) => r.status !== "VALID").length;

  // Prioridade = tráfego real do projeto nos últimos 30 dias (analytics_events).
  const fetchMetrics = useServerFn(getPortfolioFunnelMetrics);
  const metrics = useQuery({
    queryKey: ["portfolio-cover-traffic", 30],
    queryFn: () => fetchMetrics({ data: { days: 30 } }),
    staleTime: 5 * 60_000,
  });

  const viewsBySlug = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of metrics.data?.projects ?? []) map.set(r.slug, r.views ?? 0);
    return map;
  }, [metrics.data]);

  const visible = useMemo(() => {
    const t = term.trim().toLowerCase();
    return rows
      .filter((r) =>
        filter === "PENDING"
          ? r.status !== "VALID"
          : filter === "ALL"
            ? true
            : r.status === filter,
      )
      .filter(
        (r) =>
          !t ||
          r.slug.includes(t) ||
          (r.businessName ?? "").toLowerCase().includes(t) ||
          (r.segment ?? "").toLowerCase().includes(t),
      )
      .sort(
        (a, b) =>
          (viewsBySlug.get(b.slug) ?? 0) - (viewsBySlug.get(a.slug) ?? 0) ||
          a.status.localeCompare(b.status) ||
          a.slug.localeCompare(b.slug),
      );
  }, [rows, filter, term, viewsBySlug]);


  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ImageIcon className="h-5 w-5 text-primary" /> Capas do portfólio
        </h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} projetos · {rows.length - pendingTotal} com capa publicada ·{" "}
          {pendingTotal} aguardando material. Cada linha mostra o motivo e o que
          precisa chegar do cliente.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(STATUS_LABEL).map(([status, label]) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-xl border p-3 text-left transition ${
              filter === status ? "ring-2 ring-primary" : ""
            } ${STATUS_TONE[status]}`}
          >
            <span className="block text-2xl font-bold">{counts[status] ?? 0}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("PENDING")}
          className={`min-h-10 rounded-lg border px-3 text-sm ${filter === "PENDING" ? "border-primary text-primary" : "border-border"}`}
        >
          Só pendentes ({pendingTotal})
        </button>
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`min-h-10 rounded-lg border px-3 text-sm ${filter === "ALL" ? "border-primary text-primary" : "border-border"}`}
        >
          Todas ({rows.length})
        </button>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar projeto, empresa ou ramo"
          aria-label="Buscar capa de projeto"
          className="min-h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm"
        />
      </div>

      <ul className="space-y-2">
        {visible.map((row) => (
          <li
            key={row.slug}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
          >
            <div className="flex h-16 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:w-28">
              {row.cardValid && row.catalogImage ? (
                <img
                  src={row.catalogImage}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {row.businessName ?? row.slug}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.slug}
                {row.segment ? ` · ${row.segment}` : ""}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {row.reason ?? "Capa aprovada e publicada."}
              </p>
              {row.status !== "VALID" && (
                <p className="mt-1 flex items-start gap-1 text-sm">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  <span>{STATUS_ACTION[row.status] ?? "Revisar material."}</span>
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <span
                className={`rounded-full border px-2 py-1 text-xs font-medium ${STATUS_TONE[row.status]}`}
              >
                {STATUS_LABEL[row.status] ?? row.status}
              </span>
              <Link
                to="/app/portfolio/$slug"
                params={{ slug: row.slug }}
                className="text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                Abrir revisão
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhuma capa nesse filtro.
        </p>
      )}
    </div>
  );
}
