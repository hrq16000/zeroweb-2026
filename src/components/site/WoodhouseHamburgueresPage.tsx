import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./WoodhouseHamburgueresGaleria"));

/**
 * Site exclusivo de Woodhouse Hambúrgueres (/portfolio/woodhouse-hamburgueres).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function WoodhouseHamburgueresPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Woodhouse Hambúrgueres
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Grelhados e petiscos para transformar qualquer noite em encontro.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Um conceito de site para apresentar a experiência da Woodhouse no Jardim Itália com personalidade.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/woodhouse-hamburgueres/capa.png"
            alt="Woodhouse Hambúrgueres"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="woodhouse-hamburgueres"
              companySlug="woodhouse-hamburgueres"
              formSlug="funnel-woodhouse-hamburgueres"
              location="woodhouse-hamburgueres_hero"
            >
              Falar com a equipe
            </FunnelCTAButton>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[['Hambúrgueres grelhados','Espaço para destacar ingredientes e combinações reais.'],['Petiscos','Uma seção para compartilhar a experiência da casa.'],['Clima da noite','Conteúdo visual que convida a conhecer o ambiente.']].map(([title, text]) => <article key={title} className="rounded-2xl border border-border bg-card p-5"><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}
          </div>
        </section>
      </main>

      {/* Exemplo de seção sob demanda:
      <LazySection minHeight={320} fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
        <Galeria />
      </LazySection>
      */}

      <PortfolioSocialProofPopup clientKey="woodhouse-hamburgueres" />
      <PortfolioUpsellPopup pageName="portfolio-woodhouse-hamburgueres" />
      <PortfolioHostCredit />
    </div>
  );
}
