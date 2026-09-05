import { ManagedText } from "@/components/portfolio/ManagedText";
import { Instagram } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";

/** Catálogo de superfícies: linhas técnicas numeradas, não cards. */
const catalogo = [
  ["01", "Plotagem de móveis", "Portas e frentes renovadas com película aplicada em obra limpa, sem barulho e sem quebra.", "Móveis"],
  ["02", "Envelopamento de geladeiras", "Mais de 800 opções de imagens e cores para transformar o eletro em peça central da cozinha.", "Eletros"],
  ["03", "Comunicação visual", "Adesivos para paredes, portas e automóveis, além de lonas, banners e perfurados.", "Ambientes"],
  ["04", "Criação de artes", "Logotipos e artes personalizadas para dar unidade à comunicação da marca.", "Marca"],
] as const;

export function PremiumEnvelopamentosPage() {
  return (
    <MotionScope intensity="EXPRESSIVE">
    <div className="min-h-dvh bg-[#f5f8fb] text-[#071d41]">
      {/* HERO: faixa escura de largura total + tira fotográfica panorâmica abaixo. */}
      <section id="inicio" className="bg-[#071d41] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <a href="#inicio" aria-label="Premium Envelopamentos" className="shrink-0">
            <PortfolioImage
              managedField="logoUrl"
              priority
              src="/images/premium-envelopamentos/logo.png"
              alt="Premium Envelopamentos"
              width={768}
              height={256}
              decoding="async"
              className="h-10 w-auto rounded-md bg-white/95 px-3 py-1.5"
            />
          </a>
          <nav className="hidden gap-6 text-sm font-semibold text-white/80 md:flex">
            <a href="#catalogo" className="hover:text-white">Catálogo</a>
            <a href="#aplicacao" className="hover:text-white">Aplicação</a>
            <a href="#orcamento" className="hover:text-white">Orçamento</a>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-14 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.32em] text-[#f06a24]">
            Plotagem · envelopamento · comunicação visual
          </p>
          <MotionReveal as="h1" variant="mask" className="mt-5 max-w-4xl text-4xl font-black uppercase leading-[.95] tracking-[-.02em] sm:text-7xl">
            <ManagedText field="heroHeadline" fallback={"Seu m\u00f3vel muda de cara. Seu ambiente ganha presen\u00e7a."} />
          </MotionReveal>
          <div className="mt-8 grid gap-6 border-t border-white/15 pt-6 md:grid-cols-[1.4fr_.6fr] md:items-end">
            <p className="max-w-2xl text-lg leading-8 text-[#b9d0e6]">
              <ManagedText
                field="heroSubheadline"
                fallback={"Plotagem de m\u00f3veis e envelopamento de geladeiras com aplica\u00e7\u00e3o limpa, cores atuais e acabamento profissional em Curitiba e regi\u00e3o."}
              />
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm md:justify-items-end">
              <div>
                <dt className="text-[#7fa6cd]">Aplicação</dt>
                <dd className="text-lg font-black">Sem obra</dd>
              </div>
              <div>
                <dt className="text-[#7fa6cd]">Prazo típico</dt>
                <dd className="text-lg font-black">Mesmo dia</dd>
              </div>
            </dl>
          </div>
        </div>
        <MotionImageReveal direction="left">
        <PortfolioImage
          src="/images/premium-envelopamentos/hero.png"
          alt="Aplicação de envelopamento em geladeira pela Premium Envelopamentos"
          priority
          width={1024}
          height={1024}
          className="h-56 w-full object-cover object-center sm:h-80 lg:h-[26rem]"
          managedField="heroImageUrl"
        />
        </MotionImageReveal>
      </section>

      <main>
        {/* Catálogo em linhas técnicas com coluna de índice. */}
        <section id="catalogo" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-2xl text-3xl font-black uppercase tracking-[-.01em] sm:text-4xl">
              Uma nova superfície para cada ideia.
            </h2>
            <div className="mt-10 divide-y divide-[#cfdce9] border-y border-[#cfdce9]">
              {catalogo.map(([index, title, text, tag], i) => (
                <MotionReveal as="article" variant="right" delay={i * 80} key={title} className="grid gap-3 py-7 md:grid-cols-[4rem_1fr_1.2fr_8rem] md:items-baseline md:gap-8">
                  <span className="text-sm font-black text-[#f06a24]">{index}</span>
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="leading-7 text-[#46617c]">{text}</p>
                  <span className="justify-self-start rounded-full bg-[#e1f4f8] px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-[#0a2b5e] md:justify-self-end">
                    {tag}
                  </span>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Aplicação: foto de oficina em bloco largo com legenda lateral. */}
        <section id="aplicacao" className="bg-[#0a2b5e] px-5 py-16 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_.65fr] md:items-center">
            <MotionImageReveal direction="up">
            <PortfolioImage
              src="/images/premium-envelopamentos/galeria-oficina.png"
              alt="Plotagem de móveis em oficina limpa e moderna"
              width={1536}
              height={1024}
              className="aspect-[16/9] w-full rounded-none object-cover"
            />
            </MotionImageReveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.32em] text-[#49d6f3]">Como é feito</p>
              <h2 className="mt-3 text-3xl font-black">Preparo, corte e aplicação no mesmo fluxo.</h2>
              <p className="mt-4 leading-7 text-white/75">
                A superfície é limpa e nivelada antes da película. O corte é ajustado à peça e o acabamento é conferido
                borda a borda — sem poeira, sem cheiro forte e sem parar o ambiente por dias.
              </p>
              <a
                href="https://www.instagram.com/premiumenvelopamentos"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"
              >
                <Instagram className="h-4 w-4" /> Ver aplicações no Instagram
              </a>
            </div>
          </div>
        </section>

        {/* Orçamento em linha horizontal, sem card centralizado. */}
        <section id="orcamento" className="border-b-8 border-[#f06a24] px-5 py-14 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black uppercase sm:text-4xl">Pronto para renovar sem reforma?</h2>
              <p className="mt-3 max-w-xl leading-8 text-[#46617c]">
                Conte qual móvel ou eletro você quer transformar e receba orientação sobre as possibilidades.
              </p>
            </div>
            <FunnelCTAButton
              clientKey="premium-envelopamentos"
              companySlug="premium-envelopamentos"
              formSlug="funnel-premium-envelopamentos"
              location="premium_footer"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-none bg-[#f06a24] px-7 py-3.5 font-bold uppercase tracking-[.1em] text-white"
            >
              Solicitar orçamento
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      <footer className="bg-[#071d41] px-5 py-8 text-sm text-[#c8e4f0] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-white">Premium Envelopamentos</strong>
            <br />
            Plotagem, envelopamento e comunicação visual em Curitiba e região.
          </p>
          <PortfolioHostCredit linkClassName="font-semibold text-white underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="premium-envelopamentos"
        eyebrow="Premium Envelopamentos"
        title="Uma nova superfície muda a sensação do ambiente."
        description="Conheça plotagem de móveis, envelopamento de geladeiras e soluções de comunicação visual."
        ctaLabel="Ver catálogo"
        ctaHref="#catalogo"
        delayMs={9000}
        className="border-[#10a8d8]/35 bg-[#071d41]/95 text-white"
        accentClassName="text-[#49d6f3]"
      />
      <PortfolioUpsellPopup pageName="portfolio-premium-envelopamentos" />
    </div>
    </MotionScope>
  );
}
