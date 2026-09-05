import { ManagedText } from "@/components/portfolio/ManagedText";
import { CalendarDays, MapPin, PartyPopper, Users } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal } from "@/components/motion";

const attractions = [
  { n: "01", title: "Tobogã inflável", text: "A descida que vira o ponto alto da comemoração.", tone: "bg-[#e2231a] text-white", chip: "bg-white/20 text-white" },
  { n: "02", title: "Cama elástica", text: "Espaço para pular, gastar energia e brincar junto.", tone: "bg-[#0757c9] text-white", chip: "bg-white/20 text-white" },
  { n: "03", title: "Piscina de bolinhas", text: "Um canto colorido pensado para os menores.", tone: "bg-[#f3ae00] text-[#09265b]", chip: "bg-[#09265b]/15 text-[#09265b]" },
  { n: "04", title: "Monte seu kit", text: "Combine as atrações conforme o espaço e o público da festa.", tone: "bg-[#63d5ff] text-[#09265b]", chip: "bg-[#09265b]/15 text-[#09265b]" },
] as const;

const planning = [
  { icon: CalendarDays, label: "Data", text: "Dia e horário da comemoração." },
  { icon: MapPin, label: "Local", text: "Espaço disponível para montagem." },
  { icon: Users, label: "Público", text: "Quantidade e faixa etária da criançada." },
] as const;

export function GalileuLocacaoBrinquedosPage() {
  return (
    <div className="min-h-dvh bg-[#09265b] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#09265b]/95 px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#inicio" aria-label="Galileu Locação de Brinquedos" className="shrink-0">
            <PortfolioImage managedField="logoUrl" priority src="/images/galileu-locacao-brinquedos/logo.png" alt="Galileu Locação de Brinquedos" width={768} height={256} decoding="async" className="h-11 w-auto" />
          </a>
          <nav className="hidden gap-6 text-sm font-bold text-white/80 md:flex">
            <a href="#atracoes" className="hover:text-[#f3ae00]">Atrações</a>
            <a href="#planejamento" className="hover:text-[#f3ae00]">Planejamento</a>
            <a href="#orcamento" className="hover:text-[#f3ae00]">Orçamento</a>
          </nav>
          <FunnelCTAButton clientKey="galileu-locacao-brinquedos" companySlug="galileu-locacao-brinquedos" formSlug="funnel-galileu-locacao-brinquedos" location="galileu_header" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f3ae00] px-5 py-2.5 text-sm font-black text-[#09265b]">
            Pedir orçamento
          </FunnelCTAButton>
        </div>
      </header>

      <main>
        <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex rounded-full bg-[#f3ae00] px-4 py-1.5 text-xs font-black uppercase tracking-[.2em] text-[#09265b]">Locação de brinquedos · festas e eventos</p>
            <MotionReveal as="h1" variant="scale" intensity="EXPRESSIVE" className="mt-6 max-w-2xl text-5xl font-black leading-[.95] tracking-tight sm:text-7xl">
              <ManagedText field="heroHeadline" fallback={"Divers\u00e3o garantida para momentos inesquec\u00edveis."} />
            </MotionReveal>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#a9c6f5]">
              <ManagedText field="heroSubheadline" fallback={"Brinquedos coloridos para transformar festas em mem\u00f3rias alegres: tobog\u00e3 infl\u00e1vel, cama el\u00e1stica, piscina de bolinhas e muito mais."} />
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <FunnelCTAButton clientKey="galileu-locacao-brinquedos" companySlug="galileu-locacao-brinquedos" formSlug="funnel-galileu-locacao-brinquedos" location="galileu_hero" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f3ae00] px-6 py-3 font-black text-[#09265b]">
                Garantir diversão
              </FunnelCTAButton>
              <a href="#atracoes" className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 py-3 font-bold text-white">Ver atrações</a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-left">
              {planning.map(({ icon: Icon, label, text }, i) => (
                <MotionReveal key={label} variant="up" intensity="EXPRESSIVE" delay={200 + i * 110} className="group/plan rounded-2xl border border-white/15 bg-white/5 p-4">
                  <Icon className="h-5 w-5 text-[#63d5ff] transition-transform duration-300 group-hover/plan:-translate-y-1" aria-hidden="true" />
                  <dt className="mt-3 text-sm font-black uppercase tracking-widest text-[#f3ae00]">{label}</dt>
                  <dd className="mt-1 text-sm leading-6 text-[#a9c6f5]">{text}</dd>
                </MotionReveal>
              ))}
            </dl>
          </div>
          <MotionImageReveal intensity="EXPRESSIVE" direction="left" className="rounded-[2rem]">
          <PortfolioImage
            src="/images/galileu-locacao-brinquedos/cena.png"
            alt="Cartela de atrações Galileu: tobogã inflável, cama elástica, piscina de bolinhas e kit personalizado"
            priority
            width={1200}
            height={1200}
            className="w-full rounded-[2rem] border border-white/10 shadow-2xl shadow-black/30"
            managedField="heroImageUrl"
          />
          </MotionImageReveal>
        </section>

        <section id="atracoes" className="bg-[#f4f8ff] px-5 py-20 text-[#09265b] lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-black uppercase tracking-[.2em] text-[#0757c9]">Cartela de atrações</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-black">Cada brinquedo ocupa um espaço da festa.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {attractions.map(({ n, title, text, tone, chip }, i) => (
                <MotionReveal key={title} as="article" variant="up" intensity="EXPRESSIVE" delay={i * 110} className={`rounded-[1.75rem] p-7 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[-1deg] ${tone}`}>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black tracking-widest ${chip}`}>{n}</span>
                  <h3 className="mt-6 text-3xl font-black leading-tight">{title}</h3>
                  <p className="mt-3 text-base leading-7 opacity-85">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="planejamento" className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-[#f3ae00]">Planejamento</p>
              <h2 className="mt-3 text-4xl font-black">Do primeiro contato ao dia da festa.</h2>
              <p className="mt-4 max-w-md leading-7 text-[#a9c6f5]">Três informações bastam para montar a proposta das atrações.</p>
            </div>
            <ol className="grid gap-4">
              {[["Conte a data e o local", "Informe quando e onde acontece a comemoração."], ["Escolha as atrações", "Monte o kit com os brinquedos que cabem no espaço."], ["Combine os detalhes", "Receba a orientação para organizar o dia."]].map(([title, text], index) => (
                <li key={title} className="flex gap-5 rounded-2xl border border-white/15 bg-white/5 p-6">
                  <span className="text-3xl font-black text-[#f3ae00]">{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-black">{title}</h3>
                    <p className="mt-2 leading-7 text-[#a9c6f5]">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="orcamento" className="bg-[#f3ae00] px-5 py-16 text-[#09265b] lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <PartyPopper className="h-8 w-8" aria-hidden="true" />
              <p className="mt-4 text-sm font-black uppercase tracking-[.2em]">Vamos brincar?</p>
              <h2 className="mt-2 text-3xl font-black">Garanta alegria para a sua festa.</h2>
              <p className="mt-3 max-w-xl leading-7 text-[#09265b]/75">Conte os detalhes do evento e receba orientação para escolher as atrações.</p>
            </div>
            <FunnelCTAButton clientKey="galileu-locacao-brinquedos" companySlug="galileu-locacao-brinquedos" formSlug="funnel-galileu-locacao-brinquedos" location="galileu_footer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#09265b] px-7 py-3 font-black text-white">
              Solicitar orçamento
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      <footer className="bg-[#061638] px-5 py-8 text-sm text-[#c9dcfb] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p><strong className="text-white">Galileu Locação de Brinquedos</strong><br />Brinquedos para festas e eventos · São José dos Pinhais — PR</p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup clientKey="galileu-locacao-brinquedos" eyebrow="Galileu Locação de Brinquedos" title="Diversão garantida para momentos inesquecíveis." description="Tobogã inflável, cama elástica, piscina de bolinhas e muito mais para festas e eventos." ctaLabel="Pedir orçamento" ctaHref="#orcamento" delayMs={9000} className="border-[#f3ae00]/40 bg-[#061638]/95 text-white" accentClassName="text-[#f3ae00]" />
      <PortfolioUpsellPopup pageName="portfolio-galileu-locacao-brinquedos" />
    </div>
  );
}
