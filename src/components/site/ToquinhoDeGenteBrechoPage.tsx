import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Toquinho de Gente Brechó Adulto e Infantil
 * (/portfolio/toquinho-de-gente-brecho).
 *
 * Direção autoral (Rodada 4 · CLUSTER_02): mural de recados. Faixa superior
 * com o nome da casa, quadro de avisos com bilhetes inclinados de tamanhos
 * diferentes e a foto colada no meio do mural. O convite aparece cedo, dentro
 * do próprio mural, e o fim é uma tira de lembretes curtos.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const bilhetes = [
  {
    titulo: "Para adultos",
    texto: "Peças do dia a dia e achados de garimpo, conferidos antes de entrar na vitrine.",
    giro: "rotate-[-1.5deg]",
  },
  {
    titulo: "Para crianças",
    texto: "Roupas infantis que duram pouco em casa e podem seguir servindo em outra família.",
    giro: "rotate-[1.8deg]",
  },
  {
    titulo: "Como pedir",
    texto: "Conte se procura peças adultas ou infantis e o tamanho que precisa.",
    giro: "rotate-[-0.8deg]",
  },
] as const;

const lembretes = [
  "Moda circular",
  "Adulto e infantil",
  "Sítio Cercado",
  "Peça a peça",
] as const;

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
        <div className="bg-[var(--tq-coral)] py-2.5 text-center text-[0.66rem] font-bold uppercase tracking-[0.38em] text-[var(--tq-sun)]">
          Toquinho de Gente · Brechó adulto e infantil
        </div>

        {/* mural de recados: assinatura do projeto */}
        <section className="mx-auto w-[min(94%,70rem)] py-10 md:py-16">
          <h1 className="max-w-[15ch] font-display text-[2.4rem] font-black leading-[1.02] tracking-tight md:text-[4rem]">
            <ManagedText
              field="heroHeadline"
              fallback={"Moda circular para todas as idades."}
            />
          </h1>

          <div className="mt-10 rounded-[2rem] border-[6px] border-[var(--tq-mint)] bg-[var(--tq-mint)]/12 p-5 md:p-10">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
              <div className="space-y-5">
                {bilhetes.map((b) => (
                  <article
                    key={b.titulo}
                    className={`${b.giro} rounded-xl bg-white px-6 py-5 shadow-[4px_5px_0_var(--tq-ink)]`}
                  >
                    <h2 className="font-display text-lg font-black">{b.titulo}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--tq-ink)]/75">
                      {b.texto}
                    </p>
                  </article>
                ))}
              </div>

              <div className="space-y-6">
                <div className="rotate-[2.5deg] rounded-md bg-white p-3 pb-9 shadow-2xl">
                  <PortfolioImage
                    src="/images/toquinho-de-gente-brecho/capa.png"
                    alt="Toquinho de Gente Brechó Adulto e Infantil"
                    priority
                    width={900}
                    height={900}
                    className="aspect-square w-full rounded-sm object-cover"
                    managedField="heroImageUrl"
                  />
                  <p className="absolute-none mt-2 text-center font-display text-sm font-semibold text-[var(--tq-ink)]/70">
                    Garimpo da semana
                  </p>
                </div>
                <p className="text-base leading-relaxed text-[var(--tq-ink)]/80">
                  <ManagedText
                    field="heroSubheadline"
                    fallback={
                      "Presen\u00e7a digital de Toquinho de Gente Brech\u00f3 Adulto e Infantil: vitrine para moda circular adulta e infantil no S\u00edtio Cercado."
                    }
                  />
                </p>
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
          </div>

          {/* tira de lembretes fecha o mural, sem faixa de CTA */}
          <ul className="mt-10 flex flex-wrap items-center gap-3">
            {lembretes.map((item) => (
              <li
                key={item}
                className="rounded-full border-2 border-[var(--tq-ink)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-[var(--tq-ink)]/65">
            Garimpar também pode ser uma forma de cuidar do planeta — e de fazer
            uma peça durar mais de uma história.
          </p>
        </section>
      </main>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="toquinho-de-gente-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-toquinho-de-gente-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
