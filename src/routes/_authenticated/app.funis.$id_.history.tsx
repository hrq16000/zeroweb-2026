import {createFileRoute,Link} from '@tanstack/react-router';
import {queryOptions,useSuspenseQuery} from '@tanstack/react-query';
import {getFunnelHistory} from '@/lib/funnel-history.functions';
import {leadTracking} from '@/lib/funnel-tracking';
import {Button} from '@/components/ui/button';
const options=(id:string)=>queryOptions({queryKey:['funnel-history',id],queryFn:()=>getFunnelHistory({data:{id}})});
export const Route=createFileRoute('/_authenticated/app/funis/$id_/history')({
 head:()=>({meta:[{title:'Histórico do funil · 0WEB'},{name:'description',content:'Destino cadastrado, protocolos e pendências do funil no painel 0WEB.'},{property:'og:title',content:'Histórico do funil · 0WEB'},{property:'og:description',content:'Acompanhamento administrativo dos leads do funil.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex,nofollow'}]}),
 loader:({context,params})=>context.queryClient.ensureQueryData(options(params.id)),
 errorComponent:({error,reset})=><div role="alert" className="space-y-4"><p>{error instanceof Error ? error.message : 'Não foi possível carregar o funil.'}</p><Button onClick={reset}>Tentar novamente</Button></div>,
 component:FunnelHistory,
});
function FunnelHistory(){const {id}=Route.useParams();const {data}=useSuspenseQuery(options(id));return <div className="space-y-6 max-w-6xl">
 <Button asChild variant="ghost"><Link to="/app/funis/leads">Voltar aos leads</Link></Button><h1 className="text-3xl font-display font-bold">{data.form.name}</h1>
 <dl className="grid gap-5 sm:grid-cols-3 border-y border-border py-5"><div><dt className="text-sm text-muted-foreground">Status do funil</dt><dd className="font-medium">{data.form.status}</dd></div><div><dt className="text-sm text-muted-foreground">WhatsApp cadastrado</dt><dd className="font-mono">{data.destination??'Sem destino confirmado'}</dd></div><div><dt className="text-sm text-muted-foreground">Alertas pendentes ou com falha</dt><dd className="text-2xl font-semibold">{data.pending}</dd></div></dl>
 <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/app/funis/$id" params={{id}}>Editar funil</Link></Button><Button asChild><Link to="/app/funis/leads" search={{formId:id}}>Contatos e respostas</Link></Button></div>
 <h2 className="text-xl font-semibold">Histórico de leads</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left"><th className="p-3">Data</th><th className="p-3">Protocolo</th><th className="p-3">Estágio</th><th className="p-3">Alerta WhatsApp</th></tr></thead><tbody>{data.rows.map(r=><tr key={r.id} className="border-b border-border"><td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString('pt-BR')}</td><td className="p-3 font-mono">{leadTracking(r.metadata_json).protocol??r.id}</td><td className="p-3">{r.pipeline_stage??'novo'}</td><td className="p-3">{r.whatsapp_alert_status??'disabled'}</td></tr>)}</tbody></table></div>{!data.rows.length&&<p className="text-muted-foreground">Nenhum lead neste funil.</p>}{data.rows.length===500&&<p className="text-sm text-muted-foreground">Últimos 500 registros. Consulte os filtros de leads para períodos anteriores.</p>}
 </div>;}
