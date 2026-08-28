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
import { PortfolioBackToTop } from "@/components/portfolio/PortfolioBackToTop";

type Props = {
  slug: string;
  children: ReactNode;
  /** Dedicated client pages already own their editorial footer. */
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
  const standards = resolvePortfolioStandards(slug);
  const client = findPortfolioClient(slug);
  const clientKey = resolvePortfolioClientKey(slug);
  const siteName = client?.siteName ?? "Projeto";

  return (
    <>
      <PortfolioVitals slug={slug} />
      {standards.shareButton.enabled ? (
        <PortfolioShareButton
          position={standards.shareButton.position}
          variant={standards.shareButton.variant}
          label={standards.shareButton.label}
          slug={slug}
        />
      ) : null}

      {children}

      {includePlatformFooter && standards.footer.enabled ? (
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
    </>
  );
}
