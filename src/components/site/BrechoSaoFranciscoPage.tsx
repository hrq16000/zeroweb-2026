import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

/**
 * Site exclusivo de Brechó São Francisco (/portfolio/brecho-sao-francisco).
 *
 * Direção autoral: vitrine cinematográfica — capa em tela cheia com cartão
 * de legenda sobreposto, depois texto corrido em duas colunas com fio
 * dourado, no clima de bairro histórico. Sem cards, sem grid de serviços.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function BrechoSaoFranciscoPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--sf-paper)] text-[var(--sf-ink)]"
      style={
        {
          "--sf-paper": "oklch(0.96 0.02 85)",
          "--sf-ink": "oklch(0.26 0.03 60)",
          "--sf-gold": "oklch(0.65 0.11 75)",
          "--sf-terra": "oklch(0.48 0.09 45)",
        } as React.CSSProperties
      }
    >
      <main>
        {/* capa em tela cheia com legenda sobreposta */}
        <section className="relative">
          <PortfolioImage
            src="/images/brecho-sao-francisco/capa.png"
            alt="Brechó São Francisco"
            priority
            width={1600}
            height={1000}
            className="h-[62vh] w-full object-cover md:h-[78vh]"
            managedField="heroImageUrl"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--sf-ink)]/70 via-[var(--sf-ink)]/10 to-transparent" />
          <div className="relative mx-auto -mt-24 w-[min(92%,44rem)] rounded-sm border-t-4 border-[var(--sf-gold)] bg-[var(--sf-paper)] px-7 py-8 shadow-xl md:-mt-32 md:px-12 md:py-12">
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[var(--sf-terra)]">
              Brechó São Francisco · Curitiba
            </p>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              <ManagedText
                field="heroHeadline"
                fallback={"Pe\u00e7as com hist\u00f3ria em uma vitrine acolhedora."}
              />
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--sf-ink)]/75">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital de Brech\u00f3 S\u00e3o Francisco: cat\u00e1logo digital para roupas, acess\u00f3rios e pe\u00e7as de segunda m\u00e3o no bairro S\u00e3o Francisco."
                }
              />
            </p>
            <div className="mt-8">
              <FunnelCTAButton
                clientKey="brecho-sao-francisco"
                companySlug="brecho-sao-francisco"
                formSlug="funnel-brecho-sao-francisco"
                location="brecho-sao-francisco_hero"
                className="rounded-sm bg-[var(--sf-terra)] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-[var(--sf-paper)]"
              >
                <ManagedText field="ctaLabel" fallback={"Consultar pe\u00e7as"} />
              </FunnelCTAButton>
            </div>
          </div>
        </section>

        {/* texto corrido em duas colunas, com capitular */}
        <section className="mx-auto w-[min(92%,60rem)] py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[var(--sf-gold)]">
                Sobre a vitrine
              </p>
              <p className="mt-6 text-lg leading-8 text-[var(--sf-ink)]/85">
                <span className="float-left mr-3 mt-1 font-display text-6xl font-semibold leading-none text-[var(--sf-terra)]">
                  R
                </span>
                oupas e acessórios de segunda mão ganham uma apresentação
                cuidadosa: cada peça é conferida, fotografada e descrita antes de
                entrar na vitrine, para que a escolha seja feita com calma.
              </p>
            </div>
            <div className="border-l border-[var(--sf-gold)]/50 pl-8">
              <dl className="space-y-6 text-[var(--sf-ink)]/80">
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-[var(--sf-terra)]">
                    O que você encontra
                  </dt>
                  <dd className="mt-2 leading-relaxed">
                    Roupas femininas e masculinas, acessórios e peças de garimpo
                    selecionadas uma a uma.
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-[var(--sf-terra)]">
                    Como escolher
                  </dt>
                  <dd className="mt-2 leading-relaxed">
                    Conte o tipo de peça, o tamanho e o estilo que procura para
                    receber o que está disponível.
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-[var(--sf-terra)]">
                    Moda circular
                  </dt>
                  <dd className="mt-2 leading-relaxed">
                    Cada peça que segue em uso é uma escolha mais consciente de
                    consumo.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--sf-gold)]/40 bg-[var(--sf-ink)] py-16 text-[var(--sf-paper)] md:py-20">
          <div className="mx-auto w-[min(92%,48rem)] text-center">
            <h2 className="font-display text-2xl font-semibold leading-snug md:text-4xl">
              Roupas com história merecem uma descoberta cuidadosa.
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[var(--sf-paper)]/75">
              Conte o tipo de peça, o tamanho e o estilo que procura.
            </p>
            <div className="mt-8">
              <FunnelCTAButton
                clientKey="brecho-sao-francisco"
                companySlug="brecho-sao-francisco"
                formSlug="funnel-brecho-sao-francisco"
                location="brecho-sao-francisco_fechamento"
                className="rounded-sm bg-[var(--sf-gold)] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-[var(--sf-ink)]"
              >
                Consultar peças
              </FunnelCTAButton>
            </div>
          </div>
        </section>
      </main>

      <PortfolioUpsellPopup pageName="portfolio-brecho-sao-francisco" />
      <PortfolioHostCredit />
    </div>
  );
}
