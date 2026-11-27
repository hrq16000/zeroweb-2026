import { useCallback, useEffect, useMemo, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Link } from '@tanstack/react-router';
import { Activity, CheckCircle2, ChevronLeft, ChevronRight, Download, FileText, RefreshCcw, XCircle } from 'lucide-react';
import { decideLhciRun, getLhciCoverage, getLhciRun, listLhciRuns } from '@/lib/lhci.functions';
import { buildReceiptCoverage, measurementState, MEASUREMENT_STATES, MEASUREMENT_STATE_LABEL, receiptMetadata, receiptOrigin, receiptProject, type MeasurementState, type ReceiptRow } from '@/lib/lhci-receipt-tracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PAGE_SIZE = 50;
const pct = (n: number | null) => n == null ? '—' : Math.round(n * 100);
const date = (value: string | null) => value ? new Date(value).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Não informada';
const STATE_CLASS: Record<MeasurementState, string> = { aprovado: 'text-primary', reprovado: 'text-destructive', em_execucao: 'text-foreground', pendente: 'text-muted-foreground', falha_coleta: 'text-destructive' };
const title = (slug: string) => slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
function path(url: string) { try { return new URL(url).pathname; } catch { return url; } }
function download(name: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function LhciAdmin() {
  const list = useServerFn(listLhciRuns);
  const get = useServerFn(getLhciRun);
  const decide = useServerFn(decideLhciRun);
  const coverageRead = useServerFn(getLhciCoverage);
  const [environment, setEnvironment] = useState('all');
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [state, setState] = useState<'all' | MeasurementState>('all');
  const [automaticTotal, setAutomaticTotal] = useState<number | null>(null);
  const [lastAutomaticAt, setLastAutomaticAt] = useState<string | null>(null);
  const [rows, setRows] = useState<ReceiptRow[]>([]);
  const [coverageRows, setCoverageRows] = useState<ReceiptRow[]>([]);
  const [coverageComplete, setCoverageComplete] = useState(true);
  const [total, setTotal] = useState(0);
  const [canDecide, setCanDecide] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getLhciRun>>['row'] | null>(null);
  const [decision, setDecision] = useState<{ id: string; action: 'approved' | 'rejected' } | null>(null);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [result, coverage] = await Promise.all([
        list({ data: { ...(environment === 'all' ? {} : { environment }), ...(state === 'all' ? {} : { state }), ...(query ? { search: query } : {}), limit: PAGE_SIZE, offset } }), coverageRead(),
      ]);
      setRows(result.rows as ReceiptRow[]); setTotal(result.total);
      setCanDecide(result.canDecide); setConfigured(result.receivingConfigured);
      setCoverageRows(coverage.rows as ReceiptRow[]); setCoverageComplete(coverage.complete);
      setAutomaticTotal(coverage.automaticTotal); setLastAutomaticAt(coverage.lastAutomaticAt);
    } catch { setError('Não foi possível atualizar os recebimentos.'); }
    finally { setLoading(false); }
  }, [list, coverageRead, environment, state, query, offset]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { const timer = setTimeout(() => { setQuery(search.trim()); setOffset(0); }, 400); return () => clearTimeout(timer); }, [search]);
  useEffect(() => {
    const timer = setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 60000);
    return () => clearInterval(timer);
  }, [refresh]);

  const coverage = useMemo(() => buildReceiptCoverage(coverageRows), [coverageRows]);
  const pending = coverage.filter(item => !item.latest).length;
  const automatic = coverageRows.filter(row => receiptMetadata(row).automatic).length;
  const visible = rows;
  const chart = [...rows].reverse().map(row => ({ t: date(receiptMetadata(row).measuredAt ?? row.created_at), perf: pct(row.performance), seo: pct(row.seo) }));

  const open = async (id: string) => {
    setOpenId(id); setDetail(null); setError('');
    try { const result = await get({ data: { id } }); setDetail(result.row); }
    catch { setError('Não foi possível abrir esta medição.'); }
  };
  const saveDecision = async () => {
    if (!decision || !canDecide || !reason.trim()) return;
    setSaving(true);
    try { await decide({ data: { id: decision.id, decision: decision.action, reason: reason.trim() } }); setDecision(null); setReason(''); await refresh(); }
    catch { setError('Não foi possível salvar a decisão.'); }
    finally { setSaving(false); }
  };

  return <section aria-label="Recebimentos Lighthouse" className="min-w-0 space-y-6 border-y border-border py-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><Activity className="size-5 text-primary" />Medições Lighthouse</h2><p className="mt-1 text-sm text-muted-foreground">Datas em Brasília · {total} recebimentos</p></div>
      <div className="flex flex-wrap gap-2"><Button variant="outline" className="min-h-11" asChild><Link to="/painel-lighthouse"><FileText />Painel de recebimentos</Link></Button><Button variant="outline" className="min-h-11" onClick={() => void refresh()} disabled={loading}><RefreshCcw className={loading ? 'animate-spin motion-reduce:animate-none' : ''} />Atualizar medições</Button></div>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="grid gap-5 border-y border-border py-5 sm:grid-cols-3">
      <Metric label="Produção recebida" value={`${coverage.length - pending}/${coverage.length}`} />
      <Metric label="Sem medição recebida" value={String(pending)} />
      <Metric label="Recebidas sozinhas do GitHub (todos os ambientes)" value={automaticTotal == null ? '—' : automaticTotal.toLocaleString('pt-BR')} />
    </div>
    <p role="status" className="text-sm text-muted-foreground">{configured ? (automaticTotal ? `Recebimento automático ativo · última entrada em ${date(lastAutomaticAt)}.${automatic ? '' : ' Ainda sem medição automática do site em produção.'}` : 'Chave configurada · aguardando o primeiro recebimento automático.') : 'Recebimento automático sem chave configurada.'}</p>
    {!coverageComplete && <p className="text-sm text-destructive">Cobertura parcial: há mais registros do que o limite desta consulta.</p>}
    <div><h3 className="mb-3 font-semibold">Candidaturas acompanhadas · produção</h3>
      <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">{coverage.map(item => <div key={item.slug} className="flex min-w-0 items-center justify-between gap-3 border-b border-border py-3 text-sm">
        <span className="min-w-0"><span className="block font-medium">{title(item.slug)}</span><span className="text-xs text-muted-foreground">{item.latest ? date(receiptMetadata(item.latest).measuredAt) : 'Aguardando medição'}</span></span>
        <span className={item.latest ? 'shrink-0 text-primary' : 'shrink-0 text-muted-foreground'}>{item.count ? `${item.count} recebidas` : 'Pendente'}</span>
      </div>)}</div>
    </div>
    <div className="flex flex-wrap gap-3">
      <Input aria-label="Buscar projeto ou endereço" placeholder="Buscar projeto ou endereço" value={search} onChange={e => setSearch(e.target.value)} className="min-h-11 sm:max-w-sm" />
      <Select value={environment} onValueChange={value => { setEnvironment(value); setOffset(0); }}><SelectTrigger aria-label="Ambiente Lighthouse" className="min-h-11 w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os ambientes</SelectItem><SelectItem value="prod">Produção</SelectItem><SelectItem value="staging">Prévia de revisão</SelectItem><SelectItem value="dev">Desenvolvimento</SelectItem></SelectContent></Select>
      <Select value={state} onValueChange={value => { setState(value as 'all' | MeasurementState); setOffset(0); }}><SelectTrigger aria-label="Status da medição" className="min-h-11 w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os status</SelectItem>{MEASUREMENT_STATES.map(item => <SelectItem key={item} value={item}>{MEASUREMENT_STATE_LABEL[item]}</SelectItem>)}</SelectContent></Select>
    </div>
    {rows.length > 1 && <div className="min-w-0" aria-label="Performance e SEO das medições"><h3 className="mb-2 text-sm font-medium">Performance e SEO · notas de 0 a 100</h3><ResponsiveContainer width="100%" height={180}><LineChart data={chart}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="t" hide /><YAxis domain={[0,100]} /><Tooltip /><Line type="linear" dataKey="perf" name="Performance" stroke="var(--primary)" dot={false} isAnimationActive={false} /><Line type="linear" dataKey="seo" name="SEO" stroke="var(--accent)" dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>}
    <div className="overflow-x-auto" role="region" aria-label="Histórico de medições" tabIndex={0}>
      <table className="w-full min-w-[1100px] text-sm"><thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-3 pr-4">Data da medição</th><th className="pr-4">Projeto e domínio</th><th className="pr-4">Desempenho</th><th className="pr-4">Acessibilidade</th><th className="pr-4">Boas práticas</th><th className="pr-4">SEO</th><th className="pr-4">Status</th><th className="pr-4">Origem</th><th>Ações</th></tr></thead><tbody>
        {!visible.length && <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">{loading ? 'Carregando medições…' : 'Nenhuma medição neste filtro.'}</td></tr>}
        {visible.map(row => { const meta = receiptMetadata(row); const current = measurementState(row); const project = receiptProject(row.url); return <tr key={row.id} className="border-b border-border align-top">
          <td className="whitespace-nowrap py-4 pr-4 tabular-nums">{date(meta.measuredAt)}<span className="block text-xs text-muted-foreground">Recebida: {date(meta.receivedAt)}</span></td>
          <td className="max-w-64 py-4 pr-4"><Button variant="link" onClick={() => void open(row.id)} className="h-auto min-h-11 whitespace-normal p-0 text-left font-medium">{project.project}</Button><span className="block break-all text-xs text-muted-foreground">{project.domain}{project.path} · {row.environment}</span></td>
          <td className="py-4 pr-4 font-semibold tabular-nums">{pct(row.performance)}<span className="block text-xs font-normal text-muted-foreground">LCP {row.lcp_ms == null ? '—' : `${Math.round(row.lcp_ms)} ms`}</span></td>
          <td className="py-4 pr-4 tabular-nums">{pct(row.accessibility)}</td>
          <td className="py-4 pr-4 tabular-nums">{pct(row.best_practices)}</td>
          <td className="py-4 pr-4 tabular-nums">{pct(row.seo)}</td>
          <td className="py-4 pr-4"><span className={`font-medium ${STATE_CLASS[current]}`}>{MEASUREMENT_STATE_LABEL[current]}</span><span className="block text-xs text-muted-foreground">{row.decision === 'approved' ? 'Liberada pelo admin' : row.decision === 'rejected' ? 'Recusada pelo admin' : 'Sem decisão administrativa'}</span></td>
          <td className="py-4 pr-4">{receiptOrigin(row)}</td>
          <td className="py-3"><div className="flex gap-1"><Button variant="ghost" size="icon" className="size-11" title="Detalhes da medição" aria-label="Detalhes da medição" onClick={() => void open(row.id)}><FileText /></Button>{canDecide && <><Button variant="ghost" size="icon" className="size-11" title="Liberar administrativamente" aria-label="Liberar administrativamente" onClick={() => { setReason(''); setDecision({ id: row.id, action: 'approved' }); }}><CheckCircle2 /></Button><Button variant="ghost" size="icon" className="size-11 text-destructive" title="Recusar administrativamente" aria-label="Recusar administrativamente" onClick={() => { setReason(''); setDecision({ id: row.id, action: 'rejected' }); }}><XCircle /></Button></>}</div></td>
        </tr>; })}
      </tbody></table>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"><span>{total ? `${offset + 1}–${Math.min(offset + PAGE_SIZE,total)} de ${total}` : '0 recebimentos'}</span><div className="flex gap-2"><Button variant="outline" className="size-11" size="icon" aria-label="Página anterior" disabled={offset === 0 || loading} onClick={() => setOffset(Math.max(0,offset-PAGE_SIZE))}><ChevronLeft /></Button><Button variant="outline" className="size-11" size="icon" aria-label="Próxima página" disabled={offset+PAGE_SIZE >= total || loading} onClick={() => setOffset(offset+PAGE_SIZE)}><ChevronRight /></Button></div></div>
    <Dialog open={openId !== null} onOpenChange={value => { if (!value) { setOpenId(null); setDetail(null); } }}><DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg"><DialogHeader><DialogTitle>Detalhes da medição</DialogTitle><DialogDescription>{detail ? path(String(detail.url)) : 'Carregando…'}</DialogDescription></DialogHeader>{detail && <><dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Data original</dt><dd>{date(receiptMetadata(detail as ReceiptRow).measuredAt)}</dd></div><div><dt className="text-muted-foreground">Recebida em</dt><dd>{date(String(detail.created_at))}</dd></div><div><dt className="text-muted-foreground">Performance</dt><dd>{pct(detail.performance)}</dd></div><div><dt className="text-muted-foreground">Status recebido</dt><dd>{String(detail.status)}</dd></div></dl>{detail.decision_reason && <p className="text-sm">{String(detail.decision_reason)}</p>}<Button variant="outline" className="min-h-11 justify-self-start" onClick={() => download(`lighthouse-${detail.id}.json`,detail)}><Download />Baixar JSON</Button><pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all bg-muted p-3 text-xs">{JSON.stringify(detail.logs ?? {},null,2)}</pre></>}</DialogContent></Dialog>
    <Dialog open={decision !== null} onOpenChange={value => { if (!value) setDecision(null); }}><DialogContent className="w-[calc(100%-2rem)] rounded-lg"><DialogHeader><DialogTitle>Decisão administrativa</DialogTitle><DialogDescription>A nota medida permanece inalterada.</DialogDescription></DialogHeader><label className="space-y-2 text-sm">Motivo<Input value={reason} maxLength={500} onChange={e => setReason(e.target.value)} /></label><Button disabled={saving || !reason.trim()} className="min-h-11" onClick={() => void saveDecision()}>{saving ? 'Salvando…' : 'Confirmar decisão'}</Button></DialogContent></Dialog>
  </section>;
}
function Metric({label,value}:{label:string;value:string}) { return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</p></div>; }
