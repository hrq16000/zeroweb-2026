import { ArrowRight, CalendarDays, Check, Eye, Facebook, MapPin, Scissors, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { MotionReveal, MotionScope, MotionStagger } from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";

const quizConfig = {
  services: [
    "Alongamento / Molde F1",
    "Banho em gel",
    "Pé em gel",
    "Volume brasileiro",
    "Progressiva",
  ],
  experienceOptions: [
    "É minha primeira vez no studio",
    "Já faço esse procedimento",
    "Quero entender qual opção combina comigo",
    "Quero aproveitar a condição para novas clientes",
  ],
  periodOptions: ["Manhã", "Tarde", "Noite", "Tenho flexibilidade"],
  timingOptions: ["Quero o primeiro horário disponível", "Nesta semana", "Na próxima semana", "Estou me organizando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "Qual cuidado você quer agendar?",
    experience: "Como você chega para este atendimento?",
    period: "Qual período facilita para você?",
    timing: "Quando gostaria de ir?",
    note: "Quer contar mais algum detalhe?",
  },
  notePlaceholder: "Ex.: formato desejado, referência de unha, cílios, comprimento do cabelo ou disponibilidade.",
};

function CTA({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="catharine-lima-studio"
      studioName="Catharine Lima Studio"
      recipientName="Catharine Lima Studio"
      theme="pink"
      mode="booking"
      quizConfig={quizConfig}
      ariaLabel="Solicitar horário no Catharine Lima Studio"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7b2f4c] px-6 py-3.5 font-bold text-white shadow-xl shadow-[#7b2f4c]/20 transition hover:-translate-y-0.5 hover:bg-[#61233b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dca1b5] focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const services = [
  { title: "Alongamento · Molde F1", text: "Para quem busca comprimento e um acabamento marcante, com escolha de referência no atendimento.", icon: Sparkles },
  { title: "Banho em gel", text: "Uma opção para valorizar as unhas naturais com brilho e acabamento em gel.", icon: Check },
  { title: "Pé em gel", text: "Cuidado com acabamento em gel para os pés, com disponibilidade confirmada no agendamento.", icon: CalendarDays },
  { title: "Volume brasileiro", text: "Procedimento de cílios divulgado pelo studio para destacar o olhar.", icon: Eye },
  { title: "Progressiva", text: "Serviço para cabelo divulgado pelo studio, com avaliação e horário combinados diretamente no atendimento.", icon: Scissors },
];

export function CatharineLimaStudioPage() {
  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#fff9fb] text-[#3a1c2a]">
        <header className="sticky top-0 z-30 border-b border-[#7b2f4c]/10 bg-[#fff9fb]/90 px-5 py-3 backdrop-blur lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="#inicio" className="flex items-center gap-3" aria-label="Catharine Lima Studio">
              <PortfolioImage src="/images/catharine-lima-studio/logo.svg" alt="" width={52} height={52} className="h-11 w-11 rounded-full" />
              <span className="font-display text-lg font-black tracking-tight text-[#61233b]">
                Catharine Lima <span className="font-normal text-[#b26682]">Studio</span>
              </span>
            </a>
            <nav className="hidden gap-6 text-sm font-semibold text-[#6e5260] md:flex">
              <a href="#servicos" className="hover:text-[#7b2f4c]">Serviços</a>
              <a href="#novas-clientes" className="hover:text-[#7b2f4c]">Primeira visita</a>
              <a href="#local" className="hover:text-[#7b2f4c]">Local</a>
            </nav>
            <CTA>Agendar horário <ArrowRight className="h-4 w-4" /></CTA>
          </div>
        </header>

        <main>
          <section id="inicio" className="relative px-5 py-12 lg:px-10 lg:py-20">
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#efc9d6]/45 blur-3xl" />
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[.28em] text-[#b26682]">Nail design · cílios · cabelo</p>
                <MotionReveal as="h1" variant="up" className="mt-5 max-w-2xl font-display text-5xl font-black leading-[.93] text-[#4c1d32] sm:text-7xl">
                  Seu momento de beleza pode começar com um <span className="text-[#a54e6e]">horário só seu.</span>
                </MotionReveal>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#715462]">
                  Catharine Lima Studio reúne alongamento, Molde F1, banho em gel, pé em gel, volume brasileiro e progressiva. Escolha o cuidado que procura e solicite seu horário pelo funil.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CTA>Quero agendar <CalendarDays className="h-4 w-4" /></CTA>
                  <a href="#servicos" className="inline-flex min-h-12 items-center rounded-full border border-[#d8b4c2] px-6 py-3.5 font-semibold text-[#7b2f4c] transition hover:bg-white">
                    Ver serviços
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#715462]">
                  <span><Check className="mr-1 inline h-4 w-4 text-[#a54e6e]" />Condições para novas clientes</span>
                  <span><MapPin className="mr-1 inline h-4 w-4 text-[#a54e6e]" />Rua Victor Alves Ferreira, 211</span>
                </div>
              </div>
              <MotionReveal variant="scale" className="relative mx-auto w-full max-w-2xl">
                <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-[#e8bdcd] via-white to-[#8f4562] opacity-50 blur-xl" />
                <PortfolioImage
                  src="/images/catharine-lima-studio/hero.svg"
                  alt="Arte editorial do Catharine Lima Studio inspirada em unhas, cílios e beleza"
                  width={1200}
                  height={1500}
                  priority
                  className="relative max-h-[720px] w-full rounded-[2.2rem] object-cover shadow-2xl shadow-[#6f2d47]/15"
                />
              </MotionReveal>
            </div>
          </section>

          <section id="servicos" className="bg-[#4c1d32] px-5 py-18 text-white lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-black uppercase tracking-[.28em] text-[#efb7c9]">O que você pode agendar</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-black sm:text-5xl">Um studio, diferentes formas de cuidar da sua beleza.</h2>
              <MotionStagger variant="up" step={80} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {services.map(({ title, text, icon: Icon }) => (
                  <article key={title} className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                    <Icon className="h-7 w-7 text-[#f2bfd0]" aria-hidden="true" />
                    <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">{text}</p>
                  </article>
                ))}
              </MotionStagger>
            </div>
          </section>

          <section id="novas-clientes" className="px-5 py-18 lg:px-10 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
              <PortfolioImage src="/images/catharine-lima-studio/capa-card.svg" alt="Arte editorial de primeira visita ao Catharine Lima Studio" width={1200} height={900} className="w-full rounded-[2rem] shadow-xl shadow-[#7b2f4c]/10" />
              <div className="rounded-[2rem] border border-[#ecd6de] bg-white p-7 sm:p-9">
                <p className="text-xs font-black uppercase tracking-[.24em] text-[#b26682]">Primeira visita</p>
                <h2 className="mt-3 font-display text-4xl font-black text-[#4c1d32]">O post divulgado pelo studio anuncia valores especiais para clientes novas.</h2>
                <p className="mt-5 leading-8 text-[#715462]">
                  A disponibilidade, os valores vigentes e as vagas são confirmados diretamente no atendimento. O site não inventa preço nem prazo: ele organiza seu pedido e leva as informações certas para a conversa.
                </p>
                <div className="mt-7"><CTA>Consultar condição e horário <ArrowRight className="h-4 w-4" /></CTA></div>
              </div>
            </div>
          </section>

          <section id="local" className="border-y border-[#ecd6de] bg-[#f8eef2] px-5 py-16 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-[#b26682]">Onde encontrar</p>
                <h2 className="mt-3 font-display text-4xl font-black text-[#4c1d32]">Rua Victor Alves Ferreira, 211</h2>
                <p className="mt-4 max-w-xl leading-7 text-[#715462]">Endereço divulgado no material do studio. Confirme disponibilidade e horário antes de se deslocar.</p>
              </div>
              <div className="rounded-[2rem] bg-[#4c1d32] p-7 text-white">
                <Facebook className="h-8 w-8 text-[#efb7c9]" />
                <h3 className="mt-5 font-display text-2xl font-bold">Trabalhos e novidades</h3>
                <p className="mt-3 leading-7 text-white/70">O perfil público informado é a referência social do studio. Fotos e vídeos permanecem na origem enquanto não houver mídia publicamente acessível para ingestão segura.</p>
                <a href="https://www.facebook.com/caah.lima.39" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ffd5e2] underline underline-offset-4">
                  Abrir perfil informado no Facebook <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          <section id="agendamento" className="px-5 py-20 lg:px-10">
            <div className="mx-auto max-w-5xl rounded-[2.4rem] bg-gradient-to-br from-[#7b2f4c] to-[#4c1d32] px-7 py-12 text-center text-white shadow-2xl shadow-[#4c1d32]/20 sm:px-12">
              <Sparkles className="mx-auto h-9 w-9 text-[#ffd1df]" />
              <h2 className="mt-5 font-display text-4xl font-black sm:text-5xl">Qual cuidado você quer reservar para você?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80">Responda algumas perguntas rápidas. O pedido fica organizado e segue para o WhatsApp oficial do Catharine Lima Studio.</p>
              <div className="mt-8"><CTA className="bg-white text-[#6a2843] hover:bg-[#fff5f8]">Começar agendamento <ArrowRight className="h-4 w-4" /></CTA></div>
            </div>
          </section>
        </main>

        <footer className="bg-[#351321] px-5 py-8 text-sm text-white/65 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p><strong className="text-white">Catharine Lima Studio</strong><br />Atendimento e disponibilidade confirmados no agendamento.</p>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="catharine-lima-studio"
          eyebrow="Catharine Lima Studio"
          title="Primeira vez no studio?"
          description="Escolha o procedimento e consulte as condições e horários disponíveis."
          ctaLabel="Agendar horário"
          ctaHref="#agendamento"
          delayMs={8500}
          className="border-[#a54e6e]/35 bg-[#4c1d32]/95 text-white"
          accentClassName="text-[#efb7c9]"
        />
      </div>
    </MotionScope>
  );
}
