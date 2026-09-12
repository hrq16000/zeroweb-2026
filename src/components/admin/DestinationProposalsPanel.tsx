import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  approveDestinationProposal,
  listDestinationProposals,
  rejectDestinationProposal,
  type DestinationProposal,
} from "@/lib/portfolio-destination-proposals.functions";

/**
 * Tela de confirmação: contatos encontrados em fonte oficial pública ficam
 * aguardando aprovação humana. Nada é gravado sem clique explícito, e o número
 * nunca aparece inteiro.
 */
export function DestinationProposalsPanel({ onApproved }: { onApproved?: () => void }) {
  const list = useServerFn(listDestinationProposals);
  const approve = useServerFn(approveDestinationProposal);
  const reject = useServerFn(rejectDestinationProposal);

  const [rows, setRows] = useState<DestinationProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyStrong, setOnlyStrong] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ack, setAck] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await list({ data: { status: "PENDING" } });
      setRows(r.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar sugestões");
    } finally {
      setLoading(false);
    }
  }, [list]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () => (onlyStrong ? rows.filter((r) => r.matchStrength === "STRONG") : rows),
    [rows, onlyStrong],
  );
  const grouped = useMemo(() => {
    const map = new Map<string, DestinationProposal[]>();
    for (const r of visible) map.set(r.slug, [...(map.get(r.slug) ?? []), r]);
    return [...map.entries()];
  }, [visible]);

  const onApprove = async (row: DestinationProposal) => {
    setBusyId(row.id);
    setFeedback(null);
    try {
      const result = await approve({
        data: {
          id: row.id,
          note: notes[row.id] ?? "",
          acknowledgeLandline: ack[row.id] ?? false,
          acknowledgeShared: ack[`shared:${row.id}`] ?? false,
          acknowledgeChange: ack[`change:${row.id}`] ?? false,
        },
      });
      setFeedback(`${row.slug}: ${result.status} — ${result.message}`);
      if (result.ok) {
        await load();
        onApproved?.();
      }
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Falha ao gravar destino");
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (row: DestinationProposal) => {
    setBusyId(row.id);
    try {
      await reject({ data: { id: row.id, note: notes[row.id] ?? "" } });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section aria-labelledby="proposals-title" className="mt-6 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="proposals-title" className="font-display text-lg font-semibold">
          Sugestões de contato para confirmar
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={onlyStrong} onChange={(e) => setOnlyStrong(e.target.checked)} />
            Só correspondência forte
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="min-h-9 rounded-md border border-border px-3 text-xs font-semibold"
          >
            Atualizar
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Encontradas em ficha pública do próprio negócio. Nada é gravado sem sua confirmação; o número aparece
        sempre mascarado.
      </p>

      {feedback && (
        <p role="status" className="mt-3 rounded-md border border-border bg-muted/40 p-3 text-xs font-semibold">
          {feedback}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-3 text-sm text-muted-foreground">Carregando sugestões…</p>}
      {!loading && !error && !grouped.length && (
        <p className="mt-3 text-sm text-muted-foreground">Nenhuma sugestão pendente com esse filtro.</p>
      )}

      <div className="mt-3 space-y-4">
        {grouped.map(([slug, items]) => (
          <article key={slug} className="rounded-lg border border-border p-3">
            <h3 className="text-sm font-semibold">
              {slug}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {items.length} sugestão(ões)
              </span>
            </h3>
            <ul className="mt-2 space-y-3">
              {items.map((row) => (
                <li key={row.id} className="rounded-md border border-border bg-muted/20 p-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                    <span className="font-medium">{row.candidateName ?? "—"}</span>
                    <span className="text-xs text-muted-foreground">{row.candidateCategory ?? "—"}</span>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-semibold ${
                        row.matchStrength === "STRONG"
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {row.matchStrength}
                    </span>
                    <span className="text-xs font-semibold">{row.masked ?? "—"}</span>
                    {row.looksLikeLandline && (
                      <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                        parece telefone fixo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-normal text-xs text-muted-foreground">
                    {row.candidateAddress ?? "Endereço não informado"}
                    {row.placeId ? ` · Place ID ${row.placeId}` : ""}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      aria-label={`Observação sobre a sugestão de ${slug}`}
                      value={notes[row.id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
                      placeholder="Observação (quem conferiu, onde)"
                      className="min-h-9 min-w-[16rem] flex-1 rounded-md border border-border bg-background px-2 text-sm"
                    />
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void onApprove(row)}
                      className="min-h-9 rounded-md border border-primary bg-primary/10 px-3 text-xs font-semibold text-primary disabled:opacity-50"
                    >
                      {busyId === row.id ? "Gravando…" : "Confirmar e gravar"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => void onReject(row)}
                      className="min-h-9 rounded-md border border-border px-3 text-xs font-semibold disabled:opacity-50"
                    >
                      Descartar
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={ack[row.id] ?? false}
                        onChange={(e) => setAck((a) => ({ ...a, [row.id]: e.target.checked }))}
                      />
                      Confirmo que este número atende no WhatsApp
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={ack[`shared:${row.id}`] ?? false}
                        onChange={(e) => setAck((a) => ({ ...a, [`shared:${row.id}`]: e.target.checked }))}
                      />
                      Pode ser compartilhado com outro projeto
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={ack[`change:${row.id}`] ?? false}
                        onChange={(e) => setAck((a) => ({ ...a, [`change:${row.id}`]: e.target.checked }))}
                      />
                      Confirmo a troca de um destino já verificado
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
