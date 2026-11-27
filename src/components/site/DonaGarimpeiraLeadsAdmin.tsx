import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, MessageCircle, Plus, RefreshCcw } from "lucide-react";
import {
  addDgInteraction, createDgLead, getDgLead, listDgLeads, prepareDgWhatsApp, updateDgLead,
} from "@/lib/dona-garimpeira-leads.functions";
import {
  DG_INTERACTIONS, DG_INTERACTION_LABEL, DG_ORIGINS, DG_ORIGIN_LABEL, DG_STATUSES, DG_STATUS_LABEL,
  describeHistory, draftReply, type DgInteraction, type DgLeadRow, type DgOrigin, type DgStatus,
} from "@/lib/dona-garimpeira-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const when = (value: string | null) =>
  value ? new Date(value).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }) : "—";
const message = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);
type History = { id: string; kind: string; from_value: string | null; to_value: string | null; note: string | null; actor: string | null; created_at: string };
const EMPTY = { name: "", phone: "", email: "", product: "", origin: "whatsapp" as DgOrigin, message: "", assignee: "" };

export function DonaGarimpeiraLeadsAdmin() {
  const list = useServerFn(listDgLeads);
  const detail = useServerFn(getDgLead);
  const create = useServerFn(createDgLead);
  const update = useServerFn(updateDgLead);
  const interact = useServerFn(addDgInteraction);
  const prepare = useServerFn(prepareDgWhatsApp);

  const [leads, setLeads] = useState<DgLeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"all" | DgStatus>("all");
  const [origin, setOrigin] = useState<"all" | DgOrigin>("all");
  const [product, setProduct] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [openId, setOpenId] = useState<string | null>(null);
  const [lead, setLead] = useState<DgLeadRow | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [kind, setKind] = useState<DgInteraction>("contato_realizado");
  const [note, setNote] = useState("");
  const [reply, setReply] = useState("");
  const [assignee, setAssignee] = useState("");
  const [sheetError, setSheetError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const result = await list({ data: {
        ...(status === "all" ? {} : { status }), ...(origin === "all" ? {} : { origin }),
        ...(product.trim() ? { product: product.trim() } : {}), ...(search.trim() ? { search: search.trim() } : {}),
        ...(from ? { from } : {}), ...(to ? { to } : {}),
      } });
      setLeads(result.leads); setTotal(result.total); setByStatus(result.byStatus);
    } catch (cause) { setError(message(cause, "Não foi possível carregar os leads.")); }
    finally { setLoading(false); }
  }, [list, status, origin, product, search, from, to]);
  useEffect(() => { const timer = setTimeout(() => void refresh(), 300); return () => clearTimeout(timer); }, [refresh]);

  const openLead = useCallback(async (id: string) => {
    setOpenId(id); setLead(null); setHistory([]); setSheetError(""); setNote("");
    try {
      const result = await detail({ data: { id } });
      setLead(result.lead); setHistory(result.history as History[]);
      setReply(draftReply(result.lead)); setAssignee(result.lead.assignee ?? "");
    } catch (cause) { setSheetError(message(cause, "Não foi possível abrir a ficha.")); }
  }, [detail]);
  const reload = async (id: string) => {
    const result = await detail({ data: { id } });
    setLead(result.lead); setHistory(result.history as History[]);
    void refresh();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const result = await create({ data: {
        name: form.name, phone: form.phone, origin: form.origin,
        ...(form.email ? { email: form.email } : {}), ...(form.product ? { product: form.product } : {}),
        ...(form.message ? { message: form.message } : {}), ...(form.assignee ? { assignee: form.assignee } : {}),
      } });
      setCreating(false);
      if (result.created) { setForm(EMPTY); setNotice("Lead cadastrado."); await refresh(); void openLead(result.id); }
      else if (result.id) { setNotice("Este telefone já estava cadastrado. Abrimos a ficha existente."); void openLead(result.id); }
      else setNotice("Este telefone já foi registrado hoje em outro atendimento; nenhum cadastro novo foi criado.");
    } catch (cause) { setError(message(cause, "Não foi possível cadastrar o lead.")); }
    finally { setSaving(false); }
  };

  const run = async (action: () => Promise<unknown>) => {
    if (!openId) return;
    setSaving(true); setSheetError("");
    try { await action(); await reload(openId); }
    catch (cause) { setSheetError(message(cause, "Não foi possível salvar. Leads concluídos precisam ser reabertos antes de novas interações.")); }
    finally { setSaving(false); }
  };
  const openWhatsApp = () => run(async () => {
    if (!openId) return;
    // A janela abre no clique; o endereço só chega depois de a mensagem ficar gravada.
    const tab = window.open("", "_blank");
    try {
      const { url } = await prepare({ data: { id: openId, message: reply } });
      if (tab) tab.location.href = url; else window.location.href = url;
      await interact({ data: { id: openId, kind: "whatsapp_iniciado", note: "" } });
    } catch (cause) { tab?.close(); throw cause; }
  });
  const copyReply = async () => {
    try { await navigator.clipboard.writeText(reply); setNotice("Mensagem copiada."); }
    catch { setSheetError("Não foi possível copiar. Selecione o texto e copie manualmente."); }
  };

  return <section aria-label="Central de leads da Dona Garimpeira" className="min-w-0 space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <p className="max-w-2xl text-sm text-muted-foreground">Contatos comerciais do brechó, guardados no banco e visíveis só para administradores. {total} {total === 1 ? "lead cadastrado" : "leads cadastrados"}.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="min-h-11" onClick={() => void refresh()} disabled={loading}><RefreshCcw className={loading ? "animate-spin motion-reduce:animate-none" : ""} />Atualizar</Button>
        <Button className="min-h-11" onClick={() => { setForm(EMPTY); setCreating(true); }}><Plus />Novo lead</Button>
      </div>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {notice && <p role="status" className="text-sm text-primary">{notice}</p>}

    <div className="grid grid-cols-2 gap-5 border-y border-border py-5 sm:grid-cols-4">
      {DG_STATUSES.map((item) => <button key={item} type="button" onClick={() => setStatus(status === item ? "all" : item)} aria-pressed={status === item} className={`min-h-11 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring ${status === item ? "text-primary" : ""}`}>
        <span className="block text-xs text-muted-foreground">{DG_STATUS_LABEL[item]}</span>
        <span className="mt-1 block font-display text-2xl font-semibold tabular-nums">{byStatus[item] ?? 0}</span>
      </button>)}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <Input aria-label="Pesquisar nome, telefone ou mensagem" placeholder="Pesquisar contato" value={search} onChange={(e) => setSearch(e.target.value)} className="min-h-11 lg:col-span-2" />
      <Input aria-label="Filtrar por produto" placeholder="Produto" value={product} onChange={(e) => setProduct(e.target.value)} className="min-h-11" />
      <Select value={origin} onValueChange={(value) => setOrigin(value as "all" | DgOrigin)}><SelectTrigger aria-label="Origem do contato" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas as origens</SelectItem>{DG_ORIGINS.map((item) => <SelectItem key={item} value={item}>{DG_ORIGIN_LABEL[item]}</SelectItem>)}</SelectContent></Select>
      <Input type="date" aria-label="Data inicial" value={from} onChange={(e) => setFrom(e.target.value)} className="min-h-11" />
      <Input type="date" aria-label="Data final" value={to} onChange={(e) => setTo(e.target.value)} className="min-h-11" />
    </div>

    <ul className="divide-y divide-border border-y border-border">
      {!leads.length && <li className="py-10 text-center text-sm text-muted-foreground">{loading ? "Carregando leads…" : total ? "Nenhum lead neste filtro." : "Nenhum lead cadastrado ainda. Use “Novo lead” para registrar o primeiro contato."}</li>}
      {leads.map((row) => <li key={row.id}>
        <button type="button" onClick={() => void openLead(row.id)} className="grid w-full min-w-0 gap-x-6 gap-y-1 py-4 text-left outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto]">
          <span className="min-w-0"><span className="block truncate font-medium">{row.name ?? "Sem nome"}</span><span className="block text-sm text-muted-foreground tabular-nums">{row.phone ?? "Sem telefone"}</span></span>
          <span className="min-w-0 text-sm"><span className="block truncate">{row.product ?? "Produto não informado"}</span><span className="block text-muted-foreground">{DG_ORIGIN_LABEL[row.origin]} · {row.assignee ?? "Sem responsável"}</span></span>
          <span className="text-sm text-muted-foreground tabular-nums">{when(row.created_at)}</span>
          <span className="text-sm font-medium">{DG_STATUS_LABEL[row.status]}</span>
        </button>
      </li>)}
    </ul>

    <Dialog open={creating} onOpenChange={setCreating}><DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg">
      <DialogHeader><DialogTitle>Novo lead</DialogTitle><DialogDescription>A data e o horário do cadastro são registrados automaticamente.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="dg-name">Nome do cliente</Label><Input id="dg-name" required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="min-h-11" /></div>
        <div className="space-y-2"><Label htmlFor="dg-phone">Telefone com DDD</Label><Input id="dg-phone" required inputMode="tel" maxLength={30} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="min-h-11" /></div>
        <div className="space-y-2"><Label htmlFor="dg-email">E-mail (opcional)</Label><Input id="dg-email" type="email" maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="min-h-11" /></div>
        <div className="space-y-2"><Label htmlFor="dg-product">Produto de interesse</Label><Input id="dg-product" maxLength={200} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="min-h-11" /></div>
        <div className="space-y-2"><Label htmlFor="dg-origin">Origem do contato</Label><Select value={form.origin} onValueChange={(value) => setForm({ ...form, origin: value as DgOrigin })}><SelectTrigger id="dg-origin" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent>{DG_ORIGINS.map((item) => <SelectItem key={item} value={item}>{DG_ORIGIN_LABEL[item]}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label htmlFor="dg-assignee">Responsável</Label><Input id="dg-assignee" maxLength={120} value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} className="min-h-11" /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="dg-message">Mensagem inicial</Label><Textarea id="dg-message" maxLength={2000} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
        <Button type="submit" disabled={saving} className="min-h-11 sm:col-span-2">{saving ? "Salvando…" : "Cadastrar lead"}</Button>
      </form>
    </DialogContent></Dialog>

    <Dialog open={openId !== null} onOpenChange={(value) => { if (!value) { setOpenId(null); setLead(null); } }}><DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg">
      <DialogHeader><DialogTitle>{lead?.name ?? "Ficha do lead"}</DialogTitle><DialogDescription>{lead ? `Cadastrado em ${when(lead.created_at)} · última interação ${when(lead.last_interaction)}` : "Carregando…"}</DialogDescription></DialogHeader>
      {sheetError && <p role="alert" className="text-sm text-destructive">{sheetError}</p>}
      {lead && <div className="grid min-w-0 gap-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Telefone</dt><dd className="tabular-nums">{lead.phone ?? "—"}</dd></div>
          <div><dt className="text-muted-foreground">E-mail</dt><dd className="break-all">{lead.email ?? "—"}</dd></div>
          <div><dt className="text-muted-foreground">Produto de interesse</dt><dd>{lead.product ?? "—"}</dd></div>
          <div><dt className="text-muted-foreground">Origem</dt><dd>{DG_ORIGIN_LABEL[lead.origin]}</dd></div>
          <div className="sm:col-span-2"><dt className="text-muted-foreground">Mensagem inicial</dt><dd className="whitespace-pre-wrap">{lead.message ?? "—"}</dd></div>
        </dl>

        <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="dg-status">Status</Label><Select value={lead.status} onValueChange={(value) => void run(() => update({ data: { id: lead.id, status: value as DgStatus } }))}><SelectTrigger id="dg-status" className="min-h-11" disabled={saving}><SelectValue /></SelectTrigger><SelectContent>{DG_STATUSES.map((item) => <SelectItem key={item} value={item}>{DG_STATUS_LABEL[item]}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="dg-owner">Responsável pelo atendimento</Label><div className="flex gap-2"><Input id="dg-owner" maxLength={120} value={assignee} onChange={(e) => setAssignee(e.target.value)} className="min-h-11" /><Button variant="outline" className="min-h-11" disabled={saving || assignee.trim() === (lead.assignee ?? "")} onClick={() => void run(() => update({ data: { id: lead.id, assignee: assignee.trim() || null } }))}>Salvar</Button></div></div>
        </div>

        <div className="space-y-3 border-t border-border pt-5">
          <Label htmlFor="dg-reply">Resposta para o WhatsApp</Label>
          <Textarea id="dg-reply" rows={4} maxLength={2000} value={reply} onChange={(e) => setReply(e.target.value)} />
          <p className="text-xs text-muted-foreground">Nada é enviado por aqui: a mensagem fica registrada como preparada e a conversa abre no WhatsApp para você enviar.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => void copyReply()} disabled={!reply.trim()}><Copy />Copiar mensagem</Button>
            <Button className="min-h-11" onClick={() => void openWhatsApp()} disabled={saving || !reply.trim() || !lead.phone}><MessageCircle />Abrir conversa no WhatsApp</Button>
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-5">
          <h3 className="font-semibold">Registrar interação</h3>
          <div className="grid gap-3 sm:grid-cols-[14rem_minmax(0,1fr)]">
            <Select value={kind} onValueChange={(value) => setKind(value as DgInteraction)}><SelectTrigger aria-label="Tipo de interação" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent>{DG_INTERACTIONS.map((item) => <SelectItem key={item} value={item}>{DG_INTERACTION_LABEL[item]}</SelectItem>)}</SelectContent></Select>
            <Input aria-label="Detalhes da interação" placeholder={kind === "resposta_enviada" ? "Como a resposta foi comprovada" : "Detalhes (opcional)"} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} className="min-h-11" />
          </div>
          <Button variant="outline" className="min-h-11" disabled={saving} onClick={() => void run(async () => { await interact({ data: { id: lead.id, kind, note } }); setNote(""); })}>Registrar</Button>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="mb-3 font-semibold">Histórico</h3>
          <ol className="divide-y divide-border">
            {history.map((item) => { const entry = describeHistory(item); return <li key={item.id} className="grid gap-x-4 py-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]">
              <span className="text-muted-foreground tabular-nums">{when(item.created_at)}</span>
              <span className="min-w-0"><span className="block font-medium">{entry.title}</span>{entry.text && <span className="block whitespace-pre-wrap break-words text-muted-foreground">{entry.text}</span>}</span>
            </li>; })}
            {!history.length && <li className="py-3 text-sm text-muted-foreground">Sem eventos registrados.</li>}
          </ol>
        </div>
      </div>}
    </DialogContent></Dialog>
  </section>;
}
