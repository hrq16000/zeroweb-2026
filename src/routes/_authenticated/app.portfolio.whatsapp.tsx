import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Phone, RefreshCcw, Search, Trash2 } from "lucide-react";
import {
  confirmPortfolioWhatsApp,
  listPortfolioWhatsAppStatus,
  revokePortfolioWhatsApp,
  type PortfolioWhatsAppRow,
} from "@/lib/portfolio-whatsapp-admin.functions";

export const Route = createFileRoute("/_authenticated/app/portfolio/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp por portfólio · 0WEB Painel" },
      { name: "description", content: "Confirmação do WhatsApp oficial de cada portfólio, por clientKey." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PortfolioWhatsAppPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

const SOURCE_LABEL: Record<PortfolioWhatsAppRow["source"], string> = {
  panel: "Confirmado no painel",
  catalog: "Cadastro do projeto",
  none: "Sem número",
};

function PortfolioWhatsAppPage() {
  const load = useServerFn(listPortfolioWhatsAppStatus);
  const confirm = useServerFn(confirmPortfolioWhatsApp);
  const revoke = useServerFn(revokePortfolioWhatsApp);

  const [rows, setRows] = useState<PortfolioWhatsAppRow[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "none" | "panel">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
      if (filter === "panel" && r.source !== "panel") return false;
      if (!q) return true;
      return r.siteName.toLowerCase().includes(q) || r.clientKey.includes(q);
    });
  }, [rows, query, filter]);

  const current = rows.find((r) => r.clientKey === selected) ?? null;

  const counts = useMemo(
    () => ({
      total: rows.length,
      withNumber: rows.filter((r) => r.source !== "none").length,
      panel: rows.filter((r) => r.source === "panel").length,
      none: rows.filter((r) => r.source === "none").length,
    }),
    [rows],
  );

  async function onConfirm() {
    if (!current) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      await confirm({ data: { clientKey: current.clientKey, whatsapp: number, evidence } });
      setMessage(`WhatsApp confirmado para ${current.siteName}.`);
      setNumber("");
      setEvidence("");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onRevoke(clientKey: string) {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      await revoke({ data: { clientKey } });
      setMessage("Confirmação removida. O projeto volta ao cadastro original.");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">WhatsApp por portfólio</h1>
          <p className="text-sm text-muted-foreground">
            Confirme o número oficial de cada projeto. O número completo nunca é exibido nem
            publicado — o funil sempre resolve o contato no servidor.
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

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Projetos", counts.total],
          ["Com número", counts.withNumber],
          ["Confirmados aqui", counts.panel],
          ["Sem número", counts.none],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {message && <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">{message}</div>}
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
        {(["all", "none", "panel"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-2 text-sm ${filter === f ? "bg-primary/10 text-primary" : ""}`}
          >
            {f === "all" ? "Todos" : f === "none" ? "Sem número" : "Confirmados no painel"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2">Projeto</th>
                <th className="p-2">Número</th>
                <th className="p-2">Origem</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={4}>
                    Carregando…
                  </td>
                </tr>
              )}
              {!loading &&
                visible.map((r) => (
                  <tr key={r.clientKey} className="border-t">
                    <td className="p-2">
                      <button
                        type="button"
                        className="text-left font-medium hover:underline"
                        onClick={() => {
                          setSelected(r.clientKey);
                          setNumber("");
                          setEvidence("");
                        }}
                      >
                        {r.siteName}
                      </button>
                      <div className="text-xs text-muted-foreground">/portfolio/{r.slug}</div>
                    </td>
                    <td className="p-2">{r.masked ?? "—"}</td>
                    <td className="p-2">
                      <span className="text-xs">{SOURCE_LABEL[r.source]}</span>
                      {r.notApplicable && (
                        <div className="text-xs text-muted-foreground">WhatsApp não é o canal</div>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {r.source === "panel" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void onRevoke(r.clientKey)}
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                        >
                          <Trash2 className="h-3 w-3" /> Remover
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              {!loading && visible.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={4}>
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <aside className="h-fit rounded-lg border p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Phone className="h-4 w-4" /> Confirmar número oficial
          </h2>
          {!current && (
            <p className="mt-2 text-sm text-muted-foreground">
              Escolha um projeto na lista para confirmar o WhatsApp dele.
            </p>
          )}
          {current && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="font-medium">{current.siteName}</div>
                <div className="text-xs text-muted-foreground">{current.clientKey}</div>
                <div className="mt-1 text-xs">
                  Atual: {current.masked ?? "sem número"} · {SOURCE_LABEL[current.source]}
                </div>
                {current.evidence && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Evidência: {current.evidence}
                  </div>
                )}
              </div>
              <label className="block text-sm">
                Número com DDI e DDD
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="55 41 9 0000-0000"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                Como o número foi confirmado
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  rows={3}
                  placeholder="Ex.: confirmado pelo responsável em 16/09, por mensagem."
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                disabled={busy || !number || evidence.trim().length < 3}
                onClick={() => void onConfirm()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirmar
              </button>
              <p className="text-xs text-muted-foreground">
                O número confirmado passa a valer imediatamente para este projeto, sem alterar o
                site. Nenhum número é reaproveitado entre projetos.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
