import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCcw } from "lucide-react";
import {
  listPortfolioProtocols,
  type PortfolioProtocolRow,
} from "@/lib/portfolio-whatsapp-admin.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio/protocolos")({
  head: () => ({
    meta: [
      { title: "Protocolos por portfólio · 0WEB Painel" },
      { name: "description", content: "Protocolos gerados pelos funis, com data, lead e abertura do WhatsApp." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ProtocolsPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

function ProtocolsPage() {
  const load = useServerFn(listPortfolioProtocols);
  const [rows, setRows] = useState<PortfolioProtocolRow[]>([]);
  const [days, setDays] = useState(30);
  const [slug, setSlug] = useState("");
  const [onlyOpened, setOnlyOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load({ data: { days } });
      setRows(res.rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load, days]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const slugs = useMemo(
    () => Array.from(new Set(rows.map((r) => r.slug))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [rows],
  );

  const visible = rows.filter(
    (r) => (!slug || r.slug === slug) && (!onlyOpened || r.opened),
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Protocolos por portfólio</h1>
          <p className="text-sm text-muted-foreground">
            Cada atendimento registrado pelo funil, com data, contato e se o WhatsApp foi aberto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <RefreshCcw className="h-4 w-4" /> Atualizar
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-md border px-3 py-2 text-sm"
        >
          {[7, 30, 90, 180].map((d) => (
            <option key={d} value={d}>
              Últimos {d} dias
            </option>
          ))}
        </select>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Todos os projetos</option>
          {slugs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyOpened}
            onChange={(e) => setOnlyOpened(e.target.checked)}
          />
          Somente os que abriram o WhatsApp
        </label>
        <span className="text-sm text-muted-foreground">{visible.length} registros</span>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Protocolo</th>
              <th className="p-2">Projeto</th>
              <th className="p-2">Lead</th>
              <th className="p-2">Contato</th>
              <th className="p-2">WhatsApp do projeto</th>
              <th className="p-2">Abriu</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={7}>
                  Carregando…
                </td>
              </tr>
            )}
            {!loading &&
              visible.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 whitespace-nowrap">{fmt(r.createdAt)}</td>
                  <td className="p-2 font-mono text-xs">{r.protocol ?? "—"}</td>
                  <td className="p-2">{r.slug}</td>
                  <td className="p-2">{r.leadName ?? "—"}</td>
                  <td className="p-2">{r.leadPhoneMasked ?? "—"}</td>
                  <td className="p-2">{r.destinationMasked ?? "sem número"}</td>
                  <td className="p-2">
                    {r.opened ? (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {fmt(r.openedAt)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">não</span>
                    )}
                  </td>
                </tr>
              ))}
            {!loading && visible.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={7}>
                  Nenhum protocolo no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
