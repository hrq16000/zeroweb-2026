import {
  ArrowRight,
  Check,
  Gift,
  MapPin,
  PackageSearch,
  PenTool,
  Puzzle,
  Sparkles,
  Watch,
} from "lucide-react";
import type { ReactNode } from "react";
import { MotionReveal, MotionScope } from "@/components/motion";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";

const quizConfig = {
  services: [
    "Brinquedos e artigos recreativos",
    "Papelaria",
    "Armarinho",
    "Doces, balas e bombons",
    "Joalheria e relojoaria",
    "Quero ajuda para encontrar um presente",
  ],
  experienceOptions: [
    "Presente para criança",
    "Presente para adulto",
    "Material de papelaria",
    "Item para uso do dia a dia",
    "Ainda estou escolhendo",
  ],
  periodOptions: [
    "Quero retirar na loja",
    "Quero confirmar se tem disponível",
    "Quero combinar antes de ir",
  ],
  timingOptions: ["Hoje", "Nesta semana", "Estou pesquisando"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você está procurando?",
    experience: "Para quem ou para qual necessidade?",
    period: "Como prefere seguir?",
    timing: "Para quando você precisa?",
    note: "Quer dar mais algum detalhe?",
  },
  notePlaceholder: "Ex.: idade, ocasião, faixa de preço, tipo de brinquedo ou item de papelaria.",
};

const categories = [
  {
    code: "C01",
    title: "Brinquedos",
    text: "A atividade principal registrada da filial é comércio varejista de brinquedos e artigos recreativos.",
    icon: Puzzle,
  },
  {
    code: "C02",
    title: "Papelaria",
    text: "O cadastro empresarial também contempla artigos de papelaria.",
    icon: PenTool,
  },
  {
    code: "C03",
    title: "Armarinho",
    text: "Itens de armarinho aparecem entre as atividades comerciais registradas.",
    icon: PackageSearch,
  },
  {
    code: "C04",
    title: "Doces e lembranças",
    text: "Doces, balas e bombons fazem parte das categorias secundárias cadastradas.",
    icon: Gift,
  },
  {
    code: "C05",
    title: "Acessórios",
    text: "Joalheria e relojoaria constam entre as atividades secundárias da empresa.",
    icon: Watch,
  },
] as const;

function CTA({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PortfolioCTAQuiz
      clientKey="cris-presentes-colonia-rio-grande"
      studioName="Cris Presentes · Colônia Rio Grande"
      recipientName="Cris Presentes"
      theme="gold"
      mode="proposal"
      funnelIntent="pedido"
      quizConfig={quizConfig}
      ariaLabel="Consultar produtos na Cris Presentes"
      className={className}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

export function CrisPresentesColoniaRioGrandePage() {
  return (
    <MotionScope intensity="BALANCED">
      <div className="min-h-dvh overflow-hidden bg-[#fff6dc] text-[#20213a]">
        <header className="border-b-2 border-[#20213a] bg-[#fff6dc] px-5 py-4 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <a href="#inicio" className="flex items-center gap-3">
              <PortfolioImage
                src="/images/cris-presentes-colonia-rio-grande/logo.svg"
                alt=""
                width={54}
                height={54}
                className="h-11 w-11"
              />
              <div>
                <p className="font-display text-lg font-black">Cris Presentes</p>
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#bd3e72]">
                  Colônia Rio Grande
                </p>
              </div>
            </a>

            <nav
              aria-label="Navegação Cris Presentes"
              className="hidden items-center gap-5 text-[10px] font-black uppercase tracking-[.14em] md:flex"
            >
              <a href="#encontre" className="hover:text-[#bd3e72]">Encontrar</a>
              <a href="#categorias" className="hover:text-[#bd3e72]">Categorias</a>
              <a href="#loja" className="hover:text-[#bd3e72]">Loja</a>
            </nav>

            <div className="justify-self-end">
              <CTA className="inline-flex min-h-10 items-center gap-2 border-2 border-[#20213a] bg-[#20213a] px-4 py-2.5 text-xs font-black uppercase tracking-[.08em] text-white transition hover:bg-[#bd3e72]">
                Encontrar um presente
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </div>
        </header>

        <main>
          <section id="inicio" className="px-5 py-7 lg:px-8 lg:py-10">
            <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[.78fr_1.22fr]">
              <aside className="flex min-h-[610px] flex-col justify-between border-2 border-[#20213a] bg-[#ffca62] p-7 sm:p-9 lg:p-10">
                <div>
                  <span className="inline-flex bg-[#bd3e72] px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-white">
                    loja local · São José dos Pinhais
                  </span>
                  <MotionReveal
                    as="h1"
                    variant="up"
                    className="mt-6 max-w-[9ch] font-display text-5xl font-black leading-[.88] tracking-[-.045em] sm:text-6xl lg:text-[5.7rem]"
                  >
                    Um presente começa por uma pista.
                  </MotionReveal>
                  <p className="mt-6 max-w-lg text-base leading-7 text-[#4f4560]">
                    Conte para quem é, o que você imagina e quando precisa. A página organiza a
                    consulta para a Cris Presentes sem inventar estoque, marca ou preço.
                  </p>
                </div>

                <div id="encontre" className="mt-10">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#7d3155]">
                    três pistas para começar
                  </p>
                  <div className="mt-4 divide-y divide-[#20213a]/20 border-y border-[#20213a]/20">
                    {[
                      ["01", "Para quem?", "criança, adulto ou uso próprio"],
                      ["02", "O que?", "brinquedo, papelaria, doce ou acessório"],
                      ["03", "Quando?", "hoje, nesta semana ou pesquisando"],
                    ].map(([n, title, detail]) => (
                      <div key={n} className="grid grid-cols-[2.5rem_5rem_1fr] gap-3 py-4 text-sm">
                        <span className="font-mono text-xs font-black">{n}</span>
                        <span className="font-black">{title}</span>
                        <span className="text-[#6d6077]">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <CTA className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-[#20213a] px-6 py-3.5 text-sm font-black text-white">
                  Começar consulta
                  <ArrowRight className="h-4 w-4" />
                </CTA>
              </aside>

              <figure className="relative m-0 min-h-[610px] overflow-hidden border-2 border-[#20213a] bg-[#fffaf8]">
                <PortfolioImage
                  src="/images/cris-presentes-colonia-rio-grande/hero.svg"
                  alt="Arte editorial da Cris Presentes com referências a brinquedos, papelaria e presentes"
                  width={1200}
                  height={1400}
                  priority
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 grid gap-3 border-t-2 border-[#20213a] bg-[#fff6dc]/95 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#bd3e72]">
                      filial 2
                    </p>
                    <p className="mt-1 font-black">Rua Pedro Trevisan, 58 · lojas 06 e 07</p>
                  </div>
                  <span className="text-xs font-bold text-[#6f6074]">Colônia Rio Grande</span>
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="categorias" className="border-y-2 border-[#20213a] bg-[#20213a] px-5 py-20 text-white lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[.31fr_.69fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#ffca62]">
                    corredor de categorias
                  </p>
                  <h2 className="mt-4 max-w-[9ch] font-display text-4xl font-black leading-[.92] sm:text-5xl">
                    Procure pela categoria, não por um estoque inventado.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                    As categorias abaixo vêm do cadastro comercial da filial. Disponibilidade e
                    condições são confirmadas diretamente pela loja.
                  </p>
                </div>

                <div className="border-t border-white/25">
                  {categories.map(({ code, title, text, icon: Icon }) => (
                    <article
                      key={code}
                      className="grid gap-5 border-b border-white/20 py-7 md:grid-cols-[4rem_1fr_auto] md:items-start"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-[#ffca62]">{code}</span>
                        <Icon className="h-5 w-5 text-[#ffca62] md:hidden" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <Icon className="hidden h-5 w-5 text-[#ffca62] md:block" />
                          <h3 className="font-display text-2xl font-black">{title}</h3>
                        </div>
                        <p className="mt-3 max-w-2xl leading-7 text-white/65">{text}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[.12em] text-[#f6b7d0]">
                        categoria registrada
                      </span>
                    </article>
                  ))}

                  <div className="grid gap-5 bg-[#bd3e72] p-6 sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="text-sm leading-6 text-white/80">
                      Não encontrou exatamente o que precisa? Descreva o item, ocasião ou faixa de
                      preço no atendimento.
                    </p>
                    <CTA className="inline-flex min-h-11 items-center gap-2 bg-[#fff6dc] px-5 py-3 text-sm font-black text-[#20213a]">
                      Consultar um item
                      <ArrowRight className="h-4 w-4" />
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="loja" className="px-5 py-20 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[.62fr_.38fr]">
              <figure className="m-0 overflow-hidden border-2 border-[#20213a] bg-white">
                <PortfolioImage
                  src="/images/cris-presentes-colonia-rio-grande/capa-card.svg"
                  alt="Composição editorial de presentes, brinquedos e papelaria da Cris Presentes"
                  width={1200}
                  height={900}
                  className="h-full min-h-[420px] w-full object-cover"
                />
              </figure>

              <div className="flex flex-col justify-between border-2 border-[#20213a] bg-[#f7bed4] p-7 sm:p-9">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#7d3155]">
                    ficha da unidade
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-black leading-[.94]">
                    Cris Presentes Filial 2.
                  </h2>
                  <p className="mt-5 leading-8 text-[#604d63]">
                    O registro empresarial público identifica a unidade na Rua Pedro Trevisan, 58,
                    lojas 06 e 07. O mesmo endereço corresponde ao Jacomar Colônia Rio Grande.
                  </p>
                </div>

                <dl className="mt-10 divide-y divide-[#20213a]/20 border-y border-[#20213a]/20">
                  {[
                    ["Cidade", "São José dos Pinhais — PR"],
                    ["Bairro", "Colônia Rio Grande"],
                    ["CEP", "83025-580"],
                  ].map(([term, value]) => (
                    <div key={term} className="grid grid-cols-[5rem_1fr] gap-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-[.12em] text-[#7d3155]">{term}</dt>
                      <dd className="text-sm font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section className="border-y-2 border-[#20213a] bg-[#69c6da] px-5 py-14 lg:px-8 lg:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <p className="text-[10px] font-black uppercase tracking-[.18em]">retirada / consulta</p>
                </div>
                <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-black leading-[.94] sm:text-5xl">
                  Confirme antes de ir. A loja responde com a disponibilidade real.
                </h2>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
                  <span><Check className="mr-1 inline h-4 w-4" />Item desejado</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Ocasião</span>
                  <span><Check className="mr-1 inline h-4 w-4" />Prazo</span>
                </div>
              </div>
              <CTA className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#20213a] px-6 py-3.5 text-sm font-black text-white">
                Verificar disponibilidade
                <ArrowRight className="h-4 w-4" />
              </CTA>
            </div>
          </section>
        </main>

        <footer className="bg-[#20213a] px-5 py-8 text-sm text-white/60 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong className="text-white">Cris Presentes · Colônia Rio Grande</strong>
              <br />
              Disponibilidade e condições confirmadas diretamente no atendimento.
            </p>
            <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
          </div>
        </footer>

        <PortfolioSocialProofPopup
          clientKey="cris-presentes-colonia-rio-grande"
          eyebrow="Cris Presentes"
          title="Procurando um presente e ainda não decidiu?"
          description="Conte para quem é e o que você imaginou. O funil organiza a consulta para a loja."
          ctaLabel="Quero ajuda para escolher"
          ctaHref="#encontre"
          delayMs={9000}
          className="border-[#ffca62]/35 bg-[#20213a]/95 text-white"
          accentClassName="text-[#ffca62]"
        />
      </div>
    </MotionScope>
  );
}
