import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, MessageCircle, Send, Loader2 } from "lucide-react";
import { listCityLeads } from "@/lib/city-leads.functions";
import { startLeadConversation } from "@/lib/phone-leads.functions";
import {
  getWhatsAppBusinessStatus,
  dispatchWhatsAppBatch,
  listWhatsAppBatches,
} from "@/lib/wa-dispatch.functions";

export const Route = createFileRoute("/_authenticated/app/atendimento")({
  component: AtendimentoPage,
});

function AtendimentoPage() {
  const fetchLeads = useServerFn(listCityLeads);
  const openConversation = useServerFn(startLeadConversation);
  const [cidade, setCidade] = useState("all");
  const [days, setDays] = useState(90);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const waStatus = useServerFn(getWhatsAppBusinessStatus);
  const dispatchBatch = useServerFn(dispatchWhatsAppBatch);
  const fetchBatches = useServerFn(listWhatsAppBatches);
  const [mensagem, setMensagem] = useState(
    "Olá! Aqui é da 0WEB. Recebemos seu pedido de diagnóstico do site e podemos seguir por aqui quando for melhor para você.",
  );
  const [disparando, setDisparando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["city-leads", cidade, days],
    queryFn: () => fetchLeads({ data: { cidade, days } }),
  });

  const leads = data?.leads ?? [];

  const { data: waInfo } = useQuery({ queryKey: ["wa-status"], queryFn: () => waStatus() });
  const { data: lotes, refetch: refetchLotes } = useQuery({
    queryKey: ["wa-batches"],
    queryFn: () => fetchBatches(),
  });

  async function dispararLote() {
    setResultado(null);
    setDisparando(true);
    try {
      const alvos = leads.filter((l) => !l.contato_realizado).slice(0, waInfo?.maxPerBatch ?? 50);
      const res = await dispatchBatch({ data: { leadIds: alvos.map((l) => l.id), message: mensagem } });
      setResultado(
        `${res.sent} mensagem(ns) ${res.mode === "simulated" ? "simuladas (sem credenciais)" : "enviadas"} · ${res.failed} falha(s) · ${res.skipped} em opt-out.`,
      );
      await refetchLotes();
    } catch (error) {
      setResultado(error instanceof Error ? error.message : "Falha no disparo.");
    } finally {
      setDisparando(false);
    }
  }

  async function abrir(leadId: string) {
    setAviso(null);
    const res = await openConversation({ data: { leadId } });
    if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
    else setAviso("Lead sem telefone válido.");
  }

  async function abrirTodos() {
    setAviso(null);
    setEnviando(true);
    const pendentes = leads.filter((l) => !l.contato_realizado).slice(0, 10);
    let abertos = 0;
    for (const lead of pendentes) {
      try {
        const res = await openConversation({ data: { leadId: lead.id } });
        if (res.ok) {
          window.open(res.url, "_blank", "noopener,noreferrer");
          abertos += 1;
          await new Promise((r) => setTimeout(r, 600));
        }
      } catch {
        /* segue para o próximo */
      }
    }
    setEnviando(false);
    setAviso(
      abertos
        ? `${abertos} conversa(s) aberta(s) com a mensagem pronta. Basta enviar em cada janela.`
        : "Nenhum lead pendente com telefone válido.",
    );
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Atendimento por cidade</h1>
        <p className="text-sm text-muted-foreground">
          Leads agrupados pela cidade de origem (página da capital, resposta do quiz ou DDD do telefone).
        </p>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="text-sm">
          <span className="mr-2 text-muted-foreground">Cidade</span>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground"
          >
            <option value="all">Todas</option>
            {(data?.cidades ?? []).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome} ({c.leads})
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-2 text-muted-foreground">Período</span>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground"
          >
            <option value={30}>30 dias</option>
            <option value={90}>90 dias</option>
            <option value={180}>180 dias</option>
          </select>
        </label>
        <button
          type="button"
          onClick={abrirTodos}
          disabled={enviando || leads.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Abrir conversas pendentes (até 10)
        </button>
      </div>

      {aviso && <p className="mb-4 text-sm text-muted-foreground">{aviso}</p>}

      <section className="mb-8 rounded-xl border border-border p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">Disparo em lote (WhatsApp Business)</h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {waInfo?.mode === "cloud_api" ? "API conectada" : "modo simulado — sem credenciais"}
          </span>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          Envia para até {waInfo?.maxPerBatch ?? 50} leads pendentes do filtro atual. Telefones em opt-out são
          ignorados automaticamente. Sem credenciais configuradas, o lote é registrado como simulado e nenhuma
          mensagem sai.
        </p>
        <label className="block text-sm">
          <span className="text-muted-foreground">Mensagem</span>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={3}
            maxLength={900}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <button
          type="button"
          onClick={dispararLote}
          disabled={disparando || leads.length === 0}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {disparando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Disparar lote
        </button>
        {resultado && <p className="mt-3 text-sm text-muted-foreground">{resultado}</p>}
        {!!lotes?.length && (
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            {lotes.slice(0, 5).map((b) => (
              <li key={b.id}>
                {new Date(b.createdAt).toLocaleString("pt-BR")} · {b.channel} · {b.sent} enviadas · {b.failed} falhas ·{" "}
                {b.skipped} opt-out
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.cidades ?? []).slice(0, 8).map((c) => (
          <div key={c.slug} className="rounded-lg border border-border bg-card p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {c.nome} · {c.uf}
            </p>
            <p className="text-xl font-semibold text-foreground">{c.leads}</p>
            <p className="text-xs text-muted-foreground">{c.contatados} já contatados</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando leads…</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum lead com telefone no período.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Cidade</th>
                <th className="px-3 py-2">Origem</th>
                <th className="px-3 py-2">Recebido</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border/60">
                  <td className="px-3 py-2 text-foreground">{l.nome}</td>
                  <td className="px-3 py-2">{l.cidade}</td>
                  <td className="px-3 py-2 text-muted-foreground">{l.origem}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(l.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 py-2">
                    {l.contato_realizado ? (
                      <span className="text-emerald-600">contatado</span>
                    ) : (
                      <span className="text-muted-foreground">pendente</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => abrir(l.id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Abrir conversa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
