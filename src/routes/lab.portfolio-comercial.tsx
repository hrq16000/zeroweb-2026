import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BriefcaseBusiness, CheckCircle2, Clock3, Layers3, MessageCircle, ShieldCheck, Sparkles, Users2, Workflow } from "lucide-react";

const URL = "https://0web.com.br/lab/portfolio-comercial";
const TITLE = "Laboratório Comercial 0WEB — Protótipo visual de CRM e jornadas B2B";
const DESC = "Demonstração autoral de interface de CRM e qualificação B2B feita pela 0WEB. Sem instalação, dados reais, clientes atendidos ou vínculo oficial com as referências estudadas.";

const lanes = [
  { title:"Primeiro contato", tone:"text-[#caf4a4]", dot:"bg-[#caf4a4]", cards:[
    { id:"EX-001", kind:"Consultoria", title:"Diagnóstico de presença digital", note:"Briefing recebido · exemplo" },
    { id:"EX-002", kind:"Serviços", title:"Organização de solicitações", note:"Contexto inicial · exemplo" },
  ]},
  { title:"Qualificação", tone:"text-[#ffd1a7]", dot:"bg-[#ffd1a7]", cards:[
    { id:"EX-003", kind:"B2B", title:"Operação recorrente", note:"Escopo em avaliação · exemplo" },
  ]},
  { title:"Próxima etapa", tone:"text-[#d7c6ff]", dot:"bg-[#d7c6ff]", cards:[
    { id:"EX-004", kind:"Projetos", title:"Proposta editorial", note:"Próxima ação definida · exemplo" },
  ]},
] as const;

const contexts = [
  { no:"01", name:"Demanda pontual", copy:"Uma necessidade específica pede briefing direto: objetivo, prioridade e condições antes da proposta.", path:"Intenção → Escopo → Encaminhamento" },
  { no:"02", name:"Contrato recorrente", copy:"O relacionamento contínuo pede frequência, responsáveis e próximos passos claramente definidos.", path:"Recorrência → Alinhamento → Rotina" },
  { no:"03", name:"Atendimento consultivo", copy:"Solicitações sensíveis merecem critérios de acesso, validação humana e escopo transparente.", path:"Contexto → Validação → Próxima ação" },
] as const;

function ConceptPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#081714] font-sans text-[#e8f4ed] selection:bg-[#c6f3a1] selection:text-[#14221a]" lang="pt-BR">
      <div className="flex items-center justify-center gap-2 bg-[#c6f3a1] px-4 py-2 text-center text-[11px] font-bold text-[#152a1c]">
        <Sparkles size={14} aria-hidden="true" /> ESTUDO VISUAL · NÃO É UM CRM INSTALADO · NÃO É UMA IMPLEMENTAÇÃO OFICIAL
      </div>
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-9 lg:px-16">
        <a href="/portfolio" className="inline-flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6f3a1]" aria-label="0WEB, voltar ao portfólio">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c6f3a1] text-xl font-black text-[#122819]">0</span>
          <span className="text-lg font-extrabold tracking-tight">0WEB <small className="ml-2 border-l border-white/20 pl-3 text-[10px] font-bold uppercase tracking-[.19em] text-[#9aada6]">Lab</small></span>
        </a>
        <nav className="hidden gap-8 text-xs font-semibold text-[#bdcfc6] sm:flex" aria-label="Seções do laboratório">
          <a href="#painel" className="hover:text-[#c6f3a1]">Painel</a>
          <a href="#jornadas" className="hover:text-[#c6f3a1]">Jornadas B2B</a>
          <a href="#futuro" className="hover:text-[#c6f3a1]">Visão</a>
        </nav>
        <a href="/portfolio" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c6f3a1]"><ArrowLeft size={15} aria-hidden="true"/> Portfólio</a>
      </header>
      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-20 sm:px-9 lg:pb-28 lg:pt-28" aria-labelledby="lab-title">
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-48 h-[630px] w-[630px] rounded-full bg-[#658e69]/10 blur-3xl"/>
          <div className="relative mx-auto grid max-w-[1312px] items-center gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,.7fr)]">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.22em] text-[#c6f3a1]"><span className="text-xl">✳</span> CONCEITO COMERCIAL / 01</p>
              <h1 id="lab-title" className="mt-7 max-w-[900px] text-[clamp(2.8rem,6.7vw,6.25rem)] font-extrabold leading-[1.04] tracking-[-.065em]">Cada conversa tem um contexto. <span className="text-[#c6f3a1]">Cada contexto, um próximo passo.</span></h1>
              <p className="mt-8 max-w-2xl text-base leading-8 text-[#abc3b6] sm:text-lg">Um produto digital imaginado pela 0WEB: o visual de uma central comercial, sem contas reais, WhatsApp, automações ou integração de banco. Feito para mostrar possibilidades de design, não para simular resultados.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#painel" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#c6f3a1] px-6 py-3 text-sm font-extrabold text-[#14251a] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none">Explorar a interface <ArrowRight size={17} aria-hidden="true"/></a>
                <a href="/contato" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/35 px-6 py-3 text-sm font-bold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Conversar sobre um projeto <ArrowUpRight size={16} aria-hidden="true"/></a>
              </div>
              <p className="mt-7 flex max-w-xl items-start gap-2 text-xs leading-6 text-[#8ca99b]"><ShieldCheck size={16} className="mt-1 shrink-0" aria-hidden="true"/> Demonstração fictícia e autoral. Não representa o DeskcommCRM nem empresas ou clientes reais.</p>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[#4e6b60]/70 bg-[linear-gradient(145deg,#1e3932,#102820)] p-7 shadow-2xl sm:p-9" aria-label="Três passos da jornada comercial">
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#c6f3a1]">UMA JORNADA, TRÊS MOMENTOS</p>
              {[
                ["01","Captar","Entender a necessidade"],
                ["02","Qualificar","Organizar as informações"],
                ["03","Acompanhar","Definir a próxima ação"],
              ].map(([no,heading,detail])=><div key={no} className="mt-6 grid grid-cols-[36px_1fr] gap-3 border-t border-white/15 pt-5"><span className="text-sm font-black text-[#c6f3a1]">{no}</span><div><strong className="block text-xl tracking-tight">{heading}</strong><p className="mt-1 text-xs text-[#b1c7bb]">{detail}</p></div></div>)}
              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#688678] px-3 py-2 text-[10px] font-semibold text-[#bad9c5]"><CheckCircle2 size={14} aria-hidden="true"/> Visualização, não operação</span>
            </div>
          </div>
        </section>
        <section id="painel" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-9 lg:px-16 lg:py-28" aria-labelledby="painel-title">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div><p className="text-[11px] font-extrabold uppercase tracking-[.22em] text-[#c6f3a1]">02 / PRODUTO EM CENA</p><h2 id="painel-title" className="mt-4 max-w-3xl text-3xl font-extrabold tracking-[-.05em] sm:text-5xl">Um painel para enxergar o essencial.</h2></div>
            <p className="max-w-sm text-sm leading-7 text-[#a5c2b4]">Uma proposta de interface para organizar oportunidades. Todas as pessoas, cartões e situações são inventados.</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#344940] bg-[#10211d] shadow-[0_30px_100px_rgba(0,0,0,.22)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#1b2b26] px-5 py-3"><span className="flex gap-1.5" aria-hidden="true"><i className="h-2.5 w-2.5 rounded-full bg-[#f0a6a4]"/><i className="h-2.5 w-2.5 rounded-full bg-[#f7cc86]"/><i className="h-2.5 w-2.5 rounded-full bg-[#b9ed97]"/></span><span className="rounded-md border border-white/10 px-3 py-1 text-[10px] text-[#a7c0b1]">laboratório / painel ilustrativo</span><span className="text-[9px] font-bold tracking-widest text-[#b7d4be]">0WEB</span></div>
            <div className="grid lg:grid-cols-[196px_minmax(0,1fr)]">
              <aside className="hidden border-r border-white/10 bg-[#142821] p-5 lg:block" aria-label="Navegação ilustrativa, sem funcionalidade">
                <div className="flex items-center gap-2 text-sm font-black"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#c6f3a1] font-black text-[#102817]">N</span>NEXO <small className="text-[9px] font-normal text-[#b2c9b8]">conceito</small></div>
                <p className="mt-12 text-[9px] font-bold tracking-wider text-[#81998c]">PAINEL VISUAL</p>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#30473a] px-3 py-3 text-xs font-semibold text-[#c6f3a1]"><BarChart3 size={16} aria-hidden="true"/> Visão comercial</div>
                <div className="mt-1 flex items-center gap-2 px-3 py-3 text-xs text-[#aac7b4]"><Layers3 size={16} aria-hidden="true"/> Oportunidades</div>
                <div className="mt-1 flex items-center gap-2 px-3 py-3 text-xs text-[#aac7b4]"><Users2 size={16} aria-hidden="true"/> Contatos</div>
                <div className="mt-1 flex items-center gap-2 px-3 py-3 text-xs text-[#aac7b4]"><MessageCircle size={16} aria-hidden="true"/> Conversas</div>
                <p className="mt-14 border-t border-white/10 pt-5 text-[10px] leading-5 text-[#849c8c]">Menu apenas ilustrativo. Não há interação com CRM.</p>
              </aside>
              <div className="min-w-0 p-4 sm:p-7 lg:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-[#b6d3bb]">Visão de oportunidades / amostra</p><h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Tudo começa pelo contexto.</h3></div><span className="rounded-full border border-[#60846b] px-3 py-1.5 text-[10px] font-bold text-[#c6f3a1]">● Dados fictícios</span></div>
                <div className="my-7 grid gap-3 sm:grid-cols-3">
                  {[["Organização","Etapas visíveis","Visão de pipeline"],["Origem","Contexto preservado","Sem dados pessoais"],["Continuidade","Próxima ação","Sem automação"]].map(([top,value,foot])=><div key={top} className="rounded-xl border border-[#32483c] bg-[#1a3027] p-4"><span className="block text-[10px] text-[#9fbdab]">{top}</span><strong className="mt-2 block text-base font-extrabold">{value}</strong><small className="mt-2 block text-[10px] text-[#9fbdab]">{foot}</small></div>)}
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4"><h4 className="text-xl font-extrabold">Jornada comercial</h4><span className="text-[10px] text-[#95b3a1]">4 cartões de demonstração</span></div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {lanes.map(lane=><section key={lane.title} className="min-w-0 rounded-xl bg-[#142922] p-3" aria-label={lane.title}><div className="mb-4 flex items-center gap-2 px-1"><i className={["h-2","w-2","rounded-full",lane.dot].join(" ")} aria-hidden="true"/><h5 className="flex-1 text-xs font-extrabold">{lane.title}</h5><span className="text-[10px] text-[#a4baab]">{lane.cards.length}</span></div>
                    {lane.cards.map(card=><article key={card.id} className="mb-3 min-h-40 rounded-xl border border-[#385143] bg-[#1e382d] p-4"><div className="flex justify-between text-[10px] text-[#a9c3b0]"><span>{card.id} · {card.kind}</span><span aria-hidden="true">↗</span></div><h6 className="mt-5 text-sm font-bold leading-5">{card.title}</h6><p className="mt-3 text-[11px] leading-5 text-[#a6bbab]">{card.note}</p><span className={["mt-3","inline-block","rounded-md","bg-[#30463b]","px-2","py-1","text-[10px]","font-bold",lane.tone].join(" ")}>Exemplo</span></article>)}
                  </section>)}
                </div>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-[#91aa98]">Protótipo estático: sem login, banco, contatos reais, mensagens enviadas ou botões de operação.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="jornadas" className="border-t border-white/10 bg-[#0e211b] px-5 py-20 sm:px-9 lg:py-28" aria-labelledby="jornadas-title">
          <div className="mx-auto max-w-[1312px]"><div className="mb-10 max-w-3xl"><p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#c6f3a1]">03 / LÓGICA COMERCIAL</p><h2 id="jornadas-title" className="mt-4 text-3xl font-extrabold tracking-[-.05em] sm:text-5xl">O atendimento muda conforme a necessidade.</h2><p className="mt-5 text-sm leading-7 text-[#a5c2b4]">Do benchmarking da MEGAX, a ideia útil é separar contextos e qualificar o escopo, sem copiar a página, a identidade ou promessas de atendimento.</p></div>
            <div className="grid gap-4 md:grid-cols-3">{contexts.map(context=><article key={context.no} className="flex min-h-[310px] flex-col rounded-2xl border border-[#365044] bg-[#172e25] p-7"><div className="flex items-center justify-between text-sm font-extrabold text-[#c6f3a1]"><span>{context.no}</span><ArrowUpRight size={19} aria-hidden="true"/></div><h3 className="mt-12 text-2xl font-extrabold tracking-tight">{context.name}</h3><p className="mt-3 flex-1 text-sm leading-7 text-[#acc3b2]">{context.copy}</p><p className="mt-6 border-t border-white/10 pt-4 text-[11px] font-semibold text-[#d2e8d5]">{context.path}</p></article>)}</div>
          </div>
        </section>
        <section id="futuro" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-9 lg:px-16 lg:py-28" aria-labelledby="futuro-title">
          <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#c6f3a1]">04 / EVOLUÇÃO CONCEITUAL</p><h2 id="futuro-title" className="mt-4 max-w-4xl text-3xl font-extrabold tracking-[-.05em] sm:text-5xl">Um visual hoje. Possibilidades amanhã.</h2>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{[
            {icon:Workflow,title:"Etapas configuráveis",body:"Mapear diferentes jornadas comerciais sem clonar layouts."},
            {icon:BriefcaseBusiness,title:"Briefing B2B",body:"Qualificação adequada a projetos pontuais e recorrentes."},
            {icon:Clock3,title:"Continuidade",body:"Próximos passos claros, sem métricas inventadas."},
            {icon:ShieldCheck,title:"Agentes especializados",body:"Lunaro-AI é apenas referência futura de papéis, não software integrado."},
          ].map(item=><article key={item.title} className="border-t-2 border-[#577662] pt-5"><item.icon className="mb-5 text-[#c6f3a1]" size={22} aria-hidden="true"/><h3 className="text-base font-extrabold">{item.title}</h3><p className="mt-3 text-xs leading-6 text-[#a5c2b4]">{item.body}</p></article>)}</div>
        </section>
        <section className="bg-[#c6f3a1] px-5 py-20 text-center text-[#122819] sm:py-24" aria-labelledby="closing-title"><p className="text-[11px] font-extrabold uppercase tracking-[.17em]">UMA IDEIA PODE VIRAR PROJETO</p><h2 id="closing-title" className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-[-.05em] sm:text-6xl">Design que apresenta.<br/>Estratégia que direciona.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#406047]">Conheça trabalhos publicados ou converse com a 0WEB sobre uma presença digital sob medida.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href="/portfolio" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#183221] px-6 py-3 text-sm font-extrabold text-white">Ver projetos reais <ArrowRight size={16} aria-hidden="true"/></a><a href="/contato" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#294d33] px-6 py-3 text-sm font-extrabold">Solicitar projeto <ArrowUpRight size={16} aria-hidden="true"/></a></div></section>
      </main>
      <footer className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 px-5 py-7 text-[11px] leading-6 text-[#acc4b4] sm:px-9 lg:px-16"><span><strong>0WEB</strong> · Demonstração visual autoral · 2026</span><span>Referências estudadas: <a href="https://github.com/melgarafael/DeskcommCRM" className="underline" target="_blank" rel="noopener noreferrer">DeskcommCRM</a> · <a href="https://github.com/ceocript/megax-site" className="underline" target="_blank" rel="noopener noreferrer">MEGAX</a> · <a href="https://github.com/ceocript/Lunaro-AI" className="underline" target="_blank" rel="noopener noreferrer">Lunaro-AI</a></span></footer>
    </div>
  );
}

export const Route = createFileRoute("/lab/portfolio-comercial")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:type", content: "website" }, { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:url", content: URL }, { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel:"canonical", href:URL }],
    scripts:[{ type:"application/ld+json", children: JSON.stringify({
      "@context":"https://schema.org","@type":"CreativeWork",name:TITLE,url:URL,
      description:DESC,creativeWorkStatus:"Demonstração visual não funcional",
      creator:{"@type":"Organization",name:"0WEB",url:"https://0web.com.br"},
    }) }],
  }),
  component: ConceptPage,
});
