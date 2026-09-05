import { ManagedText } from "@/components/portfolio/ManagedText";
import type { CSSProperties } from "react";
import { ArrowRight, Brush, Droplets, House, PaintRoller } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Ton & Cor — direção ARTESANAL / CROMÁTICA.
 *
 * Hero tipográfico claro (sem split com foto), cartela de cor como elemento
 * assinatura, serviços em linhas numeradas largas (não cards), faixa de imagem
 * plena e CTA em bloco cromático. Composição própria: não compartilha hero,
 * grid, ritmo de seções nem apresentação de serviços com os demais projetos.
 */

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Pintura em geral",
    "Pequenos serviços de alvenaria",
    "Pequenos serviços hidráulicos",
    "Limpeza de telhado",
    "Reparos em geral",
  ],
  experienceOptions: ["Casa", "Apartamento", "Comércio", "Outro espaço"],
  periodOptions: ["Tenho fotos do local", "Posso explicar o reparo", "Preciso de uma avaliação"],
  timingOptions: ["O quanto antes", "Nos próximos dias", "Ainda neste mês", "Estou planejando"],
  stepTitles: {
    service: "Qual serviço você precisa?",
    experience: "Onde será o trabalho?",
    period: "Como podemos avaliar?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte quais ambientes ou reparos precisam de atenção.",
};

/** Cartela cromática — elemento assinatura da marca. */
function ColorSwatch({ name, value, index }: { name: string; value: string; index: number }) {
  return (
    <MotionReveal
      as="li"
      variant="up"
      delay={index * 90}
      className="flex h-20 flex-1 items-end p-2 md:h-28"
      style={{ backgroundColor: `hsl(${value})` }}
    >
      <span className="sr-only">{name}</span>
    </MotionReveal>
  );
}

const swatches = [
  { name: "Areia", value: "38 42% 86%" },
  { name: "Terracota", value: "18 62% 52%" },
  { name: "Oliva", value: "78 24% 42%" },
  { name: "Grafite", value: "220 12% 24%" },
  { name: "Nuvem", value: "210 22% 92%" },
  { name: "Índigo", value: "224 46% 34%" },
];

const jobs = [
  {
    icon: PaintRoller,
    title: "Pintura em geral",
    text: "Renovação de paredes e ambientes com atenção ao acabamento.",
    tag: "Interna e externa",
  },
  {
    icon: House,
    title: "Alvenaria",
    text: "Pequenas reformas e correções para organizar o espaço.",
    tag: "Pequenos reparos",
  },
  {
    icon: Droplets,
    title: "Hidráulica",
    text: "Pequenos serviços hidráulicos integrados aos reparos necessários.",
    tag: "Manutenção",
  },
  {
    icon: Brush,
    title: "Telhados e reparos",
    text: "Limpeza de telhado e soluções para reparos em geral.",
    tag: "Conservação",
  },
];

const theme = {
  "--background": "oklch(0.974 0.008 78.3)",
  "--foreground": "oklch(0.282 0.027 51.4)",
  "--card": "oklch(0.993 0.002 74.9)",
  "--card-foreground": "oklch(0.282 0.027 51.4)",
  "--muted": "oklch(0.929 0.014 74.9)",
  "--muted-foreground": "oklch(0.493 0.027 51.9)",
  "--primary": "oklch(0.599 0.148 42.1)",
  "--primary-foreground": "oklch(0.980 0.006 78.3)",
  "--border": "oklch(0.865 0.018 63.8)",
  "--ring": "oklch(0.599 0.148 42.1)",
} as CSSProperties;

export function TonECorPage() {
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-background text-foreground" style={theme}>
      <header className="px-5 pt-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Ton & Cor — início">
            <PortfolioImage
              src="/images/ton-e-cor/logo.png"
              alt="Ton & Cor"
              width={420}
              height={190}
              className="h-12 w-auto object-contain"
              managedField="logoUrl"
            />
          </a>
          <a
            href="#servicos"
            className="text-sm font-semibold underline decoration-primary decoration-2 underline-offset-8 hover:text-primary"
          >
            Serviços
          </a>
        </div>
      </header>

      <main id="inicio">
        {/* HERO tipográfico — sem imagem, a cor é o protagonista. */}
        <section id="apresentacao" aria-label="Apresentação principal" className="px-5 pb-4 pt-12 md:pt-20">
          <div className="mx-auto max-w-5xl">
            <p className="font-display text-[11px] font-bold uppercase tracking-[.42em] text-primary">
              Pintura · pequenas reformas
            </p>
            <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="mt-6 max-w-4xl font-display text-[2.6rem] font-bold leading-[.98] tracking-tight md:text-[5.5rem]">
              <ManagedText
                field="heroHeadline"
                fallback={"Sua casa renovada, com os reparos organizados em um s\u00f3 atendimento."}
              />
            </MotionReveal>
            <p className="mt-8 max-w-lg border-l-4 border-primary pl-5 text-base leading-7 text-muted-foreground">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Pintura em geral, pequenos servi\u00e7os de alvenaria e hidr\u00e1ulica, limpeza de telhado e reparos para cuidar do seu espa\u00e7o."
                }
              />
            </p>
          </div>
        </section>

        {/* Assinatura visual: cartela de cor de largura total. */}
        <section aria-label="Cartela de acabamentos" className="mt-10 px-5">
          <ul className="mx-auto flex max-w-5xl overflow-hidden rounded-2xl border border-border">
            {swatches.map((swatch, index) => (
              <ColorSwatch key={swatch.name} name={swatch.name} value={swatch.value} index={index} />
            ))}
          </ul>
          <p className="mx-auto mt-3 max-w-5xl text-xs uppercase tracking-[.2em] text-muted-foreground">
            {swatches.map((s) => s.name).join(" · ")}
          </p>
        </section>

        {/* Serviços em linhas largas numeradas — não são cards. */}
        <section id="servicos" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Da pintura ao pequeno reparo que faltava.
            </h2>
            <ul className="mt-10 border-t border-border">
              {jobs.map(({ icon: Icon, title, text, tag }, index) => (
                <MotionReveal
                  as="li"
                  variant="right"
                  delay={index * 70}
                  key={title}
                  className="grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-2 border-b border-border py-7 md:grid-cols-[3.5rem_1fr_11rem] md:items-center"
                >
                  <span className="font-display text-2xl font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold md:text-2xl">
                      <Icon aria-hidden className="h-5 w-5 text-primary" />
                      {title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                  <span className="col-start-2 w-fit rounded-full bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground md:col-start-3 md:justify-self-end">
                    {tag}
                  </span>
                </MotionReveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Faixa de imagem plena com legenda deslocada. */}
        <section aria-label="Galeria de trabalhos" className="px-5">
          <figure className="mx-auto max-w-6xl">
            <MotionImageReveal direction="up" className="rounded-3xl">
            <PortfolioImage
              src="/images/ton-e-cor/servicos.webp"
              alt="Materiais de pintura e pequenas reformas organizados em ambiente residencial"
              priority
              width={1440}
              height={640}
              className="aspect-[21/9] w-full rounded-3xl object-cover"
              managedField="heroImageUrl"
            />
            </MotionImageReveal>
            <figcaption className="mx-auto mt-4 w-fit rounded-full bg-card px-5 py-3 text-center text-sm font-semibold shadow-lg md:-mt-8">
              Trabalho de acabamento, feito no ritmo da sua casa.
            </figcaption>
          </figure>
        </section>

        <section aria-label="Avaliação do serviço" className="px-5 py-16 md:py-24">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Explique o que precisa e organize a avaliação.
              </h2>
              <PortfolioImage
                src="/images/ton-e-cor/hero.webp"
                alt="Apresentação dos serviços reais da Ton & Cor"
                width={1200}
                height={900}
                className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </div>
            <ol className="space-y-4">
              {[
                "Escolha o serviço principal.",
                "Informe o tipo de imóvel e os detalhes do local.",
                "Combine a avaliação e receba o orçamento.",
              ].map((item, index) => (
                <li
                  key={item}
                  className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold"
                >
                  <span className="mr-3 text-primary">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA em bloco cromático — não é banner escuro. */}
        <section aria-label="Solicitar orçamento" className="px-5 pb-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground md:px-12">
            <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight md:text-5xl">
              Escolha a cor. Nós cuidamos do resto.
            </h2>
            <PortfolioCTAQuiz
              clientKey="ton-e-cor"
              studioName="Ton & Cor"
              recipientName="Gelton"
              theme="navy"
              mode="proposal"
              quizConfig={quizConfig}
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-7 font-bold text-background hover:opacity-90"
            >
              Solicitar orçamento <ArrowRight aria-hidden className="h-4 w-4" />
            </PortfolioCTAQuiz>
            <p className="mt-5 text-sm opacity-80">
              Orçamento sem compromisso, conforme informado pelo profissional.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>Ton &amp; Cor</strong>
            <p className="mt-1 text-sm text-muted-foreground">Pintura e pequenas reformas.</p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-muted-foreground"
            linkClassName="font-semibold text-primary"
          />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="ton-e-cor"
        eyebrow="Ton & Cor"
        title="Pintura e pequenos reparos em uma presença clara."
        description="Conheça os serviços e organize os detalhes para solicitar um orçamento."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
      />
      <PortfolioUpsellPopup pageName="portfolio-ton-e-cor" />
    </div>
    </MotionScope>
  );
}
