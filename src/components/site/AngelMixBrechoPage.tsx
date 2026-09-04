import { ManagedText } from "@/components/portfolio/ManagedText";
import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./AngelMixBrechoGaleria"));

/**
 * Site exclusivo de Angel Mix Brechó (/portfolio/angel-mix-brecho).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function AngelMixBrechoPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Angel Mix Brechó
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            <ManagedText field="heroHeadline" fallback={"Garimpo de moda no Novo Mundo."} />
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            <ManagedText field="heroSubheadline" fallback={"Presen\u00e7a digital de Angel Mix Brech\u00f3: vitrine para moda circular no Novo Mundo."} />
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/angel-mix-brecho/capa.png"
            alt="Angel Mix Brechó"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
            managedField="heroImageUrl"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="angel-mix-brecho"
              companySlug="angel-mix-brecho"
              formSlug="funnel-angel-mix-brecho"
              location="angel-mix-brecho_hero"
            ><ManagedText field="ctaLabel" fallback={"Falar com a equipe"} /></FunnelCTAButton>
          </div>
        </section>
      </main>

      {/* Exemplo de seção sob demanda:
      <LazySection minHeight={320} fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
        <Galeria />
      </LazySection>
      */}
      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="angel-mix-brecho" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-angel-mix-brecho" />
      <PortfolioHostCredit />
    </div>
  );
}
