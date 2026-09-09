import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { getPortfolioSearchMetrics } from "@/lib/portfolio-search-metrics.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio-buscas")({
  component: PortfolioSearchPage,
  head: () => ({
    meta: [
      { title: "Buscas do portfólio · 0WEB" },
      {
        name: "description",
        content: "Termos buscados em /portfolio e cliques que cada termo gerou.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const DESTAQUES = ["pastel", "lanche"];

function PortfolioSearchPage() {
  const fetchMetrics = useServerFn(getPortfolioSearchMetrics);
  const [days, setDays] = useState(30);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-search-metrics", days],
    queryFn: () => fetchMetrics({ data: { days } }),
  });

  const rows = data?.rows ?? [];
  const destaques = DESTAQUES.map(
    (term) => rows.find((r) => r.term === term) ?? null,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Search className="h-5 w-5 text-primary" /> Buscas do portfólio
          </h1>
          <p className="text-sm text-muted-foreground">
            O que as pessoas digitam na busca de /portfolio e em quais projetos elas clicam.
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="min-h-10 rounded-lg border border-border bg-card px-3 text-sm"
        >
          <option value={7}>Últimos 7 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={90}>Últimos 90 dias</option>
        </select>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {DESTAQUES.map((term, i) => {
          const row = destaques[i];
          return (
            <div key={term} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Busca “{term}”
              </p>
              <p className="mt-2 text-3xl font-bold">{row ? row.visitors : "—"}</p>
              <p className="text-sm text-muted-foreground">
                {row
                  ? `${row.visitors} pessoas · ${row.searches} buscas · ${row.clicks} cliques em projetos`
                  : "Sem dados no período"}
              </p>
            </div>
          );
        })}
      </section>

      {isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </p>
      ) : error ? (
        <p className="text-sm text-destructive">Não foi possível carregar as buscas.</p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Nenhuma busca registrada neste período.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Termo</th>
                <th className="px-4 py-3">Pessoas</th>
                <th className="px-4 py-3">Buscas</th>
                <th className="px-4 py-3">Cliques</th>
                <th className="px-4 py-3">Sem resultado</th>
                <th className="px-4 py-3">Projetos mais clicados</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.term} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{row.term}</td>
                  <td className="px-4 py-3">{row.visitors}</td>
                  <td className="px-4 py-3">{row.searches}</td>
                  <td className="px-4 py-3">{row.clicks}</td>
                  <td className="px-4 py-3">{row.zeroResults}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.topProjects.length
                      ? row.topProjects.map((p) => `${p.slug} (${p.clicks})`).join(", ")
                      : "—"}
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
