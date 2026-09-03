import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./HeloaGasGaleria"));

/**
 * Site exclusivo de Heloá Gás (/portfolio/heloa-gas).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function HeloaGasPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Heloá Gás
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Heloá Gás: uma presença digital clara para o seu público.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Conheça os serviços, a identidade e os próximos passos de Heloá Gás.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/heloa-gas/capa.webp"
            alt="Heloá Gás"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="heloa-gas"
              companySlug="heloa-gas"
              formSlug="funnel-heloa-gas"
              location="heloa-gas_hero"
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
      <PortfolioSocialProofPopup clientKey="heloa-gas" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioHostCredit />
    </div>
  );
}
