import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { listLocalRanking, type LocalRankingRow } from "@/lib/local-ranking.functions";

export const Route = createFileRoute("/_authenticated/app/ranking-local")({
  component: LocalRankingPage,
});

type SortKey = "clicks" | "impressions" | "position" | "visits" | "leads" | "conversion" | "city";

function LocalRankingPage() {
  const fetchRanking = useServerFn(listLocalRanking);
  const [days, setDays] = useState(28);
  const [sort, setSort] = useState<SortKey>("clicks");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<LocalRankingRow | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["local-ranking", days],
    queryFn: () => fetchRanking({ data: { days } }),
  });

  const rows = useMemo(() => {
    const list = (data?.rows ?? []).filter((r) =>
      q ? `${r.city} ${r.uf}`.toLowerCase().includes(q.toLowerCase()) : true,
    );
    return [...list].sort((a, b) => {
      if (sort === "city") return a.city.localeCompare(b.city);
      if (sort === "position") {
        const av = a.position ?? 999;
        const bv = b.position ?? 999;
        return av - bv;
      }
      return (b[sort] as number) - (a[sort] as number);
    });
  }, [data, sort, q]);

  const totals = useMemo(() => {
    const list = data?.rows ?? [];
    return {
      clicks: list.reduce((s, r) => s + r.clicks, 0),
      impressions: list.reduce((s, r) => s + r.impressions, 0),
      leads: list.reduce((s, r) => s + r.leads, 0),
      visits: list.reduce((s, r) => s + r.visits, 0),
    };
  }, [data]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" /> Ranking local por cidade
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Desempenho das páginas locais: termos principais no Google, visitas e conversão em
            leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            aria-label="Período"
            className="text-sm rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value={7}>7 dias</option>
            <option value={28}>28 dias</option>
            <option value={90}>90 dias</option>
          </select>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Atualizar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Cliques" value={totals.clicks} />
        <Stat label="Impressões" value={totals.impressions} />
        <Stat label="Visitas" value={totals.visits} />
        <Stat label="Leads" value={totals.leads} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar cidade"
          aria-label="Buscar cidade"
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Ordenar por"
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="clicks">Mais cliques</option>
          <option value="impressions">Mais impressões</option>
          <option value="position">Melhor posição</option>
          <option value="visits">Mais visitas</option>
          <option value="leads">Mais leads</option>
          <option value="conversion">Maior conversão</option>
          <option value="city">Cidade (A-Z)</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border overflow-x-auto bg-card">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Cidade</th>
              <th className="text-right px-4 py-3">Cliques</th>
              <th className="text-right px-4 py-3">Impressões</th>
              <th className="text-right px-4 py-3">CTR</th>
              <th className="text-right px-4 py-3">Posição</th>
              <th className="text-right px-4 py-3">Visitas</th>
              <th className="text-right px-4 py-3">Leads</th>
              <th className="text-right px-4 py-3">Conversão</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-muted-foreground">
                  Carregando…
                </td>
              </tr>
            )}
            {!isLoading &&
              rows.map((r) => (
                <tr key={r.slug} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {r.city} <span className="text-muted-foreground text-xs">/{r.uf}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.clicks}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.impressions}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.ctr}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.position ?? "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.visits}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.leads}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.conversion}%</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setOpen(r)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Termos
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {open && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">
              Palavras-chave · {open.city}/{open.uf}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="text-xs text-muted-foreground hover:underline"
            >
              Fechar
            </button>
          </div>
          {open.topQueries.length === 0 ? (
            <p className="text-xs text-muted-foreground mt-3">
              Sem termos registrados no período. Sincronize o Search Console em “Search Console”.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {open.topQueries.map((t) => (
                <li key={t.query} className="flex items-center justify-between text-sm">
                  <span>{t.query}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {t.clicks} cliques · {t.impressions} impr. · pos. {t.position.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
    </div>
  );
}
