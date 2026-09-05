import type { ReactNode } from "react";
import { PortfolioShareButton } from "@/components/site/PortfolioShareButton";
import { PortfolioUpsellPopup } from "@/components/site/PortfolioUpsellPopup";
import { PortfolioContactFloating } from "@/components/portfolio/PortfolioContactFloating";
import { PortfolioStandardFooter } from "@/components/portfolio/PortfolioStandardFooter";
import {
  findPortfolioClient,
  resolvePortfolioClientKey,
  resolvePortfolioStandards,
} from "@/lib/portfolio-global-config";
import { PortfolioVitals } from "@/lib/portfolio-vitals";
import { PortfolioView } from "@/components/portfolio/PortfolioView";
import { PortfolioBackToTop } from "@/components/portfolio/PortfolioBackToTop";
import { PortfolioSocialProofPopup } from "@/components/portfolio/PortfolioSocialProofPopup";
import { resolvePortfolioAssets } from "@/lib/portfolio-assets";
import { PortfolioPresenceKit } from "@/components/portfolio/PortfolioPresenceKit";
import { PortfolioConversionNarrative } from "@/components/portfolio/PortfolioConversionNarrative";

type Props = {
  slug: string;
  children: ReactNode;
  /**
   * Kept for route compatibility. The shell now owns the only canonical
   * footer, so legacy client footers are hidden inside the client region.
   */
  includePlatformFooter?: boolean;
};

/**
 * Casca universal dos projetos `/portfolio/:slug`.
 *
 * Aplica automaticamente — a projetos atuais e futuros — os padrões globais:
 * botão de compartilhar, botão flutuante de contato (funil do cliente),
 * rodapé padrão com crédito da hospedagem e pop-up de captação da 0WEB.
 *
 * Overrides por cliente ficam em `src/config/portfolio-global-config.json`.
 */
export function PortfolioStandardShell({ slug, children, includePlatformFooter = false }: Props) {
  // Older dedicated routes still pass this flag. Footer ownership is now
  // centralized so the client footer can never appear above the About block.
  void includePlatformFooter;
  const standards = resolvePortfolioStandards(slug);
  const client = findPortfolioClient(slug);
  const clientKey = resolvePortfolioClientKey(slug);
  const siteName = client?.siteName ?? "Projeto";
  const proof = resolvePortfolioAssets(slug)?.proof;

  return (
    <div className="portfolio-standard-shell">
      <PortfolioVitals slug={slug} />
      {standards.shareButton.enabled ? (
        <PortfolioShareButton
          position={standards.shareButton.position}
          variant={standards.shareButton.variant}
          label={standards.shareButton.label}
          slug={slug}
          siteName={siteName}
        />
      ) : null}

      {/*
       * Dedicated pages historically rendered their own footer/host credit.
       * Keep their editorial content intact but suppress those legacy footer
       * nodes inside this boundary. The canonical footer below is always the
       * last content section after About and the presence kit.
       *
       * The client's own content always renders FIRST — visitors arriving
       * from search or shared links must see the business hero/CTA above the
       * fold. The 0WEB "Sobre o projeto" narrative belongs after the client
       * content, right before the presence kit.
       */}
      <div
        data-portfolio-client-content
        className="[&_footer]:hidden [&_[data-portfolio-host-credit]]:hidden"
      >
        {children}
      </div>

      <PortfolioConversionNarrative slug={slug} />

      <PortfolioPresenceKit slug={slug} />

      {clientKey && proof ? <PortfolioSocialProofPopup clientKey={clientKey} {...proof} /> : null}

      {standards.footer.enabled ? (
        <PortfolioStandardFooter
          siteName={siteName}
          variant={standards.footer.variant}
          showYear={standards.footer.showYear}
          hostCredit={standards.footer.hostCredit}
        />
      ) : null}

      {standards.contactFloating.enabled && clientKey ? (
        <PortfolioContactFloating
          clientKey={clientKey}
          studioName={standards.contactFloating.studioName}
          recipientName={standards.contactFloating.recipientName}
          theme={standards.contactFloating.theme}
          mode={standards.contactFloating.mode}
          label={standards.contactFloating.label}
          position={standards.contactFloating.position}
          quizConfig={standards.contactFloating.quizConfig}
          slug={slug}
        />
      ) : null}

      <PortfolioBackToTop />

      {/* Camada externa da hospedagem: obrigatória, com guard de instância única. */}
      <PortfolioUpsellPopup pageName={`portfolio-${slug}`} />
    </div>
  );
}
