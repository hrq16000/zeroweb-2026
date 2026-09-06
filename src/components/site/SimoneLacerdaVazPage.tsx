import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  Baby,
  Check,
  HeartPulse,
  Leaf,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: ["Atendimento nutricional", "Bioimpedância e plano alimentar", "Pré e pós-bariátrica", "Laudo nutricional para cirurgia", "Consultoria em amamentação"],
  experienceOptions: ["Quero organizar minha alimentação", "Estou no pré-operatório", "Estou no pós-operatório", "Tenho dúvidas sobre amamentação"],
  periodOptions: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  timingOptions: ["Quero conversar agora", "Nesta semana", "Estou me organizando"],
  proposalKind: "service" as const,
  stepTitles: { service: "Qual cuidado você procura?", experience: "Em que momento você está?", period: "Qual período facilita?", timing: "Quando gostaria de começar?", note: "Se desejar, conte um pouco mais" },
  notePlaceholder: "Ex.: objetivo, cirurgia planejada, rotina alimentar ou dúvida sobre amamentação.",
};

function CTA({ children }: { children: ReactNode }) {
  return <PortfolioCTAQuiz clientKey="simone-lacerda-vaz" studioName="Simone Lacerda Vaz · Nutricionista" recipientName="Simone Lacerda Vaz" theme="pink" mode="booking" quizConfig={quiz} ariaLabel="Conversar com Simone Lacerda Vaz pelo WhatsApp" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--simone-wine)] px-6 py-3.5 font-bold text-white shadow-lg shadow-[var(--simone-wine)]/20 transition hover:-translate-y-0.5 hover:bg-[var(--simone-wine-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--simone-gold)] focus-visible:ring-offset-2">{children}</PortfolioCTAQuiz>;
}

const services = [
  ["Atendimento nutricional", "Um plano possível para sua rotina, objetivos e fase de vida.", Stethoscope],
  ["Bioimpedância", "Avaliação para acompanhar composição corporal com mais contexto.", Scale],
  ["Pré e pós-bariátrica", "Acompanhamento nutricional e orientação em cada etapa do processo.", HeartPulse],
  ["Consultoria em amamentação", "Orientação acolhedora para uma experiência mais segura e tranquila.", Baby],
] as const;

export function SimoneLacerdaVazPage() {
  const theme = { "--simone-paper": "#f7eadb", "--simone-cream": "#fffaf2", "--simone-wine": "#741d25", "--simone-wine-deep": "#4e1118", "--simone-gold": "#c58a3a", "--simone-ink": "#291c1b", "--simone-muted": "#705e59" } as CSSProperties;

  return <MotionScope intensity="BALANCED"><div style={theme} className="min-h-dvh overflow-hidden bg-[var(--simone-paper)] text-[var(--simone-ink)]">
    <header className="sticky top-0 z-30 border-b border-[var(--simone-wine)]/10 bg-[var(--simone-cream)]/95 px-5 py-3 backdrop-blur lg:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><a href="#inicio" aria-label="Simone Lacerda Vaz · Nutricionista" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--simone-gold)] bg-[var(--simone-wine)] font-display text-xl italic text-white">SV</span><span className="font-display text-base font-semibold text-[var(--simone-wine)] sm:text-lg">Simone Lacerda Vaz <small className="block font-sans text-[10px] font-bold uppercase tracking-[.24em] text-[var(--simone-gold)]">Nutricionista</small></span></a><nav aria-label="Navegação da página" className="hidden gap-7 text-sm font-semibold text-[var(--simone-muted)] md:flex"><a href="#atendimentos" className="transition hover:text-[var(--simone-wine)]">Atendimentos</a><a href="#metodo" className="transition hover:text-[var(--simone-wine)]">Como funciona</a><a href="#contato" className="transition hover:text-[var(--simone-wine)]">Contato</a></nav><CTA>Conversar agora <ArrowRight className="h-4 w-4" /></CTA></div></header>
    <main>
      <section id="inicio" className="px-5 py-10 lg:px-10 lg:py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--simone-gold)]">Nutrição com escuta e estratégia</p><h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[.98] text-[var(--simone-wine-deep)] sm:text-7xl">Seu cuidado merece um plano que <em className="font-normal text-[var(--simone-wine)]">caiba na vida.</em></h1><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--simone-muted)]"><ManagedText field="heroSubheadline" fallback="Atendimento nutricional, bioimpedância e acompanhamento especializado para cada fase do seu processo." /></p><div className="mt-8 flex flex-wrap gap-3"><CTA>Começar uma conversa <ArrowRight className="h-4 w-4" /></CTA><a href="#atendimentos" className="inline-flex min-h-12 items-center rounded-full border border-[var(--simone-wine)]/25 px-6 py-3.5 font-semibold text-[var(--simone-wine)] transition hover:bg-[var(--simone-cream)]">Ver atendimentos</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[var(--simone-muted)]"><span><Check className="mr-1 inline h-4 w-4 text-[var(--simone-gold)]" />Plano individualizado</span><span><ShieldCheck className="mr-1 inline h-4 w-4 text-[var(--simone-gold)]" />Acompanhamento cuidadoso</span></div></div><figure className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--simone-gold)]/30 bg-[var(--simone-cream)] shadow-2xl shadow-[var(--simone-wine)]/10"><PortfolioImage src="/images/simone-lacerda-vaz/hero.png" alt="Arte editorial de Simone Lacerda Vaz, nutricionista, com seus atendimentos" width={1024} height={1536} priority managedField="heroImageUrl" className="h-auto w-full object-cover" /><figcaption className="absolute bottom-4 left-4 rounded-full bg-[var(--simone-cream)]/90 px-4 py-2 text-xs font-semibold text-[var(--simone-wine)]">Cuidado especializado para cada fase</figcaption></figure></div></section>
      <section id="atendimentos" className="bg-[var(--simone-cream)] px-5 py-16 lg:px-10 lg:py-24"><div className="mx-auto max-w-7xl"><MotionReveal><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--simone-gold)]">Atendimentos</p><h2 className="mt-3 font-display text-4xl font-semibold text-[var(--simone-wine-deep)] sm:text-5xl">Nutrição para decisões mais tranquilas.</h2></div></MotionReveal><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{services.map(([title, text, Icon], index) => <MotionReveal key={title} delay={index * 0.06}><article className="h-full rounded-3xl border border-[var(--simone-wine)]/10 bg-[var(--simone-paper)] p-6 transition hover:-translate-y-1 hover:border-[var(--simone-gold)]/60"><Icon className="h-8 w-8 text-[var(--simone-wine)]" aria-hidden="true" /><h3 className="mt-6 font-display text-xl font-semibold text-[var(--simone-wine-deep)]">{title}</h3><p className="mt-3 leading-7 text-[var(--simone-muted)]">{text}</p></article></MotionReveal>)}</div></div></section>
      <section id="metodo" className="px-5 py-16 lg:px-10 lg:py-24"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--simone-gold)]">Um próximo passo possível</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-[var(--simone-wine-deep)] sm:text-5xl">Escuta, avaliação e acompanhamento sem fórmula pronta.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--simone-muted)]">Cada conversa começa entendendo seu momento: rotina, objetivos, cirurgia, maternidade ou o que você precisa organizar agora.</p></div><div className="rounded-[2rem] bg-[var(--simone-wine)] p-8 text-white"><Sparkles className="h-8 w-8 text-[var(--simone-gold)]" /><h3 className="mt-6 font-display text-2xl font-semibold">Vamos conversar?</h3><p className="mt-3 leading-7 text-white/75">Responda algumas perguntas rápidas e a equipe organiza o melhor próximo passo.</p><div className="mt-6"><CTA>Iniciar atendimento <ArrowRight className="h-4 w-4" /></CTA></div></div></div></section>
      <section id="contato" className="border-t border-[var(--simone-wine)]/10 bg-[var(--simone-cream)] px-5 py-16 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--simone-gold)]">Contato</p><h2 className="mt-3 font-display text-4xl font-semibold text-[var(--simone-wine-deep)]">Seu cuidado começa com uma conversa.</h2><p className="mt-4 max-w-xl leading-7 text-[var(--simone-muted)]">Atendimento nutricional, bioimpedância, pré e pós-bariátrica e consultoria em amamentação.</p></div><CTA>Falar pelo WhatsApp <ArrowRight className="h-4 w-4" /></CTA></div></section>
    </main><footer className="bg-[var(--simone-wine-deep)] px-5 py-8 text-white/70 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"><span>Simone Lacerda Vaz · Nutricionista</span><span>Informações e disponibilidade confirmadas no atendimento.</span></div><PortfolioHostCredit className="mx-auto mt-5 max-w-7xl" /></footer><PortfolioSocialProofPopup clientKey="simone-lacerda-vaz" eyebrow="Atendimento nutricional" title="Um próximo passo possível começa aqui." description="Converse sobre seu momento e descubra qual atendimento faz sentido para você." ctaLabel="Conversar agora" ctaHref="#contato" /><PortfolioUpsellPopup pageName="simone-lacerda-vaz" /></div></MotionScope>;
}
