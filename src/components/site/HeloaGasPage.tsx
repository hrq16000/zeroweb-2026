import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";
import type { CSSProperties } from "react";
import { ArrowRight, Clock, Droplets, Flame, MapPin, ShieldCheck, Truck } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Botijão de gás 13kg",
    "Troca de botijão",
    "Água mineral 20L (galão)",
    "Gás + água no mesmo pedido",
    "Pedido para comércio",
    "Outro pedido",
  ],
  experienceOptions: ["Casa", "Apartamento", "Condomínio (portaria)", "Comércio", "Outro local"],
  periodOptions: ["Já tenho o vasilhame", "Preciso do vasilhame", "Não sei informar"],
  timingOptions: ["Agora", "Ainda hoje", "Amanhã", "Estou só consultando"],
  stepTitles: {
    service: "O que você precisa hoje?",
    experience: "Para qual tipo de endereço?",
    period: "Você já tem o vasilhame?",
    timing: "Para quando é a entrega?",
  },
  notePlaceholder: "Informe bairro, ponto de referência e quantidade desejada.",
};

const catalogo = [
  {
    icon: Flame,
    title: "Botijão de gás 13kg",
    text: "Troca de botijão para o dia a dia da cozinha, com entrega no seu endereço.",
  },
  {
    icon: Droplets,
    title: "Água mineral 20L",
    text: "Galão de água mineral entregue junto com o gás, sem precisar sair de casa.",
  },
  {
    icon: Truck,
    title: "Entrega em Piraquara e região",
    text: "Atendimento em Vila Vicente Macedo e bairros vizinhos, direto na sua porta.",
  },
  {
    icon: ShieldCheck,
    title: "Produto lacrado e conferido",
    text: "Botijões e galões entregues lacrados e conferidos na hora da entrega.",
  },
];

const theme = {
  "--background": "oklch(0.985 0.008 150)",
  "--foreground": "oklch(0.24 0.05 165)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.24 0.05 165)",
  "--muted": "oklch(0.94 0.015 155)",
  "--muted-foreground": "oklch(0.48 0.03 165)",
  "--primary": "oklch(0.7 0.19 44)",
  "--primary-foreground": "oklch(1 0 0)",
  "--border": "oklch(0.89 0.015 155)",
  "--ring": "oklch(0.7 0.19 44)",
} as CSSProperties;


export function HeloaGasPage() {
  const logo = useManagedValue("logoUrl", "/images/heloa-gas/logo.png");
  const hero = useManagedValue("heroImageUrl", "/images/heloa-gas/hero.jpg");
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-background text-foreground" style={theme}>
      <header className="border-b border-border bg-card/95 px-5 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Heloá Gás — início">
            <PortfolioImage
              src={logo}
              alt="Heloá Gás"
              width={1152}
              height={576}
              className="h-12 w-auto object-contain"
            />
          </a>
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-6 text-sm font-semibold md:flex"
          >
            <a href="#produtos" className="hover:text-primary">
              Produtos
            </a>
            <a href="#entrega" className="hover:text-primary">
              Entrega
            </a>
            <a href="#atendimento" className="hover:text-primary">
              Atendimento
            </a>
          </nav>
          <PortfolioCTAQuiz
            clientKey="heloa-gas"
            studioName="Heloá Gás"
            recipientName="Heloá Gás"
            theme="navy"
            mode="proposal"
            quizConfig={quizConfig}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            Fazer pedido
          </PortfolioCTAQuiz>
        </div>
      </header>

      <main id="inicio">
        <section className="overflow-hidden bg-foreground px-5 py-16 text-background md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                Gás e água em Piraquara — PR
              </p>
              <MotionReveal as="h1" variant="up" intensity="EXPRESSIVE" className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            <ManagedText field="heroHeadline" fallback={"Seu g\u00e1s acabou? Pe\u00e7a e receba em casa."} />
          </MotionReveal>
              <p className="mt-6 max-w-xl text-base leading-7 text-background/75">
            <ManagedText field="heroSubheadline" fallback={"Botij\u00e3o de g\u00e1s 13kg e \u00e1gua mineral de 20 litros entregues em Vila Vicente Macedo e regi\u00e3o. Fa\u00e7a o pedido em poucos toques e combine a entrega com a equipe."} />
          </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PortfolioCTAQuiz
                  clientKey="heloa-gas"
                  studioName="Heloá Gás"
                  recipientName="Heloá Gás"
                  theme="navy"
                  mode="proposal"
                  quizConfig={quizConfig}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground hover:opacity-90"
                >
                  Pedir gás ou água <ArrowRight className="h-4 w-4" />
                </PortfolioCTAQuiz>
                <a
                  href="#produtos"
                  className="inline-flex min-h-12 items-center rounded-full border border-background/30 px-6 font-semibold text-background hover:border-primary hover:text-primary"
                >
                  Ver produtos
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-background/75">
                <span className="inline-flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" /> Gás de cozinha
                </span>
                <span className="inline-flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" /> Água mineral 20L
                </span>
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Entrega no endereço
                </span>
              </div>
            </div>
            <PortfolioImage
              src={hero}
              alt="Botijão de gás 13kg e galão de água mineral entregues na porta de casa"
              priority
              width={1440}
              height={900}
              className="aspect-[8/5] w-full rounded-3xl border border-background/15 object-cover shadow-2xl"
            managedField="heroImageUrl"
          />
          </div>
        </section>

        <section id="produtos" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
              O que entregamos
            </p>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-2xl font-display text-3xl font-bold md:text-5xl">
                Gás e água na porta da sua casa.
              </h2>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Escolha o que precisa, informe o endereço e combine a entrega diretamente com a
                equipe da Heloá Gás.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {catalogo.map(({ icon: Icon, title, text }, i) => (
                <MotionReveal as="article" variant="scale" delay={i * 80} key={title} className="rounded-2xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/50">
                  <Icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="entrega" className="bg-muted px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <PortfolioImage
              src="/images/heloa-gas/entrega.jpg"
              alt="Entregador levando botijão de gás até a residência do cliente"
              width={1440}
              height={900}
              className="aspect-[8/5] w-full rounded-3xl object-cover"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                Como pedir
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                Pediu, chegou. Simples assim.
              </h2>
              <ol className="mt-8 space-y-5">
                {[
                  "Escolha entre botijão de gás, água mineral ou os dois.",
                  "Informe o endereço, o bairro e um ponto de referência.",
                  "Combine a entrega e o pagamento com a equipe.",
                ].map((item, index) => (
                  <MotionReveal as="li" variant="right" delay={index * 110} key={item} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-2 font-semibold">{item}</span>
                  </MotionReveal>
                ))}
              </ol>
              <PortfolioCTAQuiz
                clientKey="heloa-gas"
                studioName="Heloá Gás"
                recipientName="Heloá Gás"
                theme="navy"
                mode="proposal"
                quizConfig={quizConfig}
                className="mt-8 inline-flex min-h-12 items-center rounded-full bg-foreground px-6 font-bold text-background hover:opacity-90"
              >
                Iniciar pedido
              </PortfolioCTAQuiz>
            </div>
          </div>
        </section>

        <section id="atendimento" className="px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6">
              <MapPin className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-bold">Onde estamos</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Rua Belo Horizonte, 340 — Vila Vicente Macedo, Piraquara — PR, 83303-130.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <Truck className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-bold">Área de entrega</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Vila Vicente Macedo e bairros próximos de Piraquara. Confirme a disponibilidade do
                seu endereço ao fazer o pedido.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-6">
              <Clock className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-bold">Atendimento</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pedidos pelo formulário: você conta o que precisa e a equipe responde para combinar
                horário e pagamento.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="bg-foreground px-5 py-8 text-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>Heloá Gás</strong>
            <p className="mt-1 text-sm text-background/70">
              Gás de cozinha e água mineral com entrega em Piraquara — PR.
            </p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-background/70"
            linkClassName="font-semibold text-primary"
          />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="heloa-gas"
        eyebrow="Heloá Gás"
        title="Gás acabou no meio do preparo?"
        description="Peça botijão de gás ou água mineral e combine a entrega no seu endereço."
        ctaLabel="Ver produtos"
        ctaHref="#produtos"
      />
      <PortfolioUpsellPopup pageName="portfolio-heloa-gas" />
    </div>
    </MotionScope>
  );
}
