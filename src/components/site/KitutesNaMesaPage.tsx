import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, CakeSlice, CalendarDays, ChefHat, Check, Heart, Instagram, PartyPopper, Sparkles } from "lucide-react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: ["Salgados assados e fritos", "Mini lanches", "Doces e bolos caseiros", "Porções para eventos", "Coffee break e kits"],
  experienceOptions: ["Aniversário ou comemoração", "Casamento ou confraternização", "Coffee break empresarial", "Receber família e amigos"],
  periodOptions: ["Ainda vou definir a data", "Nos próximos 7 dias", "Nas próximas semanas", "Quero consultar disponibilidade"],
  timingOptions: ["Quero um orçamento", "Estou montando o cardápio", "Preciso de uma orientação"],
  proposalKind: "service" as const,
  stepTitles: { service: "O que vai compor sua mesa?", experience: "Qual é a ocasião?", period: "Quando será?", timing: "Qual próximo passo?", note: "Conte um pouco mais" },
  notePlaceholder: "Ex.: data, número de pessoas, sabores desejados ou tipo de evento.",
};

function CTA({ children, location: _location }: { children: ReactNode; location: string }) {
  return <PortfolioCTAQuiz clientKey="kitutes-na-mesa" studioName="Kitutes na Mesa" recipientName="a equipe Kitutes na Mesa" theme="pink" mode="proposal" quizConfig={quiz} ariaLabel="Solicitar orçamento pelo WhatsApp" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--kitutes-terracotta)] px-6 py-3.5 font-bold text-white shadow-lg shadow-[var(--kitutes-terracotta)]/20 transition hover:-translate-y-0.5 hover:bg-[var(--kitutes-cocoa)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kitutes-terracotta)] focus-visible:ring-offset-2">{children}</PortfolioCTAQuiz>;
}

const menu = [
  ["Salgados", "Assados e fritos para servir quentinhos e dividir sem pressa.", ChefHat],
  ["Mini lanches", "Combinações práticas para coffee breaks, reuniões e comemorações.", PartyPopper],
  ["Doces", "Pequenos detalhes doces para completar a mesa e surpreender.", Heart],
  ["Bolos caseiros", "Bolos com clima de casa para acompanhar cada encontro.", CakeSlice],
] as const;

const occasions = [
  ["01", "Festas em família", "Aniversários, encontros e datas que pedem uma mesa cheia de carinho.", "#f4c9b8"],
  ["02", "Eventos e celebrações", "Casamentos, confraternizações e momentos que merecem planejamento.", "#e7a797"],
  ["03", "Empresas e coffee breaks", "Porções e mini lanches pensados para receber equipes e convidados.", "#d98978"],
] as const;

export function KitutesNaMesaPage() {
  const [occasion, setOccasion] = useState("Festas em família");
  const theme = {
    "--kitutes-paper": "#fff7f0",
    "--kitutes-cream": "#fffaf6",
    "--kitutes-terracotta": "#b96555",
    "--kitutes-cocoa": "#4b2e28",
    "--kitutes-blush": "#f4c9b8",
    "--kitutes-muted": "#765d55",
  } as CSSProperties;

  return <MotionScope intensity="BALANCED"><div style={theme} className="min-h-dvh overflow-hidden bg-[var(--kitutes-paper)] text-[var(--kitutes-cocoa)]">
    <header className="sticky top-0 z-30 border-b border-[var(--kitutes-cocoa)]/10 bg-[var(--kitutes-cream)]/95 px-5 py-3 backdrop-blur lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="#inicio" aria-label="Kitutes na Mesa" className="flex items-center gap-3">
          <PortfolioImage src="/images/kitutes-na-mesa/logo.png" alt="Emblema conceito Kitutes na Mesa" width={128} height={128} priority managedField="logoUrl" className="h-11 w-11 rounded-full object-cover" />
          <span className="font-serif text-lg font-bold tracking-tight text-[var(--kitutes-cocoa)]">Kitutes <span className="font-normal text-[var(--kitutes-terracotta)]">na Mesa</span><small className="block font-sans text-[9px] font-bold uppercase tracking-[.2em] text-[var(--kitutes-muted)]">Porções com carinho</small></span>
        </a>
        <nav aria-label="Navegação principal" className="hidden gap-7 text-sm font-semibold text-[var(--kitutes-muted)] md:flex"><a href="#cardapio" className="transition hover:text-[var(--kitutes-terracotta)]">Cardápio</a><a href="#ocasioes" className="transition hover:text-[var(--kitutes-terracotta)]">Ocasiões</a><a href="#encomenda" className="transition hover:text-[var(--kitutes-terracotta)]">Encomenda</a></nav>
        <CTA location="kitutes_header">Fazer orçamento <ArrowRight className="h-4 w-4" /></CTA>
      </div>
    </header>

    <main>
      <section id="inicio" className="relative px-5 py-12 lg:px-10 lg:py-24"><div className="pointer-events-none absolute -left-48 top-12 h-[28rem] w-[28rem] rounded-full bg-[var(--kitutes-blush)]/40 blur-3xl" /><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative z-10"><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[var(--kitutes-terracotta)]">Encomendas sob medida · Curitiba e região</p><MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-5 max-w-2xl font-serif text-5xl font-bold leading-[.98] tracking-[-.04em] text-[var(--kitutes-cocoa)] sm:text-7xl">Seu evento merece uma mesa com <em className="font-normal text-[var(--kitutes-terracotta)]">gosto de quero mais.</em></MotionReveal><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--kitutes-muted)]">Salgados, mini lanches, doces e bolos caseiros preparados com ingredientes selecionados e carinho em cada mordida.</p><div className="mt-8 flex flex-wrap gap-3"><CTA location="kitutes_hero">Montar meu orçamento <ArrowRight className="h-4 w-4" /></CTA><a href="#cardapio" className="inline-flex min-h-12 items-center rounded-full border border-[var(--kitutes-terracotta)]/35 px-6 py-3.5 font-bold text-[var(--kitutes-cocoa)] transition hover:border-[var(--kitutes-terracotta)] hover:text-[var(--kitutes-terracotta)]">Ver o cardápio</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[var(--kitutes-muted)]"><span><Check className="mr-1 inline h-4 w-4 text-[var(--kitutes-terracotta)]" />Somente sob encomenda</span><span><Sparkles className="mr-1 inline h-4 w-4 text-[var(--kitutes-terracotta)]" />Feito com capricho</span></div></div>
        <MotionReveal variant="right" className="relative"><div className="absolute -inset-3 rounded-[2rem] border border-[var(--kitutes-terracotta)]/25" /><PortfolioImage src="/images/kitutes-na-mesa/hero.png" alt="Composição editorial de salgados, doces, mini lanches e bolo caseiro" priority managedField="heroImageUrl" width={1536} height={864} className="relative aspect-video w-full rounded-[1.75rem] object-cover shadow-2xl shadow-[var(--kitutes-cocoa)]/15" /><p className="mt-3 text-right text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kitutes-muted)]">Uma composição de marca · sabores para imaginar</p></MotionReveal>
      </div></section>

      <section id="cardapio" className="bg-[var(--kitutes-cocoa)] px-5 py-20 text-[var(--kitutes-cream)] lg:px-10 lg:py-24"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[var(--kitutes-blush)]">O que vai à mesa</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">Um cardápio que acompanha o tamanho do seu momento.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/70">A composição é definida na conversa, de acordo com a ocasião, o número de pessoas e as preferências do seu evento.</p></div><div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{menu.map(([title, text, Icon], index) => <MotionReveal as="article" variant="up" delay={index * 80} key={title} className="min-h-64 rounded-[1.5rem] border border-white/15 bg-white/[.06] p-6 transition hover:-translate-y-1 hover:bg-white/[.1]"><Icon className="h-8 w-8 text-[var(--kitutes-blush)]" aria-hidden="true" /><h3 className="mt-10 font-serif text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/70">{text}</p></MotionReveal>)}</div></div></section>

      <section id="ocasioes" className="px-5 py-20 lg:px-10 lg:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[var(--kitutes-terracotta)]">Escolha o clima</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">A mesa começa pela ocasião.</h2><p className="mt-5 max-w-xl leading-8 text-[var(--kitutes-muted)]">Selecione um cenário para ver como a conversa pode começar. O cardápio final é sempre combinado sob encomenda.</p><div className="mt-8 flex flex-wrap gap-2">{occasions.map(([code, title]) => <button type="button" key={code} onClick={() => setOccasion(title)} className={`min-h-11 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kitutes-terracotta)] ${occasion === title ? "bg-[var(--kitutes-terracotta)] text-white" : "border border-[var(--kitutes-terracotta)]/25 text-[var(--kitutes-cocoa)] hover:border-[var(--kitutes-terracotta)]"}`}>{title}</button>)}</div></div><div className="grid gap-4">{occasions.map(([code, title, text, color]) => <article key={code} className={`rounded-[1.75rem] p-7 transition ${occasion === title ? "translate-x-1 shadow-xl" : "opacity-70"}`} style={{ backgroundColor: color }}><div className="flex items-start justify-between gap-6"><span className="font-mono text-xs font-bold tracking-[.2em] text-[var(--kitutes-cocoa)]/65">{code}</span><CalendarDays className="h-6 w-6 text-[var(--kitutes-cocoa)]/70" aria-hidden="true" /></div><h3 className="mt-9 font-serif text-3xl font-bold text-[var(--kitutes-cocoa)]">{title}</h3><p className="mt-3 max-w-xl leading-7 text-[var(--kitutes-cocoa)]/75">{text}</p><p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-[var(--kitutes-cocoa)]/60">{occasion === title ? "ocasião selecionada" : "toque para selecionar"}</p></article>)}</div></div></section>

      <section id="encomenda" className="bg-[var(--kitutes-blush)] px-5 py-16 lg:px-10 lg:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[var(--kitutes-cream)] p-8 shadow-2xl shadow-[var(--kitutes-cocoa)]/10 sm:p-12 lg:flex-row lg:items-center"><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.28em] text-[var(--kitutes-terracotta)]">Próximo passo</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight text-[var(--kitutes-cocoa)] sm:text-5xl">Conte a ocasião. A gente ajuda a montar a mesa.</h2><p className="mt-4 max-w-xl leading-7 text-[var(--kitutes-muted)]">Escolha o que deseja, informe a data e receba um orçamento sem compromisso pelo WhatsApp.</p></div><CTA location="kitutes_footer">Solicitar orçamento <ArrowRight className="h-4 w-4" /></CTA></div></section>
    </main>

    <footer className="border-t border-[var(--kitutes-cocoa)]/10 bg-[var(--kitutes-cream)] px-5 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-serif text-xl font-bold text-[var(--kitutes-cocoa)]">Kitutes <span className="text-[var(--kitutes-terracotta)]">na Mesa</span></p><p className="mt-1 text-xs text-[var(--kitutes-muted)]">Porções com carinho · encomendas sob medida</p></div><div className="flex flex-col items-start gap-3 text-xs text-[var(--kitutes-muted)] sm:items-end"><a href="https://www.instagram.com/invites/contact/?igsh=nor9e0ag8wrw&utm_content=t2w8v3" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 font-bold hover:text-[var(--kitutes-terracotta)]"><Instagram className="h-4 w-4" />Acompanhe as novidades</a><PortfolioHostCredit linkClassName="font-semibold text-[var(--kitutes-cocoa)] underline underline-offset-4 hover:text-[var(--kitutes-terracotta)]" /></div></div></footer>
    <PortfolioSocialProofPopup clientKey="kitutes-na-mesa" eyebrow="Kitutes na Mesa" title="Sua comemoração pode começar pela mesa." description="Escolha a ocasião e conte o que gostaria de servir." ctaLabel="Montar orçamento" ctaHref="#encomenda" delayMs={10000} className="border-[var(--kitutes-terracotta)]/40 bg-[var(--kitutes-cocoa)]/95 text-white" accentClassName="text-[var(--kitutes-blush)]" /><PortfolioUpsellPopup pageName="portfolio-kitutes-na-mesa" />
  </div></MotionScope>;
}
