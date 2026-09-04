import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Toquinho de Gente Brechó Adulto e Infantil
 * (/portfolio/toquinho-de-gente-brecho).
 *
 * Direção autoral: colagem afetiva — foto em polaroide inclinada, etiquetas
 * arredondadas, faixa ondulada e duas trilhas de leitura (adulto e infantil).
 * Clima de família, cores quentes e alegres.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const etiquetas = ["Adulto", "Infantil", "Moda circular", "Sítio Cercado"] as const;

export function ToquinhoDeGenteBrechoPage() {
  return (
    <div
      className="min-h-dvh overflow-x-hidden bg-[var(--tq-sun)] text-[var(--tq-ink)]"
      style={
        {
          "--tq-sun": "oklch(0.97 0.04 95)",
          "--tq-ink": "oklch(0.27 0.04 25)",
          "--tq-coral": "oklch(0.68 0.17 35)",
          "--tq-mint": "oklch(0.78 0.11 175)",
        } as React.CSSProperties
      }
    >
      <main>
        <section className="mx-auto grid w-[min(92%,66rem)] items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div>
            <div className="flex flex-wrap gap-2">
              {etiquetas.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tq-mint)]/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--tq-ink)]/80"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-6 font-display text-[2.3rem] font-black leading-[1.02] tracking-tight md:text-[3.6rem]">
              <ManagedText
                field="heroHeadline"
                fallback={"Moda circular para todas as idades."}
              />
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--tq-ink)]/75">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital de Toquinho de Gente Brech\u00f3 Adulto e Infantil: vitrine para moda circular adulta e infantil no S\u00edtio Cercado."
                }
              />
            </p>
            <div className="mt-8">
              <FunnelCTAButton
                clientKey="toquinho-de-gente-brecho"
                companySlug="toquinho-de-gente-brecho"
                formSlug="funnel-toquinho-de-gente-brecho"
                location="toquinho-de-gente-brecho_hero"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--tq-coral)] px-7 py-3.5 text-sm font-bold text-[var(--tq-sun)] shadow-[6px_6px_0_var(--tq-ink)]"
              >
                <ManagedText field="ctaLabel" fallback={"Consultar pe\u00e7as"} />
              </FunnelCTAButton>
            </div>
          </div>

          {/* polaroide inclinada: assinatura afetiva do projeto */}
          <div className="relative mx-auto w-full max-w-sm rotate-[-3deg] rounded-md bg-white p-3 pb-10 shadow-2xl md:rotate-[-5deg]">
            <PortfolioImage
              src="/images/toquinho-de-gente-brecho/capa.png"
              alt="Toquinho de Gente Brechó Adulto e Infantil"
              priority
              width={900}
              height={900}
              className="aspect-square w-full rounded-sm object-cover"
              managedField="heroImageUrl"
            />
            <p className="absolute bottom-3 left-0 w-full text-center font-display text-sm font-semibold text-[var(--tq-ink)]/70">
              Toquinho de Gente
            </p>
          </div>
        </section>

        {/* faixa ondulada separando as trilhas */}
        <div aria-hidden className="text-[var(--tq-mint)]">
          <svg viewBox="0 0 1440 80" className="block h-12 w-full md:h-20" preserveAspectRatio="none">
            <path
              d="M0 40c120 30 240 30 360 0s240-30 360 0 240 30 360 0 240-30 360 0v40H0z"
              fill="currentColor"
            />
          </svg>
        </div>

        <section className="bg-[var(--tq-mint)] py-14 md:py-20">
          <div className="mx-auto grid w-[min(92%,66rem)] gap-6 md:grid-cols-2">
            <article className="inline-flex items-center gap-2 rounded-3xl bg-[var(--tq-sun)] p-7 md:p-9">
              <h2 className="font-display text-2xl font-black">Para adultos</h2>
              <p className="mt-3 leading-relaxed text-[var(--tq-ink)]/75">
                Peças do dia a dia e achados de garimpo, conferidos antes de
                entrar na vitrine.
              </p>
            </article>
            <article className="inline-flex items-center gap-2 rounded-3xl bg-[var(--tq-sun)] p-7 md:p-9">
              <h2 className="font-display text-2xl font-black">Para crianças</h2>
              <p className="mt-3 leading-relaxed text-[var(--tq-ink)]/75">
                Roupas infantis que duram pouco em casa e podem seguir servindo
                em outra família.
              </p>
            </article>
          </div>
        </section>

        <section className="mx-auto w-[min(92%,52rem)] py-16 text-center md:py-24">
          <h2 className="font-display text-2xl font-black leading-snug md:text-4xl">
            Garimpar também pode ser uma forma de cuidar do planeta.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[var(--tq-ink)]/75">
            Conte se procura peças adultas ou infantis e o tamanho que precisa.
          </p>
          <div className="mt-8">
            <FunnelCTAButton
              clientKey="toquinho-de-gente-brecho"
              companySlug="toquinho-de-gente-brecho"
              formSlug="funnel-toquinho-de-gente-brecho"
              location="toquinho-de-gente-brecho_fechamento"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--tq-ink)] px-7 py-3.5 text-sm font-bold text-[var(--tq-sun)]"
            >
              Consultar peças
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      <PortfolioUpsellPopup pageName="portfolio-toquinho-de-gente-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
