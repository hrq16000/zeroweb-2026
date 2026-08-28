import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Hammer,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
  ExternalLink,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

import { MARIDO_ALUGUEL_FAQ } from "@/components/site/marido-de-aluguel-faq";
import caseMestre from "@/assets/case-mestredosservicos.webp";

export { MARIDO_ALUGUEL_FAQ };


const services = [
  ["Instalações", "Prateleiras, suportes, varais, cortinas, luminárias e acessórios."],
  ["Reparos hidráulicos", "Torneiras, sifões, registros, vazamentos simples e ajustes."],
  ["Montagem e ajustes", "Móveis, portas, gavetas, dobradiças e pequenos consertos."],
  ["Pintura e acabamento", "Retoques, paredes pequenas, vedação e acabamento cuidadoso."],
  ["Manutenção preventiva", "Checklist de pequenos problemas antes que virem prejuízo."],
  ["Adequações para imóveis", "Preparação para mudança, locação, venda ou vistoria."],
];

const mestreQuiz = {
  services: [
    "Instalação",
    "Reparo hidráulico",
    "Montagem de móvel",
    "Pintura e acabamento",
    "Vários reparos na mesma visita",
  ],
  experienceOptions: [
    "Casa",
    "Apartamento",
    "Escritório ou comércio",
    "Imóvel para mudança ou locação",
  ],
  periodOptions: [
    "Curitiba",
    "São José dos Pinhais",
    "Pinhais / Colombo",
    "Outra cidade da região",
  ],
  timingOptions: ["Urgente", "Ainda nesta semana", "Na próxima semana", "Estou planejando"],
  stepTitles: {
    service: "Qual reparo você precisa?",
    experience: "Onde será o serviço?",
    period: "Em qual região fica o imóvel?",
    timing: "Quando você precisa resolver?",
    note: "Descreva os reparos",
  },
  notePlaceholder:
    "Ex.: instalar duas prateleiras e ajustar uma torneira. Apartamento com elevador.",
};

function MestreCTA({ children, className }: { children: ReactNode; className: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="marido-de-aluguel"
      studioName="Mestre dos Serviços"
      recipientName="Mestre dos Serviços"
      theme="navy"
      mode="proposal"
      quizConfig={mestreQuiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function MaridoDeAluguelPage() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <div className="portfolio-theme-prototype min-h-screen bg-[#f7f8fa] text-slate-950">
      <header className="border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173b67] text-white">
              <Wrench className="h-4 w-4" />
            </span>
            Mestre dos Serviços
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#servicos">Serviços</a>
            <a href="#processo">Como funciona</a>
            <a href="#faq">Dúvidas</a>
          </nav>
          <MestreCTA className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#173b67] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#102d50]">
            Pedir orçamento
          </MestreCTA>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-6xl px-5 pt-6 lg:px-8">
          <a
            href="https://www.mestredosservicos.com.br/"
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-[#102d50] shadow-sm"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#f6c45355,transparent_36%)]" />
            <div className="relative flex min-h-36 items-center gap-5 p-5 sm:p-7">
              <img
                src="/images/mestre-dos-servicos-logo.jpg"
                alt="Mestre dos Serviços"
                className="h-24 w-24 rounded-2xl object-cover shadow-lg ring-2 ring-amber-300/60 transition duration-500 group-hover:rotate-2 group-hover:scale-105"
                loading="eager"
 decoding="async" fetchPriority="high" width={1024} height={1024} />
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">
                  Mestre dos Serviços
                </p>
                <p className="mt-2 text-xl font-bold sm:text-2xl">
                  Reparos rápidos. Profissionais verificados.
                </p>
                <p className="mt-1 text-sm text-blue-100">
                  A capa oficial da marca agora aparece também nesta experiência publicada.
                </p>
              </div>
              <ExternalLink className="ml-auto h-5 w-5 shrink-0 text-amber-300" />
            </div>
          </a>
        </div>
        <section id="inicio" className="bg-[#173b67] px-5 py-20 text-white sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-amber-300">
                Reparos residenciais com confiança
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.03] sm:text-6xl">
                Mestre dos Serviços para resolver o que sua casa precisa.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                Instalações, montagens, manutenção e pequenos reparos para casas, apartamentos,
                escritórios e imóveis de aluguel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MestreCTA className="inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-300 px-6 py-3.5 font-bold text-slate-950 hover:bg-amber-200">
                  Pedir orçamento seguro
                </MestreCTA>
                <a
                  href="#servicos"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-semibold text-white hover:bg-white/10"
                >
                  Ver serviços <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-blue-100">
                <span>
                  <ShieldCheck className="mr-2 inline h-4 w-4 text-amber-300" />
                  Profissionais avaliados
                </span>
                <span>
                  <Clock3 className="mr-2 inline h-4 w-4 text-amber-300" />
                  Resposta rápida
                </span>
                <span>
                  <MapPin className="mr-2 inline h-4 w-4 text-amber-300" />
                  Atendimento local
                </span>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 text-slate-950">
                  <Hammer className="h-6 w-6 text-[#173b67]" />
                  <p className="mt-8 text-2xl font-bold">1 visita</p>
                  <p className="mt-1 text-sm text-slate-500">para organizar vários reparos</p>
                </div>
                <div className="rounded-2xl bg-amber-300 p-5 text-slate-950">
                  <Star className="h-6 w-6" />
                  <p className="mt-8 text-2xl font-bold">Cuidado</p>
                  <p className="mt-1 text-sm text-slate-700">com o imóvel e o acabamento</p>
                </div>
                <div className="rounded-2xl bg-slate-950/40 p-5 sm:col-span-2">
                  <p className="text-sm leading-6 text-blue-100">
                    Descreva o problema, envie fotos se quiser e receba um próximo passo claro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="servicos" className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#173b67]">
              O que fazemos
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold">
              Pequenos reparos que devolvem tempo e tranquilidade.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(([title, text], index) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="text-sm font-bold text-[#173b67]">0{index + 1}</span>
                  <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="presenca" className="bg-[#102d50] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-amber-300">Presença oficial</p>
              <h2 className="mt-3 font-display text-4xl font-semibold">Dicas, bastidores e soluções no Instagram.</h2>
              <p className="mt-5 max-w-xl leading-7 text-blue-100">Acompanhe os conteúdos do Mestre dos Serviços e veja ideias práticas para cuidar da sua casa, preparar um imóvel e evitar pequenos problemas.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="https://www.instagram.com/mestresdosservicos" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 hover:bg-amber-200">Ver Instagram</a>
                <a href="https://www.facebook.com/mestresdosservicos" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10">Facebook</a>
              </div>
            </div>
            <motion.a href="https://www.instagram.com/mestresdosservicos" target="_blank" rel="noreferrer" whileHover={{ y: -6 }} className="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl">
              <img src={caseMestre} alt="Mestre dos Serviços em destaque" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
              <div className="p-5"><p className="font-semibold">@mestresdosservicos</p><p className="mt-1 text-sm text-blue-100">Conteúdos recentes e inspiração para seus próximos reparos.</p></div>
            </motion.a>
          </div>
        </section>
        <section id="processo" className="bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#173b67]">
              Como funciona
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Do pedido à solução, sem adivinhação.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                [
                  "01",
                  "Você explica",
                  "Conte o que precisa, onde é e quando gostaria de resolver.",
                ],
                [
                  "02",
                  "A gente organiza",
                  "Validamos escopo, materiais, região e o melhor profissional.",
                ],
                ["03", "Você aprova", "Com prazo e condições claros, o reparo é agendado."],
              ].map(([n, t, d]) => (
                <div key={n} className="rounded-2xl border border-slate-200 p-6">
                  <span className="text-3xl font-black text-amber-500">{n}</span>
                  <h3 className="mt-8 text-xl font-semibold">{t}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-[#173b67]">
                Preços e orçamento
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold">
                Cada reparo tem um contexto. O orçamento também.
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                O valor depende do tipo de serviço, quantidade de itens, materiais, urgência e
                localização. Por isso, o orçamento é organizado com as informações do seu imóvel —
                sem promessa genérica.
              </p>
            </div>
            <div className="rounded-3xl bg-[#173b67] p-8 text-white">
              <CheckCircle2 className="h-7 w-7 text-amber-300" />
              <h3 className="mt-5 text-2xl font-semibold">Receba uma estimativa clara</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100">
                Envie seu pedido pelo funil e receba orientação para comparar escopo, prazo e
                condições antes de contratar.
              </p>
              <MestreCTA className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950 hover:bg-amber-200">
                Solicitar orçamento
              </MestreCTA>
            </div>
          </div>
        </section>
        <section id="faq" className="bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#173b67]">
              Perguntas frequentes
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Antes de chamar um profissional, tire suas dúvidas.
            </h2>
            <div className="mt-8 space-y-3">
              {MARIDO_ALUGUEL_FAQ.map((faq, index) => (
                <div key={faq.q} className="rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    {faq.q}
                    <span className="text-2xl text-[#173b67]">{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index && (
                    <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Star className="h-5 w-5 text-amber-500" />
                Avaliações e experiências são conectadas ao sistema de reviews.
              </div>
              <MestreCTA className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#173b67] px-5 py-3 text-sm font-semibold text-white">
                Falar sobre meu reparo
              </MestreCTA>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-slate-950 px-5 py-10 text-sm text-slate-400 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-white">Mestre dos Serviços</strong> · Marido de aluguel em Curitiba e região
          </p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="marido-de-aluguel"
        eyebrow="Experiências reais"
        title="Veja como organizamos serviços e contatos para negócios locais."
        description="O catálogo conecta avaliações, contexto e próximo passo sem expor dados de contato no código público."
        ctaLabel="Conhecer a estrutura"
        ctaHref="#processo"
        delayMs={9000}
      />
      <PortfolioUpsellPopup pageName="portfolio-marido-de-aluguel" />
    </div>
  );
}
