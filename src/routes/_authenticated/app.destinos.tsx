/**
 * Tela única de revisão: todos os clientKeys e seus destinos de funil.
 *
 * Somente leitura. Reutiliza a auditoria server-side já existente
 * (getPortfolioDestinationAudit) — nenhuma segunda fonte de verdade.
 * O número completo nunca sai do servidor: apenas a máscara.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { getPortfolioDestinationAudit } from "@/lib/portfolio-destination-audit.functions";
import { isDestinationOk, type DestinationRow } from "@/lib/portfolio-funnel-destination";

export const Route = createFileRoute("/_authenticated/app/destinos")({
  head: () => ({
    meta: [
      { title: "Destinos por cliente · 0WEB Painel" },
      {
        name: "description",
        content:
          "Revisão única de todos os clientKeys do portfólio e seus destinos de funil, com status, origem e máscara.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DestinationsReviewPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type Filter = "ALL" | "OK" | "PENDING" | "PUBLISHED_PENDING";

function matchesFilter(row: DestinationRow, filter: Filter): boolean {
  const ok = isDestinationOk(row.destinationStatus);
  if (filter === "OK") return ok;
  if (filter === "PENDING") return !ok;
  if (filter === "PUBLISHED_PENDING") return !ok && row.publicState === "published";
  return true;
}

function DestinationsReviewPage() {
  const load = useServerFn(getPortfolioDestinationAudit);
  const [rows, setRows] = useState<DestinationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [term, setTerm] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await load();
      setRows(data.rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totals = useMemo(() => {
    const published = rows.filter((r) => r.publicState === "published");
    const ok = rows.filter((r) => isDestinationOk(r.destinationStatus));
    return {
      total: rows.length,
      published: published.length,
      ok: ok.length,
      pending: rows.length - ok.length,
      publishedPending: published.filter((r) => !isDestinationOk(r.destinationStatus)).length,
      atRisk: rows.reduce((sum, r) => sum + r.conversionsAtRisk, 0),
    };
  }, [rows]);

  const visible = useMemo(() => {
    const q = term.trim().toLowerCase();
    return rows
      .filter((r) => matchesFilter(r, filter))
      .filter(
        (r) =>
          !q ||
          r.slug.toLowerCase().includes(q) ||
          (r.clientKey ?? "").toLowerCase().includes(q) ||
          r.projectName.toLowerCase().includes(q),
      )
      .sort((a, b) => (a.clientKey ?? a.slug).localeCompare(b.clientKey ?? b.slug));
  }, [rows, filter, term]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Destinos por cliente</h1>
          <p className="mt-1 max-w-[75ch] text-sm text-muted-foreground">
            Lista única de revisão: cada clientKey do portfólio, o destino do funil e a origem da evidência. Somente
            leitura — o número completo permanece no servidor e aqui aparece apenas mascarado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}

      <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Projetos", value: totals.total },
          { label: "Publicados", value: totals.published },
          { label: "Com destino operacional", value: totals.ok },
          { label: "Sem destino", value: totals.pending },
          { label: "Publicados sem destino", value: totals.publishedPending },
        ].map((card) => (
          <div key={card.label} className="rounded-lg border border-border bg-muted/30 p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(
          [
            ["ALL", "Todos"],
            ["OK", "Com destino"],
            ["PENDING", "Sem destino"],
            ["PUBLISHED_PENDING", "Publicados sem destino"],
          ] as Array<[Filter, string]>
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`min-h-11 rounded-md border px-3 text-sm font-medium ${
              filter === value ? "border-primary bg-primary/10" : "border-border"
            }`}
          >
            {label}
          </button>
        ))}
        <label className="ml-auto flex min-h-11 items-center gap-2 rounded-md border border-input px-3 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Buscar por cliente, slug ou nome</span>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar cliente ou slug"
            className="bg-transparent outline-none"
          />
        </label>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Carregando destinos…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <caption className="sr-only">Destinos de funil por clientKey</caption>
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2">clientKey</th>
                <th scope="col" className="px-3 py-2">Projeto</th>
                <th scope="col" className="px-3 py-2">Destino</th>
                <th scope="col" className="px-3 py-2">Status</th>
                <th scope="col" className="px-3 py-2">Origem</th>
                <th scope="col" className="px-3 py-2">Publicação</th>
                <th scope="col" className="px-3 py-2">Observação</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const ok = isDestinationOk(row.destinationStatus);
                return (
                  <tr key={row.slug} className="border-t border-border align-top">
                    <td className="px-3 py-2 font-medium">{row.clientKey ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span className="block">{row.projectName}</span>
                      <span className="block text-xs text-muted-foreground">/portfolio/{row.slug}</span>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{row.destinationValueMasked ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1">
                        {ok ? (
                          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
                        )}
                        {row.destinationStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.destinationSource}
                      {row.evidenceSource ? ` · ${row.evidenceSource}` : ""}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{row.publicState}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.note ?? "—"}</td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                    Nenhum projeto neste filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
