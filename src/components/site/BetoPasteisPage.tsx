import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./BetoPasteisGaleria"));

/**
 * Site exclusivo de Beto Pastéis (/portfolio/beto-pasteis).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function BetoPasteisPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Beto Pastéis
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Substitua por uma promessa concreta de Beto Pastéis.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Substitua por uma descrição real do negócio, sem métricas inventadas.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/beto-pasteis/capa.webp"
            alt="Beto Pastéis"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="beto-pasteis"
              companySlug="beto-pasteis"
              formSlug="funnel-beto-pasteis"
              location="beto-pasteis_hero"
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

      <PortfolioSocialProofPopup clientKey="beto-pasteis" />
      <PortfolioHostCredit />
    </div>
  );
}
