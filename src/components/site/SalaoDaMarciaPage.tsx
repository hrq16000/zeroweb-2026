import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Heart } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = { services: ["Depilação com cera", "Progressiva", "Corte e hidratação", "Pé e mão", "Mechas e tratamento", "Combo de serviços"], experienceOptions: ["Quero conhecer o salão", "Tenho um horário em mente", "Preciso de uma indicação", "Quero combinar serviços"], periodOptions: ["Cidade Jardim · São José dos Pinhais", "São José dos Pinhais", "Vou confirmar o endereço"], timingOptions: ["Quero agendar em breve", "Estou planejando", "Quero consultar horários"], proposalKind: "service" as const, stepTitles: { service: "Qual cuidado você procura?", experience: "Como podemos ajudar?", period: "Onde será o atendimento?", timing: "Quando prefere?", note: "Conte o que você deseja" }, notePlaceholder: "Ex.: comprimento do cabelo, região da depilação e preferência de horário." };

function CTA({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioCTAQuiz
      clientKey="salao-da-marcia"
      studioName="Salão da Marcia"
      recipientName="Marcia"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c20d67] px-7 py-3.5 font-bold text-white transition hover:bg-[#8f0a4c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c20d67] focus-visible:ring-offset-2"
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

// Caderno editorial: cada cuidado é uma coluna de texto corrida, não um card.
const columns: Array<[string, string]> = [
  ["Depilação com cera", "Buço, axila, meia perna, perna inteira, braços e virilha com cuidado."],
  ["Cabelos com movimento", "Progressiva, corte, hidratação, mechas e tratamentos personalizados."],
  ["Pé e mão", "Um momento de autocuidado para renovar seu visual e sua energia."],
  ["Combos especiais", "Combine serviços e monte uma experiência do seu jeito."],
];

export function SalaoDaMarciaPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf7] text-[#3d0c2a]">
      {/* Cabeçalho de revista: marca centralizada, navegação em linha fina. */}
      <header className="sticky top-0 z-30 border-b-2 border-[#3d0c2a] bg-[#fffaf7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 py-3">
          <a href="#inicio" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <Heart className="h-5 w-5 text-[#c20d67]" />
            Salão da Marcia
          </a>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[.7rem] font-semibold uppercase tracking-[.22em] text-[#8a5a75]">
            <a href="#servicos" className="hover:text-[#c20d67]">Serviços</a>
            <a href="#experiencia" className="hover:text-[#c20d67]">Experiência</a>
            <a href="#local" className="hover:text-[#c20d67]">Localização</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16">
        {/* Capa editorial: título centralizado sobre uma linha, imagem em faixa larga abaixo. */}
        <section id="inicio" className="pt-12 text-center lg:pt-16">
          <p className="text-[.7rem] font-bold uppercase tracking-[.32em] text-[#c20d67]">
            Cidade Jardim · São José dos Pinhais
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-3xl font-display text-5xl font-bold leading-[.95] sm:text-7xl"
          >
            Seu momento de <em className="not-italic text-[#c20d67]">se cuidar.</em>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#70274f]">
            Depilação, cabelos, pé e mão e tratamentos para você sair leve, renovada e do jeitinho que gosta.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTA>Agendar meu horário <CalendarDays className="h-4 w-4" /></CTA>
            <a
              href="#servicos"
              className="inline-flex min-h-12 items-center rounded-full border-2 border-[#3d0c2a] px-7 py-3.5 font-semibold hover:bg-[#3d0c2a] hover:text-white"
            >
              Ver serviços
            </a>
          </div>
          <PortfolioImage
            src="/images/salao-da-marcia/depilacao.webp"
            alt="Depilação com cera no Salão da Marcia"
            priority
            width={1200}
            height={1600}
            className="mt-12 h-[22rem] w-full border-2 border-[#3d0c2a] object-cover object-top sm:h-[30rem]"
            managedField="heroImageUrl"
          />
        </section>

        {/* Serviços como colunas de caderno, separadas por filete. */}
        <section id="servicos" className="mt-16 border-t-2 border-[#3d0c2a] pt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              Beleza prática, resultado que faz você sorrir.
            </h2>
            <p className="text-[.7rem] font-bold uppercase tracking-[.28em] text-[#c20d67]">Menu de cuidados</p>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map(([title, text], i) => (
              <div key={title} className="border-t border-[#e3c6d6] pt-4">
                <span className="font-display text-3xl font-bold text-[#f0b7d0]">{`0${i + 1}`}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#7a4a67]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bloco de citação editorial, imagem em recorte estreito ao lado. */}
        <section id="experiencia" className="mt-16 border-t-2 border-[#3d0c2a] pt-10">
          <blockquote className="mx-auto max-w-3xl text-center font-display text-2xl font-bold leading-snug sm:text-3xl">
            “Cada serviço começa com uma conversa para entender o que você deseja.”
          </blockquote>
          <p className="mx-auto mt-5 max-w-2xl text-center leading-8 text-[#70274f]">
            O objetivo é valorizar sua beleza com cuidado e atenção aos detalhes, para você se sentir bem antes, durante
            e depois do atendimento.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <PortfolioImage
              src="/images/salao-da-marcia/progressiva.webp"
              alt="Resultado de progressiva no Salão da Marcia"
              width={1200}
              height={1600}
              className="h-64 w-full border border-[#e3c6d6] object-cover object-top sm:col-span-2"
            />
            <PortfolioImage
              src="/images/salao-da-marcia/servicos.webp"
              alt="Serviços oferecidos no Salão da Marcia"
              width={1200}
              height={1600}
              className="h-64 w-full border border-[#e3c6d6] object-cover object-top"
            />
          </div>
        </section>

        <section id="local" className="mt-16 border-y-2 border-[#3d0c2a] py-12 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Reserve seu horário e viva esse momento.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#70274f]">
            Escolha o serviço, conte sua preferência e consulte a disponibilidade em Cidade Jardim, São José dos Pinhais.
          </p>
          <div className="mt-8">
            <CTA>Consultar horários <ArrowRight className="h-4 w-4" /></CTA>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 text-sm text-[#7a4a67]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-[#3d0c2a]">Salão da Marcia</p>
            <p className="mt-1">Depilação, cabelos e autocuidado em Cidade Jardim.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-[#c20d67] underline underline-offset-4 hover:text-[#8f0a4c]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="salao-da-marcia"
        eyebrow="Salão da Marcia · Cidade Jardim"
        title="Seu momento de autocuidado começa com um horário reservado."
        description="Escolha o serviço e receba uma orientação para agendar."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
        delayMs={9000}
        className="border-[#ffb6d6]/40 bg-[#5b123d]/95 text-white"
        accentClassName="text-[#ffb6d6]"
      />
      <PortfolioUpsellPopup pageName="portfolio-salao-da-marcia" />
    </div>
  );
}
