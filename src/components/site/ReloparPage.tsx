import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Building2, Clock3, ClipboardList, Cpu, MapPin, Monitor, ShieldCheck, Wrench } from "lucide-react";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";

const MAP = "https://www.google.com/maps/search/?api=1&query=Relopar%20Rua%20Cruz%20Machado%20344%20Curitiba";
const photo = "/images/relopar/";

const JOTFORM_URL = "https://form.jotform.com/263097813049059";
/** O botão abre um formulário real e isolado, identificado como demo, sem simular contato com a loja. */
function Consultar({children,className=""}:{children:ReactNode;className?:string}) {
 const [open,setOpen]=useState(false);
 const dialogRef=useRef<HTMLDivElement>(null);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const overflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  closeRef.current?.focus();
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){event.preventDefault();setOpen(false);return;}
   if(event.key!=="Tab")return;
   const focusables=Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button,[href],iframe,[tabindex]:not([tabindex="-1"])')??[]);
   if(!focusables.length)return;
   const first=focusables[0],last=focusables[focusables.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  document.addEventListener("keydown",onKey);
  window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-open"));
  return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=overflow;window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-close"));previous?.focus();};
 },[open]);
 return <>
  <button type="button" className={className} onClick={()=>setOpen(true)}>{children}</button>
  {open&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1725]/85 p-3 backdrop-blur-sm" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="relopar-modal-title" aria-describedby="relopar-modal-disclaimer" className="flex h-[min(93dvh,840px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white text-[#102133] shadow-2xl">
    <div className="flex items-start justify-between gap-3 border-b border-[#dfe5e8] px-5 py-4">
     <div><p className="text-[10px] font-extrabold uppercase tracking-widest text-[#92710f]">Amostra · Funil 0WEB</p><h2 id="relopar-modal-title" className="mt-1 text-xl font-black">Consulta técnica Relopar</h2><p id="relopar-modal-disclaimer" className="mt-1 text-xs leading-relaxed text-[#607083]">Formulário demonstrativo. Não é contato oficial da Relopar; as respostas são registradas para demonstração da 0WEB.</p></div>
     <button ref={closeRef} type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded border border-[#c9d4dc] bg-[#f5f7f7] text-xl font-black" onClick={()=>setOpen(false)} aria-label="Fechar formulário">×</button>
    </div>
    <iframe src={JOTFORM_URL} title="Formulário demonstrativo Relopar — atendimento 0WEB" className="min-h-0 w-full flex-1 border-0" loading="eager" referrerPolicy="strict-origin-when-cross-origin" data-funnel-provider="jotform" data-client-key="relopar"/>
    <div className="border-t border-[#dfe5e8] bg-[#f4f6f7] px-4 py-3 text-center text-xs text-[#586c7d]">Dados armazenados no Jotform para a amostra 0WEB. Nenhum WhatsApp foi configurado.</div>
   </div>
  </div>}
 </>;
}
const pathways = [
  {number:"01", title:"Relógios de ponto", icon:Clock3,
    copy:"Venda e assistência técnica são atividades anunciadas na fachada. Consulte modelos e possibilidades para sua empresa.",
    detail:"Equipamentos de registro de jornada"},
  {number:"02",title:"Controle de acesso",icon:ShieldCheck,
    copy:"A razão social associada ao endereço menciona soluções de controle de acesso. Confirme quais tecnologias estão disponíveis.",
    detail:"Soluções para ambientes empresariais"},
  {number:"03",title:"Assistência técnica",icon:Wrench,
    copy:"A sinalização do ponto comercial anuncia reparos de eletrônicos. Informe o equipamento para confirmar se a unidade atende.",
    detail:"Avaliação sujeita à confirmação"},
  {number:"04",title:"Equipamentos comerciais",icon:Monitor,
    copy:"A fachada e o interior mostram equipamentos como impressoras e itens de escritório. Consulte disponibilidade e suporte.",
    detail:"Consultar antes de levar"},
] as const;
const faqs = [
  ["A Relopar fica onde?", "Na Rua Cruz Machado, 344, Centro de Curitiba — PR. O endereço foi fotografado e também encontrado em cadastro público. Confirme loja e acesso antes de visitar."],
  ["É possível pedir orçamento de relógio de ponto?", "A sinalização da Relopar divulga comércio e assistência de relógios de ponto. A demonstração permite descrever sua necessidade; não informa preços ou estoque em tempo real."],
  ["Vocês consertam notebook, impressora ou outros eletrônicos?", "Placas de assistência técnica fotografadas no mesmo imóvel mencionam essas categorias. Por existir mais de um cadastro comercial no endereço, a abrangência precisa ser confirmada com o estabelecimento."],
  ["Este é o site oficial da Relopar?", "Não. Este é um portfólio demonstrativo desenvolvido pela 0WEB a partir de dados públicos e fotografias reais. Não há representação comercial autorizada pela empresa."],
  ["O formulário envia diretamente à Relopar?", "Não nesta fase. O registro é uma demonstração da 0WEB, com protocolo de interesse. O encaminhamento ao estabelecimento depende de confirmação e ativação de canal oficial."],
] as const;
export function ReloparPage() {
  return <div id="inicio" lang="pt-BR" className="min-h-dvh overflow-x-clip bg-[#f7f6f0] text-[#182737]">
    <div className="bg-[#0e1b2a] px-5 py-2.5 text-center text-xs font-semibold leading-relaxed tracking-wide text-white/90">
      DEMONSTRAÇÃO 0WEB · Estudo de presença digital, não é o site oficial da Relopar
    </div>
    <header className="sticky top-0 z-30 border-b border-[#1b2939]/10 bg-[#f7f6f0]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[74px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="Relopar, início">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#122439] font-black text-[#f5cf49]" aria-hidden="true">R.</span>
          <span className="flex flex-col leading-none"><strong className="text-xl font-black tracking-[-.08em] text-[#1b3151]">RELOPAR</strong><span className="mt-1 text-[9px] font-bold uppercase tracking-[.22em] text-[#657286]">Relógios de ponto</span></span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[#3c4c5c] md:flex" aria-label="Seções da página">
          <a className="hover:text-black" href="#solucoes">Soluções</a>
          <a className="hover:text-black" href="#galeria">A loja</a>
          <a className="hover:text-black" href="#localizacao">Localização</a>
        </nav>
        <Consultar className="hidden min-h-11 items-center justify-center gap-2 rounded-sm bg-[#ecbb23] px-5 py-3 text-sm font-black text-[#102032] shadow-sm transition hover:bg-[#ffcc35] sm:inline-flex">Consultar opções <ArrowUpRight size={16}/></Consultar>
      </div>
    </header>

    <main>
      <section className="relative isolate overflow-hidden bg-[#102133] text-white" aria-labelledby="relopar-titulo">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={{backgroundImage:"repeating-linear-gradient(90deg,transparent 0,transparent 75px,#f5c72b 76px,#f5c72b 77px)"}}/>
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-16 md:pb-24 md:pt-20 lg:grid-cols-[1.08fr_.92fr] lg:px-12">
          <div>
            <p className="inline-flex items-center gap-2 border-l-4 border-[#ecc12a] pl-3 text-[11px] font-extrabold uppercase tracking-[.22em] text-[#e8cf77]">Centro de Curitiba · PR</p>
            <h1 id="relopar-titulo" className="mt-8 max-w-3xl text-[clamp(3.1rem,7vw,6.8rem)] font-black leading-[.95] tracking-[-.07em]">O ponto certo para quem precisa de <span className="text-[#f2c72f]">precisão.</span></h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">Relógios de ponto, soluções de acesso e consulta de assistência técnica. Conheça o endereço da Relopar e organize sua solicitação de informação em uma só página.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Consultar className="inline-flex min-h-14 items-center gap-2 rounded-sm bg-[#f2c72f] px-6 py-4 text-sm font-black text-[#102133] transition hover:bg-[#ffdf66]">Solicitar informações <ArrowRight size={18}/></Consultar>
              <a className="inline-flex min-h-14 items-center gap-2 border border-white/35 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10" href="#galeria">Ver a loja real <ArrowDownRight size={18}/></a>
            </div>
            <p className="mt-6 text-xs text-white/60">Portfólio demonstrativo da 0WEB · preços, horários e atendimento sujeitos a confirmação.</p>
          </div>
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -left-4 -top-4 h-full w-full border border-[#f2c72f]/50" aria-hidden="true"/>
            <div className="relative overflow-hidden border border-white/10 bg-[#f2c72f] p-4 text-[#14283a] shadow-2xl md:p-6">
              <div className="flex items-center justify-between border-b border-black/15 pb-4 text-[11px] font-extrabold uppercase tracking-widest">
                <span>Identidade observada no local</span><Cpu size={20}/>
              </div>
              <div className="my-6 text-center">
                <div className="text-6xl font-black leading-none tracking-[-.08em] md:text-8xl">344</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[.25em]">Rua Cruz Machado</div>
              </div>
              <div className="grid grid-cols-3 border-t border-black/20 pt-4 text-center text-[10px] font-black uppercase tracking-wide">
                <span>Comércio</span><span>Assistência</span><span>Curitiba</span>
              </div>
            </div>
            <div className="relative mt-4 flex justify-between gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#d8e1e8]"><span>RELOPAR / ESTUDO</span><span>0WEB / 2026</span></div>
          </div>
        </div>
      </section>

      <div className="border-b border-[#d6dadd] bg-[#e9e8df] px-5 py-4 text-center text-[11px] font-bold uppercase tracking-[.15em] text-[#435365]">Relógio de ponto <span className="mx-3 text-[#bd8d08]">✳</span> Controle de acesso <span className="mx-3 text-[#bd8d08]">✳</span> Assistência técnica</div>

      <section id="solucoes" className="scroll-mt-24 px-5 py-20 md:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_.6fr]"><div><p className="text-xs font-extrabold uppercase tracking-[.21em] text-[#9b7208]">01 / Especialidades anunciadas</p><h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-.055em] md:text-6xl">Soluções em destaque, sem complicar sua pesquisa.</h2></div><p className="text-sm leading-relaxed text-[#536275]">A página parte de informações publicadas na fachada e em cadastros comerciais. A disponibilidade de cada item e o escopo exato do atendimento devem ser confirmados.</p></div>
          <div className="mt-12 divide-y divide-[#bec7ce] border-y border-[#bec7ce]">
            {pathways.map(({number,title,icon:Icon,copy,detail})=><article key={number} className="grid gap-5 py-7 md:grid-cols-[70px_minmax(0,1fr)_minmax(240px,1fr)_auto] md:items-center md:gap-8">
              <span className="font-mono text-lg font-bold text-[#b78a1b]">{number}</span>
              <div className="flex items-center gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center border border-[#c6ccd0]"><Icon size={22}/></span><h3 className="text-2xl font-black tracking-[-.04em]">{title}</h3></div>
              <div><p className="max-w-lg text-sm leading-relaxed text-[#59697b]">{copy}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#8c730b]">{detail}</p></div>
              <Consultar className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#2f4253] px-4 py-2.5 text-xs font-black uppercase tracking-wide hover:bg-[#ead9a2]">Consultar <ArrowUpRight size={17}/></Consultar>
            </article>)}
          </div>
        </div>
      </section>

      <section id="galeria" className="scroll-mt-24 bg-[#162a3d] px-5 py-20 text-white md:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div className="lg:sticky lg:top-32"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#f1c737]">02 / O ponto comercial</p><h2 className="mt-5 max-w-md text-4xl font-black leading-tight tracking-[-.05em] md:text-5xl">Um endereço real no Centro de Curitiba.</h2><p className="mt-5 max-w-sm leading-relaxed text-white/70">Fotografias reais enviadas por quem passou em frente ao estabelecimento. Elas documentam a fachada e o interior visível da rua, sem imagens inventadas de equipe ou trabalhos.</p><span className="mt-8 inline-flex items-center gap-2 border-l-4 border-[#efc42f] pl-3 text-xs font-bold uppercase tracking-wider">Rua Cruz Machado, 344</span></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden bg-white/10"><img src={photo+"fachada-01.webp"} alt="Fotografia real da fachada Relopar, letreiro e interior vistos da Rua Cruz Machado, Curitiba" width="320" height="569" loading="lazy" decoding="async" className="h-[350px] w-full object-cover object-top md:h-[500px]"/><figcaption className="px-3 py-3 text-xs text-white/75">Fachada e mostruário · foto real do usuário</figcaption></figure>
            <figure className="overflow-hidden bg-white/10"><img src={photo+"fachada-02.webp"} alt="Segunda fotografia real da entrada da Relopar na Rua Cruz Machado, Curitiba" width="320" height="569" loading="lazy" decoding="async" className="h-[350px] w-full object-cover object-top md:h-[500px]"/><figcaption className="px-3 py-3 text-xs text-white/75">Entrada lateral · foto real do usuário</figcaption></figure>
          </div>
        </div>
      </section>

      <section id="processo" className="bg-[#f0d66a] px-5 py-20 lg:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[.23em]">03 / Como consultar</p><h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.055em] md:text-6xl">Uma solicitação bem descrita começa melhor.</h2><div className="mt-11 grid gap-8 lg:grid-cols-3">{[{n:"01",t:"Escolha o assunto",p:"Informe se procura um equipamento, suporte ou avaliação técnica.",icon:Building2},{n:"02",t:"Descreva o equipamento",p:"Se souber, inclua marca, modelo, quantidade e sintomas do problema.",icon:ClipboardList},{n:"03",t:"Registre seu interesse",p:"A amostra da 0WEB organiza os dados, mas não representa contato oficial com a Relopar.",icon:ShieldCheck}].map(({n,t,p,icon:Icon})=><div key={n} className="border-t-2 border-[#152638] pt-6"><div className="mb-6 flex justify-between"><span className="font-mono text-2xl font-black">{n}</span><Icon/></div><h3 className="text-xl font-black">{t}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed">{p}</p></div>)}</div><Consultar className="mt-10 inline-flex min-h-14 items-center gap-3 bg-[#14273a] px-7 py-4 text-sm font-extrabold text-white hover:bg-[#254967]">Abrir consulta demonstrativa <ArrowUpRight size={18}/></Consultar></div></section>

      <section id="localizacao" className="scroll-mt-24 px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#957213]">04 / Onde encontrar</p><h2 className="mt-5 text-4xl font-black tracking-[-.05em] md:text-6xl">Curitiba, bem no Centro.</h2><p className="mt-5 text-lg leading-relaxed text-[#506273]">Rua Cruz Machado, nº 344 · Centro · Curitiba, Paraná.</p><p className="mt-3 text-sm text-[#687786]">Horário de atendimento, unidade responsável, estacionamento e serviços no local ainda não foram confirmados.</p><a className="mt-8 inline-flex min-h-12 items-center gap-2 border-b-2 border-[#be910a] py-2 font-extrabold text-[#172c40] hover:opacity-75" href={MAP} target="_blank" rel="noopener noreferrer">Abrir endereço no Google Maps <MapPin size={19}/></a></div><div className="relative overflow-hidden border border-[#bec7cc] bg-[#e3e7e6] p-8 md:p-12"><div aria-hidden="true" className="absolute right-0 top-0 h-24 w-24 bg-[#edc42f]"/><span className="relative z-10 text-xs font-black uppercase tracking-[.16em] text-[#42546a]">Destino de referência</span><div className="relative z-10 mt-12 text-6xl font-black tracking-[-.075em] md:text-8xl">344</div><div className="relative z-10 mt-5 max-w-xs border-t border-[#8d9da8] pt-5 text-xl font-black">Rua Cruz Machado<br/>Centro · Curitiba/PR</div><div className="relative z-10 mt-8 flex gap-2 text-xs font-semibold text-[#607181]"><MapPin size={18}/> Navegação externa pelo Google Maps</div></div></div></section>

      <section className="bg-white px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#9a791b]">05 / Perguntas frequentes</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Informação antes do orçamento.</h2></div><div className="divide-y divide-[#d4d9db] border-t border-[#d4d9db]">{faqs.map(([q,a])=><details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-base font-bold"><span>{q}</span><span className="text-xl text-[#a7820a] group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-4 pr-6 text-sm leading-relaxed text-[#617080]">{a}</p></details>)}</div></div></section>
      <section className="bg-[#102133] px-5 py-20 text-center text-white"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#f3cb43]">Estudo de portfólio · 0WEB</p><h2 className="mt-6 text-4xl font-black tracking-[-.05em] md:text-6xl">Mais clareza para o próximo atendimento.</h2><p className="mx-auto mt-6 max-w-xl text-white/75">Esta amostra mostra como organizar a presença digital da Relopar e oferecer uma triagem inicial, sem sugerir vínculo com a empresa.</p><Consultar className="mt-9 inline-flex min-h-14 items-center gap-2 bg-[#f2c72f] px-7 py-4 font-extrabold text-[#142637] hover:bg-[#ffe082]">Explorar o formulário <ArrowRight size={19}/></Consultar></div></section>
    </main>
    <PortfolioHostCredit className="py-5 text-center text-xs text-[#6b7884]"/>
    <div className="fixed bottom-5 right-5 z-40"><Consultar className="flex min-h-14 items-center gap-2 rounded-sm border-2 border-[#102133] bg-[#f3c52a] px-5 py-3.5 text-sm font-black text-[#102133] shadow-[0_8px_27px_#10213366] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#e4b41b]"><ClipboardList size={19}/> Consultar <ArrowUpRight size={16}/></Consultar></div>
  </div>;
}
