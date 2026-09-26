import {
  ArrowRight,
  Box,
  Check,
  MapPin,
  Package,
  ShoppingBasket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { ManagedText } from "@/components/portfolio/ManagedText";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Embalagens para alimentos",
    "Descartáveis e festas",
    "Produtos de limpeza",
    "Higiene e utilidades",
    "Sacos, caixas e papelaria",
  ],
  experienceOptions: ["Minha casa", "Meu comércio", "Festa ou evento", "Compra para revenda"],
  periodOptions: ["Jardim Itália", "São José dos Pinhais", "Vou confirmar a retirada"],
  timingOptions: ["Quero consultar agora", "Para esta semana", "Estou planejando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você procura?",
    experience: "Para qual uso?",
    period: "Onde será a retirada?",
    timing: "Quando precisa?",
    note: "Conte os itens que busca",
  },
  notePlaceholder: "Ex.: quantidade, tamanho da embalagem, tipo de produto ou data do evento.",
};

function CTA({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="embalar-embalagens"
      studioName="Embalar Embalagens"
      recipientName="a equipe Embalar"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

const categories: Array<{
  code: string;
  title: string;
  text: string;
  icon: LucideIcon;
  examples: string;
}> = [
  {
    code: "A",
    title: "Embalagens",
    text: "Caixas, sacos, potes, bobinas e soluções para apresentar e proteger seus produtos.",
    icon: Box,
    examples: "alimentos · delivery · comércio",
  },
  {
    code: "B",
    title: "Descartáveis",
    text: "Itens para festas, lanchonetes, delivery e o dia a dia do seu negócio.",
    icon: Package,
    examples: "festas · eventos · atendimento",
  },
  {
    code: "C",
    title: "Limpeza e utilidades",
    text: "Produtos para higiene, organização e manutenção de ambientes e operações.",
    icon: ShoppingBasket,
    examples: "casa · empresa · rotina",
  },
];

const gallery = [
  ["/images/embalar-embalagens/loja-01.png", "Prateleiras com embalagens e descartáveis"],
  ["/images/embalar-embalagens/loja-02.png", "Variedade de itens para limpeza e utilidades"],
  ["/images/embalar-embalagens/loja-03.png", "Corredor de produtos de higiene e organização"],
  ["/images/embalar-embalagens/loja-04.png", "Seleção de produtos e embalagens"],
  ["/images/embalar-embalagens/loja-05.png", "Estoque de papéis, sacos e materiais"],
] as const;

export function EmbalarEmbalagensPage() {
  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#fff9f2] text-[#27363a]">
        <header className="border-b border-[#27363a]/10 bg-[#fff9f2] px-5 py-4 lg:px-10">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" aria-label="Embalar Embalagens" className="flex items-center gap-3">
              <PortfolioImage
                src="/images/embalar-embalagens/logo.png"
                alt="Símbolo editorial de embalagens e utilidades"
                width={160}
                height={160}
                priority
                managedField="logoUrl"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="font-display text-lg font-bold tracking-tight">
                Embalar <span className="font-normal text-[#d95645]">Embalagens</span>
              </span>
            </a>

            <nav
              aria-label="Navegação da loja"
              className="hidden gap-6 text-[11px] font-black uppercase tracking-[.16em] text-[#687475] md:flex"
            >
              <a href="#prateleiras" className="hover:text-[#d95645]">Prateleiras</a>
              <a href="#loja" className="hover:text-[#d95645]">Loja real</a>
              <a href="#contato" className="hover:text-[#d95645]">Consultar</a>
            </nav>

            <div className="justify-self-end text-right">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#9b7770]">
                Jardim Itália
              </p>
              <p className="mt-1 text-xs font-bold">São José dos Pinhais</p>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="px-5 pb-12 pt-10 lg:px-10 lg:pb-16 lg:pt-14">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 border-b border-[#27363a]/12 pb-10 lg:grid-cols-[.72fr_.28fr] lg:items-end">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#d95645]">
                    Loja de bairro · embalagens · utilidades
                  </p>
                  <MotionReveal
                    as="h1"
                    variant="mask"
                    intensity="EXPRESSIVE"
                    className="mt-5 max-w-[12ch] font-display text-5xl font-bold leading-[.92] tracking-[-.045em] sm:text-7xl"
                  >
                    <ManagedText
                      field="heroHeadline"
                      fallback="Uma loja para montar a solução, não só escolher um item."
                    />
                  </MotionReveal>
                </div>

                <div className="lg:pb-1">
                  <p className="text-base leading-7 text-[#647070]">
                    <ManagedText
                      field="heroSubheadline"
                      fallback="Embalagens, descartáveis, produtos de limpeza e utilidades para sua casa, festa ou negócio."
                    />
                  </p>
                  <CTA className="mt-6 inline-flex min-h-12 items-center gap-2 border-b-2 border-[#d95645] pb-1 font-black text-[#b94638]">
                    Consultar produtos
                    <ArrowRight className="h-4 w-4" />
                  </CTA>
                </div>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_.7fr_.7fr]">
                <MotionReveal variant="up" className="overflow-hidden bg-[#eee2d7]">
                  <PortfolioImage
                    src="/images/embalar-embalagens/loja-01.png"
                    alt="Prateleiras da Embalar com embalagens e descartáveis"
                    managedField="heroImageUrl"
                    priority
                    width={960}
                    height={720}
                    className="h-[430px] w-full object-cover lg:h-[560px]"
                  />
                </MotionReveal>
                <div className="grid gap-3">
                  <MotionReveal variant="up" delay={60} className="overflow-hidden bg-[#eee2d7]">
                    <PortfolioImage
                      src="/images/embalar-embalagens/loja-02.png"
                      alt="Itens de limpeza e utilidades na Embalar"
                      width={960}
                      height={720}
                      className="h-[210px] w-full object-cover lg:h-[274px]"
                    />
                  </MotionReveal>
                  <MotionReveal variant="up" delay={110} className="overflow-hidden bg-[#eee2d7]">
                    <PortfolioImage
                      src="/images/embalar-embalagens/loja-03.png"
                      alt="Corredor de produtos da loja Embalar"
                      width={960}
                      height={720}
                      className="h-[210px] w-full object-cover lg:h-[274px]"
                    />
                  </MotionReveal>
                </div>
                <aside className="flex min-h-[430px] flex-col justify-between bg-[#27363a] p-7 text-white lg:min-h-[560px]">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#f3b6a4]">
                      Na loja
                    </p>
                    <h2 className="mt-5 font-display text-3xl font-bold leading-tight">
                      Variedade para resolver a compra de uma vez.
                    </h2>
                    <div className="mt-8 space-y-4 border-t border-white/15 pt-6 text-sm text-white/70">
                      <p className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#f3b6a4]" /> Casa e rotina
                      </p>
                      <p className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#f3b6a4]" /> Festas e eventos
                      </p>
                      <p className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#f3b6a4]" /> Comércio e revenda
                      </p>
                    </div>
                  </div>
                  <a
                    href="#prateleiras"
                    className="inline-flex items-center gap-2 text-sm font-black text-[#f3b6a4]"
                  >
                    Abrir o índice <ArrowRight className="h-4 w-4" />
                  </a>
                </aside>
              </div>
            </div>
          </section>

          <section id="prateleiras" className="px-5 py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.3fr_.7fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#d95645]">
                    Índice de prateleiras
                  </p>
                  <h2 className="mt-4 max-w-[8ch] font-display text-4xl font-bold leading-[.96] sm:text-5xl">
                    Comece pelo que você precisa resolver.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#697475]">
                    A equipe ajuda a localizar formato, quantidade e tipo de produto conforme o uso.
                  </p>
                </div>

                <div className="border-t-2 border-[#27363a]">
                  {categories.map(({ code, title, text, icon: Icon, examples }) => (
                    <article
                      key={code}
                      className="grid gap-5 border-b border-[#27363a]/15 py-7 sm:grid-cols-[3rem_1fr_.8fr] sm:items-start"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-[#d95645]">{code}</span>
                        <Icon className="h-5 w-5 text-[#d95645] sm:hidden" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <Icon className="hidden h-5 w-5 text-[#d95645] sm:block" />
                          <h3 className="font-display text-2xl font-bold">{title}</h3>
                        </div>
                        <p className="mt-3 max-w-xl leading-7 text-[#647070]">{text}</p>
                      </div>
                      <p className="text-xs font-black uppercase tracking-[.14em] text-[#9b7770]">
                        {examples}
                      </p>
                    </article>
                  ))}

                  <div className="flex flex-col gap-5 bg-[#f5e6dc] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black">Não encontrou a categoria?</p>
                      <p className="mt-1 text-sm text-[#6d7778]">
                        Descreva o item, quantidade ou uso e consulte a equipe.
                      </p>
                    </div>
                    <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#d95645] px-5 py-3 text-sm font-black text-white">
                      Montar minha consulta
                      <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="loja" className="bg-[#27363a] px-5 py-20 text-white lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[.45fr_.55fr] lg:items-end">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#f3b6a4]">
                    Fotos reais
                  </p>
                  <h2 className="mt-4 max-w-[10ch] font-display text-4xl font-bold leading-tight sm:text-5xl">
                    O catálogo começa nas prateleiras de verdade.
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-white/65">
                  As imagens abaixo mostram o interior da loja e ajudam a entender a variedade disponível sem inventar estoque ou preço.
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_.75fr]">
                {gallery.slice(2).map(([src, alt], index) => (
                  <MotionReveal
                    as="figure"
                    variant="up"
                    delay={index * 70}
                    key={src}
                    className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}
                  >
                    <PortfolioImage
                      src={src}
                      alt={alt}
                      width={960}
                      height={720}
                      className="h-72 w-full object-cover lg:h-80"
                    />
                    <figcaption className="mt-2 text-[10px] uppercase tracking-[.14em] text-white/40">
                      Loja Embalar · registro do interior
                    </figcaption>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </section>

          <section id="contato" className="px-5 py-16 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 border-2 border-[#27363a] p-7 sm:p-10 lg:grid-cols-[.68fr_.32fr] lg:items-end">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[.27em] text-[#d95645]">
                    Consulta e retirada
                  </p>
                  <h2 className="mt-4 max-w-[15ch] font-display text-4xl font-bold leading-tight sm:text-5xl">
                    Diga o que você precisa. A Embalar ajuda a encontrar a combinação.
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[#637071]">
                    <span>
                      <MapPin className="mr-1.5 inline h-4 w-4 text-[#d95645]" />
                      Rua Quirino Zagonel, 1330
                    </span>
                    <span>
                      <Sparkles className="mr-1.5 inline h-4 w-4 text-[#d95645]" />
                      Jardim Itália · São José dos Pinhais/PR
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#27363a]/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-sm leading-7 text-[#647070]">
                    Informe item, quantidade, tamanho ou data do evento para tornar a consulta mais objetiva.
                  </p>
                  <CTA className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#27363a] px-6 py-3.5 text-sm font-black text-white">
                    Consultar disponibilidade
                    <ArrowRight className="h-4 w-4" />
                  </CTA>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#27363a]/10 bg-[#fff9f2] px-5 py-8 text-sm text-[#6d7778] lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display font-bold text-[#26363b]">
                Embalar <span className="text-[#d95645]">Embalagens</span>
              </p>
              <p className="mt-1 text-xs">Embalagens, higiene, descartáveis e utilidades.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs">Rua Quirino Zagonel, 1330 · São José dos Pinhais/PR</p>
              <PortfolioHostCredit linkClassName="mt-2 inline-block font-semibold text-[#26363b] underline underline-offset-4 hover:text-[#d95645]" />
            </div>
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="embalar-embalagens"
          eyebrow="Embalar Embalagens"
          title="A rotina fica mais simples quando tudo está à mão."
          description="Consulte produtos e disponibilidade direto com a equipe."
          ctaLabel="Consultar produtos"
          ctaHref="#contato"
          delayMs={10000}
          className="border-[#d95645]/40 bg-[#27363a]/95 text-white"
          accentClassName="text-[#f3b6a4]"
        />
        <PortfolioUpsellPopup pageName="portfolio-embalar-embalagens" />
      </div>
    </MotionScope>
  );
}
