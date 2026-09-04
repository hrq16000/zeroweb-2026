import {
  ArrowRight,
  Check,
  Clock3,
  Hammer,
  Home,
  MapPin,
  PaintRoller,
  Ruler,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  proposalKind: "service" as const,
  services: [
    "Instalação de drywall",
    "Pinturas",
    "Reformas em geral",
    "Móveis e madeira",
    "Corte de grama",
    "Pequenos fretes",
  ],
  experienceOptions: [
    "Minha casa",
    "Meu comércio",
    "Preciso de um reparo",
    "Ainda estou avaliando",
  ],
  periodOptions: [
    "Quero combinar uma visita",
    "Tenho fotos e medidas",
    "Vou confirmar o endereço",
    "Ainda preciso de orientação",
  ],
  timingOptions: ["O quanto antes", "Nos próximos dias", "Ainda neste mês", "Estou planejando"],
  stepTitles: {
    service: "Qual serviço você precisa?",
    experience: "Onde será o trabalho?",
    period: "Como podemos entender a demanda?",
    timing: "Quando você pretende começar?",
    note: "Conte os detalhes",
  },
  notePlaceholder:
    "Ex.: ambiente, medidas aproximadas, acabamento desejado ou itens para transportar.",
};

function CTA({ children, location }: { children: React.ReactNode; location: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="fernanda-amaral-drywall"
      studioName="Fernanda & Amaral Serviços"
      recipientName="Fernanda e Amaral"
      theme="navy"
      mode="proposal"
      quizConfig={quiz}
      ariaLabel="Falar com Fernanda e Amaral"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-black text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-4 focus-visible:ring-ring/40"
      onOpen={() => {
        void location;
      }}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const services = [
  [
    Hammer,
    "Instalação de drywall",
    "Estruturas e fechamentos em drywall para renovar ambientes com um acabamento organizado.",
  ],
  [
    PaintRoller,
    "Pinturas",
    "Pintura para atualizar paredes, cômodos e áreas que precisam de uma nova aparência.",
  ],
  [
    Wrench,
    "Reformas em geral",
    "Pequenos reparos e melhorias para deixar a casa mais funcional e bem cuidada.",
  ],
  [Home, "Móveis e madeira", "Montagem, reparos e instalações em móveis e elementos de madeira."],
  [
    ShieldCheck,
    "Corte de grama",
    "Cuidado prático para manter o jardim em dia e o espaço mais agradável.",
  ],
  [
    Truck,
    "Pequenos fretes",
    "Transporte de itens com cuidado, conforme a necessidade combinada no atendimento.",
  ],
] as const;

export function FernandaAmaralDrywallPage() {
  return (
    <main className="portfolio-theme-fernanda min-h-dvh overflow-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-border/60 bg-secondary/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5">
          <a
            href="#inicio"
            className="flex min-h-11 items-center gap-3 rounded-md font-display font-black tracking-tight focus-visible:ring-4 focus-visible:ring-ring/40"
            aria-label="Fernanda e Amaral — início"
          >
            <PortfolioImage managedField="logoUrl"
              src="/images/fernanda-amaral-drywall/logo.webp"
              alt="Fernanda e Amaral — Instalação de Drywall"
              width={1262}
              height={1262}
             
             
              decoding="async"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="leading-none">
              FERNANDA <span className="text-primary">&amp; AMARAL</span>
              <small className="mt-1 block font-sans text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">
                Serviços para sua casa
              </small>
            </span>
          </a>
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 text-sm font-bold md:flex"
          >
            <a href="#servicos" className="hover:text-primary">
              Serviços
            </a>
            <a href="#processo" className="hover:text-primary">
              Como funciona
            </a>
            <a href="#galeria" className="hover:text-primary">
              Trabalhos
            </a>
          </nav>
          <CTA location="fernanda_header">
            Pedir orçamento <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTA>
        </div>
      </header>

      <section
        id="inicio"
        className="relative min-h-[760px] bg-secondary pt-28 text-secondary-foreground"
      >
        <PortfolioImage
          src="/images/fernanda-amaral-drywall/servicos.webp"
          alt="Profissional executando instalação de drywall"
          priority
          width={1086}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
            managedField="heroImageUrl"
          />
        <div className="absolute inset-0 bg-secondary/90" />
        <div className="relative mx-auto flex min-h-[632px] max-w-7xl items-center px-5 py-16">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-primary">
              <MapPin className="h-4 w-4" /> Atendimento na região · PR
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-[.92] tracking-[-.045em] sm:text-7xl lg:text-[5.6rem]">
              Sua casa muda.
              <br />
              <span className="text-primary">O acabamento fica.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Instalação de drywall, pinturas, reformas e serviços práticos para transformar o que
              você precisa, com conversa clara desde o primeiro contato.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CTA location="fernanda_hero">
                Solicitar orçamento <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTA>
              <a
                href="#servicos"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-secondary/70 px-6 py-3 font-bold hover:border-primary hover:text-primary"
              >
                Explorar serviços
              </a>
            </div>
            <ul
              className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold"
              aria-label="Diferenciais"
            >
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Atendimento combinado
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Soluções para casa
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> Qualidade no acabamento
              </li>
            </ul>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-2 w-full bg-primary" />
      </section>

      <section id="servicos" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-primary">
                Fernanda &amp; Amaral Serviços
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
                Um time para resolver.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Do drywall ao pequeno frete, você encontra um caminho simples para explicar a
              necessidade e combinar o próximo passo.
            </p>
          </div>
          <div className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([Icon, title, text]) => (
              <article
                key={title}
                className="group min-h-56 border-b border-border p-7 transition hover:bg-muted md:p-9"
              >
                <Icon className="h-8 w-8 text-primary transition group-hover:scale-110" />
                <h3 className="mt-8 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="bg-muted px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="relative">
            <PortfolioImage
              src="/images/fernanda-amaral-drywall/servicos.webp"
              alt="Panfleto com serviços de Fernanda e Amaral"
              width={1086}
              height={1280}
              className="mx-auto w-full max-w-xl rounded-2xl object-cover shadow-soft"
            />
            <span className="absolute bottom-5 left-5 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground">
              Material apresentado pela equipe
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-primary">
              Soluções sob medida
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[.95] sm:text-6xl">
              Do reparo ao projeto.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A necessidade pode ser uma parede nova, uma pintura, um móvel para montar ou um
              transporte pontual. O atendimento começa entendendo o que o seu espaço precisa.
            </p>
            <ul className="mt-8 grid gap-4 text-sm font-bold sm:grid-cols-2">
              {[
                "Drywall e acabamentos",
                "Pintura e renovação",
                "Móveis e madeira",
                "Serviços para o jardim",
                "Pequenos fretes",
                "Orçamento por demanda",
              ].map((item) => (
                <li
                  key={item}
                  className="flex min-h-12 items-center gap-3 border-l-2 border-primary pl-4"
                >
                  <Check className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="processo" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[.22em] text-primary">
            Como funciona
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black uppercase sm:text-6xl">
            Uma conversa que organiza o serviço.
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Conte", "Explique o que precisa, envie fotos ou medidas se tiver."],
              ["02", "Combine", "A equipe entende o local e alinha a melhor forma de atendimento."],
              [
                "03",
                "Execute",
                "O serviço é agendado conforme disponibilidade e escopo combinado.",
              ],
            ].map(([n, title, text]) => (
              <li key={n} className="rounded-2xl border border-border bg-card p-7">
                <span className="font-display text-5xl font-black text-border">{n}</span>
                <Clock3 className="mt-8 h-7 w-7 text-primary" />
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-primary px-5 py-20 text-primary-foreground md:py-24">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em]">Fernanda &amp; Amaral</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[.95] sm:text-6xl">
              Seu próximo reparo começa com uma boa conversa.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 opacity-85">
              Conte o serviço e a região. O orçamento e a disponibilidade são confirmados no
              atendimento.
            </p>
          </div>
          <CTA location="fernanda_cta_final">
            Falar com Fernanda e Amaral <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTA>
        </div>
      </section>

      <footer className="bg-secondary px-5 py-10 text-secondary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm sm:flex-row sm:items-end">
          <div>
            <strong className="font-display text-xl">
              FERNANDA <span className="text-primary">&amp; AMARAL</span>
            </strong>
            <p className="mt-2 text-muted-foreground">
              Instalação de drywall · Pinturas · Serviços
            </p>
            <p className="mt-1 flex items-center gap-2 text-muted-foreground">
              <Ruler className="h-4 w-4" /> Atendimento na região — confirme o endereço
            </p>
          </div>
          <PortfolioHostCredit
            className="text-muted-foreground"
            linkClassName="font-bold text-primary underline underline-offset-4 hover:text-accent"
          />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="fernanda-amaral-drywall"
        eyebrow="Fernanda & Amaral Serviços"
        title="Sua casa muda. O acabamento fica."
        description="Instalação de drywall, pinturas, reformas e serviços práticos para sua casa."
        ctaLabel="Pedir orçamento"
        ctaHref="#servicos"
        delayMs={9000}
      />
      <PortfolioUpsellPopup pageName="portfolio-fernanda-amaral-drywall" />
    </main>
  );
}
