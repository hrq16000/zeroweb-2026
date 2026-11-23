import {useState} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {useQuery} from '@tanstack/react-query';
import {Link} from '@tanstack/react-router';
import {Send,UserRound,MessageCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {answerSupport,getSupportOrders} from '@/lib/support-chat.functions';
type Message={role:'user'|'assistant';content:string};
export function SupportChat(){
 const ask=useServerFn(answerSupport); const ordersFn=useServerFn(getSupportOrders);
 const {data:orders=[],error:orderError}=useQuery({queryKey:['support-orders'],queryFn:()=>ordersFn()});
 const [messages,setMessages]=useState<Message[]>([]); const [text,setText]=useState(''); const [orderId,setOrderId]=useState('');
 const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [ticket,setTicket]=useState<string|null>(null); const [sources,setSources]=useState<string[]>([]);
 async function send(human=false){
  if(busy || ticket)return;
  const content=text.trim() || (human?'Gostaria de atendimento humano.':''); if(!content)return;
  const next:Message[]=[...messages,{role:'user',content}]; setBusy(true);setError('');
  try{const r=await ask({data:{messages:next.slice(-20),human,...(orderId?{orderId}:{})}});setMessages([...next,{role:'assistant',content:r.answer}]);setText('');setSources(r.sources);setTicket(r.ticketId);}
  catch(e){setError(e instanceof Error?e.message:'Não foi possível enviar.');}finally{setBusy(false);}
 }
 return <section className="my-6 border-y border-border py-6" aria-labelledby="support-chat-title">
  <h2 id="support-chat-title" className="text-xl font-display font-semibold flex items-center gap-2"><MessageCircle className="size-5 text-primary"/>Atendimento</h2>
  <div className="mt-4 max-w-3xl">
   <label htmlFor="support-order" className="text-sm font-medium">Pedido</label>
   <select id="support-order" value={orderId} disabled={busy||!!ticket} onChange={e=>setOrderId(e.target.value)} className="mt-2 w-full min-h-11 border border-input rounded-md bg-background px-3">
    <option value="">Dúvida geral</option>{orders.map(o=><option key={o.id} value={o.id}>{o.id.slice(0,8).toUpperCase()} · {new Date(o.created_at).toLocaleDateString('pt-BR')} · {o.status}</option>)}
   </select>
   {orderError&&<p role="alert" className="mt-2 text-sm text-destructive">Não foi possível carregar os pedidos.</p>}
   <div role="log" aria-live="polite" aria-label="Conversa de suporte" className="my-5 space-y-4 max-h-96 overflow-y-auto">
    {!messages.length&&<p className="text-sm text-muted-foreground">Olá! Qual é sua dúvida?</p>}
    {messages.map((m,i)=><div key={i} className={m.role==='user'?'border-l-2 border-primary pl-4':'border-l-2 border-border pl-4'}><p className="text-xs font-semibold text-muted-foreground mb-1">{m.role==='user'?'Você':'Suporte 0WEB'}</p><p className="text-sm whitespace-pre-wrap break-words">{m.content}</p></div>)}
   </div>
   {sources.length>0&&<p className="mb-4 text-xs text-muted-foreground">Fontes: {sources.join(' · ')}</p>}
   {error&&<p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
   {ticket?<Button asChild className="min-h-11"><Link to="/app/support/$id" params={{id:ticket}}>Acompanhar atendimento</Link></Button>:<form onSubmit={e=>{e.preventDefault();void send();}} className="space-y-3">
    <label htmlFor="support-question" className="sr-only">Sua mensagem</label><div className="flex gap-2"><Input id="support-question" value={text} onChange={e=>setText(e.target.value)} maxLength={4000} placeholder="Escreva sua mensagem" disabled={busy} className="min-h-11"/><Button type="submit" disabled={busy||!text.trim()} aria-label="Enviar mensagem" className="min-h-11 min-w-11"><Send/></Button></div>
    <Button type="button" variant="outline" onClick={()=>void send(true)} disabled={busy} className="min-h-11"><UserRound/>{busy?'Enviando…':'Falar com uma pessoa'}</Button>
   </form>}
  </div>
 </section>;
}
