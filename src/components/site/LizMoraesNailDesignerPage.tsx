import { ArrowRight, CalendarDays, Check, Heart, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Manicure tradicional · R$ 45,00",
    "Pedicure tradicional · R$ 45,00",
    "Spa dos pés · R$ 55,00",
    "Esmaltação em gel · R$ 70,00",
    "Banho de gel · R$ 90,00",
    "Alongamento ou manutenção molde F1",
    "Quero orientação para escolher",
  ],
  experienceOptions: ["Primeiro atendimento", "Já faço unhas em gel", "Quero manutenção", "Quero conhecer as opções"],
  periodOptions: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  timingOptions: ["O quanto antes", "Ainda nesta semana", "Na próxima semana", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual cuidado você deseja?",
    experience: "Como estão suas unhas hoje?",
    period: "Qual período combina com sua rotina?",
    timing: "Quando gostaria de agendar?",
    note: "Conte um pouco mais",
  },
  notePlaceholder: "Ex.: data desejada, referência de cor ou dúvida sobre o molde F1.",
};

function CTA({ children, location }: { children: React.ReactNode; location: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="liz-moraes-nail-designer"
      studioName="Liz Moraes Nail Designer"
      recipientName="Liz Moraes Nail Designer"
      theme="pink"
      mode="booking"
      quizConfig={quiz}
      ariaLabel="Agendar horário com Liz Moraes Nail Designer"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d79b93] px-6 py-3.5 font-bold text-[#160f11] shadow-lg shadow-[#d79b93]/20 transition hover:-translate-y-0.5 hover:bg-[#efbbb2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efbbb2]"
      onOpen={() => { void location; }}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const services = [
  ["Manicure tradicional", "R$ 45,00", "Cuidado clássico para mãos bem cuidadas."],
  ["Pedicure tradicional", "R$ 45,00", "Um momento dedicado aos pés e ao acabamento."],
  ["Spa dos pés", "R$ 55,00", "Pausa de cuidado para renovar sua rotina."],
  ["Esmaltação em gel", "R$ 70,00", "Brilho e acabamento em gel para suas unhas."],
  ["Banho de gel", "R$ 90,00", "Uma camada de cuidado com visual elegante."],
  ["Alongamento molde F1", "R$ 150,00", "Comprimento e formato personalizados."],
  ["Manutenção molde F1", "R$ 120,00", "Manutenção para seguir cuidando do seu alongamento."],
];

export function LizMoraesNailDesignerPage() {
  return (
    <div className="min-h-dvh bg-[#100c0d] text-[#fff7f4]">
      <header className="sticky top-0 z-20 border-b border-[#d79b93]/20 bg-[#100c0d]/90 px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Liz Moraes Nail Designer" className="shrink-0">
            <PortfolioImage managedField="logoUrl" priority src="/images/liz-moraes-nail-designer/logo.png" alt="Liz Moraes Nail Designer" width={1536} height={1024} decoding="async" className="h-12 w-auto max-w-[180px] object-contain" />
          </a>
          <nav className="hidden gap-6 text-sm font-semibold text-white/70 md:flex"><a href="#servicos" className="hover:text-[#efbbb2]">Serviços</a><a href="#cuidado" className="hover:text-[#efbbb2]">Cuidado</a><a href="#localizacao" className="hover:text-[#efbbb2]">Localização</a></nav>
          <CTA location="liz_header">Agendar horário <ArrowRight className="h-4 w-4" /></CTA>
        </div>
      </header>
      <main>
        <section id="inicio" className="relative overflow-hidden px-5 py-14 lg:px-8 lg:py-24"><div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#7f4f55]/30 blur-3xl" /><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]"><div className="relative"><p className="text-sm font-bold uppercase tracking-[.22em] text-[#efbbb2]">Nail designer · Centro · São José dos Pinhais</p><h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[.98] sm:text-7xl">Suas unhas, sua <span className="text-[#d79b93]">melhor versão.</span></h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/70">Realce sua beleza e eleve sua autoestima com atendimento personalizado, materiais de qualidade e todo o carinho que você merece.</p><div className="mt-8 flex flex-wrap gap-3"><CTA location="liz_hero">Agendar meu horário <ArrowRight className="h-4 w-4" /></CTA><a href="#servicos" className="inline-flex min-h-12 items-center rounded-full border border-[#d79b93]/50 px-6 py-3.5 font-semibold text-[#efbbb2]">Ver serviços</a></div><div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-white/65"><span><Check className="mr-1 inline h-4 w-4 text-[#d79b93]" />Atendimento personalizado</span><span><Heart className="mr-1 inline h-4 w-4 text-[#d79b93]" />Cuidado em cada detalhe</span></div></div><motion.div initial={{ opacity: 0, y: 18, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .65 }} className="relative"><div className="absolute -inset-3 rounded-[2rem] bg-[#d79b93]/20 blur-xl" /><PortfolioImage src="/images/liz-moraes-nail-designer/hero.png" alt="Tabela de serviços da Liz Moraes Nail Designer" priority width={1080} height={1200} className="relative mx-auto w-full max-w-xl rounded-[2rem] object-cover shadow-2xl shadow-black/40"
            managedField="heroImageUrl"
          /></motion.div></div></section>
        <section id="servicos" className="bg-[#f8e9e5] px-5 py-20 text-[#211719] lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#9b6562]">Tabela de cuidados</p><h2 className="mt-3 max-w-2xl font-display text-4xl font-bold">Escolha o cuidado que combina com você.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(([name, price, detail], index) => <motion.article key={name} whileHover={{ y: -5 }} className="rounded-3xl border border-[#e4c9c2] bg-white/75 p-6 shadow-sm"><span className="text-sm font-bold text-[#b37b75]">0{index + 1}</span><h3 className="mt-7 text-xl font-bold">{name}</h3><p className="mt-3 text-2xl font-black text-[#9b6562]">{price}</p><p className="mt-3 text-sm leading-6 text-[#6b5250]">{detail}</p><a href="#agendamento" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#9b6562] hover:underline">Quero este cuidado <ArrowRight className="h-4 w-4" /></a></motion.article>)}</div></div></section>
        <section id="cuidado" className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#efbbb2]">Uma experiência para você</p><h2 className="mt-3 font-display text-4xl font-bold">Cuidado, beleza e autoestima em cada etapa.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-white/70">Do primeiro contato à escolha do acabamento, você encontra espaço para explicar o que deseja e planejar seu horário com tranquilidade.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{[["01", "Escolha", "Conte o serviço ou a referência que você imaginou."], ["02", "Combine", "Alinhe formato, cor e disponibilidade no atendimento."], ["03", "Cuide-se", "Reserve seu momento de beleza no Centro."]].map(([n, title, text]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-sm font-bold text-[#d79b93]">{n}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}</div></div><div id="agendamento" className="rounded-[2rem] border border-[#d79b93]/25 bg-[#1c1315] p-8 shadow-2xl"><Sparkles className="h-8 w-8 text-[#efbbb2]" /><h3 className="mt-6 font-display text-3xl font-bold">Vamos reservar seu momento?</h3><p className="mt-3 leading-7 text-white/65">Responda algumas perguntas rápidas para iniciar seu agendamento com a Liz Moraes Nail Designer.</p><CTA location="liz_booking">Agendar pelo WhatsApp <ArrowRight className="h-4 w-4" /></CTA><p className="mt-5 text-xs text-white/50"><CalendarDays className="mr-1 inline h-4 w-4" />Horários mediante disponibilidade.</p></div></div></section>
        <section id="localizacao" className="bg-[#d79b93] px-5 py-16 text-[#211719] lg:px-8"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#5d3739]">Atendimento presencial</p><h2 className="mt-3 font-display text-4xl font-bold">Seu próximo cuidado começa no Centro.</h2><p className="mt-3 flex items-start gap-2 text-lg font-semibold"><MapPin className="mt-1 h-5 w-5 shrink-0" />Rua Marcelino Nogueira, 606 · Centro<br />São José dos Pinhais — PR</p></div><CTA location="liz_location">Encontrar meu horário <ArrowRight className="h-4 w-4" /></CTA></div></section>
      </main>
      <footer className="bg-[#090708] px-5 py-8 text-sm text-white/60 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-white">Liz Moraes <span className="text-[#efbbb2]">Nail Designer</span></p><p className="mt-1">Cuidado personalizado para mãos e pés.</p></div><PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#efbbb2]" /></div></footer>
      <PortfolioSocialProofPopup clientKey="liz-moraes-nail-designer" eyebrow="Liz Moraes Nail Designer" title="Suas unhas merecem um cuidado especial." description="Conheça os serviços e reserve um momento de beleza, cuidado e autoestima." ctaLabel="Ver serviços" ctaHref="#servicos" delayMs={9000} className="border-[#d79b93]/40 bg-[#1c1315]/95 text-white" accentClassName="text-[#efbbb2]" />
      <PortfolioUpsellPopup pageName="portfolio-liz-moraes-nail-designer" />
    </div>
  );
}
