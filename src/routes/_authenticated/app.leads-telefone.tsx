import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Phone, Filter, PhoneCall, Users, MousePointerClick, MessageCircle } from "lucide-react";
import { listPhoneLeads, startLeadConversation, type PhoneLead } from "@/lib/phone-leads.functions";

export const Route = createFileRoute("/_authenticated/app/leads-telefone")({
  component: PhoneLeadsPage,
});

function PhoneLeadsPage() {
  const fetchLeads = useServerFn(listPhoneLeads);
  const openConversation = useServerFn(startLeadConversation);
  const [conversando, setConversando] = useState<string | null>(null);
  const [erroConversa, setErroConversa] = useState<string | null>(null);

  async function iniciarConversa(leadId: string) {
    setErroConversa(null);
    setConversando(leadId);
    try {
      const res = await openConversation({ data: { leadId } });
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setErroConversa(res.reason === "sem_telefone" ? "Lead sem telefone." : "Telefone inválido.");
    } catch {
      setErroConversa("Não foi possível abrir a conversa.");
    } finally {
      setConversando(null);
    }
  }

  const [segmento, setSegmento] = useState("all");
  const [etapa, setEtapa] = useState("all");
  const [somenteContatados, setSomenteContatados] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["phone-leads", segmento, etapa, somenteContatados, from, to],
    queryFn: () =>
      fetchLeads({
        data: {
          segmento,
          etapa,
          somenteContatados,
          from: from || undefined,
          to: to || undefined,
        },
      }),
  });

  const leads = data?.leads ?? [];
  const funil = data?.funil ?? { leads: 0, comTelefone: 0, intencaoContato: 0, contatoReal: 0 };
  const base = Math.max(funil.leads, 1);

  const steps = [
    { label: "Leads com telefone", value: funil.comTelefone, icon: <Users className="w-4 h-4" /> },
    { label: "Intenção de contato", value: funil.intencaoContato, icon: <MousePointerClick className="w-4 h-4" /> },
    { label: "Contato real (WhatsApp aberto)", value: funil.contatoReal, icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const porSegmento = new Map<string, { total: number; contato: number }>();
  for (const l of leads) {
    const cur = porSegmento.get(l.segmento) ?? { total: 0, contato: 0 };
    cur.total += 1;
    if (l.contato_realizado) cur.contato += 1;
    porSegmento.set(l.segmento, cur);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Phone className="w-6 h-6 text-primary" /> Leads por telefone e segmento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Somente leads que informaram telefone. O funil mostra quantos avançaram até o contato real.
          O acesso a esta tela é registrado na auditoria.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Funil até o contato real</h2>
        <ul className="space-y-3">
          {steps.map((s) => (
            <li key={s.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-2">
                  {s.icon}
                  {s.label}
                </span>
                <span className="font-semibold tabular-nums">
                  {s.value} · {Math.round((s.value / base) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.round((s.value / base) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Conversão por segmento</h2>
        {porSegmento.size === 0 ? (
          <p className="text-xs text-muted-foreground">Sem leads no recorte atual.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {Array.from(porSegmento.entries())
              .sort((a, b) => b[1].total - a[1].total)
              .map(([seg, v]) => (
                <li key={seg} className="flex items-center justify-between">
                  <span className="capitalize">{seg}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {v.contato}/{v.total} chegaram ao contato
                  </span>
                </li>
              ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select
          value={segmento}
          onChange={(e) => setSegmento(e.target.value)}
          aria-label="Filtrar por segmento"
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="all">Todos os segmentos</option>
          {(data?.segmentos ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={etapa}
          onChange={(e) => setEtapa(e.target.value)}
          aria-label="Filtrar por etapa"
          className="text-sm rounded-lg border border-border bg-background px-3 py-2"
        >
          <option value="all">Todas as etapas</option>
          {(data?.etapas ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="text-xs text-muted-foreground flex items-center gap-2">
          De
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="text-xs text-muted-foreground flex items-center gap-2">
          Até
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
        <label className="text-xs flex items-center gap-2">
          <input
            type="checkbox"
            checked={somenteContatados}
            onChange={(e) => setSomenteContatados(e.target.checked)}
          />
          Somente contatos reais
        </label>
      </div>

      {erroConversa && (
        <p className="mb-3 text-xs text-destructive">{erroConversa}</p>
      )}

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Telefone</th>
              <th className="text-left px-4 py-3">Segmento</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Etapa</th>
              <th className="text-left px-4 py-3">Contato</th>
              <th className="text-right px-4 py-3">Conversa</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  Carregando…
                </td>
              </tr>
            )}
            {!isLoading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhum lead com telefone no recorte atual.
                </td>
              </tr>
            )}
            {leads.map((l: PhoneLead) => (
              <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{l.nome}</td>
                <td className="px-4 py-3 tabular-nums">{l.telefone}</td>
                <td className="px-4 py-3 capitalize">{l.segmento}</td>
                <td className="px-4 py-3 hidden md:table-cell">{l.etapa}</td>
                <td className="px-4 py-3">
                  {l.contato_realizado ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs">
                      contato real
                    </span>
                  ) : l.contato_gerado ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs">
                      intenção
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">sem contato</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => iniciarConversa(l.id)}
                    disabled={conversando === l.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 disabled:opacity-60"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {conversando === l.id ? "Abrindo…" : "Abrir conversa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
