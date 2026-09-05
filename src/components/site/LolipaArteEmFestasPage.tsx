import { ManagedText } from "@/components/portfolio/ManagedText";
import { ArrowRight, CakeSlice } from "lucide-react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/** Mural de festa: o próprio hero é o mosaico de decorações reais da Lolipa. */
const mural = [
  ["/images/lolipa-arte-em-festas/galeria-temas.png", "Decorações personalizadas para temas infantis e comemorações", "sm:col-span-2 sm:row-span-2"],
  ["/images/lolipa-arte-em-festas/decoracao-branca.png", "Decoração elegante em tons claros para celebrações especiais", ""],
  ["/images/lolipa-arte-em-festas/decoracao-colorida.png", "Mesa temática colorida com composição sob medida", ""],
  ["/images/lolipa-arte-em-festas/decoracao-infantil.png", "Decoração infantil com balões e elementos personalizados", "sm:col-span-2"],
] as const;

/** Formatos de atendimento em linhas contínuas, não em cards. */
const formatos: Array<[string, string, string]> = [
  ["Decoração completa", "A Lolipa cuida da composição inteira: espaço, tema, cores e detalhes no dia da celebração.", "A"],
  ["Criação sob medida", "Peças e arranjos desenhados para a identidade da sua festa, do convite ao centro de mesa.", "B"],
  ["Pegue e monte", "Você recebe o material e a orientação para montar a própria celebração com tranquilidade.", "C"],
];

const mimos = ["Projeto da festa", "Centrinhos de mesa", "Porta presentes"];

export function LolipaArteEmFestasPage() {
  return (
    <div className="min-h-dvh bg-[#fbf4f5] text-[#34272b]">
      {/* HERO: mural fotográfico full-bleed com o título sobreposto. */}
      <section id="inicio" className="relative isolate">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {mural.map(([src, alt, span], index) => (
            <PortfolioImage
              key={src}
              src={src}
              alt={alt}
              priority={index === 0}
              width={1100}
              height={800}
              className={`h-32 w-full object-cover sm:h-52 ${span}`}
              {...(index === 0 ? { managedField: "heroImageUrl" as const } : {})}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[#34272b]/55" />
        <div className="absolute inset-0 flex items-center px-5 lg:px-8">
          <div className="mx-auto w-full max-w-5xl text-[#fbf4f5]">
            <a href="#inicio" aria-label="Lolipa Arte em Festas Decor" className="pointer-events-auto inline-block">
              <PortfolioImage
                managedField="logoUrl"
                priority
                src="/images/lolipa-arte-em-festas/logo.png"
                alt="Lolipa Arte em Festas Decor"
                width={768}
                height={256}
                decoding="async"
                className="h-12 w-auto drop-shadow-lg"
              />
            </a>
            <h1 className="mt-4 max-w-2xl font-display text-3xl font-black leading-[1.02] drop-shadow-md sm:text-6xl">
              <ManagedText field="heroHeadline" fallback={"Sua festa vira um momento inesquec\u00edvel."} />
            </h1>
          </div>
        </div>
      </section>

      <main>
        {/* Subtítulo + CTA em faixa própria, logo abaixo do mural. */}
        <section className="border-b border-[#ead8dc] bg-[#9b6875] px-5 py-8 text-white lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-lg leading-8 text-white/90">
              <ManagedText
                field="heroSubheadline"
                fallback={"Decora\u00e7\u00f5es personalizadas e encantadoras para anivers\u00e1rios, batizados, ch\u00e1s e comemora\u00e7\u00f5es especiais \u2014 com cada detalhe pensado para contar uma hist\u00f3ria."}
              />
            </p>
            <FunnelCTAButton
              clientKey="lolipa-arte-em-festas"
              companySlug="lolipa-arte-em-festas"
              formSlug="funnel-lolipa-arte-em-festas"
              location="lolipa_hero"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#9b6875]"
            >
              Planejar minha festa <ArrowRight className="h-4 w-4" />
            </FunnelCTAButton>
          </div>
        </section>

        {/* Formatos como linhas contínuas com letra-índice. */}
        <section id="formatos" className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.3em] text-[#9b6875]">Três formas de celebrar</p>
                <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">Escolha o quanto quer delegar.</h2>
              </div>
              <CakeSlice className="h-10 w-10 shrink-0 text-[#c9aab2]" />
            </div>
            <div className="mt-8 divide-y divide-[#ead8dc] border-y border-[#ead8dc]">
              {formatos.map(([title, text, letter]) => (
                <article key={title} className="flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:gap-10">
                  <span className="font-display text-5xl font-black text-[#ead8dc] md:w-20">{letter}</span>
                  <h3 className="font-display text-2xl font-black md:w-64">{title}</h3>
                  <p className="max-w-xl leading-7 text-[#705c62]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Mimos como fita horizontal de etiquetas. */}
        <section id="mimos" className="bg-[#f1e1e4] px-5 py-12 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
            <p className="mr-2 text-xs font-bold uppercase tracking-[.3em] text-[#9b6875]">Mimos possíveis</p>
            {mimos.map((item) => (
              <span key={item} className="rounded-full border border-[#c9aab2] bg-white px-4 py-2 text-sm font-semibold text-[#705c62]">
                {item}
              </span>
            ))}
            <span className="text-sm text-[#8b7278]">Sujeitos ao alinhamento do projeto.</span>
          </div>
        </section>

        {/* Fechamento assimétrico. */}
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 rounded-[2rem] bg-[#34272b] px-7 py-12 text-white md:grid-cols-[1.3fr_.7fr] md:items-center sm:px-12">
            <div>
              <h2 className="font-display text-3xl font-black sm:text-4xl">Vamos planejar a festa que vai marcar memórias?</h2>
              <p className="mt-4 max-w-xl leading-8 text-white/80">
                Conte o tema, a ocasião e o que você imaginou. A proposta é construída com você.
              </p>
            </div>
            <FunnelCTAButton
              clientKey="lolipa-arte-em-festas"
              companySlug="lolipa-arte-em-festas"
              formSlug="funnel-lolipa-arte-em-festas"
              location="lolipa_footer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#9b6875] px-7 py-3.5 font-bold text-white md:justify-self-end"
            >
              Falar sobre minha festa <ArrowRight className="h-4 w-4" />
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ead8dc] px-5 py-8 text-sm text-[#705c62] lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-[#34272b]">Lolipa Arte em Festas Decor</strong>
            <br />
            Decorações personalizadas para comemorações especiais.
          </p>
          <PortfolioHostCredit linkClassName="font-semibold text-[#34272b] underline underline-offset-4" />
        </div>
      </footer>

      <PortfolioSocialProofPopup
        clientKey="lolipa-arte-em-festas"
        eyebrow="Lolipa Arte em Festas Decor"
        title="Sua festa merece uma composição feita com carinho."
        description="Veja inspirações e planeje uma decoração personalizada para a sua comemoração."
        ctaLabel="Ver formatos"
        ctaHref="#formatos"
        delayMs={9000}
        className="border-[#9b6875]/35 bg-[#34272b]/95 text-white"
        accentClassName="text-[#f9dce2]"
      />
      <PortfolioUpsellPopup pageName="portfolio-lolipa-arte-em-festas" />
    </div>
  );
}
