import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./BrechoSaoFranciscoGaleria"));

/**
 * Site exclusivo de Brechó São Francisco (/portfolio/brecho-sao-francisco).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function BrechoSaoFranciscoPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Brechó São Francisco
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Peças com história em uma vitrine acolhedora.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Presença digital de Brechó São Francisco: roupas, acessórios e peças de segunda mão no bairro São Francisco.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/brecho-sao-francisco/capa.png"
            alt="Brechó São Francisco"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="brecho-sao-francisco"
              companySlug="brecho-sao-francisco"
              formSlug="funnel-brecho-sao-francisco"
              location="brecho-sao-francisco_hero"
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
      <PortfolioSocialProofPopup clientKey="brecho-sao-francisco" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-brecho-sao-francisco" />
      <PortfolioHostCredit />
    </div>
  );
}
