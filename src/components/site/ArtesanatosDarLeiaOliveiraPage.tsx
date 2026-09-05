import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, Coffee, Droplets, Instagram, Recycle, Scissors } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = {
  services: [
    "Coador de café 100% algodão",
    "Escolher uma estampa",
    "Presente artesanal",
    "Quero conhecer outros artesanatos",
  ],
  experienceOptions: ["Para minha casa", "Para presentear", "Quero encomendar", "Ainda estou conhecendo"],
  periodOptions: ["Quero combinar a entrega", "Vou retirar", "Preciso consultar", "Ainda não sei"],
  timingOptions: ["O quanto antes", "Nesta semana", "Estou pesquisando", "Quero combinar"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você gostaria de conhecer?",
    experience: "Como pretende usar?",
    period: "Como prefere receber?",
    timing: "Quando você precisa?",
    note: "Conte os detalhes",
  },
  notePlaceholder: "Ex.: cor, estampa, quantidade ou ocasião do presente.",
};

function CTA({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="artesanatos-darleia-oliveira"
      studioName="Artesanatos Darléia Oliveira"
      recipientName="Darléia"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      ariaLabel="Falar com Artesanatos Darléia Oliveira"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border-2 border-[#3e241d] bg-[#bd355d] px-6 py-3.5 font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#a5284e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd355d] ${className}`}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

/** Ritual em três tempos — trilho vertical numerado (assinatura da página). */
const ritual: Array<[string, string, string]> = [
  ["Molhe", "Passe água quente no algodão antes do pó. O tecido abre e o café rende mais aroma.", "01"],
  ["Coe", "O algodão retém o resíduo e deixa passar o óleo natural do grão — corpo e doçura na xícara.", "02"],
  ["Lave", "Enxágue sem sabão, deixe secar. O mesmo coador acompanha a casa por muito tempo.", "03"],
];

/** Ficha técnica em formato de rótulo — sem cards. */
const ficha: Array<[string, string]> = [
  ["Material", "Tecido 100% algodão"],
  ["Produção", "Costura e acabamento feitos à mão"],
  ["Uso", "Reutilizável e lavável"],
  ["Acabamento", "Estampas e barrados variados"],
  ["Entrega", "Retirada ou entrega combinada no atendimento"],
];

export function ArtesanatosDarLeiaOliveiraPage() {
  return (
    <div className="min-h-dvh bg-[#fff8ef] text-[#3e241d]">
      <header className="border-b-2 border-[#3e241d] bg-[#fff8ef] px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Artesanatos Darléia Oliveira" className="shrink-0">
            <PortfolioImage
              managedField="logoUrl"
              priority
              src="/images/artesanatos-darleia-oliveira/logo.png"
              alt="Artesanatos Darléia Oliveira"
              width={1280}
              height={1280}
              decoding="async"
              className="h-11 w-auto max-w-[170px] object-contain"
            />
          </a>
          <p className="hidden text-xs font-semibold uppercase tracking-[.3em] text-[#8d2345] sm:block">
            Ateliê de coadores de algodão
          </p>
          <a href="#encomenda" className="text-sm font-semibold uppercase tracking-[.14em] underline underline-offset-4 hover:text-[#bd355d]">
            Encomendar
          </a>
        </div>
      </header>

      <main>
        {/* HERO: painel fotográfico com rótulo de papel sobreposto (sem grade 2 colunas). */}
        <section id="inicio" className="relative">
          <PortfolioImage
            src="/images/artesanatos-darleia-oliveira/hero.png"
            alt="Coador de café de algodão Artesanatos Darléia Oliveira"
            priority
            width={853}
            height={1280}
            className="h-[62vh] min-h-[22rem] w-full object-cover object-center sm:h-[70vh]"
            managedField="heroImageUrl"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2e1b17]/10 via-transparent to-[#fff8ef]" />
          <div className="mx-auto -mt-24 max-w-3xl px-5 pb-14 lg:px-8">
            <div className="relative border-2 border-[#3e241d] bg-[#fff8ef] px-6 py-8 shadow-[10px_10px_0_0_#e5b58b] sm:px-10 sm:py-10">
              <span className="absolute -top-3 left-6 bg-[#bd355d] px-3 py-1 text-[.7rem] font-bold uppercase tracking-[.22em] text-white">
                Feito à mão
              </span>
              <h1 className="font-serif text-4xl font-semibold leading-[1.02] sm:text-6xl">
                <ManagedText field="heroHeadline" fallback={"Seu caf\u00e9 merece o melhor filtro."} />
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#6d4a3e]">
                <ManagedText
                  field="heroSubheadline"
                  fallback={"Coador de caf\u00e9 100% algod\u00e3o, reutiliz\u00e1vel e feito \u00e0 m\u00e3o para transformar cada x\u00edcara em um momento de aconchego."}
                />
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CTA>Encomendar o meu <ArrowRight className="h-4 w-4" /></CTA>
                <a href="#ritual" className="text-sm font-semibold uppercase tracking-[.14em] underline underline-offset-4 hover:text-[#bd355d]">
                  Como se usa
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trilho numerado do ritual — composição vertical, sem grade de cards. */}
        <section id="ritual" className="bg-[#f3dfca] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[.3em] text-[#8d2345]">O ritual</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Três tempos entre a água e a xícara.</h2>
            <ol className="mt-10 border-l-2 border-[#c98c77]">
              {ritual.map(([title, text, index]) => (
                <li key={title} className="relative py-6 pl-8 sm:pl-12">
                  <span className="absolute -left-[.9rem] top-7 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#3e241d] bg-[#fff8ef] text-[.7rem] font-bold">
                    {index}
                  </span>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[#6d4a3e]">{text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-[#6d4a3e]">
              <span className="inline-flex items-center gap-2"><Droplets className="h-4 w-4 text-[#bd355d]" />Café mais limpo</span>
              <span className="inline-flex items-center gap-2"><Recycle className="h-4 w-4 text-[#bd355d]" />Sem filtro descartável</span>
              <span className="inline-flex items-center gap-2"><Scissors className="h-4 w-4 text-[#bd355d]" />Costura artesanal</span>
            </p>
          </div>
        </section>

        {/* Ficha técnica em linhas — não repete o padrão de cards do portfólio. */}
        <section id="ficha" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end justify-between gap-4 border-b-2 border-[#3e241d] pb-4">
              <h2 className="font-serif text-3xl sm:text-4xl">Ficha do produto</h2>
              <Coffee className="h-8 w-8 text-[#bd355d]" />
            </div>
            <dl className="divide-y divide-[#e1c2aa]">
              {ficha.map(([term, value]) => (
                <div key={term} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8">
                  <dt className="w-40 shrink-0 text-xs font-bold uppercase tracking-[.22em] text-[#8d2345]">{term}</dt>
                  <dd className="leading-7 text-[#6d4a3e]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Encomenda: bloco de papel, alinhado à esquerda, sem faixa colorida cheia. */}
        <section id="encomenda" className="px-5 pb-20 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 border-2 border-[#3e241d] bg-[#4a2921] px-7 py-10 text-[#fff8ef] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#f2bd9d]">Encomenda</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Escolha a estampa e combine com a artesã.</h2>
              <p className="mt-3 max-w-lg leading-7 text-[#f3dfca]">
                Conte a ocasião, a estampa ou a quantidade. Disponibilidade e entrega são confirmadas no atendimento.
              </p>
            </div>
            <CTA className="border-[#f2bd9d]">Falar com Darléia <ArrowRight className="h-4 w-4" /></CTA>
          </div>
          <p className="mx-auto mt-6 flex max-w-4xl items-center gap-2 text-sm font-semibold text-[#6d4a3e]">
            <Instagram className="h-4 w-4 text-[#bd355d]" />
            <a href="https://www.instagram.com/darleia__artesanatos" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#bd355d]">
              Novidades e encomendas no Instagram
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t-2 border-[#3e241d] bg-[#fff8ef] px-5 py-8 text-sm text-[#6d4a3e] lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-[#3e241d]">Artesanatos Darléia Oliveira</p>
            <p className="mt-1">Coador de café 100% algodão, feito à mão. Atendimento e entrega a combinar.</p>
          </div>
          <PortfolioHostCredit linkClassName="font-semibold text-[#3e241d] underline underline-offset-4 hover:text-[#bd355d]" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="artesanatos-darleia-oliveira"
        eyebrow="Artesanato feito à mão"
        title="Seu café merece um momento de aconchego."
        description="Coador de café 100% algodão, reutilizável e artesanal."
        ctaLabel="Ver a ficha"
        ctaHref="#ficha"
        delayMs={9000}
        className="border-[#bd355d]/45 bg-[#4a2921]/95 text-white"
        accentClassName="text-[#f2bd9d]"
      />
      <PortfolioUpsellPopup pageName="portfolio-artesanatos-darleia-oliveira" />
    </div>
  );
}
