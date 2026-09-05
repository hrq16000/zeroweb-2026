import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, Gift, MapPin, PenLine, Truck } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal } from "@/components/motion";

const quiz = {
  services: [
    "Kit promocional: caneca + azulejo",
    "Caneca de cerâmica personalizada",
    "Azulejo personalizado 15x15 cm",
    "Quero conhecer outras opções",
  ],
  experienceOptions: ["Para presentear", "Para minha casa", "Para uma data especial", "Ainda estou escolhendo"],
  periodOptions: ["Quero combinar a entrega", "Vou retirar", "Preciso consultar", "Ainda não sei"],
  timingOptions: ["O quanto antes", "Nesta semana", "Estou pesquisando", "Quero combinar"],
  proposalKind: "service" as const,
  stepTitles: {
    service: "O que você gostaria de personalizar?",
    experience: "Qual é a ocasião?",
    period: "Como prefere receber?",
    timing: "Quando você precisa?",
    note: "Conte os detalhes",
  },
  notePlaceholder: "Ex.: frase, imagem, cores, quantidade ou data do presente.",
};

function CTA({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <PortfolioCTAQuiz
      clientKey="thays-camilla"
      studioName="Thays Camilla"
      recipientName="Thays Camilla"
      theme="pink"
      mode="proposal"
      quizConfig={quiz}
      ariaLabel="Falar com Thays Camilla"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e87859] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#e87859]/25 transition hover:-translate-y-0.5 hover:bg-[#d6654a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87859] ${className}`}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

/** As duas peças do kit, apresentadas lado a lado com divisor — assinatura da página. */
const pecas: Array<[string, string, string]> = [
  ["Caneca de cerâmica", "Estampa nítida em volta inteira, pronta para o café de todo dia.", "Peça 1"],
  ["Azulejo 15x15 cm", "Para apoiar na parede, na bancada ou entregar como quadrinho.", "Peça 2"],
];

const passos: Array<[string, string, typeof PenLine]> = [
  ["Você envia a ideia", "Uma frase, uma foto, um nome ou uma data — o que quiser eternizar.", PenLine],
  ["A arte é combinada", "Cores e disposição são ajustadas com você antes da produção.", Gift],
  ["Chega pronto para presentear", "Embalagem cuidadosa; retirada ou entrega combinada no atendimento.", Truck],
];

export function ThaysCamillaPage() {
  return (
    <div className="min-h-dvh bg-[#fff9f4] text-[#3f2117]">
      <header className="px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          <a href="#inicio" aria-label="Thays Camilla Personalizados">
            <PortfolioImage
              managedField="logoUrl"
              priority
              src="/images/thays-camilla/logo.png"
              alt="Thays Camilla Personalizados"
              width={1536}
              height={1024}
              decoding="async"
              className="h-14 w-auto max-w-[210px] object-contain"
            />
          </a>
          <p className="text-[.7rem] font-bold uppercase tracking-[.4em] text-[#d6654a]">Presentes personalizados</p>
        </div>
      </header>

      <main>
        {/* HERO centralizado com etiqueta de presente pendurada — sem grade 2 colunas. */}
        <section id="inicio" className="px-5 pb-16 pt-4 text-center lg:px-8">
          <div className="mx-auto max-w-3xl">
            <MotionReveal as="h1" variant="down" intensity="BALANCED" className="mx-auto max-w-2xl font-serif text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl">
              <ManagedText field="heroHeadline" fallback={"Personalize carinho em cada detalhe."} />
            </MotionReveal>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#704738]">
              <ManagedText
                field="heroSubheadline"
                fallback={"Canecas e azulejos personalizados para transformar uma mensagem, uma imagem ou uma lembran\u00e7a em presente."}
              />
            </p>
          </div>
          <div className="relative mx-auto mt-10 max-w-2xl">
            <MotionImageReveal intensity="BALANCED" direction="up" className="rounded-[2.5rem]">
            <PortfolioImage
              src="/images/thays-camilla/hero.png"
              alt="Kit de caneca e azulejo personalizados Thays Camilla"
              priority
              width={1280}
              height={1280}
              className="mx-auto w-full rounded-[2.5rem] border-8 border-white object-cover shadow-[0_30px_60px_-25px_rgba(142,76,55,.5)]"
              managedField="heroImageUrl"
            />
            </MotionImageReveal>
            <MotionReveal variant="down" intensity="BALANCED" delay={240} className="mx-auto -mt-8 w-fit rotate-[-2deg] rounded-2xl bg-[#4b271d] px-6 py-4 text-[#fff9f4] shadow-xl">
              <p className="text-[.68rem] font-bold uppercase tracking-[.28em] text-[#f5b39a]">Kit promocional informado</p>
              <p className="mt-1 font-serif text-3xl">R$ 59,90</p>
              <p className="text-xs text-[#edc6b4]/80">caneca + azulejo 15x15 cm</p>
            </MotionReveal>
          </div>
          <div className="mt-10">
            <CTA>Montar meu presente <ArrowRight className="h-4 w-4" /></CTA>
          </div>
        </section>

        {/* Duas peças, lado a lado com divisor central — não é grade de 3 cards. */}
        <section id="kit" className="border-y border-[#f1d8ca] bg-[#f8e4d8] px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-2 sm:divide-x sm:divide-[#dfae95]">
            {pecas.map(([title, text, tag], index) => (
              <MotionReveal key={title} variant={index === 1 ? "right" : "left"} intensity="BALANCED" delay={index * 130} className={index === 1 ? "sm:pl-10" : "sm:pr-10"}>
                <p className="text-[.7rem] font-bold uppercase tracking-[.28em] text-[#d6654a]">{tag}</p>
                <h2 className="mt-3 font-serif text-3xl">{title}</h2>
                <p className="mt-3 leading-7 text-[#704738]">{text}</p>
              </MotionReveal>
            ))}
          </div>
        </section>

        {/* Três passos em faixa horizontal com numeração corrida. */}
        <section id="como-funciona" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-serif text-3xl sm:text-4xl">Do seu jeito, em três passos.</h2>
            <div className="mt-10 space-y-4">
              {passos.map(([title, text, Icon], index) => (
                <div key={title} className="flex items-start gap-5 rounded-full border border-[#f1d8ca] bg-white/70 px-6 py-5">
                  <span className="mt-1 font-serif text-3xl text-[#e0b8a5]">{index + 1}</span>
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-[#4b271d]">
                      <Icon className="h-4 w-4 text-[#d6654a]" />
                      {title}
                    </h3>
                    <p className="mt-1 leading-7 text-[#704738]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fechamento centralizado em cartão claro. */}
        <section id="pedido" className="px-5 pb-20 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-[#edb49c] bg-[#fff9f4] px-8 py-12 text-center shadow-sm">
            <Gift className="mx-auto h-9 w-9 text-[#d6654a]" />
            <h2 className="mt-5 font-serif text-3xl sm:text-4xl">Vamos criar o seu?</h2>
            <p className="mx-auto mt-4 max-w-md leading-8 text-[#704738]">
              Conte a mensagem, a imagem ou a ocasião. Arte final, disponibilidade e entrega são combinadas no atendimento.
            </p>
            <div className="mt-8">
              <CTA>Falar com Thays Camilla <ArrowRight className="h-4 w-4" /></CTA>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#2e1914] px-5 py-8 text-sm text-[#f0cbbb] lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          <p className="font-bold text-[#fff9f4]">Thays Camilla</p>
          <p className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#f5b39a]" />
            Caneca e azulejo personalizados · atendimento e entrega a combinar.
          </p>
          <PortfolioHostCredit linkClassName="font-semibold text-[#fff9f4] underline underline-offset-4 hover:text-white" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="thays-camilla"
        eyebrow="Thays Camilla Personalizados"
        title="Personalize carinho em cada detalhe."
        description="Caneca e azulejo para presentear com uma história sua."
        ctaLabel="Ver o kit"
        ctaHref="#kit"
        delayMs={9000}
        className="border-[#e87859]/45 bg-[#4b271d]/95 text-white"
        accentClassName="text-[#f5b39a]"
      />
      <PortfolioUpsellPopup pageName="portfolio-thays-camilla" />
    </div>
  );
}
