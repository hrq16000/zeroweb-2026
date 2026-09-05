import { ManagedText } from "@/components/portfolio/ManagedText";
import { Car, Sofa } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionCounter, MotionImageReveal, MotionReveal } from "@/components/motion";

const surfaces = [
  { item: "Sofá", detail: "Tecido e couro, dos assentos às laterais.", group: "Residencial" },
  { item: "Colchão", detail: "Solteiro, casal e camas infantis.", group: "Residencial" },
  { item: "Cadeira", detail: "Poltronas de sala e cadeiras de escritório.", group: "Residencial" },
  { item: "Tapete e carpete", detail: "Peças soltas e áreas maiores da casa.", group: "Residencial" },
  { item: "Puff e divã", detail: "Estofados menores que acumulam uso diário.", group: "Residencial" },
  { item: "Interior automotivo", detail: "Bancos, forro e demais superfícies do carro.", group: "Automotiva" },
] as const;

export function LjCleaningPage() {
  return (
    <div className="min-h-dvh bg-[#f6f9fc] text-[#0a2d5c]">
      <div className="h-1.5 w-full bg-[#f2621f]" />
      <header className="sticky top-0 z-20 border-b border-[#d7e3f0] bg-[#f6f9fc]/95 px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="L&J Cleaning" className="shrink-0">
            <PortfolioImage managedField="logoUrl" priority src="/images/lj-cleaning/logo.png" alt="L&J Cleaning" width={768} height={256} decoding="async" className="h-11 w-auto" />
          </a>
          <nav className="hidden gap-6 text-sm font-semibold md:flex">
            <a href="#superficies" className="hover:text-[#f2621f]">O que higienizamos</a>
            <a href="#atendimento" className="hover:text-[#f2621f]">Atendimento</a>
            <a href="#orcamento" className="hover:text-[#f2621f]">Orçamento</a>
          </nav>
          <FunnelCTAButton clientKey="lj-cleaning" companySlug="lj-cleaning" formSlug="funnel-lj-cleaning" location="lj_header" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0a2d5c] px-5 py-2.5 text-sm font-bold text-white">
            Solicitar orçamento
          </FunnelCTAButton>
        </div>
      </header>

      <main>
        <section id="inicio" className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#f2621f]">Higienização residencial e automotiva</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <MotionReveal as="h1" variant="mask" intensity="SUBTLE" className="max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
                <ManagedText field="heroHeadline" fallback={"Limpamos, higienizamos e cuidamos do seu conforto."} />
              </MotionReveal>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5b7899]">
                <ManagedText field="heroSubheadline" fallback={"Higieniza\u00e7\u00e3o de sof\u00e1s, cadeiras, colch\u00f5es, tapetes, carpetes, puffs e interiores automotivos, com atendimento sob medida."} />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <FunnelCTAButton clientKey="lj-cleaning" companySlug="lj-cleaning" formSlug="funnel-lj-cleaning" location="lj_hero" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f2621f] px-6 py-3 font-bold text-white">
                  Quero higienizar
                </FunnelCTAButton>
                <a href="#superficies" className="inline-flex min-h-12 items-center rounded-full border border-[#9dbbd8] px-6 py-3 font-semibold text-[#0a2d5c]">Ver o que higienizamos</a>
              </div>
            </div>
            <MotionImageReveal intensity="SUBTLE" direction="left" className="rounded-2xl">
            <PortfolioImage
              src="/images/lj-cleaning/cena.png"
              alt="Matriz de superfícies higienizadas pela L&J Cleaning: sofá, colchão, cadeira, tapete, puff e interior automotivo"
              priority
              width={1200}
              height={1200}
              className="w-full rounded-2xl border border-[#d7e3f0]"
              managedField="heroImageUrl"
            />
            </MotionImageReveal>
          </div>
        </section>

        <section id="superficies" className="border-y border-[#d7e3f0] bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.28em] text-[#f2621f]">Matriz de superfícies</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">Item por item, com o cuidado que cada superfície pede.</h2>
              </div>
              <div className="flex gap-3 text-sm font-semibold text-[#5b7899]">
                <span className="inline-flex items-center gap-2"><Sofa className="h-4 w-4 text-[#0a2d5c]" aria-hidden="true" />Residencial</span>
                <span className="inline-flex items-center gap-2"><Car className="h-4 w-4 text-[#0a2d5c]" aria-hidden="true" />Automotiva</span>
              </div>
            </div>
            <ul className="mt-10 divide-y divide-[#e2eaf2] border-y border-[#e2eaf2]">
              {surfaces.map(({ item, detail, group }, i) => (
                <MotionReveal key={item} as="li" variant="right" intensity="SUBTLE" delay={i * 60} className="grid gap-2 py-6 sm:grid-cols-[minmax(0,14rem)_1fr_auto] sm:items-baseline sm:gap-6">
                  <span className="text-xl font-black">{item}</span>
                  <span className="leading-7 text-[#5b7899]">{detail}</span>
                  <span className="justify-self-start rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0a2d5c] sm:justify-self-end">{group}</span>
                </MotionReveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="atendimento" className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#f2621f]">Atendimento</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Um pedido claro rende um orçamento certo.</h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {[["Descreva o item", "Informe qual superfície precisa de higienização e o tamanho dela."], ["Receba orientação", "A equipe organiza o atendimento conforme a sua necessidade."], ["Combine o serviço", "Defina os próximos passos pelo canal de atendimento."]].map(([title, text], index) => (
                <li key={title} className="rounded-2xl border border-[#d7e3f0] bg-white p-6 transition-shadow duration-300 hover:shadow-[0_12px_30px_-18px_rgba(10,45,92,.6)]">
                  <span className="text-sm font-black uppercase tracking-widest text-[#f2621f]">
                    Passo <MotionCounter value={index + 1} />
                  </span>
                  <h3 className="mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-2 leading-7 text-[#5b7899]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="orcamento" className="bg-[#0a2d5c] px-5 py-16 text-white lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.28em] text-[#ff9a6d]">Seu conforto de volta</p>
              <h2 className="mt-3 text-3xl font-black">Solicite um orçamento.</h2>
              <p className="mt-3 max-w-xl leading-7 text-white/80">Conte qual sofá, colchão, tapete ou interior automotivo precisa de cuidado.</p>
            </div>
            <FunnelCTAButton clientKey="lj-cleaning" companySlug="lj-cleaning" formSlug="funnel-lj-cleaning" location="lj_footer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f2621f] px-7 py-3 font-bold text-white">
              Falar com a L&J
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      <footer className="bg-[#06203f] px-5 py-8 text-sm text-[#c2d8ee] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p><strong className="text-white">L&J Cleaning</strong><br />Higienização residencial e automotiva · São José dos Pinhais — PR</p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup clientKey="lj-cleaning" eyebrow="L&J Cleaning" title="Seu conforto merece um cuidado completo." description="Higienização de sofás, automotiva, colchões, tapetes e outros itens." ctaLabel="Ver serviços" ctaHref="#superficies" delayMs={9000} className="border-[#f2621f]/35 bg-[#06203f]/95 text-white" accentClassName="text-[#ff9a6d]" />
      <PortfolioUpsellPopup pageName="portfolio-lj-cleaning" />
    </div>
  );
}
