import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, Check, Clock3, Home, Instagram, MapPin, Microwave, RotateCcw, ShieldCheck, ShoppingBag, Sparkles, Wrench } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Conserto de micro-ondas",
    "Restauração contra ferrugem",
    "Comprar micro-ondas revisado",
    "Conserto a domicílio",
    "Quero orientação para escolher",
  ],
  experienceOptions: [
    "Meu aparelho parou de funcionar",
    "Meu micro-ondas está enferrujado",
    "Quero comprar um modelo revisado",
    "Preciso avaliar a melhor opção",
  ],
  periodOptions: ["Em casa", "Na assistência", "Quero combinar a entrega", "Ainda preciso de orientação"],
  timingOptions: ["O quanto antes", "Nesta semana", "Estou pesquisando", "Quero consultar disponibilidade"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você precisa resolver?",
    experience: "Como está o seu micro-ondas?",
    period: "Onde será o atendimento?",
    timing: "Quando você precisa?",
    note: "Conte os detalhes",
  },
  notePlaceholder: "Ex.: marca, modelo, defeito percebido ou se procura um aparelho revisado.",
};

function CTA({ children, location }: { children: React.ReactNode; location: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="assistencia-microondas-santos"
      studioName="Assistência Técnica Microondas Santos"
      recipientName="Ryan e Pedro"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      ariaLabel="Falar com a Assistência Técnica Microondas Santos"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d9282f] px-6 py-3.5 font-black text-white shadow-lg shadow-[#d9282f]/25 transition hover:-translate-y-0.5 hover:bg-[#ef474d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef474d]"
      onOpen={() => { void location; }}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const services = [
  ["Conserto especializado", "Diagnóstico e reparo para devolver o funcionamento ao seu micro-ondas.", Wrench],
  ["Restauração contra ferrugem", "Recuperação interna para renovar o acabamento do aparelho.", RotateCcw],
  ["Modelos revisados à venda", "Mais de 15 modelos disponíveis, sujeitos à disponibilidade do estoque.", ShoppingBag],
  ["Atendimento a domicílio", "Combine a visita técnica e veja a melhor forma de atendimento para o seu caso.", Home],
] as const;

export function AssistenciaMicroondasSantosPage() {
  return (
    <div className="min-h-dvh bg-[#111315] text-[#f7f7f5]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111315]/95 px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Assistência Técnica Microondas Santos" className="shrink-0">
            <img src="/images/assistencia-microondas-santos/logo.png" alt="Assistência Técnica Microondas Santos" width={1768} height={890} loading="eager" fetchPriority="high" decoding="async" className="h-11 w-auto max-w-[235px] object-contain" />
          </a>
          <nav className="hidden gap-6 text-sm font-semibold text-white/70 md:flex"><a href="#servicos" className="hover:text-white">Serviços</a><a href="#como-funciona" className="hover:text-white">Como funciona</a><a href="#instagram" className="hover:text-white">Instagram</a></nav>
          <CTA location="santos_microondas_header">Solicitar atendimento <ArrowRight className="h-4 w-4" /></CTA>
        </div>
      </header>
      <main>
        <section id="inicio" className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-24"><div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#d9282f]/15 blur-3xl" /><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.92fr_1.08fr]"><div className="relative"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#ff6a70]">Assistência técnica · Micro-ondas Santos</p><h1 className="mt-5 max-w-xl text-5xl font-black leading-[.98] tracking-tight sm:text-7xl">
            <ManagedText field="heroHeadline" fallback={"Seu micro-ondas pode voltar a funcionar bem."} />
          </h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            <ManagedText field="heroSubheadline" fallback={"Conserto, restaura\u00e7\u00e3o contra ferrugem e modelos revisados para venda, com atendimento t\u00e9cnico organizado para cada necessidade."} />
          </p><div className="mt-8 flex flex-wrap gap-3"><CTA location="santos_microondas_hero">Falar com Ryan e Pedro <ArrowRight className="h-4 w-4" /></CTA><a href="#servicos" className="inline-flex min-h-12 items-center rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white/85 transition hover:border-[#ff6a70] hover:text-white">Ver serviços</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-white/65"><span><Check className="mr-1 inline h-4 w-4 text-[#ff6a70]" />Diagnóstico organizado</span><span><ShieldCheck className="mr-1 inline h-4 w-4 text-[#ff6a70]" />Garantia informada na compra</span></div></div><div className="relative"><div className="absolute -inset-3 rounded-[2rem] bg-[#d9282f]/10 blur-xl" /><PortfolioImage src="/images/assistencia-microondas-santos/hero.png" alt="Antes e depois da restauração de um micro-ondas" priority width={1220} height={1198} className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 object-cover shadow-2xl shadow-black/50"
            managedField="heroImageUrl"
          /></div></div></section>
        <section id="servicos" className="bg-[#1b1e21] px-5 py-20 lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#ff6a70]">Soluções para o seu aparelho</p><h2 className="mt-3 max-w-2xl text-4xl font-black">Escolha o caminho mais prático.</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{services.map(([title, text, Icon]) => <article key={title} className="rounded-2xl border border-white/10 bg-[#111315] p-6 transition hover:-translate-y-1 hover:border-[#d9282f]/60"><Icon className="h-8 w-8 text-[#ff6a70]" /><h3 className="mt-8 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-white/65">{text}</p><a href="#atendimento" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#ff9a9f] hover:underline">Quero avaliar <ArrowRight className="h-4 w-4" /></a></article>)}</div></div></section>
        <section id="galeria" className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#ff6a70]">Galeria da assistência</p><h2 className="mt-3 max-w-2xl text-4xl font-black">Restauração e atendimento em um só lugar.</h2><div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start"><figure className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1e21]"><PortfolioImage src="/images/assistencia-microondas-santos/hero.png" alt="Comparativo antes e depois da restauração de um micro-ondas" width={1220} height={1198} className="w-full object-cover" /><figcaption className="p-5 text-sm text-white/60">Material enviado pela Assistência Técnica Microondas Santos.</figcaption></figure><figure className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1e21]"><PortfolioImage src="/images/assistencia-microondas-santos/flyer.png" alt="Flyer da Assistência Técnica Microondas Santos" width={1040} height={585} className="w-full object-cover" /><figcaption className="p-5 text-sm text-white/60">Identidade e contatos apresentados no material original do cliente.</figcaption></figure></div></div></section>
        <section id="como-funciona" className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#ff6a70]">Como funciona</p><h2 className="mt-3 max-w-2xl text-4xl font-black">Uma conversa clara antes do próximo passo.</h2><div className="mt-8 grid gap-4 sm:grid-cols-3">{[["01", "Conte", "Explique o defeito, a ferrugem ou o modelo que procura."], ["02", "Avalie", "A equipe entende o aparelho e orienta a alternativa adequada."], ["03", "Combine", "Defina atendimento, retirada ou entrega conforme o caso."]].map(([number, title, text]) => <div key={number} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><span className="text-sm font-bold text-[#ff6a70]">{number}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}</div></div><div id="atendimento" className="rounded-[2rem] border border-[#d9282f]/30 bg-[#1b1e21] p-8 shadow-2xl"><Sparkles className="h-8 w-8 text-[#ff6a70]" /><h3 className="mt-6 text-3xl font-black">Precisa de uma orientação?</h3><p className="mt-3 leading-7 text-white/65">Responda algumas perguntas rápidas e envie os detalhes para a equipe avaliar seu atendimento.</p><CTA location="santos_microondas_booking">Solicitar avaliação <ArrowRight className="h-4 w-4" /></CTA><p className="mt-5 text-xs text-white/45"><Clock3 className="mr-1 inline h-4 w-4" />Disponibilidade e condições são confirmadas no atendimento.</p></div></div></section>
        <section id="instagram" className="bg-[#d9282f] px-5 py-16 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><Instagram className="h-8 w-8" /><p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-white/75">Presença digital</p><h2 className="mt-2 text-3xl font-black">Acompanhe a Assistência Santos.</h2><p className="mt-3 max-w-xl leading-7 text-white/80">Veja restaurações, aparelhos e novidades no perfil da assistência.</p></div><a href="https://www.instagram.com/micro_santos" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 py-3 font-black text-[#a7181d]">Abrir Instagram <ArrowRight className="h-4 w-4" /></a></div></section>
      </main>
      <footer className="bg-[#090a0b] px-5 py-8 text-sm text-white/60 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-white">Assistência Técnica Microondas Santos</p><p className="mt-1">Conserto, restauração e venda de micro-ondas.</p><p className="mt-1 flex items-center gap-1"><MapPin className="h-4 w-4 text-[#ff6a70]" />Atendimento local — consulte a região.</p></div><PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#ff9a9f]" /></div></footer>
      <PortfolioSocialProofPopup clientKey="assistencia-microondas-santos" eyebrow="Assistência Técnica Microondas Santos" title="Seu micro-ondas pode voltar a funcionar bem." description="Conserto, restauração contra ferrugem e modelos revisados para venda." ctaLabel="Ver serviços" ctaHref="#servicos" delayMs={9000} className="border-[#d9282f]/45 bg-[#151719]/95 text-white" accentClassName="text-[#ff6a70]" />
      <PortfolioUpsellPopup pageName="portfolio-assistencia-microondas-santos" />
    </div>
  );
}
