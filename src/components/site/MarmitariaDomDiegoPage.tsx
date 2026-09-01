import { lazy } from "react";
import { FunnelCTAButton } from "@/components/funnel/FunnelCTAButton";
import { PortfolioHostCredit } from "@/components/portfolio/PortfolioHostCredit";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { LazySection } from "@/components/portfolio/LazySection";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";

// Seções pesadas (galerias, mapas, carrosséis) entram por chunk sob demanda.
// Ver docs/PORTFOLIO_PERFORMANCE.md
// const Galeria = lazy(() => import("./MarmitariaDomDiegoGaleria"));

/**
 * Site exclusivo de Marmitaria Dom Diego (/portfolio/marmitaria-dom-diego).
 * Identidade do cliente é soberana: nada de Header/Footer/copy da 0WEB.
 * Contato é resolvido no servidor pelo clientKey — nunca no bundle público.
 */
export function MarmitariaDomDiegoPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Marmitaria Dom Diego
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
            Almoço prático para deixar o dia mais leve no Jardim Itália.
          </h1>
          <p className="mt-4 max-w-[65ch] text-muted-foreground">
            Um conceito de vitrine digital para apresentar marmitas, combinações e caminhos de pedido com clareza.
          </p>
          {/* Única imagem LCP do projeto: priority. As demais ficam lazy por padrão. */}
          <PortfolioImage
            src="/images/marmitaria-dom-diego/capa.png"
            alt="Marmitaria Dom Diego"
            priority
            width={1200}
            height={800}
            className="mt-8 w-full rounded-3xl object-cover"
          />

          <div className="mt-8">
            <FunnelCTAButton
              clientKey="marmitaria-dom-diego"
              companySlug="marmitaria-dom-diego"
              formSlug="funnel-marmitaria-dom-diego"
              location="marmitaria-dom-diego_hero"
            >
              Falar com a equipe
            </FunnelCTAButton>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[['Almoço do dia','Informações organizadas para escolher sem perder tempo.'],['Combinações','Espaço para destacar opções e acompanhamentos confirmados.'],['Pedido simples','Próximo passo direto para consultar disponibilidade.']].map(([title, text]) => <article key={title} className="rounded-2xl border border-border bg-card p-5"><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}
          </div>
        </section>
      </main>

      {/* Exemplo de seção sob demanda:
      <LazySection minHeight={320} fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
        <Galeria />
      </LazySection>
      */}
      {/* TODO: preencher com conteúdo real do cliente antes de ativar:
      <PortfolioSocialProofPopup clientKey="marmitaria-dom-diego" eyebrow="" title="" description="" ctaLabel="" ctaHref="#" /> */}
      <PortfolioUpsellPopup pageName="portfolio-marmitaria-dom-diego" />
      <PortfolioHostCredit />
    </div>
  );
}
