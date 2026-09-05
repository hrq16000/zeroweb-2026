import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionReveal, MotionScope } from "@/components/motion";

/**
 * Site exclusivo de Brechó São Francisco (/portfolio/brecho-sao-francisco).
 *
 * Direção autoral (Rodada 4 · CLUSTER_02): caderno de garimpo com coluna
 * fixa. A marca, a chamada e o CTA moram em uma coluna lateral que acompanha
 * a rolagem; a direita é uma lista de araras numeradas em texto corrido, sem
 * hero sangrado e sem faixa de fechamento.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const araras = [
  {
    numero: "Arara 01",
    titulo: "Peças femininas",
    texto:
      "Vestidos, blusas, saias e alfaiataria garimpados peça a peça, conferidos antes de entrar na vitrine.",
  },
  {
    numero: "Arara 02",
    titulo: "Peças masculinas",
    texto:
      "Camisas, malhas e calças de uso diário, escolhidas pelo caimento e pelo estado de conservação.",
  },
  {
    numero: "Arara 03",
    titulo: "Acessórios de garimpo",
    texto:
      "Bolsas, cintos e miudezas que fecham o look e costumam sair rápido da vitrine.",
  },
  {
    numero: "Arara 04",
    titulo: "Moda circular",
    texto:
      "Cada peça que volta a circular é uma escolha de consumo mais consciente no bairro São Francisco.",
  },
] as const;

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
      <MotionScope intensity="SUBTLE">
      <main className="mx-auto w-[min(94%,72rem)] py-10 md:py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
          {/* coluna fixa: assinatura do projeto */}
          <div className="md:sticky md:top-10 md:self-start">
            <MotionReveal variant="fade">
              <p className="text-[0.68rem] uppercase tracking-[0.42em] text-[var(--sf-terra)]">
                Brechó São Francisco · Curitiba
              </p>
            </MotionReveal>
            <MotionReveal variant="up" delay={100}>
              <h1 className="mt-5 font-display text-[2.2rem] font-semibold leading-[1.05] md:text-[3.2rem]">
                <ManagedText
                  field="heroHeadline"
                  fallback={"Pe\u00e7as com hist\u00f3ria em uma vitrine acolhedora."}
                />
              </h1>
            </MotionReveal>
            <MotionReveal variant="left" delay={200}>
              <div className="mt-6 h-px w-24 bg-[var(--sf-gold)]" />
            </MotionReveal>
            <MotionReveal variant="up" delay={260}>
              <p className="mt-6 max-w-[42ch] text-base leading-[1.85] text-[var(--sf-ink)]/75">
                <ManagedText
                  field="heroSubheadline"
                  fallback={
                    "Presen\u00e7a digital de Brech\u00f3 S\u00e3o Francisco: cat\u00e1logo digital para roupas, acess\u00f3rios e pe\u00e7as de segunda m\u00e3o no bairro S\u00e3o Francisco."
                  }
                />
              </p>
            </MotionReveal>
            <div className="mt-8">
              <FunnelCTAButton
                clientKey="brecho-sao-francisco"
                companySlug="brecho-sao-francisco"
                formSlug="funnel-brecho-sao-francisco"
                location="brecho-sao-francisco_hero"
                className="inline-flex items-center gap-2 rounded-sm bg-[var(--sf-terra)] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-[var(--sf-paper)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <ManagedText field="ctaLabel" fallback={"Consultar pe\u00e7as"} />
              </FunnelCTAButton>
            </div>
            <p className="mt-6 max-w-[36ch] text-xs leading-relaxed text-[var(--sf-ink)]/55">
              Conte o tipo de peça, o tamanho e o estilo que procura para receber
              o que está disponível na vitrine.
            </p>
          </div>

          {/* coluna de leitura: retrato + araras numeradas */}
          <div className="min-w-0">
            <MotionReveal variant="mask">
              <figure className="max-w-md">
                <PortfolioImage
                  src="/images/brecho-sao-francisco/capa.png"
                  alt="Brechó São Francisco"
                  priority
                  width={1200}
                  height={1500}
                  className="w-full rounded-sm object-cover"
                  managedField="heroImageUrl"
                />
                <figcaption className="mt-3 text-[0.68rem] uppercase tracking-[0.3em] text-[var(--sf-gold)]">
                  Vitrine da semana
                </figcaption>
              </figure>
            </MotionReveal>

            <ol className="mt-12 divide-y divide-[var(--sf-gold)]/40 border-y border-[var(--sf-gold)]/40">
              {araras.map((item, i) => (
                <MotionReveal
                  as="li"
                  key={item.numero}
                  variant="right"
                  delay={i * 120}
                  className="group block py-7"
                >
                  <p className="text-[0.66rem] uppercase tracking-[0.34em] text-[var(--sf-terra)] transition-transform duration-200 group-hover:translate-x-1">
                    {item.numero}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold transition-colors duration-200 group-hover:text-[var(--sf-terra)] md:text-2xl">
                    {item.titulo}
                  </h2>
                  <p className="mt-2 max-w-[58ch] leading-[1.85] text-[var(--sf-ink)]/75">
                    {item.texto}
                  </p>
                </MotionReveal>
              ))}
            </ol>

            <p className="mt-8 font-display text-lg italic text-[var(--sf-ink)]/70">
              Roupas com história merecem uma descoberta cuidadosa.
            </p>
          </div>
        </div>
      </main>
      </MotionScope>


      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="brecho-sao-francisco" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-brecho-sao-francisco" />
      <PortfolioHostCredit />
    </div>
  );
}
