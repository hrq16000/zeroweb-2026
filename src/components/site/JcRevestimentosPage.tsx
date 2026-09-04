import { ManagedText } from "@/components/portfolio/ManagedText";
import type { CSSProperties } from "react";
import { ArrowRight, BrickWall, Building2, Droplets, PaintRoller } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * JC Revestimentos — direção CATÁLOGO DE MATERIAL.
 *
 * Hero de imagem plena com sobreposição (não split), linha de produtos como
 * tabela de especificação, faixa de aplicação e CTA em barra fixa de rodapé de
 * seção. Assinatura: tabela de material com granulação/uso.
 */

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Textura projetada",
    "Grafiato",
    "Textura lisa",
    "Massa corrida",
    "Massa acrílica",
    "Massa niveladora",
  ],
  experienceOptions: ["Residência", "Condomínio", "Comércio", "Obra em andamento", "Outro projeto"],
  periodOptions: ["Sei a metragem", "Tenho fotos do ambiente", "Preciso de orientação"],
  timingOptions: ["O quanto antes", "Nos próximos dias", "Ainda neste mês", "Estou planejando"],
  stepTitles: {
    service: "Qual revestimento procura?",
    experience: "Onde será aplicado?",
    period: "Como podemos orientar?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte a metragem, ambiente e acabamento desejado.",
};

/** Linha de produtos apresentada como especificação, não como card de serviço. */
function SpecRow({
  icon: Icon,
  produto,
  aplicacao,
  acabamento,
}: {
  icon: typeof PaintRoller;
  produto: string;
  aplicacao: string;
  acabamento: string;
}) {
  return (
    <li className="grid gap-1 border-b border-border py-5 md:grid-cols-[1.2fr_1.4fr_.8fr] md:items-center md:gap-6">
      <h3 className="flex items-center gap-3 text-lg font-bold">
        <Icon aria-hidden className="h-5 w-5 text-primary" />
        {produto}
      </h3>
      <p className="text-sm text-muted-foreground">{aplicacao}</p>
      <span className="w-fit rounded-sm bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] md:justify-self-end">
        {acabamento}
      </span>
    </li>
  );
}

const linha = [
  {
    icon: PaintRoller,
    produto: "Textura projetada",
    aplicacao: "Fachada e áreas externas",
    acabamento: "Texturizado",
  },
  {
    icon: BrickWall,
    produto: "Grafiato",
    aplicacao: "Fachada e paredes internas",
    acabamento: "Riscado",
  },
  {
    icon: BrickWall,
    produto: "Textura lisa",
    aplicacao: "Ambientes internos",
    acabamento: "Liso",
  },
  {
    icon: Building2,
    produto: "Massa corrida",
    aplicacao: "Preparo de superfície interna",
    acabamento: "Nivelamento",
  },
  {
    icon: Building2,
    produto: "Massa acrílica",
    aplicacao: "Preparo de superfície externa",
    acabamento: "Nivelamento",
  },
  {
    icon: Droplets,
    produto: "Massa niveladora",
    aplicacao: "Correção de imperfeições",
    acabamento: "Regularização",
  },
];

const theme = {
  "--background": "oklch(0.234 0.015 248.5)",
  "--foreground": "oklch(0.959 0.008 84.6)",
  "--card": "oklch(0.286 0.018 248.5)",
  "--card-foreground": "oklch(0.959 0.008 84.6)",
  "--muted": "oklch(0.336 0.020 248.4)",
  "--muted-foreground": "oklch(0.792 0.017 84.6)",
  "--primary": "oklch(0.727 0.141 58.6)",
  "--primary-foreground": "oklch(0.234 0.015 248.5)",
  "--border": "oklch(0.394 0.021 248.4)",
  "--ring": "oklch(0.727 0.141 58.6)",
} as CSSProperties;

export function JcRevestimentosPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground" style={theme}>
      <main id="inicio">
        {/* HERO de imagem plena com sobreposição e logo dentro da composição. */}
        <section aria-label="Apresentação principal" className="relative isolate min-h-[78svh] overflow-hidden">
          <PortfolioImage
            src="/images/jc-revestimentos/hero.webp"
            alt="Amostras de revestimento e textura em fachada residencial"
            priority
            width={1920}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
            managedField="heroImageUrl"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40 md:bg-gradient-to-r md:to-background/30"
          />
          <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-between px-5 py-8">
            <PortfolioImage
              src="/images/jc-revestimentos/logo.png"
              alt="JC Revestimentos"
              width={420}
              height={190}
              className="h-14 w-auto object-contain"
              managedField="logoUrl"
            />
            <div className="max-w-2xl pb-6">
              <p className="text-[11px] font-bold uppercase tracking-[.38em] text-primary">
                Revestimentos direto da fábrica
              </p>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] md:text-6xl">
                <ManagedText
                  field="heroHeadline"
                  fallback={"O acabamento certo come\u00e7a com o material adequado."}
                />
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                <ManagedText
                  field="heroSubheadline"
                  fallback={
                    "Textura projetada, grafiato, textura lisa e massas para preparo de superf\u00edcie em Uberaba, Curitiba."
                  }
                />
              </p>
              <a
                href="#servicos"
                className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-none border-b-2 border-primary pb-2 font-bold text-primary"
              >
                Ver a linha completa <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Assinatura: tabela de especificação do material. */}
        <section id="servicos" className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-2 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display text-3xl font-bold md:text-4xl">Linha de revestimentos</h2>
              <p className="text-sm text-muted-foreground">
                Produto, aplicação recomendada e tipo de acabamento.
              </p>
            </div>

            <ul className="mt-2">
              {linha.map((item) => (
                <SpecRow key={item.produto} {...item} />
              ))}
            </ul>
          </div>
        </section>

        {/* Faixa de aplicação: imagem larga + texto curto lateral. */}
        <section aria-label="Preparo de superfície" className="border-y border-border bg-card px-5 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <PortfolioImage
              src="/images/jc-revestimentos/servicos.webp"
              alt="Texturas e revestimentos para acabamento de parede"
              width={1600}
              height={800}
              className="aspect-[2/1] w-full object-cover"
            />
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Superfície preparada, acabamento previsível.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Cada produto tem uma aplicação recomendada. Informe metragem, ambiente e o
                acabamento desejado para receber a orientação correta.
              </p>
            </div>
          </div>
        </section>

        {/* CTA em barra horizontal compacta. */}
        <section aria-label="Pedir orçamento" className="px-5 py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 border-l-4 border-primary bg-card px-6 py-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-xl font-bold md:text-2xl">
              Diga a metragem e o ambiente: indicamos o material certo.
            </p>
            <PortfolioCTAQuiz
              clientKey="jc-revestimentos"
              studioName="JC Revestimentos"
              recipientName="JC"
              theme="navy"
              mode="proposal"
              quizConfig={quizConfig}
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:opacity-90"
            >
              Pedir orçamento <ArrowRight aria-hidden className="h-4 w-4" />
            </PortfolioCTAQuiz>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>JC Revestimentos</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Revestimentos para pintura — Uberaba, Curitiba.
            </p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-muted-foreground"
            linkClassName="font-semibold text-primary"
          />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="jc-revestimentos"
        eyebrow="JC Revestimentos"
        title="O acabamento certo começa com o material adequado."
        description="Conheça a linha de revestimentos e organize os detalhes para solicitar um orçamento."
        ctaLabel="Ver produtos"
        ctaHref="#servicos"
      />
      <PortfolioUpsellPopup pageName="portfolio-jc-revestimentos" />
    </div>
  );
}
