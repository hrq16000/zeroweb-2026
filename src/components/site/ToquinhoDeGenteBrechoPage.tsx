import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./ToquinhoDeGenteBrechoGaleria"));

/**
 * Site exclusivo de Toquinho de Gente Brechó Adulto e Infantil (/portfolio/toquinho-de-gente-brecho).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function ToquinhoDeGenteBrechoPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Toquinho de Gente Brechó Adulto e Infantil
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Substitua por uma promessa concreta de Toquinho de Gente Brechó Adulto e Infantil.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Substitua por uma descrição real do negócio, sem métricas inventadas.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/toquinho-de-gente-brecho/capa.png"
            alt="Toquinho de Gente Brechó Adulto e Infantil"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="toquinho-de-gente-brecho"
              companySlug="toquinho-de-gente-brecho"
              formSlug="funnel-toquinho-de-gente-brecho"
              location="toquinho-de-gente-brecho_hero"
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
      <PortfolioSocialProofPopup clientKey="toquinho-de-gente-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-toquinho-de-gente-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
