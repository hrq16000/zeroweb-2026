/**
 * Parcerias: comissões registradas por parceiro + comprovante de contato com as
 * marcas (fila de solicitações de número).
 *
 * Somente leitura, sem segunda fonte de verdade: comissões vêm de
 * `partner_commissions` e o comprovante de envio vem de
 * `portfolio_destination_requests` (canal real, data e situação registrados no
 * momento do envio). Nada é estimado nem preenchido por padrão.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Handshake, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listPartnerCommissionsAdmin } from "@/lib/partners.functions";
import {
  listDestinationRequests,
  type DestinationRequestRow,
} from "@/lib/portfolio-destination-requests.functions";
import {
  listPortfolioRequests,
  type PortfolioRequestRow,
} from "@/lib/portfolio-requests.functions";

export const Route = createFileRoute("/_authenticated/app/parcerias")({
  head: () => ({
    meta: [
      { title: "Parcerias · 0WEB Painel" },
      {
        name: "description",
        content:
          "Comissões registradas por parceiro e comprovante de contato com cada marca, com canal, data e situação.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ParceriasPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Erro: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6">Não encontrado.</div>,
});

type CommissionRow = {
  id: string;
  partner_name: string;
  partner_kind: string | null;
  partner_status: string | null;
  partner_place: string | null;
  commission_type: string;
  base_amount_cents: number;
  commission_amount_cents: number;
  status: string;
  period: string | null;
  created_at: string;
};

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const SITUACAO: Record<string, string> = {
  ENVIADO: "Enviado, aguardando resposta",
  RESPONDIDO: "Respondido",
  SEM_RESPOSTA: "Sem resposta",
  RECUSADO: "Recusado",
  NUMERO_RECEBIDO: "Número recebido",
};

function ParceriasPage() {
  const loadCommissions = useServerFn(listPartnerCommissionsAdmin);
  const loadRequests = useServerFn(listDestinationRequests);
  const loadSampleLeads = useServerFn(listPortfolioRequests);
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [requests, setRequests] = useState<DestinationRequestRow[]>([]);
  const [sampleLeads, setSampleLeads] = useState<PortfolioRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, r, s] = await Promise.all([
        loadCommissions(),
        loadRequests(),
        loadSampleLeads({ data: { only_sample: true, days: 90, limit: 200 } }),
      ]);
      setRows(c.rows as CommissionRow[]);
      setRequests(r.rows);
      setSampleLeads(s.requests);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [loadCommissions, loadRequests, loadSampleLeads]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totals = useMemo(() => {
    const paid = rows.filter((r) => r.status === "pago");
    const pending = rows.filter((r) => r.status !== "pago");
    return {
      total: rows.reduce((s, r) => s + r.commission_amount_cents, 0),
      pago: paid.reduce((s, r) => s + r.commission_amount_cents, 0),
      pendente: pending.reduce((s, r) => s + r.commission_amount_cents, 0),
    };
  }, [rows]);

  const visibleRequests = useMemo(
    () => (statusFilter ? requests.filter((r) => r.status === statusFilter) : requests),
    [requests, statusFilter],
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Parcerias</h1>
          <p className="text-sm text-muted-foreground">
            Comissões registradas por parceiro e comprovante do contato feito com cada marca.
          </p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Comissão registrada", value: brl(totals.total) },
          { label: "Já paga", value: brl(totals.pago) },
          { label: "A pagar", value: brl(totals.pendente) },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-xl font-semibold text-foreground">{c.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Handshake className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">Comissões por parceiro</h2>
          <span className="ml-auto text-sm text-muted-foreground">{rows.length} lançamentos</span>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Nenhuma comissão registrada até agora. Os valores aparecem aqui assim que uma venda
            atribuída a um parceiro for calculada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Parceiro</th>
                  <th className="px-4 py-2 font-medium">Tipo</th>
                  <th className="px-4 py-2 font-medium">Base</th>
                  <th className="px-4 py-2 font-medium">Comissão</th>
                  <th className="px-4 py-2 font-medium">Situação</th>
                  <th className="px-4 py-2 font-medium">Período</th>
                  <th className="px-4 py-2 font-medium">Registro</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-2 text-foreground">
                      {r.partner_name}
                      <span className="block text-xs text-muted-foreground">
                        {[r.partner_kind, r.partner_place].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{r.commission_type}</td>
                    <td className="px-4 py-2 text-muted-foreground">{brl(r.base_amount_cents)}</td>
                    <td className="px-4 py-2 text-foreground">{brl(r.commission_amount_cents)}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.status}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.period ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{dt(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border">
          <Send className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">Comprovante de envio às marcas</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-auto min-h-9 rounded-md border border-input bg-background px-2 text-sm"
            aria-label="Filtrar por situação"
          >
            <option value="">Todas as situações</option>
            {Object.entries(SITUACAO).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {visibleRequests.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Nenhum envio registrado com esse filtro. Os envios são registrados em Funis → Marcas sem
            destino.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Marca</th>
                  <th className="px-4 py-2 font-medium">Canal</th>
                  <th className="px-4 py-2 font-medium">Enviado em</th>
                  <th className="px-4 py-2 font-medium">Situação</th>
                  <th className="px-4 py-2 font-medium">Resposta</th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-2 text-foreground">
                      {r.slug ?? r.client_key}
                      {r.sent_note && (
                        <span className="block text-xs text-muted-foreground">{r.sent_note}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{r.channel}</td>
                    <td className="px-4 py-2 text-muted-foreground">{dt(r.sent_at)}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {SITUACAO[r.status] ?? r.status}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {r.response_at ? dt(r.response_at) : "—"}
                      {r.response_note && (
                        <span className="block text-xs">{r.response_note}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border">
          <Handshake className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">
            Contatos recebidos nos portfólios em modo amostra
          </h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {sampleLeads.length} nos últimos 90 dias
          </span>
        </div>
        <p className="px-4 pt-3 text-xs text-muted-foreground">
          Projetos sem WhatsApp próprio ficam publicados como amostra: o pedido é salvo com
          protocolo e o retorno é feito por aqui.
        </p>
        {sampleLeads.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Nenhum contato registrado nesses projetos no período.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Protocolo</th>
                  <th className="px-4 py-2 font-medium">Marca</th>
                  <th className="px-4 py-2 font-medium">Contato</th>
                  <th className="px-4 py-2 font-medium">Recebido</th>
                  <th className="px-4 py-2 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody>
                {sampleLeads.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs text-foreground">
                      {l.protocol ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {l.brand_name ?? l.client_key}
                      <span className="block text-xs text-muted-foreground">{l.client_key}</span>
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {l.contact_name ?? "—"}
                      <span className="block text-xs text-muted-foreground">
                        {l.contact_phone_masked ?? "sem telefone"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{dt(l.created_at)}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {l.recoverability_status ?? l.delivery_status ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
