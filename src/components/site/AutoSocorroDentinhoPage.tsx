import {
  ArrowRight,
  CarFront,
  Check,
  CircleGauge,
  MapPin,
  MessageCircle,
  Package,
  Search,
  Timer,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const clientKey = "auto-socorro-dentinho";
const funnel = "funnel-auto-socorro-dentinho";
// Funnel contract: clientKey="auto-socorro-dentinho" is passed by DentinhoCTA.

const services = [
  [
    "01",
    Wrench,
    "Mecânica",
    "Revisão, motor, freios, suspensão e manutenção conforme o diagnóstico.",
  ],
  [
    "02",
    CircleGauge,
    "Elétrica automotiva",
    "Leitura de sinais, bateria, alternador, ignição e sistema elétrico.",
  ],
  [
    "03",
    CarFront,
    "Socorro e reboque",
    "Quando o veículo para, o atendimento começa pelo que está acontecendo.",
  ],
  [
    "04",
    Package,
    "Peças e acessórios",
    "Orientação para escolher itens e reposições de acordo com a necessidade.",
  ],
  [
    "05",
    Search,
    "Diagnóstico técnico",
    "Uma análise inicial para transformar sintomas em um próximo passo claro.",
  ],
  [
    "06",
    Timer,
    "Atendimento",
    "Explique a situação no canal oficial para organizar o encaminhamento.",
  ],
] as const;

const faqs = [
  [
    "Quais serviços a Auto Socorro Dentinho realiza?",
    "Manutenção mecânica, elétrica automotiva, diagnóstico, peças e atendimento de socorro conforme a necessidade do veículo.",
  ],
  [
    "Atende Quatro Barras e região?",
    "O atendimento é voltado a Quatro Barras e à Região Metropolitana. A disponibilidade é confirmada no contato.",
  ],
  [
    "Como começo o atendimento?",
    "Use o botão e descreva o que aconteceu. O funil organiza as informações antes de encaminhar a conversa.",
  ],
];

function DentinhoCTA({
  location,
  children,
  inverted = false,
}: {
  location: string;
  children: ReactNode;
  inverted?: boolean;
}) {
  return (
    <FunnelCTAButton
      clientKey={clientKey}
      companySlug="auto-socorro-dentinho"
      formSlug={funnel}
      location={location}
      className={
        inverted
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-black text-[#13233a] shadow-lg shadow-[#07101d]/25 transition-transform hover:-translate-y-0.5"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ff6518] px-6 py-3 font-black text-white shadow-lg shadow-[#ff6518]/25 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      }
    >
      {children} <ArrowRight className="h-4 w-4" />
    </FunnelCTAButton>
  );
}

export function AutoSocorroDentinhoPage() {
  return (
    <div
      data-client-slug="auto-socorro-dentinho"
      className="min-h-dvh overflow-hidden bg-[#f3f0ea] font-sans text-[#13233a]"
    >
      <MotionScope intensity="EXPRESSIVE">
        <header className="relative z-20 border-b border-[#13233a]/10 bg-[#f7f4ee] px-5 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
            <a href="#inicio" aria-label="Auto Socorro Dentinho, início">
              <PortfolioImage
                priority
                managedField="logoUrl"
                src="/images/auto-socorro-dentinho/logo.svg"
                alt="Auto Socorro Dentinho"
                width={280}
                height={70}
                className="h-12 w-auto"
              />
            </a>
            <nav
              className="hidden items-center gap-7 text-sm font-black text-[#13233a] md:flex"
              aria-label="Navegação principal"
            >
              <a href="#servicos" className="hover:text-[#ff6518]">
                Serviços
              </a>
              <a href="#diagnostico" className="hover:text-[#ff6518]">
                Diagnóstico
              </a>
              <a href="#como-funciona" className="hover:text-[#ff6518]">
                Como funciona
              </a>
            </nav>
            <DentinhoCTA location="dentinho_header">
              <MessageCircle className="h-4 w-4" /> Pedir atendimento
            </DentinhoCTA>
          </div>
        </header>

        <main id="inicio">
          <section className="relative isolate min-h-[680px] overflow-hidden bg-[#091525] text-white">
            <PortfolioImage
              priority
              managedField="heroImageUrl"
              src="/images/auto-socorro-dentinho/hero-v2.png"
              alt="Arte conceitual de diagnóstico automotivo para Auto Socorro Dentinho"
              width={1536}
              height={864}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,21,37,.98)_0%,rgba(9,21,37,.91)_36%,rgba(9,21,37,.35)_66%,rgba(9,21,37,.06)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#091525] to-transparent" />
            <div className="relative mx-auto flex max-w-7xl px-5 py-20 sm:py-28 lg:py-32">
              <div className="max-w-2xl">
                <p className="inline-flex border-l-2 border-[#ff6518] pl-3 text-xs font-black uppercase tracking-[.24em] text-[#ffb18c]">
                  Quatro Barras · Paraná
                </p>
                <MotionReveal variant="up">
                  <h1 className="mt-6 text-5xl font-black leading-[.9] tracking-[-.06em] sm:text-7xl lg:text-[clamp(4rem,7vw,7rem)]">
                    Seu carro parou.
                    <br />
                    <span className="text-[#ff6518]">A solução continua.</span>
                  </h1>
                </MotionReveal>
                <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200">
                  Auto mecânica, diagnóstico e socorro automotivo para transformar uma parada
                  inesperada em um próximo passo organizado.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <DentinhoCTA location="dentinho_hero">Descrever o problema</DentinhoCTA>
                  <a
                    href="#servicos"
                    className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:border-white"
                  >
                    Ver serviços
                  </a>
                </div>
                <p className="mt-11 max-w-md border-t border-white/20 pt-4 text-xs leading-5 text-slate-300">
                  Imagem conceitual de presença digital. Não representa fotos, equipe ou oficina
                  documentais.
                </p>
              </div>
            </div>
          </section>

          <section id="servicos" className="bg-[#f3f0ea] px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.22em] text-[#e8500a]">
                    Ordem de serviço / 01
                  </p>
                  <h2 className="mt-4 text-4xl font-black leading-[.94] tracking-[-.05em] sm:text-6xl">
                    Problema não é sentença.
                    <br />É ponto de partida.
                  </h2>
                </div>
                <p className="max-w-xl justify-self-end text-lg leading-8 text-[#56606c]">
                  Você não precisa saber o nome da peça. Conte o sintoma, a situação e a urgência. A
                  equipe organiza a conversa a partir daí.
                </p>
              </div>
              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {services.map(([code, Icon, title, text]) => (
                  <article
                    key={code}
                    className="group relative overflow-hidden border border-[#13233a]/10 bg-white p-7 shadow-[0_14px_0_#dedbd4] transition-transform hover:-translate-y-1"
                  >
                    <span className="font-mono text-sm font-black text-[#ff6518]">{code}</span>
                    <Icon className="absolute right-7 top-7 h-8 w-8 text-[#13233a] transition-colors group-hover:text-[#ff6518]" />
                    <h3 className="mt-12 text-2xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#64707b]">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="diagnostico" className="bg-[#13233a] px-5 py-20 text-white sm:py-28">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
              <MotionReveal variant="scale">
                <figure className="overflow-hidden rounded-[2rem] border border-white/15 bg-[#091525] shadow-2xl shadow-black/30">
                  <PortfolioImage
                    src="/images/auto-socorro-dentinho/diagnostic-v2.png"
                    alt="Arte conceitual de instrumentos para diagnóstico automotivo"
                    width={1536}
                    height={864}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="border-t border-white/10 px-5 py-3 text-xs text-slate-300">
                    Painel visual conceitual · diagnóstico automotivo
                  </figcaption>
                </figure>
              </MotionReveal>
              <div>
                <p className="text-xs font-black uppercase tracking-[.22em] text-[#ffb18c]">
                  Diagnóstico / 02
                </p>
                <h2 className="mt-4 text-4xl font-black leading-[.94] tracking-[-.05em] sm:text-6xl">
                  Menos adivinhação.
                  <br />
                  <span className="text-[#ff6518]">Mais direção.</span>
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                  O atendimento começa traduzindo o que o veículo está mostrando: não liga, acendeu
                  uma luz, perdeu força ou precisa de revisão.
                </p>
                <ul className="mt-8 space-y-4 border-y border-white/15 py-5 text-sm font-bold">
                  {[
                    "Sintoma e contexto primeiro",
                    "Diagnóstico e encaminhamento depois",
                    "Orçamento e disponibilidade confirmados no canal oficial",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6518]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="como-funciona" className="bg-[#e9e4da] px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-black uppercase tracking-[.22em] text-[#e8500a]">
                Rota de atendimento / 03
              </p>
              <div className="mt-4 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
                <h2 className="text-4xl font-black leading-[.94] tracking-[-.05em] sm:text-6xl">
                  Do sintoma
                  <br />
                  ao próximo passo.
                </h2>
                <ol className="divide-y divide-[#13233a]/15 border-y border-[#13233a]/15">
                  {[
                    [
                      "01",
                      "Conte o que aconteceu",
                      "Carro não liga, luz no painel, falha, revisão ou necessidade de socorro.",
                    ],
                    [
                      "02",
                      "Organize a triagem",
                      "As primeiras respostas ajudam a direcionar a necessidade de atendimento.",
                    ],
                    [
                      "03",
                      "Combine o atendimento",
                      "A disponibilidade, orçamento e encaminhamento são confirmados com a equipe.",
                    ],
                  ].map(([number, title, text]) => (
                    <li key={number} className="grid gap-4 py-7 sm:grid-cols-[80px_1fr]">
                      <span className="font-mono text-lg font-black text-[#ff6518]">{number}</span>
                      <div>
                        <h3 className="text-xl font-black">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#58636e]">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="bg-[#ff6518] px-5 py-14 text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-white/75">
                  Quando precisa resolver
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Descreva o problema. A conversa começa aqui.
                </h2>
              </div>
              <DentinhoCTA location="dentinho_mid" inverted>
                Solicitar atendimento
              </DentinhoCTA>
            </div>
          </section>

          <section id="faq" className="bg-[#f7f4ee] px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-4xl">
              <p className="text-center text-xs font-black uppercase tracking-[.22em] text-[#e8500a]">
                Dúvidas / 04
              </p>
              <h2 className="mt-4 text-center text-4xl font-black tracking-[-.05em] sm:text-5xl">
                Antes de chamar, pode perguntar.
              </h2>
              <div className="mt-12 space-y-3">
                {faqs.map(([question, answer]) => (
                  <details key={question} className="group border-b border-[#13233a]/15 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black">
                      <span>{question}</span>
                      <span className="text-2xl font-normal text-[#ff6518] group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pt-4 text-sm leading-7 text-[#58636e]">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>
      </MotionScope>
      <footer className="bg-[#091525] px-5 py-12 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <PortfolioImage
              src="/images/auto-socorro-dentinho/logo-inverse.svg"
              alt="Auto Socorro Dentinho"
              width={280}
              height={70}
              className="h-10 w-auto"
              loading="lazy"
            />
            <p className="mt-3 text-sm">Auto mecânica e socorro automotivo · Quatro Barras — PR</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-200">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              Rua Vicente Vidolin, 800 · Palmitazinho · Quatro Barras — PR
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:items-end">
            <DentinhoCTA location="dentinho_footer">Iniciar atendimento</DentinhoCTA>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </div>
      </footer>
      <PortfolioUpsellPopup pageName="portfolio-auto-socorro-dentinho" />
    </div>
  );
}
