/**
 * Solicitações de número: registro de cada envio feito a uma marca sem destino
 * e da resposta recebida. Somente admin; números completos nunca são gravados
 * (o servidor mascara sequências longas de dígitos).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Send } from "lucide-react";
import seedJson from "@/config/portfolio-admin-seed.json";
import {
  listDestinationRequests,
  createDestinationRequest,
  updateDestinationRequest,
  type DestinationRequestRow,
} from "@/lib/portfolio-destination-requests.functions";

export const Route = createFileRoute("/_authenticated/app/funis/solicitacoes")({
  head: () => ({
    meta: [
      { title: "Solicitações de número · 0WEB Painel" },
      {
        name: "description",
        content: "Envios feitos às marcas sem destino, com status e resposta registrada.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DestinationRequestsPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type SeedProject = { slug: string; clientKey: string; title?: string; city?: string; state?: string };
const SEED = (Array.isArray(seedJson)
  ? seedJson
  : ((seedJson as { projects?: SeedProject[] }).projects ?? [])) as SeedProject[];

const STATUS_LABEL: Record<string, string> = {
  ENVIADO: "Enviado, aguardando resposta",
  RESPONDIDO: "Respondido",
  SEM_RESPOSTA: "Sem resposta",
  RECUSADO: "Recusou informar",
  NUMERO_RECEBIDO: "Número recebido",
};

const CHANNELS = ["whatsapp", "instagram", "e-mail", "telefone", "site", "presencial"];

const dt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

function DestinationRequestsPage() {
  const load = useServerFn(listDestinationRequests);
  const create = useServerFn(createDestinationRequest);
  const update = useServerFn(updateDestinationRequest);

  const [rows, setRows] = useState<DestinationRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [clientKey, setClientKey] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [note, setNote] = useState("");
  const [term, setTerm] = useState("");

  const titleByKey = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of SEED) map.set(p.clientKey, p.title || p.clientKey);
    return map;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await load();
      setRows(result.rows);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientKey) return;
    setError(null);
    setNotice(null);
    try {
      const seed = SEED.find((p) => p.clientKey === clientKey);
      await create({ data: { client_key: clientKey, slug: seed?.slug, channel, sent_note: note || undefined } });
      setNote("");
      setNotice("Solicitação registrada.");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const setStatus = async (row: DestinationRequestRow, status: string) => {
    setError(null);
    try {
      await update({ data: { id: row.id, status: status as never, response_note: row.response_note ?? undefined } });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const saveResponse = async (row: DestinationRequestRow, text: string) => {
    setError(null);
    try {
      await update({ data: { id: row.id, status: row.status as never, response_note: text || undefined } });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      `${r.client_key} ${titleByKey.get(r.client_key) ?? ""} ${r.channel}`.toLowerCase().includes(needle),
    );
  }, [rows, term, titleByKey]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Solicitações de número</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            Registre cada envio feito a uma marca sem destino e a resposta recebida. O número completo nunca é
            gravado aqui: a gravação oficial continua em{" "}
            <Link to="/app/funis/numeros" className="text-primary underline">
              Números dos funis
            </Link>
            .
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
      {notice && <p className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">{notice}</p>}

      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-4">
        <label className="block text-sm sm:col-span-2">
          <span className="text-muted-foreground">Marca</span>
          <select
            value={clientKey}
            onChange={(e) => setClientKey(e.target.value)}
            required
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          >
            <option value="">Selecione…</option>
            {SEED.map((p) => (
              <option key={p.clientKey} value={p.clientKey}>
                {p.title || p.clientKey}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Canal</span>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          >
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-3">
          <span className="text-muted-foreground">Observação do envio</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex.: mensagem enviada pelo Instagram oficial"
            className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          />
        </label>
        <button
          type="submit"
          className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <Send className="h-4 w-4" aria-hidden="true" /> Registrar envio
        </button>
      </form>

      <label className="mt-6 block max-w-sm text-sm">
        <span className="text-muted-foreground">Buscar</span>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Marca ou canal"
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
        />
      </label>

      <p className="mt-4 text-sm text-muted-foreground">
        {loading ? "Carregando…" : `${filtered.length} solicitação(ões) registrada(s).`}
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2">Marca</th>
              <th className="py-2">Canal</th>
              <th className="py-2">Enviado em</th>
              <th className="py-2">Status</th>
              <th className="py-2">Resposta</th>
              <th className="py-2">Respondido em</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="py-2">
                  <span className="font-medium">{titleByKey.get(r.client_key) ?? r.client_key}</span>
                  <span className="block text-xs text-muted-foreground">{r.client_key}</span>
                </td>
                <td className="py-2">{r.channel}</td>
                <td className="py-2">
                  {dt(r.sent_at)}
                  {r.sent_note && <span className="block text-xs text-muted-foreground">{r.sent_note}</span>}
                </td>
                <td className="py-2">
                  <select
                    value={r.status}
                    onChange={(e) => void setStatus(r, e.target.value)}
                    aria-label={`Status da solicitação de ${r.client_key}`}
                    className="min-h-11 rounded-md border border-input bg-background px-2"
                  >
                    {Object.entries(STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <input
                    defaultValue={r.response_note ?? ""}
                    onBlur={(e) => void saveResponse(r, e.target.value)}
                    placeholder="Resposta recebida"
                    aria-label={`Resposta de ${r.client_key}`}
                    className="min-h-11 w-56 rounded-md border border-input bg-background px-2"
                  />
                </td>
                <td className="py-2">{dt(r.response_at)}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-muted-foreground">
                  Nenhuma solicitação registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
