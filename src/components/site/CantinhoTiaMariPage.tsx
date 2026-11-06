import { useEffect, useRef, useState, type ReactNode } from "react";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { ArrowRight, ArrowUpRight, Baby, BusFront, CalendarCheck, Check, Clock3, Heart, MapPin, Menu, Sparkles, X } from "lucide-react";

const FORM = "https://form.jotform.com/263096736127059";
const ADDRESS = "Rua Pedro Alves da Rocha, 200 · Jardim Itália · São José dos Pinhais/PR";
const MAP = "https://www.google.com/maps/search/?api=1&query=Rua%20Pedro%20Alves%20da%20Rocha%20200%20Jardim%20Italia%20Sao%20Jose%20dos%20Pinhais%20PR";
const P = "/images/cantinho-da-tia-mari/";

function Badge({ children }: {children: ReactNode}) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-[#fff0ad] px-4 py-2 text-xs font-extrabold tracking-wide text-[#735027]">{children}</span>;
}

/** Consulta salva via formulário próprio da 0WEB, sem expor contato da escola ou dados de crianças. */
export function CantinhoTiaMariPage() {
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const priorFocus = useRef<HTMLElement | null>(null);

  const show = () => {
    if (typeof window === "undefined") return;
    priorFocus.current = document.activeElement as HTMLElement;
    window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-open"));
    setNavOpen(false);
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-close"));
    priorFocus.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], iframe, [tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); hide(); }
      if (e.key !== "Tab") return;
      const focus = focusables();
      if (!focus.length) return;
      const first = focus[0], last = focus[focus.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown, true);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", keydown, true); };
  }, [open]);

  useEffect(() => {
    const footer = document.querySelector("[data-portfolio-canonical-footer]");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), {threshold:0.1});
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const cards = [
    { icon: Baby, title: "Berçário", eyebrow: "PRIMEIROS CUIDADOS", text: "O material do estabelecimento anuncia atendimento de berçário. Idades e vagas dependem de confirmação.", color: "bg-[#f3e5fa]" },
    { icon: Clock3, title: "Horário estendido", eyebrow: "SUA ROTINA, SEU TEMPO", text: "Atendimento anunciado de segunda a sábado, com horário ampliado durante os dias úteis.", color: "bg-[#fff0c6]" },
    { icon: BusFront, title: "Leva e busca", eyebrow: "ESCOLA E CMEI", text: "Opção de levar e buscar na escola ou CMEI divulgada no panfleto. Consulte rotas e condições.", color: "bg-[#fce1ed]" },
  ];
  const details = [
    ["O Cantinho da Tia Mari oferece berçário?", "O panfleto informa que sim. Faixa etária, condições e disponibilidade precisam ser confirmadas com o estabelecimento."],
    ["O atendimento funciona aos sábados?", "O anúncio informa sábado das 7h30 às 17h. Confirme se os horários continuam atualizados."],
    ["O serviço de leva e busca escolar está disponível?", "O material anuncia leva e busca em escolas e CMEIs. A contratação depende de confirmação de rota, responsáveis autorizados e condições."],
    ["A unidade possui alvará de funcionamento?", "O panfleto declara possuir alvará. A 0WEB ainda não verificou o documento nem sua vigência."],
    ["Posso reservar uma vaga por este site?", "Não. Este é um portfólio demonstrativo da 0WEB, não uma matrícula, reserva ou canal oficial da unidade. Você pode registrar interesse no formulário da demonstração."],
  ] as const;

  return <div className="min-h-screen bg-[#fffdf8] text-[#493553] selection:bg-[#ebc9f3]" lang="pt-BR">
    <div className="bg-[#654080] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">
      PROJETO DEMONSTRATIVO 0WEB · Não é o site oficial do estabelecimento
    </div>
    <header className="sticky top-0 z-30 border-b border-[#eadbf0] bg-[#fffaf8]/95 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[82px] max-w-7xl items-center justify-between gap-3 px-5 md:px-10">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Cantinho da Tia Mari, início">
          <span className="grid h-12 w-12 -rotate-6 place-items-center rounded-2xl bg-[#eedaf8] text-2xl" aria-hidden="true">🌈</span>
          <span className="font-bold leading-tight text-[#6b3c8c]"><span className="block text-[21px] tracking-tight">Cantinho da</span><span className="block text-2xl">Tia Mari</span></span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex" aria-label="Navegação">
          <a href="#cuidados" className="hover:text-[#9b5ab3]">Cuidados</a>
          <a href="#ambientes" className="hover:text-[#9b5ab3]">O espaço</a>
          <a href="#horarios" className="hover:text-[#9b5ab3]">Horários</a>
          <a href="#localizacao" className="hover:text-[#9b5ab3]">Localização</a>
        </nav>
        <button type="button" className="hidden rounded-full bg-[#6b408d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4e316a] md:inline-flex" onClick={show}>Consultar informações <ArrowUpRight className="ml-2 h-4 w-4"/></button>
        <button type="button" className="rounded-full border border-[#dac0e4] p-3 lg:hidden" aria-label={navOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>{navOpen ? <X/> : <Menu/>}</button>
      </div>
      {navOpen && <nav aria-label="Navegação móvel" className="flex flex-col gap-4 border-t border-[#e7d8eb] bg-white px-6 py-4 text-sm font-bold lg:hidden">
        {[["Cuidados","#cuidados"],["O espaço","#ambientes"],["Horários","#horarios"],["Localização","#localizacao"]].map(([label, href]) => <a key={href} href={href} onClick={()=>setNavOpen(false)}>{label}</a>)}
        <button type="button" onClick={show} className="rounded-full bg-[#6b408d] px-5 py-3 text-left text-white">Consultar informações</button>
      </nav>}
    </header>

    <main id="inicio">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_10%,#ffebaf,transparent_45%),linear-gradient(125deg,#f5e4ff,#fff9f0_68%,#ffecf1)] py-16 md:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-[5%] text-4xl text-[#ddb8ed]">✦</div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
          <div className="max-w-2xl">
            <Badge>🌞 JARDIM ITÁLIA · SÃO JOSÉ DOS PINHAIS</Badge>
            <h1 className="mt-7 text-[clamp(3rem,6vw,5.8rem)] font-black leading-[1.03] tracking-[-.055em] text-[#654080]">Um cantinho de <span className="text-[#c768a2]">carinho</span> para cada descoberta.</h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#69566e]">Conheça os serviços anunciados pelo Cantinho da Tia Mari: berçário, atendimento em horário estendido e leva e busca em escolas e CMEIs, no Jardim Itália.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={show} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#6b408d] px-7 py-4 font-bold text-white shadow-xl shadow-purple-900/10 transition hover:translate-y-[-2px]" type="button">Consultar disponibilidade <ArrowRight className="h-4 w-4"/></button>
              <a href="#ambientes" className="inline-flex min-h-12 items-center rounded-full border border-[#d9bfdc] bg-white px-7 py-4 font-bold text-[#604078]">Conhecer o espaço</a>
            </div>
            <p className="mt-7 flex items-start gap-2 text-xs font-medium text-[#806b87]"><Check className="mt-0.5 h-4 w-4 shrink-0"/> Informações e horários extraídos de panfleto público, sujeitos a confirmação. Não realizamos matrículas.</p>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-3 rotate-[-5deg] rounded-[28%_40%_27%_35%] bg-[#e6c9f4]"/>
            <img src={P+"fachada.webp"} width={560} height={352} alt="Foto real da fachada do Cantinho da Tia Mari apresentada no panfleto" fetchPriority="high" decoding="async" className="relative aspect-[5/4] w-full rotate-3 rounded-[2.5rem] border-[10px] border-white object-cover shadow-2xl shadow-[#6b408d]/20" />
            <div className="absolute -bottom-7 -left-2 -rotate-12 rounded-full border-[6px] border-white bg-[#f6d779] px-7 py-7 text-center text-base font-black leading-tight text-[#74466b] shadow-lg">💜<br/>Pequenos<br/>grandes dias</div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-2 bg-[#6b428e] px-5 py-5 text-center text-sm font-bold tracking-wide text-white"><span>✿ EDUCAÇÃO</span><span>♡ CARINHO</span><span>☀ ALEGRIA</span></div>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28" id="cuidados">
        <div className="mx-auto mb-12 max-w-2xl text-center"><p className="text-xs font-extrabold tracking-[.18em] text-[#9d71b4]">UMA ROTINA QUE ACOMPANHA VOCÊ</p><h2 className="mt-5 text-4xl font-black tracking-tight text-[#624080] md:text-6xl">Cuidados para cada momento.</h2><p className="mt-5 leading-relaxed text-[#786b79]">Conheça as possibilidades divulgadas no material do estabelecimento.</p></div>
        <div className="grid gap-5 md:grid-cols-3">{cards.map((card, i) => <article className={card.color+" flex flex-col rounded-[2rem] p-8"} key={card.title}>
          <div className="mb-9 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#70438c] shadow-sm"><card.icon size={32} strokeWidth={1.75}/></div>
          <p className="text-xs font-extrabold tracking-[.14em] text-[#9b6b9d]">{card.eyebrow}</p>
          <h3 className="mt-3 text-3xl font-black text-[#654080]">{card.title}</h3>
          <p className="mt-4 flex-1 leading-relaxed text-[#67566e]">{card.text}</p>
          <button type="button" onClick={show} className="mt-7 flex items-center gap-2 text-left text-sm font-extrabold text-[#694087]">Quero saber mais <ArrowUpRight className="h-4 w-4"/></button>
        </article>)}</div>
      </section>

      <section className="bg-[#fff6e9] px-6 py-20 md:px-12 md:py-28" id="ambientes">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="text-xs font-extrabold tracking-[.18em] text-[#ad719c]">UM OLHAR POR DENTRO</p><h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#654080] md:text-6xl">O espaço real, nas fotos do panfleto.</h2>
            <p className="mt-6 leading-relaxed text-[#6d5e72]">As imagens mostram ambientes internos, área com piso colorido e estrutura de apoio. As fotografias foram extraídas do material impresso; o melhor modo de conhecer a rotina é confirmar a possibilidade de uma visita.</p>
            <button type="button" onClick={show} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#684089] px-6 py-3 font-semibold text-white">Quero conhecer melhor <ArrowUpRight size={17}/></button>
            <p className="mt-5 text-xs text-[#8c798d]">Imagens reais do panfleto, com resolução limitada pela impressão original.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={P+"acolhimento.webp"} alt="Área interna com piso colorido e cercadinho" loading="lazy" width={249} height={245} className="aspect-square w-full rounded-3xl object-cover"/>
            <img src={P+"copa.webp"} alt="Copa e ambiente de apoio com pia" loading="lazy" width={260} height={354} className="aspect-square w-full rounded-3xl object-cover"/>
            <img src={P+"sala.webp"} alt="Sala interna com piso claro e estrutura de atendimento" loading="lazy" width={278} height={246} className="col-span-2 aspect-[16/8] w-full rounded-3xl object-cover"/>
          </div>
        </div>
      </section>

      <section id="horarios" className="bg-[#57377c] px-6 py-20 text-white md:px-12 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div><p className="text-xs font-extrabold tracking-[.16em] text-[#f7d981]">PARA A ROTINA DA SUA FAMÍLIA</p><h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Um horário que acompanha o seu dia.</h2><p className="mt-5 leading-relaxed text-[#ebddf4]">Estes horários constam do panfleto fotografado. Confirme informações atualizadas e disponibilidade antes de se deslocar.</p><button type="button" onClick={show} className="mt-7 rounded-full bg-white px-6 py-3 font-bold text-[#624080]">Consultar informações <ArrowUpRight className="ml-2 inline h-4 w-4"/></button></div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-7"><p className="text-xs font-bold tracking-widest text-[#e3cce9]">SEGUNDA A SEXTA</p><p className="mt-3 text-3xl font-black text-[#ffe18e] md:text-4xl">06h30 – 20h00</p></div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-7"><p className="text-xs font-bold tracking-widest text-[#e3cce9]">SÁBADO</p><p className="mt-3 text-3xl font-black text-[#ffe18e] md:text-4xl">07h30 – 17h00</p></div>
          </div>
        </div>
      </section>

      <section id="localizacao" className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-28">
        <div><p className="text-xs font-extrabold tracking-[.18em] text-[#aa76bd]">ONDE FICA</p><h2 className="mt-5 text-4xl font-black tracking-tight text-[#654080] md:text-6xl">Bem aqui no Jardim Itália.</h2><address className="mt-7 border-l-4 border-[#f3cf78] pl-5 not-italic leading-loose text-[#58465c]">{ADDRESS}</address><p className="mt-6 max-w-md text-sm text-[#756877]">Endereço conforme panfleto. Antes de visitar, confirme diretamente a disponibilidade de atendimento.</p><a href={MAP} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#6b408d] px-6 py-3 font-semibold text-white">Abrir no Google Maps <MapPin size={17}/></a></div>
        <div className="overflow-hidden rounded-[2rem] border-8 border-[#f2e9fa] bg-[#f3ebf5]"><iframe title="Mapa do Cantinho da Tia Mari no Jardim Itália" loading="lazy" className="h-[330px] w-full border-0" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Rua%20Pedro%20Alves%20da%20Rocha%20200%20Sao%20Jose%20dos%20Pinhais%20PR&output=embed"/></div>
      </section>

      <section id="perguntas" className="bg-[#faf1fd] px-6 py-20 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-extrabold tracking-[.18em] text-[#a26db6]">PERGUNTAS FREQUENTES</p><h2 className="mt-5 text-4xl font-black tracking-tight text-[#624080]">Antes de escolher, vale perguntar.</h2><p className="mt-5 text-[#756777]">Respostas baseadas apenas nas informações divulgadas, sem inventar comprovações ou promessas.</p></div><div>{details.map(([q,a])=><details key={q} className="group border-b border-[#e5d5ed] py-5"><summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-[#624080]">{q}<span aria-hidden="true" className="text-2xl">+</span></summary><p className="mt-4 leading-relaxed text-[#77687c]">{a}</p></details>)}</div></div>
      </section>

      <section className="bg-[#f7e6f6] px-6 py-20 text-center"><div className="mx-auto max-w-3xl"><Badge>💜 CADA DESCOBERTA TEM O SEU TEMPO</Badge><h2 className="mt-6 text-4xl font-black leading-tight text-[#634080] md:text-6xl">Um cantinho para cuidar, brincar e crescer.</h2><p className="mt-6 text-[#6c5772]">Quer mais informações sobre os serviços e as vagas anunciadas?</p><button type="button" onClick={show} className="mt-7 rounded-full bg-[#6b408d] px-7 py-4 font-bold text-white shadow-lg shadow-purple-900/10">Abrir consulta demonstrativa <ArrowUpRight className="ml-2 inline h-4 w-4"/></button><p className="mt-7 text-xs text-[#896e8c]">Demonstração de apresentação comercial · Não representa o estabelecimento ou reserva de vaga.</p></div></section>
    </main>

    <PortfolioHostCredit className="sr-only" />

    {!nearFooter && <button type="button" onClick={show} className="fixed bottom-5 right-5 z-40 flex min-h-14 items-center gap-2 rounded-full bg-[#6c408c] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_35px_#41204d55] transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c18ac6]" aria-label="Abrir formulário para consultar informações sobre vagas"><CalendarCheck className="h-5 w-5"/> Consultar vagas</button>}

    {open && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#301a3c]/80 p-3 backdrop-blur-sm" onMouseDown={e => {if (e.target===e.currentTarget) hide();}}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tm-dialog-title" className="flex h-[min(92dvh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#eee2f1] px-5 py-4">
          <div><p className="text-[11px] font-extrabold tracking-widest text-[#9e6caa]">FUNIL DE CONSULTA · 0WEB</p><h2 id="tm-dialog-title" className="mt-1 text-xl font-extrabold text-[#624080]">Informações e vagas anunciadas</h2><p className="mt-1 text-xs text-[#7a6b7b]">Formulário da 0WEB. Não é matrícula ou atendimento oficial da unidade.</p></div>
          <button type="button" aria-label="Fechar formulário" className="rounded-full bg-[#f2e8f6] p-3 text-[#623f80]" onClick={hide}><X size={20}/></button>
        </div>
        <iframe data-funnel-provider="jotform" data-client-key="cantinho-da-tia-mari" src={FORM} title="Formulário demonstrativo de consulta de vagas — Cantinho da Tia Mari" className="min-h-0 w-full flex-1 border-0" loading="eager" referrerPolicy="strict-origin-when-cross-origin"/>
        <div className="border-t border-[#eee2f1] px-5 py-3 text-center text-xs text-[#88728c]">As respostas são armazenadas pelo serviço de formulários da 0WEB; nunca envie dados pessoais de crianças.</div>
      </div>
    </div>}
  </div>;
}
