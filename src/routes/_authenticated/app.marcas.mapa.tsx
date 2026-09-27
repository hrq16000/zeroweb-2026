/**
 * Mapa de marcas: cidade, status da página e destino gravado de cada portfólio.
 * Somente leitura, admin. Destino vem mascarado de `listPortfolioFunnels`
 * (server-side) — nenhum número completo no bundle.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import catalog from "@/config/portfolio-catalog.json";
import {
  listPortfolioFunnels,
  type PortfolioFunnelAdminRow,
} from "@/lib/portfolio-funnel-admin.functions";

export const Route = createFileRoute("/_authenticated/app/marcas/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de marcas · 0WEB Painel" },
      { name: "description", content: "Cidade, status e destino gravado de cada marca do portfólio." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MarcasMapaPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type Cat = { slug: string; clientKey?: string; title: string; city?: string; state?: string; status?: string; live?: boolean };

// Coordenadas aproximadas do centro de cada cidade (dado geográfico público).
const COORDS: Record<string, [number, number]> = {
  "Curitiba|PR": [-25.43, -49.27],
  "São José dos Pinhais|PR": [-25.53, -49.2],
  "Guaratuba|PR": [-25.88, -48.57],
  "Araucária|PR": [-25.59, -49.41],
  "Pinhais|PR": [-25.44, -49.19],
  "Piraquara|PR": [-25.44, -49.06],
  "Quatro Barras|PR": [-25.37, -49.08],
  "Rio Bonito|PR": [-25.49, -52.53],
  "Região de Curitiba|PR": [-25.45, -49.3],
  "Belo Horizonte|MG": [-19.92, -43.94],
  "Uberlândia|MG": [-18.92, -48.28],
  "Uberaba|MG": [-19.75, -47.93],
  "Mirassol|SP": [-20.82, -49.52],
  "São Paulo|SP": [-23.55, -46.63],
  "Manaus|AM": [-3.12, -60.02],
};

type Status = "destino" | "sem-destino" | "rascunho";

function MarcasMapaPage() {
  const fetchFunnels = useServerFn(listPortfolioFunnels);
  const { data, isLoading, error } = useQuery({ queryKey: ["marcas-mapa"], queryFn: () => fetchFunnels() });
  const [filter, setFilter] = useState<"todos" | Status>("todos");

  const rows = useMemo(() => {
    const byKey = new Map<string, PortfolioFunnelAdminRow>();
    (data ?? []).forEach((r) => byKey.set(r.clientKey, r));
    return (catalog as Cat[]).map((c) => {
      const f = byKey.get(c.clientKey ?? c.slug);
      const published = Boolean(c.live) || c.status === "published";
      const status: Status = !published ? "rascunho" : f?.destinationStatus === "configured" ? "destino" : "sem-destino";
      const key = `${c.city ?? ""}|${c.state ?? ""}`;
      return { ...c, published, status, masked: f?.destinationMasked ?? null, coord: COORDS[key] ?? null };
    });
  }, [data]);

  const shown = rows.filter((r) => filter === "todos" || r.status === filter);
  const counts = { destino: 0, "sem-destino": 0, rascunho: 0 } as Record<Status, number>;
  rows.forEach((r) => counts[r.status]++);

  const cities = useMemo(() => {
    const m = new Map<string, { coord: [number, number]; label: string; items: typeof shown }>();
    shown.forEach((r) => {
      if (!r.coord) return;
      const k = `${r.city}|${r.state}`;
      if (!m.has(k)) m.set(k, { coord: r.coord, label: `${r.city} — ${r.state}`, items: [] });
      m.get(k)!.items.push(r);
    });
    return [...m.values()];
  }, [shown]);

  // Projeção simples lat/lng → SVG (recorte do Brasil onde há marcas).
  const [minLat, maxLat, minLng, maxLng] = [-27, -2, -62, -42];
  const W = 600, H = 520;
  const proj = ([lat, lng]: [number, number]) => [((lng - minLng) / (maxLng - minLng)) * W, ((maxLat - lat) / (maxLat - minLat)) * H];
  const dot: Record<Status, string> = { destino: "fill-primary", "sem-destino": "fill-accent-foreground", rascunho: "fill-muted-foreground" };
  const label: Record<Status, string> = { destino: "Com destino gravado", "sem-destino": "Sem destino (amostra / só lead)", rascunho: "Página não publicada" };

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-semibold"><MapPin className="h-6 w-6" /> Mapa de marcas</h1>
        <p className="text-sm text-muted-foreground">Cidade, status e destino gravado de cada marca. Use o filtro para acompanhar quem está sem destino.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["todos", "destino", "sem-destino", "rascunho"] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`rounded-full border px-3 py-1.5 text-sm ${filter === k ? "bg-primary text-primary-foreground" : "bg-background"}`}>
            {k === "todos" ? `Todas (${rows.length})` : `${label[k]} (${counts[k]})`}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">Não foi possível carregar os destinos: {(error as Error).message}</p>}
      {isLoading && <p className="text-sm text-muted-foreground">Carregando destinos…</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-lg border bg-card p-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Mapa das cidades com marcas">
            <rect width={W} height={H} className="fill-muted/40" rx={12} />
            {cities.map((c) => {
              const [x, y] = proj(c.coord);
              const s = c.items.some((i) => i.status === "sem-destino") ? "sem-destino" : c.items.some((i) => i.status === "destino") ? "destino" : "rascunho";
              return (
                <g key={c.label}>
                  <circle cx={x} cy={y} r={6 + Math.min(c.items.length, 30) * 0.8} className={`${dot[s as Status]} opacity-80`}>
                    <title>{`${c.label}: ${c.items.length} marca(s)`}</title>
                  </circle>
                  <text x={x + 12} y={y + 4} className="fill-foreground text-[11px]">{c.label} ({c.items.length})</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">Cor do ponto: laranja/destaque = há marca sem destino na cidade; principal = todas com destino.</p>
        </div>

        <div className="max-h-[560px] overflow-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-left">
              <tr><th className="p-2">Marca</th><th className="p-2">Cidade</th><th className="p-2">Status</th><th className="p-2">Destino gravado</th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.slug} className="border-t">
                  <td className="p-2 font-medium">{r.title}</td>
                  <td className="p-2">{r.city ?? "—"}{r.state ? ` — ${r.state}` : ""}</td>
                  <td className="p-2">{label[r.status]}</td>
                  <td className="p-2 font-mono text-xs">{r.masked ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
