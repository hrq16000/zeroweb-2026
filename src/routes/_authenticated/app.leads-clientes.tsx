import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, MessageCircle, X, Phone } from "lucide-react";
import { listPhoneLeads, startLeadConversation, type PhoneLead } from "@/lib/phone-leads.functions";
import { getLeadDossier } from "@/lib/lead-dossier.functions";

export const Route = createFileRoute("/_authenticated/app/leads-clientes")({
  component: LeadsClientesPage,
});

function LeadsClientesPage() {
  const fetchLeads = useServerFn(listPhoneLeads);
  const fetchDossier = useServerFn(getLeadDossier);
  const openConversation = useServerFn(startLeadConversation);

  const [busca, setBusca] = useState("");
  const [segmento, setSegmento] = useState("all");
  const [etapa, setEtapa] = useState("all");
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["leads-clientes", segmento, etapa],
    queryFn: () => fetchLeads({ data: { segmento, etapa, limit: 300 } }),
  });

  const dossier = useQuery({
    queryKey: ["lead-dossier", selecionado],
    queryFn: () => fetchDossier({ data: { leadId: selecionado! } }),
    enabled: Boolean(selecionado),
  });

  const leads: PhoneLead[] = useMemo(() => {
    const list = data?.leads ?? [];
    const term = busca.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (l) =>
        l.nome.toLowerCase().includes(term) ||
        l.telefone.toLowerCase().includes(term) ||
        l.segmento.toLowerCase().includes(term),
    );
  }, [data, busca]);

  async function conversar(leadId: string) {
    setErro(null);
    try {
      const res = await openConversation({ data: { leadId } });
      if (res.ok) window.open(res.url, "_blank", "noopener,noreferrer");
      else setErro("Telefone indisponível para este lead.");
    } catch {
      setErro("Não foi possível abrir a conversa.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Leads de clientes</h1>
        <p className="text-sm text-muted-foreground">
          Todos os leads com telefone disponível, com ficha detalhada e histórico completo de interações.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
        <label className="flex-1 min-w-[220px] text-sm">
          <span className="mb-1 block text-muted-foreground">Buscar</span>
          <span className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, telefone ou segmento"
              className="w-full bg-transparent text-foreground outline-none"
            />
          </span>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted-foreground">Segmento</span>
          <select
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="all">Todos</option>
            {(data?.segmentos ?? []).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted-foreground">Etapa</span>
          <select
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="all">Todas</option>
            {(data?.etapas ?? []).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Lead</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3 font-medium">Segmento</th>
              <th className="px-4 py-3 font-medium">Etapa</th>
              <th className="px-4 py-3 font-medium">Contato real</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Carregando leads…
                </td>
              </tr>
            )}
            {!isLoading && leads.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Nenhum lead com telefone para os filtros atuais.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{l.nome}</td>
                <td className="px-4 py-3 text-foreground">{l.telefone}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.segmento}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.etapa}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.contato_realizado ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelecionado(l.id)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                    >
                      Ficha
                    </button>
                    <button
                      type="button"
                      onClick={() => conversar(l.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                      Conversa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selecionado && (
        <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-border bg-card p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {dossier.data?.nome ?? "Ficha do lead"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {dossier.data ? `${dossier.data.segmento} · etapa ${dossier.data.etapa}` : "Carregando…"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelecionado(null)}
              aria-label="Fechar ficha do lead"
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {dossier.isLoading && <p className="text-sm text-muted-foreground">Carregando ficha…</p>}

          {dossier.data && (
            <div className="space-y-6">
              <section className="rounded-md border border-border p-4">
                <h3 className="mb-2 text-sm font-medium text-foreground">Dados</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Telefone</dt>
                    <dd className="flex items-center gap-1 text-foreground">
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {dossier.data.telefone ?? "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Intenção</dt>
                    <dd className="text-foreground">{dossier.data.intent}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Score</dt>
                    <dd className="text-foreground">{dossier.data.score}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Contato real</dt>
                    <dd className="text-foreground">{dossier.data.contatoRealizado ? "Sim" : "Não"}</dd>
                  </div>
                </dl>
              </section>

              {dossier.data.respostas.length > 0 && (
                <section className="rounded-md border border-border p-4">
                  <h3 className="mb-2 text-sm font-medium text-foreground">Respostas do diagnóstico</h3>
                  <dl className="space-y-2 text-sm">
                    {dossier.data.respostas.map((r) => (
                      <div key={r.pergunta}>
                        <dt className="text-muted-foreground">{r.pergunta}</dt>
                        <dd className="text-foreground">{r.resposta}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section className="rounded-md border border-border p-4">
                <h3 className="mb-2 text-sm font-medium text-foreground">Histórico de interações</h3>
                <ol className="space-y-3 text-sm">
                  {dossier.data.interacoes.map((i, idx) => (
                    <li key={`${i.at}-${idx}`} className="border-l-2 border-border pl-3">
                      <p className="text-foreground">{i.tipo}</p>
                      <p className="text-xs text-muted-foreground">{i.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(i.at).toLocaleString("pt-BR")} · {i.canal}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <button
                type="button"
                onClick={() => conversar(dossier.data!.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Abrir conversa no WhatsApp
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
