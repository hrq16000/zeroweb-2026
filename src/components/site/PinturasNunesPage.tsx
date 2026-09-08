import { ArrowRight, BrushCleaning, House, Paintbrush, PanelsTopLeft, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioPresenceKit } from "@/components/portfolio/PortfolioPresenceKit";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const funnel = "funnel-pinturas-nunes";

const services = [
  {
    code: "P01",
    title: "Pinturas residencial e predial",
    text: "Pintura para casas e edificações conforme o escopo informado.",
    icon: House,
  },
  {
    code: "P02",
    title: "Texturas e grafiato",
    text: "Grafiato, textura e textura projetada para diferentes superfícies.",
    icon: Waves,
  },
  {
    code: "P03",
    title: "Pinturas decorativas",
    text: "Acabamentos decorativos para transformar a leitura do ambiente.",
    icon: Paintbrush,
  },
  {
    code: "P04",
    title: "Telhados, calhas e grades",
    text: "Lavagem e pinturas de telhados, calhas, grades e portões.",
    icon: BrushCleaning,
  },
] as const;

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Pintura residencial",
    "Pintura predial",
    "Grafiato ou textura",
    "Textura projetada",
    "Pintura decorativa",
    "Telhados, calhas, grades ou portões",
    "Cadeirinhas ou balancinhos",
  ],
  experienceOptions: ["Casa", "Prédio ou condomínio", "Área externa", "Outro ambiente"],
  periodOptions: [
    "Tenho fotos do local",
    "Posso explicar o serviço",
    "Preciso de orientação inicial",
  ],
  timingOptions: ["O quanto antes", "Nos próximos dias", "Ainda estou planejando"],
  stepTitles: {
    service: "Qual acabamento ou pintura você procura?",
    experience: "Em que tipo de espaço será o serviço?",
    period: "Como prefere apresentar a necessidade?",
    timing: "Em que momento pretende começar?",
  },
  notePlaceholder: "Conte a superfície, o ambiente e os detalhes que quer transformar.",
};

function NunesCTA({
  children,
  location,
  inverse = false,
}: {
  children: ReactNode;
  location: string;
  inverse?: boolean;
}) {
  return (
    <FunnelCTAButton
      clientKey="pinturas-nunes"
      companySlug="pinturas-nunes"
      formSlug={funnel}
      location={location}
      quizConfig={quizConfig}
      className={
        inverse
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#071c41] bg-[#f7f4ec] px-5 py-3 text-sm font-black text-[#071c41] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d88a00]"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#d88a00] px-5 py-3 text-sm font-black text-[#071c41] shadow-[5px_5px_0_#071c41] transition hover:-translate-y-0.5 hover:bg-[#efad27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7f4ec]"
      }
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </FunnelCTAButton>
  );
}

export function PinturasNunesPage() {
  return (
    <div
      data-client-slug="pinturas-nunes"
      className="min-h-dvh overflow-hidden bg-[#f7f4ec] font-sans text-[#071c41]"
    >
      <MotionScope intensity="BALANCED">
        <header className="border-b-4 border-[#d88a00] bg-[#f7f4ec] px-5 py-4 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="#inicio" aria-label="Pinturas Nunes, início">
              <PortfolioImage
                priority
                managedField="logoUrl"
                src="/images/pinturas-nunes/logo.svg"
                alt="Pinturas Nunes"
                width={900}
                height={300}
                className="h-12 w-auto max-w-[210px] object-contain sm:h-14 sm:max-w-[260px]"
              />
            </a>
            <nav
              aria-label="Navegação do projeto"
              className="hidden items-center gap-6 text-xs font-black uppercase tracking-[.12em] md:flex"
            >
              <a className="hover:text-[#d88a00]" href="#escopo">
                Escopo
              </a>
              <a className="hover:text-[#d88a00]" href="#processo">
                Como funciona
              </a>
              <a className="hover:text-[#d88a00]" href="#contato">
                Contato
              </a>
            </nav>
            <NunesCTA location="header">Pedir orçamento</NunesCTA>
          </div>
        </header>

        <main id="inicio">
          <section className="relative border-b border-[#071c41]/15 bg-[#071c41] px-5 py-14 text-[#f7f4ec] lg:px-8 lg:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#d88a00] [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)] sm:block"
            />
            <div className="relative mx-auto grid max-w-7xl gap-11 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
              <div>
                <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[.25em] text-[#eab33d]">
                  <span className="h-px w-10 bg-[#eab33d]" />
                  Pinturas e acabamentos
                </p>
                <MotionReveal
                  as="h1"
                  variant="mask"
                  intensity="BALANCED"
                  className="mt-6 max-w-3xl text-5xl font-black uppercase leading-[.92] tracking-[-.06em] sm:text-6xl lg:text-8xl"
                >
                  Transformando ambientes.{" "}
                  <span className="text-[#eab33d]">Realizando sonhos.</span>
                </MotionReveal>
                <p className="mt-7 max-w-xl border-l-2 border-[#d88a00] pl-5 text-base leading-7 text-[#f7f4ec]/80 sm:text-lg">
                  Pintura residencial e predial, texturas, grafiato, acabamentos decorativos e
                  cuidados para superfícies que pedem atenção.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <NunesCTA location="hero">Organizar orçamento</NunesCTA>
                  <a
                    href="#escopo"
                    className="inline-flex min-h-12 items-center justify-center rounded-sm border border-[#f7f4ec]/35 px-5 py-3 text-sm font-bold transition hover:border-[#eab33d] hover:text-[#eab33d]"
                  >
                    Ver serviços
                  </a>
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[.14em] text-[#f7f4ec]/60">
                  Responsável: Gabriel Nunes
                </p>
              </div>
              <MotionReveal
                variant="left"
                className="relative mx-auto w-full max-w-[620px] border-[10px] border-[#f7f4ec] bg-[#f7f4ec] shadow-[14px_14px_0_#071c41]"
              >
                <PortfolioImage
                  priority
                  managedField="heroImageUrl"
                  src="/images/pinturas-nunes/material-original.png"
                  alt="Material original da Pinturas Nunes com os serviços oferecidos"
                  width={1600}
                  height={950}
                  className="aspect-[16/10] w-full object-cover object-center"
                />
                <figcaption className="absolute bottom-0 left-0 bg-[#f7f4ec] px-3 py-2 text-[10px] font-black uppercase tracking-[.12em] text-[#071c41]">
                  Material original fornecido
                </figcaption>
              </MotionReveal>
            </div>
          </section>

          <section id="escopo" className="px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 border-b-2 border-[#071c41] pb-8 md:grid-cols-[.7fr_1.3fr] md:items-end">
                <p className="text-xs font-black uppercase tracking-[.22em] text-[#b66f00]">
                  01 / Escopo de trabalho
                </p>
                <h2 className="max-w-3xl text-3xl font-black uppercase leading-[.98] tracking-[-.04em] sm:text-5xl">
                  Cada superfície pede uma leitura diferente antes do acabamento.
                </h2>
              </div>
              <div className="divide-y divide-[#071c41]/15">
                {services.map(({ code, title, text, icon: Icon }, index) => (
                  <MotionReveal
                    as="article"
                    key={title}
                    variant={index % 2 ? "left" : "right"}
                    delay={index * 70}
                    className="grid gap-5 py-7 md:grid-cols-[90px_1fr_1.3fr_auto] md:items-center"
                  >
                    <span className="font-mono text-sm font-bold text-[#b66f00]">{code}</span>
                    <h3 className="text-2xl font-black tracking-[-.04em]">{title}</h3>
                    <p className="max-w-xl leading-7 text-[#071c41]/70">{text}</p>
                    <Icon aria-hidden="true" className="h-9 w-9 text-[#d88a00]" />
                  </MotionReveal>
                ))}
              </div>
              <div className="mt-10 grid gap-4 border border-[#071c41]/20 bg-white p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                <PanelsTopLeft aria-hidden="true" className="h-8 w-8 text-[#d88a00]" />
                <p className="text-sm leading-6">
                  <strong>Também executa serviços em cadeirinhas e balancinhos.</strong> Descreva o
                  contexto no atendimento para organizar a solicitação.
                </p>
                <NunesCTA inverse location="scope">
                  Descrever serviço
                </NunesCTA>
              </div>
            </div>
          </section>

          <section id="processo" className="bg-[#e9e2d2] px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.78fr_1.22fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.22em] text-[#b66f00]">
                  02 / Próximo passo
                </p>
                <h2 className="mt-5 text-4xl font-black uppercase leading-[.95] tracking-[-.05em]">
                  O orçamento começa com um espaço bem explicado.
                </h2>
              </div>
              <ol className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    "01",
                    "Selecione o serviço",
                    "Indique o acabamento, a superfície ou a pintura que você procura.",
                  ],
                  [
                    "02",
                    "Contextualize o ambiente",
                    "Conte se é casa, prédio, área externa ou outro espaço.",
                  ],
                  [
                    "03",
                    "Organize o contato",
                    "O funil encaminha os detalhes pelo canal privado da Pinturas Nunes.",
                  ],
                ].map(([number, title, text]) => (
                  <li
                    key={number}
                    className="border-t-4 border-[#d88a00] bg-[#f7f4ec] p-5 shadow-[5px_5px_0_#071c41]"
                  >
                    <p className="font-mono text-sm font-black text-[#b66f00]">{number}</p>
                    <h3 className="mt-8 text-xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#071c41]/70">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <PortfolioPresenceKit slug="pinturas-nunes" />

          <section id="contato" className="bg-[#d88a00] px-5 py-16 text-[#071c41] lg:px-8 lg:py-20">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.1fr_.9fr] md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em]">
                  Pinturas Nunes · atendimento por orçamento
                </p>
                <h2 className="mt-5 max-w-3xl text-4xl font-black uppercase leading-[.92] tracking-[-.05em] sm:text-6xl">
                  Qualidade que você vê, resultado que você sente.
                </h2>
                <p className="mt-6 max-w-xl leading-7">
                  Conte o que precisa transformar e deixe o atendimento organizar o próximo passo.
                </p>
              </div>
              <div className="md:justify-self-end">
                <NunesCTA inverse location="final">
                  Solicitar orçamento
                </NunesCTA>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#071c41] px-5 py-8 text-sm text-[#f7f4ec]/70 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p>Pinturas Nunes · acabamentos e pintura</p>
            <PortfolioHostCredit linkClassName="font-semibold text-[#f7f4ec] underline underline-offset-4 hover:text-[#eab33d]" />
          </div>
        </footer>
        <PortfolioUpsellPopup pageName="portfolio-pinturas-nunes" />
      </MotionScope>
    </div>
  );
}
