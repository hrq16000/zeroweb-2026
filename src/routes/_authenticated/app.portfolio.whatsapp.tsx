import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCcw, Search } from "lucide-react";
import {
  listPortfolioWhatsAppStatus,
  type PortfolioWhatsAppRow,
} from "@/lib/portfolio-whatsapp-admin.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp por portfólio · 0WEB Painel" },
      {
        name: "description",
        content: "Estado versionado do WhatsApp de cada portfólio, por clientKey.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortfolioWhatsAppPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const SOURCE_LABEL: Record<PortfolioWhatsAppRow["source"], string> = {
  panel: "Cadastro do projeto",
  catalog: "Cadastro do projeto",
  none: "Sem número (lead-only)",
};

function PortfolioWhatsAppPage() {
  const load = useServerFn(listPortfolioWhatsAppStatus);

  const [rows, setRows] = useState<PortfolioWhatsAppRow[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "none" | "withNumber">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load();
      setRows(res.rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "none" && r.source !== "none") return false;
      if (filter === "withNumber" && r.source === "none") return false;
      if (!q) return true;
      return r.siteName.toLowerCase().includes(q) || r.clientKey.includes(q);
    });
  }, [rows, query, filter]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      withNumber: rows.filter((r) => r.source !== "none").length,
      none: rows.filter((r) => r.source === "none").length,
    }),
    [rows],
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">WhatsApp por portfólio</h1>
          <p className="text-sm text-muted-foreground">
            Estado oficial de cada projeto, lido do cadastro versionado do próprio projeto. Só
            leitura: alterações de número são feitas no cadastro do projeto, por revisão de código.
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

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Projetos", counts.total],
          ["Com número próprio", counts.withNumber],
          ["Sem número (lead-only)", counts.none],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <p className="rounded-md border p-3 text-sm text-muted-foreground">
        Projeto sem número não está com defeito: o funil coleta os dados, guarda o contato e
        encerra com protocolo, sem abrir conversa e sem usar o número de outro projeto.
      </p>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projeto"
            className="rounded-md border py-2 pl-8 pr-3 text-sm"
          />
        </div>
        {(["all", "withNumber", "none"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-2 text-sm ${filter === f ? "bg-primary/10 text-primary" : ""}`}
          >
            {f === "all" ? "Todos" : f === "withNumber" ? "Com número" : "Sem número"}
          </button>
        ))}
        <span className="text-sm text-muted-foreground">{visible.length} projetos</span>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-2">Projeto</th>
              <th className="p-2">Número</th>
              <th className="p-2">Situação</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={3}>
                  Carregando…
                </td>
              </tr>
            )}
            {!loading &&
              visible.map((r) => (
                <tr key={r.clientKey} className="border-t">
                  <td className="p-2">
                    <div className="font-medium">{r.siteName}</div>
                    <div className="text-xs text-muted-foreground">/portfolio/{r.slug}</div>
                  </td>
                  <td className="p-2">{r.masked ?? "—"}</td>
                  <td className="p-2">
                    <span className="text-xs">{SOURCE_LABEL[r.source]}</span>
                    {r.notApplicable && (
                      <div className="text-xs text-muted-foreground">WhatsApp não é o canal</div>
                    )}
                  </td>
                </tr>
              ))}
            {!loading && visible.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={3}>
                  Nenhum projeto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
