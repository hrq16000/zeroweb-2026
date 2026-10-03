import { MotionReveal, MotionScope } from "@/components/motion";
import { ArrowRight, Heart } from "lucide-react";
import { PortfolioCTAQuiz } from "@/components/site/BeautyBookingQuiz";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

const quiz = { services: ["Alongamento em gel", "Reconstrução de unhas", "Pedicure tradicional", "Pedicure em gel", "Cuidados podológicos", "Combo mãos e pés"], experienceOptions: ["Primeiro alongamento", "Quero fazer manutenção", "Estou buscando reconstrução", "Quero combinar cuidados"], periodOptions: ["Manaus e região", "Vou confirmar a cidade", "Vou confirmar o endereço"], timingOptions: ["Quero agendar em breve", "Estou planejando", "Quero consultar horários"], proposalKind: "service" as const, stepTitles: { service: "Qual cuidado você procura?", experience: "Como podemos ajudar?", period: "Onde será o atendimento?", timing: "Quando prefere?", note: "Conte sua preferência" }, notePlaceholder: "Ex.: formato, comprimento, cor, sensibilidade ou horário ideal." };

function CTA({ children, block }: { children: React.ReactNode; block?: boolean }) {
  return (
    <PortfolioCTAQuiz
      clientKey="espaco-cih-luh"
      studioName="Espaço CIH & LUH"
      recipientName="Cih e Luh"
      theme="gold"
      mode="proposal"
      quizConfig={quiz}
      className={`${block ? "flex w-full" : "inline-flex"} min-h-12 items-center justify-center gap-2 rounded-none border border-[#cda85a] bg-[#cda85a] px-6 py-3.5 text-sm font-bold uppercase tracking-[.18em] text-[#101a38] transition hover:bg-transparent hover:text-[#cda85a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cda85a]`}
    >
      {children}
    </PortfolioCTAQuiz>
  );
}

// Cartela de esmaltes: cada cuidado é uma faixa horizontal com amostra de cor.
const swatches: Array<[string, string, string]> = [
  ["Alongamento em gel", "Estrutura elegante e resistente para alongar, reconstruir e valorizar suas mãos.", "#c9a7ff"],
  ["Cuidados da Luh", "Alongamentos, reconstruções e cuidados personalizados para suas unhas.", "#f2b5c4"],
  ["Cuidados da Cih", "Pedicure tradicional, em gel e cuidados podológicos para pés bem cuidados.", "#9ab8ff"],
  ["Combo mãos + pés", "Uma experiência completa para elevar sua autoestima em cada detalhe.", "#cda85a"],
];

export function EspacoCihLuhPage() {
  return (
    <MotionScope intensity="BALANCED">
    <div className="min-h-dvh bg-[#0b1024] text-[#f3efe6]">
      <div className="lg:flex">
        {/* Coluna de marca fixa — eixo vertical, sem hero dividido. */}
        <aside className="z-30 border-b border-[#cda85a]/25 bg-[#0b1024] px-5 py-5 lg:sticky lg:top-0 lg:h-dvh lg:w-[19rem] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="flex items-center justify-between gap-4 lg:h-full lg:flex-col lg:items-start">
            <a href="#inicio" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center border border-[#cda85a]/60 text-[#cda85a]">
                <Heart className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold leading-tight">
                Espaço
                <br className="hidden lg:block" /> CIH <span className="text-[#cda85a]">& LUH</span>
              </span>
            </a>
            <p className="hidden max-w-[16rem] text-sm leading-6 text-[#a9b0c9] lg:mt-10 lg:block">
              O casal das unhas. Luh nas mãos, Cih nos pés, um atendimento em dupla do começo ao fim.
            </p>
            <nav className="hidden flex-col gap-3 text-sm font-semibold uppercase tracking-[.16em] text-[#a9b0c9] lg:mt-10 lg:flex">
              <a href="#servicos" className="hover:text-[#cda85a]">Cartela de cuidados</a>
              <a href="#experiencia" className="hover:text-[#cda85a]">A dupla</a>
              <a href="#oferta" className="hover:text-[#cda85a]">Oferta</a>
            </nav>
            <div className="lg:mt-auto lg:w-full">
              <CTA>Garantir vaga <ArrowRight className="h-4 w-4" /></CTA>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {/* Abertura empilhada: título sobre fundo sólido, arte da promoção emoldurada abaixo. */}
          <section id="inicio" className="px-5 pt-12 lg:px-12 lg:pt-16">
            <MotionReveal as="h1" variant="mask" intensity="EXPRESSIVE" className="max-w-3xl font-display text-4xl font-bold leading-[1.02] sm:text-6xl">
              Mãos que transformam. <span className="text-[#cda85a]">Pés que sustentam.</span>
            </MotionReveal>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#d6dbef]">
              Cih e Luh cuidam da sua beleza, saúde e autoestima com técnicas de unhas, pedicure e atenção em cada
              atendimento.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <CTA>Agendar meu cuidado <ArrowRight className="h-4 w-4" /></CTA>
              <a
                href="#servicos"
                className="inline-flex min-h-12 items-center border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-[.16em] text-white hover:bg-white/10"
              >
                Ver a cartela
              </a>
            </div>
            <div className="mt-10 border border-[#cda85a]/30 bg-[#101a38] p-3">
              <PortfolioImage
                src="/images/espaco-cih-luh/promocao.webp"
                alt="Oferta de alongamento em gel do Espaço CIH e LUH"
                priority
                width={1200}
                height={1400}
                className="mx-auto max-h-[34rem] w-full object-contain"
                managedField="heroImageUrl"
              />
            </div>
          </section>


          <section id="servicos" className="px-5 py-16 lg:px-12 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#cda85a]">Cartela de cuidados</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Beleza, saúde e autoestima em uma experiência só.
            </h2>
            <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {swatches.map(([title, text, tone], i) => (
                <MotionReveal as="li" variant="left" delay={i * 90} key={title} className="flex flex-col gap-4 py-6 transition-colors duration-200 hover:bg-white/[.04] sm:flex-row sm:items-center sm:gap-8">
                  <span
                    aria-hidden
                    className="h-12 w-12 shrink-0 rounded-full ring-1 ring-white/25"
                    style={{ backgroundColor: tone }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl font-bold">{title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-[#a9b0c9]">{text}</p>
                  </div>
                </MotionReveal>
              ))}
            </ul>
          </section>

          <section id="experiencia" className="border-t border-white/10 px-5 py-16 lg:px-12 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.28em] text-[#cda85a]">Luh · mãos</p>
                <h2 className="mt-4 font-display text-3xl font-bold">Alongamento, reconstrução e manutenção.</h2>
                <p className="mt-4 leading-8 text-[#a9b0c9]">
                  Luh cuida das mãos com alongamentos e reconstruções, sempre respeitando o formato e a rotina de cada
                  cliente.
                </p>
              </div>
              <div className="lg:border-l lg:border-white/10 lg:pl-10">
                <p className="text-xs font-bold uppercase tracking-[.28em] text-[#cda85a]">Cih · pés</p>
                <h2 className="mt-4 font-display text-3xl font-bold">Pedicure e cuidado podológico.</h2>
                <p className="mt-4 leading-8 text-[#a9b0c9]">
                  Cih cuida dos pés com pedicure tradicional, em gel e atenção podológica, num atendimento acolhedor e
                  personalizado.
                </p>
              </div>
            </div>
          </section>

          {/* Oferta como bilhete numerado, não como faixa de CTA. */}
          <section id="oferta" className="px-5 pb-20 lg:px-12">
            <div className="border border-dashed border-[#cda85a]/60 bg-[#101a38] p-7 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[.28em] text-[#cda85a]">
                Oferta especial · 10 primeiras clientes
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Alongamento em gel com 10% OFF.</h2>
              <p className="mt-3 max-w-xl leading-7 text-[#d6dbef]">De R$ 160 por R$ 144. São apenas 10 vagas promocionais.</p>
              <div className="mt-7 max-w-xs">
                <CTA block>Garantir minha vaga <ArrowRight className="h-4 w-4" /></CTA>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 px-5 py-8 text-sm text-[#a9b0c9] lg:px-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-white">Espaço <span className="text-[#cda85a]">CIH & LUH</span></p>
                <p className="mt-1">O casal das unhas · beleza em cada detalhe.</p>
              </div>
              <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4 hover:text-[#cda85a]" />
            </div>
          </footer>
        </main>
      </div>

      <PortfolioSocialProofPopup
        clientKey="espaco-cih-luh"
        eyebrow="CIH & LUH · O casal das unhas"
        title="Mãos que transformam, pés que sustentam seus passos."
        description="Escolha seu cuidado e receba orientação para garantir um horário."
        ctaLabel="Ver serviços"
        ctaHref="#servicos"
        delayMs={9000}
        className="border-[#cda85a]/40 bg-[#101a38]/95 text-white"
        accentClassName="text-[#cda85a]"
      />
      <PortfolioUpsellPopup pageName="portfolio-espaco-cih-luh" />
    </div>
    </MotionScope>
  );
}
