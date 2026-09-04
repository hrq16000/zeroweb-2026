/**
 * Pixel das páginas locais agregado por cidade: sessões, visualizações,
 * cliques em CTA, abandono e conversão. Dados anônimos (sem PII).
 */
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cityPixelStats } from "@/lib/city-pixel.functions";

export function CityPixelPanel() {
  const fetchStats = useServerFn(cityPixelStats);
  const [days, setDays] = useState(30);
  const { data, isLoading } = useQuery({
    queryKey: ["city-pixel-stats", days],
    queryFn: () => fetchStats({ data: { days } }),
  });

  const rows = data?.rows ?? [];

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pixel das páginas locais</h2>
          <p className="text-xs text-muted-foreground">
            Visualizações, cliques em CTA, abandono e conversão por cidade — sem dados pessoais.
          </p>
        </div>
        <label className="text-xs text-muted-foreground">
          Período
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="ml-2 min-h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
          </select>
        </label>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {!isLoading && rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Sem eventos registrados no período. Os dados aparecem assim que as páginas locais receberem visitas.
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Cidade</th>
                <th className="py-2">Sessões</th>
                <th className="py-2">Views</th>
                <th className="py-2">Cliques CTA</th>
                <th className="py-2">Abandono</th>
                <th className="py-2">Diagnósticos</th>
                <th className="py-2">Conversão</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-t border-border">
                  <td className="py-2 font-medium">
                    {r.city}
                    {r.uf ? ` · ${r.uf}` : ""}
                  </td>
                  <td className="py-2">{r.sessoes}</td>
                  <td className="py-2">{r.visualizacoes}</td>
                  <td className="py-2">{r.cliquesCta}</td>
                  <td className="py-2">{r.abandonos}</td>
                  <td className="py-2">{r.submissoes}</td>
                  <td className="py-2">{r.conversao}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
