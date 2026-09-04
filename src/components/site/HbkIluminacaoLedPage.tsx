import { ManagedText } from "@/components/portfolio/ManagedText";
import type { CSSProperties } from "react";
import { ArrowRight, Building2, LampDesk, Lightbulb, PlugZap } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * HBK Iluminação LED — direção PRODUTO / BENTO LUMINOSO.
 *
 * Hero centrado sobre fundo escuro com halo radial, catálogo em bento grid
 * assimétrico (tiles de tamanhos diferentes), faixa de aplicação em pílulas e
 * CTA em cartão compacto flutuante. Assinatura: halo de luz + bento.
 */

const quizConfig = {
  proposalKind: "service" as const,
  services: [
    "Iluminação LED residencial",
    "Iluminação LED comercial",
    "Lâmpadas e luminárias LED",
    "Spots e perfis LED",
    "Projetos de iluminação",
    "Orientação técnica",
  ],
  experienceOptions: ["Residência", "Condomínio", "Comércio", "Obra em andamento", "Outro projeto"],
  periodOptions: ["Sei a metragem", "Tenho fotos do ambiente", "Preciso de orientação"],
  timingOptions: ["O quanto antes", "Nos próximos dias", "Ainda neste mês", "Estou planejando"],
  stepTitles: {
    service: "Qual iluminação LED procura?",
    experience: "Onde será aplicado?",
    period: "Como podemos orientar?",
    timing: "Quando pretende começar?",
  },
  notePlaceholder: "Conte os ambientes, a metragem e o que deseja iluminar.",
};

/** Bento assimétrico: cada tile ocupa uma área diferente. */
function LedTile({
  icon: Icon,
  title,
  text,
  span,
}: {
  icon: typeof Lightbulb;
  title: string;
  text: string;
  span: string;
}) {
  return (
    <article
      className={`flex flex-col justify-between rounded-3xl border border-border bg-card p-6 ${span}`}
    >
      <Icon aria-hidden className="h-8 w-8 text-primary" />
      <div className="mt-8">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </article>
  );
}

const tiles = [
  {
    icon: Lightbulb,
    title: "Lâmpadas e luminárias LED",
    text: "Opções para dar mais clareza e eficiência aos ambientes.",
    span: "md:col-span-3 md:row-span-2",
  },
  {
    icon: LampDesk,
    title: "Spots, perfis e fitas LED",
    text: "Soluções para destacar pontos de luz, móveis e acabamentos.",
    span: "md:col-span-3",
  },
  {
    icon: Building2,
    title: "Obras e reformas",
    text: "Produtos LED para projetos residenciais e comerciais.",
    span: "md:col-span-2",
  },
  {
    icon: PlugZap,
    title: "Orientação técnica",
    text: "Equipe preparada para ajudar a escolher a solução mais adequada.",
    span: "md:col-span-1",
  },
];

const aplicacoes = [
  "Sala e cozinha",
  "Fachada",
  "Comércio",
  "Área externa",
  "Móveis planejados",
  "Obra nova",
];

const theme = {
  "--background": "oklch(0.177 0.023 273.0)",
  "--foreground": "oklch(0.976 0.005 247.9)",
  "--card": "oklch(0.228 0.029 273.1)",
  "--card-foreground": "oklch(0.976 0.005 247.9)",
  "--muted": "oklch(0.280 0.030 273.4)",
  "--muted-foreground": "oklch(0.787 0.025 256.8)",
  "--primary": "oklch(0.878 0.166 94.0)",
  "--primary-foreground": "oklch(0.177 0.023 273.0)",
  "--border": "oklch(0.336 0.035 273.5)",
  "--ring": "oklch(0.878 0.166 94.0)",
} as CSSProperties;

export function HbkIluminacaoLedPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground" style={theme}>
      <main id="inicio">
        {/* HERO centrado com halo radial — assinatura de luz. */}
        <section aria-label="Apresentação principal" className="relative isolate overflow-hidden px-5 pb-16 pt-10 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.878 0.166 94.0) 0%, transparent 68%)" }}
          />
          <div className="relative mx-auto max-w-3xl">
            <PortfolioImage
              src="/images/hbk-iluminacao-led/logo.png"
              alt="HBK Iluminação LED Atacadão"
              width={420}
              height={190}
              className="mx-auto h-16 w-auto object-contain"
              managedField="logoUrl"
            />
            <h1 className="mt-10 font-display text-4xl font-bold leading-[1.04] md:text-6xl">
              <ManagedText
                field="heroHeadline"
                fallback={"Iluminando seus projetos com intelig\u00eancia."}
              />
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Produtos LED, orienta\u00e7\u00e3o t\u00e9cnica e condi\u00e7\u00f5es especiais para quem est\u00e1 construindo ou reformando."
                }
              />
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PortfolioCTAQuiz
                clientKey="hbk-iluminacao-led"
                studioName="HBK Iluminação LED Atacadão"
                recipientName="HBK"
                theme="navy"
                mode="proposal"
                quizConfig={quizConfig}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 font-bold text-primary-foreground hover:opacity-90"
              >
                Cotar iluminação <ArrowRight aria-hidden className="h-4 w-4" />
              </PortfolioCTAQuiz>
              <a
                href="#servicos"
                className="inline-flex min-h-12 items-center rounded-full border border-border px-6 font-semibold hover:border-primary hover:text-primary"
              >
                Ver soluções
              </a>
            </div>
          </div>

          <PortfolioImage
            src="/images/hbk-iluminacao-led/hero.webp"
            alt="Ambiente com soluções de iluminação LED"
            priority
            width={1600}
            height={900}
            className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-4xl rounded-[2rem] border border-border object-cover"
            managedField="heroImageUrl"
          />
        </section>

        {/* Bento assimétrico de produtos. */}
        <section id="servicos" className="px-5 py-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Soluções LED</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-6">
              {tiles.map((tile) => (
                <LedTile key={tile.title} {...tile} />
              ))}
            </div>
          </div>
        </section>

        {/* Aplicações em pílulas + imagem de produto. */}
        <section aria-label="Onde aplicar a iluminação" className="px-5 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Onde a luz certa faz diferença
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {aplicacoes.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <PortfolioImage
              src="/images/hbk-iluminacao-led/servicos.webp"
              alt="Produtos de iluminação LED para projetos e reformas"
              width={1400}
              height={900}
              className="aspect-[3/2] w-full rounded-[2rem] object-cover"
            />
          </div>
        </section>

        {/* CTA em cartão compacto centralizado. */}
        <section aria-label="Montar cotação" className="px-5 pb-20 pt-8">
          <div className="mx-auto max-w-xl rounded-[2rem] border border-primary/40 bg-card p-8 text-center">
            <h2 className="font-display text-2xl font-bold">Monte sua cotação de iluminação</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Informe os ambientes e a metragem para receber a indicação de produtos.
            </p>
            <PortfolioCTAQuiz
              clientKey="hbk-iluminacao-led"
              studioName="HBK Iluminação LED Atacadão"
              recipientName="HBK"
              theme="navy"
              mode="proposal"
              quizConfig={quizConfig}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 font-bold text-primary-foreground hover:opacity-90"
            >
              Começar cotação
            </PortfolioCTAQuiz>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong>HBK Iluminação LED Atacadão</strong>
            <p className="mt-1 text-sm text-muted-foreground">Iluminação LED — Curitiba, PR.</p>
          </div>
          <PortfolioHostCredit
            className="text-sm text-muted-foreground"
            linkClassName="font-semibold text-primary"
          />
        </div>
      </footer>
      <PortfolioSocialProofPopup
        clientKey="hbk-iluminacao-led"
        eyebrow="HBK Iluminação LED Atacadão"
        title="Iluminando seus projetos com inteligência."
        description="Conheça as soluções LED e organize uma cotação para seu projeto."
        ctaLabel="Ver soluções"
        ctaHref="#servicos"
      />
      <PortfolioUpsellPopup pageName="portfolio-hbk-iluminacao-led" />
    </div>
  );
}
