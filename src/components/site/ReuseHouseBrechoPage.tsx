import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./ReuseHouseBrechoGaleria"));

/**
 * Site exclusivo de REuse House Brechó (/portfolio/reuse-house-brecho).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function ReuseHouseBrechoPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            REuse House Brechó
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Uma peça especial pode ganhar uma nova história.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Presença digital de REuse House Brechó: curadoria de moda sustentável no Jardim das Américas.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/reuse-house-brecho/capa.png"
            alt="REuse House Brechó"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="reuse-house-brecho"
              companySlug="reuse-house-brecho"
              formSlug="funnel-reuse-house-brecho"
              location="reuse-house-brecho_hero"
            >
              Falar com a equipe
            </FunnelCTAButton>
          </div>
        </section>
      </main>

      {/* Exemplo de seção sob demanda:
      <LazySection minHeight={320} fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
        <Galeria />
      </LazySection>
      */}
      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="reuse-house-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-reuse-house-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
