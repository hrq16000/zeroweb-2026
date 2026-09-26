import {
  ArrowRight,
  Check,
  IceCreamBowl,
  MapPin,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { useManagedValue } from "@/components/portfolio/PortfolioRuntimeContext";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  stepTitles: {
    service: "Qual pedido você deseja?",
    experience: "Conte sua preferência",
    period: "Onde será a entrega?",
    timing: "Quando deseja receber?",
    note: "Observações",
  },
  services: [
    "Copão de açaí",
    "Litrão de açaí",
    "Açaí com frutas",
    "Açaí com cremes e complementos",
  ],
  experienceOptions: [
    "Quero experimentar",
    "Pedido para família",
    "Pedido para compartilhar",
    "Ainda estou escolhendo",
  ],
  periodOptions: ["Araucária", "Vou confirmar o endereço"],
  timingOptions: ["Quero pedir agora", "Hoje mais tarde", "Estou consultando"],
};

const menu = [
  {
    code: "01",
    title: "Copão caprichado",
    detail: "Escolha seu copão e combine frutas, cremes e complementos.",
    icon: IceCreamBowl,
  },
  {
    code: "02",
    title: "Litrão para compartilhar",
    detail: "Uma opção maior para dividir em família ou com amigos.",
    icon: ShoppingBag,
  },
  {
    code: "03",
    title: "Delivery em Araucária",
    detail: "Informe o endereço no pedido para organizar a entrega.",
    icon: MapPin,
  },
] as const;

function CTA({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="acai-total-araucaria"
      studioName="Açaí Total Araucária"
      recipientName="Açaí Total"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function AcaiTotalAraucariaPage() {
  const logo = useManagedValue("logoUrl", "/images/acai-total-araucaria/logo.webp");

  return (
    <div className="min-h-dvh overflow-hidden bg-[#2d0f44] text-white">
      <header className="border-b border-[#d9f23b]/25 bg-[#2d0f44] px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="#inicio" className="flex items-center gap-3">
            <PortfolioImage
              src={logo}
              alt="Açaí Total Araucária"
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-lg font-black uppercase tracking-[.06em]">
                Açaí <span className="text-[#d9f23b]">Total</span>
              </p>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/55">
                Araucária · delivery
              </p>
            </div>
          </a>

          <CTA className="inline-flex min-h-10 items-center gap-2 bg-[#d9f23b] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-[#2d0f44] transition hover:-translate-y-0.5 hover:bg-[#ecff78]">
            Montar pedido
            <ArrowRight className="h-4 w-4" />
          </CTA>
        </div>
      </header>

      <main>
        <section id="inicio" className="px-5 py-7 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid min-h-[700px] overflow-hidden border border-white/15 lg:grid-cols-[1.35fr_.65fr]">
              <figure className="relative m-0 min-h-[520px] overflow-hidden bg-[#50156d]">
                <PortfolioImage
                  src="/images/acai-total-araucaria/acai.webp"
                  alt="Copos de açaí com frutas e complementos"
                  priority
                  width={1152}
                  height={1536}
                  managedField="heroImageUrl"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d0f44]/90 via-transparent to-[#2d0f44]/10" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-7 sm:p-10">
                  <span className="inline-flex bg-[#d9f23b] px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-[#2d0f44]">
                    copões · litrões · delivery
                  </span>
                </figcaption>
              </figure>

              <aside className="flex flex-col justify-between bg-[#d9f23b] p-7 text-[#2d0f44] sm:p-10 lg:p-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#624074]">
                    pedido do seu jeito
                  </p>
                  <h1 className="mt-5 font-display text-5xl font-black leading-[.86] tracking-[-.045em] sm:text-6xl lg:text-[5.6rem]">
                    A vontade bateu. O pedido começa aqui.
                  </h1>
                  <p className="mt-6 text-base leading-8 text-[#563b67]">
                    Copões e litrões de açaí com frutas, cremes e complementos para receber em
                    Araucária.
                  </p>
                </div>

                <div className="mt-10">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#624074]">
                    caminho rápido
                  </p>
                  <ol className="mt-4 divide-y divide-[#2d0f44]/20 border-y border-[#2d0f44]/20">
                    {[
                      ["01", "Escolha", "Copão ou litrão"],
                      ["02", "Personalize", "Frutas, cremes e complementos"],
                      ["03", "Informe", "Endereço e horário"],
                    ].map(([n, title, detail]) => (
                      <li key={n} className="grid grid-cols-[2.5rem_5rem_1fr] gap-3 py-4 text-sm">
                        <span className="font-mono text-xs font-black">{n}</span>
                        <span className="font-black">{title}</span>
                        <span className="text-[#624074]">{detail}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <CTA className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#2d0f44] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#4d1769]">
                  Fazer meu pedido
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </aside>
            </div>
          </div>
        </section>

        <section id="cardapio" className="bg-[#fff9fc] px-5 py-20 text-[#2d0f44] lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.32fr_.68fr]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#8c3d8a]">
                  cardápio essencial
                </p>
                <h2 className="mt-4 max-w-[9ch] font-display text-4xl font-black leading-[.92] sm:text-5xl">
                  Três decisões para chegar ao açaí.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#705976]">
                  A página organiza a intenção do pedido. Tamanho, combinação e entrega são
                  confirmados no atendimento.
                </p>
              </div>

              <div className="border-t-2 border-[#2d0f44]">
                {menu.map(({ code, title, detail, icon: Icon }) => (
                  <article
                    key={code}
                    className="grid gap-4 border-b border-[#2d0f44]/15 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-xs font-black text-[#8c3d8a]">{code}</span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[#8c3d8a]" />
                        <h3 className="font-display text-2xl font-black">{title}</h3>
                      </div>
                      <p className="mt-3 max-w-xl leading-7 text-[#705976]">{detail}</p>
                    </div>
                    <a href="#pedido" className="text-sm font-black underline underline-offset-4">
                      escolher
                    </a>
                  </article>
                ))}

                <div className="flex flex-col gap-5 bg-[#2d0f44] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-white/65">
                    Ainda está escolhendo? O funil aceita essa opção e organiza o pedido sem
                    presumir a combinação final.
                  </p>
                  <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#d9f23b] px-5 py-3 text-sm font-black text-[#2d0f44]">
                    Quero escolher
                    <ArrowRight className="h-4 w-4" />
                  </CTA>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="entrega" className="px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-[.62fr_.38fr]">
              <div className="border border-[#d9f23b]/30 bg-[#40145a] p-7 sm:p-10">
                <MapPin className="h-7 w-7 text-[#d9f23b]" />
                <p className="mt-8 text-[10px] font-black uppercase tracking-[.18em] text-[#d9f23b]">
                  área informada
                </p>
                <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Delivery em Araucária.
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-white/65">
                  Informe o endereço no pedido para confirmar o próximo passo da entrega.
                </p>
              </div>

              <aside className="flex flex-col justify-between bg-[#9b4d9b] p-7 sm:p-9">
                <div>
                  <Sparkles className="h-7 w-7 text-[#d9f23b]" />
                  <h3 className="mt-6 font-display text-3xl font-black">
                    Copão para você. Litrão para dividir.
                  </h3>
                  <p className="mt-4 leading-7 text-white/70">
                    Escolha a intenção do pedido e detalhe a preferência no próprio funil.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
                  <span><Check className="mr-1 inline h-4 w-4 text-[#d9f23b]" />Araucária</span>
                  <span><Check className="mr-1 inline h-4 w-4 text-[#d9f23b]" />Entrega</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="pedido" className="bg-[#d9f23b] px-5 py-14 text-[#2d0f44] lg:px-8 lg:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#624074]">
                próximo passo
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                Escolha o tamanho. Conte a preferência. Informe o endereço.
              </h2>
            </div>

            <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#2d0f44] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#4d1769]">
              Abrir meu pedido
              <ArrowRight className="h-4 w-4" />
            </CTA>
          </div>
        </section>
      </main>

      <footer className="bg-[#1f0a30] px-5 py-8 text-sm text-white/60 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">
              Açaí <span className="text-[#d9f23b]">Total Araucária</span>
            </p>
            <p className="mt-1">Copões, litrões e delivery.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#d9f23b]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="acai-total-araucaria"
        eyebrow="Açaí Total · Araucária"
        title="Um copão caprichado deixa o dia melhor."
        description="Escolha seu pedido e receba em casa."
        ctaLabel="Montar pedido"
        ctaHref="#pedido"
        delayMs={9000}
        className="border-[#d9f23b]/40 bg-[#2d0f44]/95 text-white"
        accentClassName="text-[#d9f23b]"
      />
      <PortfolioUpsellPopup pageName="portfolio-acai-total-araucaria" />
    </div>
  );
}
