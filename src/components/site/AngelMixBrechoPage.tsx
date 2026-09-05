import { ManagedText } from "@/components/portfolio/ManagedText";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { MotionImageReveal, MotionReveal, MotionScope } from "@/components/motion";

/**
 * Site exclusivo de Angel Mix Brechó (/portfolio/angel-mix-brecho).
 *
 * Direção autoral: capa de revista de moda. A página abre com a fotografia
 * ocupando a tela inteira e o título sobreposto no rodapé da imagem; em
 * seguida uma arara horizontal de estilos e um texto editorial em duas
 * colunas. Fechamento em faixa fina, sem cartão nem mosaico.
 *
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
const arara = [
  "Vestidos",
  "Blusas e tricôs",
  "Jeans",
  "Saias",
  "Casacos",
  "Acessórios",
] as const;

export function AngelMixBrechoPage() {
  return (
    <div
      className="min-h-dvh bg-[var(--am-cream)] text-[var(--am-ink)]"
      style={
        {
          "--am-cream": "oklch(0.97 0.02 350)",
          "--am-ink": "oklch(0.24 0.05 340)",
          "--am-rose": "oklch(0.68 0.18 350)",
          "--am-blush": "oklch(0.89 0.07 350)",
        } as React.CSSProperties
      }
    >
      <MotionScope intensity="EXPRESSIVE">
      <main>
        {/* capa de revista: fotografia em tela cheia com o título sobreposto */}
        <section className="relative isolate">
          <MotionImageReveal direction="up">
            <PortfolioImage
              src="/images/angel-mix-brecho/capa.png"
              alt="Angel Mix Brechó"
              priority
              width={1536}
              height={1024}
              className="h-[78vh] w-full object-cover md:h-[88vh]"
              managedField="heroImageUrl"
            />
          </MotionImageReveal>
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--am-ink)]/85 via-[var(--am-ink)]/25 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-14 md:pb-16">
            <MotionReveal variant="up" delay={80}>
              <p className="font-display text-xs uppercase tracking-[0.5em] text-[var(--am-blush)]">
                Angel Mix · Novo Mundo, Curitiba
              </p>
            </MotionReveal>
            <MotionReveal variant="mask" delay={180}>
              <h1 className="mt-4 max-w-[16ch] font-display text-[2.6rem] font-black leading-[0.92] tracking-tight text-[var(--am-cream)] md:text-[5rem]">
                <ManagedText field="heroHeadline" fallback={"Garimpo de moda no Novo Mundo."} />
              </h1>
            </MotionReveal>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-[var(--am-cream)]/85 md:text-lg">
              <ManagedText
                field="heroSubheadline"
                fallback={
                  "Presen\u00e7a digital de Angel Mix Brech\u00f3: vitrine para moda circular no Novo Mundo."
                }
              />
            </p>
          </div>
        </section>

        {/* arara horizontal: os estilos passam como peças penduradas */}
        <section className="border-b border-[var(--am-blush)] py-7">
          <div className="flex gap-3 overflow-x-auto px-6 md:justify-center md:px-14">
            {arara.map((peca, i) => (
              <MotionReveal
                as="span"
                key={peca}
                variant="down"
                delay={i * 90}
                className="inline-block whitespace-nowrap rounded-full border border-[var(--am-rose)]/45 px-5 py-2 text-sm text-[var(--am-ink)]/80 transition-colors duration-200 hover:border-[var(--am-rose)] hover:text-[var(--am-ink)]"
              >
                {peca}
              </MotionReveal>
            ))}
          </div>
        </section>

        {/* corpo editorial em duas colunas, sem cartões */}
        <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-14 md:py-24">
          <MotionReveal variant="left">
          <h2 className="font-display text-3xl font-black leading-tight tracking-tight md:text-[2.75rem]">
            Cada peça chega uma vez só.
          </h2>
          </MotionReveal>
          <MotionReveal variant="right" delay={140} className="space-y-5 text-lg leading-relaxed text-[var(--am-ink)]/80">
            <p>
              O acervo do Angel Mix se renova em pequenas levas. Quando uma peça
              agrada, ela costuma ser a única daquele modelo e daquele tamanho —
              por isso a conversa começa pelo seu estilo e pela numeração que
              veste bem em você.
            </p>
            <p>
              Romântico, básico, colorido ou clássico: com essa pista fica mais
              fácil separar o que combina antes mesmo de você atravessar o
              bairro.
            </p>
          </MotionReveal>
        </section>

        {/* fechamento em faixa fina, alinhado à esquerda */}
        <section className="bg-[var(--am-rose)] px-6 py-10 text-[var(--am-cream)] md:px-14">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[34ch] font-display text-2xl font-bold leading-snug md:text-3xl">
              Conte o que procura e veja o que chegou nesta semana.
            </p>
            <FunnelCTAButton
              clientKey="angel-mix-brecho"
              companySlug="angel-mix-brecho"
              formSlug="funnel-angel-mix-brecho"
              location="angel-mix-brecho_fechamento"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--am-ink)] px-8 py-3.5 text-sm font-semibold text-[var(--am-cream)] transition-transform duration-200 hover:scale-[1.03]"
            >
              <ManagedText field="ctaLabel" fallback={"Falar sobre uma pe\u00e7a"} />
            </FunnelCTAButton>
          </div>
        </section>
      </main>
      </MotionScope>

      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="angel-mix-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-angel-mix-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
