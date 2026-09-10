import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useFunnel, type FunnelPageType } from "@/hooks/useFunnel";
import { FunnelModalWrapper } from "./FunnelModalWrapper";
import { trackEvent } from "@/lib/analytics";
import { buildContactFallbackHref, type ContactIntent } from "@/lib/contact-intent";

type LegacyProps = {
  pageType: FunnelPageType;
  serviceSlug?: string;
  serviceFunnels?: Record<string, string>;
  /** Força um slug específico ignorando a resolução padrão. @deprecated use `intent`. */
  funnelSlug?: string;
  /** Páginas de portfólio: chave do cliente. @deprecated use `intent.companySlug`. */
  clientKey?: string;
  /** Páginas de portfólio: slug da empresa. @deprecated use `intent.companySlug`. */
  companySlug?: string;
  /** Páginas de portfólio: slug do formulário. @deprecated use `intent`. */
  formSlug?: string;
};

type Props = Partial<LegacyProps> & {
  /**
   * Funnel-first: preferred way to open a funnel. The `purpose` decides
   * which funnel (from a fixed allowlist) is opened; slugs are never
   * chosen directly by the caller. Legacy props above are kept for
   * backwards compatibility during migration.
   */
  intent?: ContactIntent;
  label?: string;
  className?: string;
  location?: string;
  showArrow?: boolean;
  /** Respostas pré-preenchidas repassadas ao funil. */
  prefill?: Record<string, string | string[]>;
  /** Contexto sintetizado da página/oferta de origem. */
  context?: Record<string, string>;
  /** Rótulo como children (equivalente a `label`). */
  children?: React.ReactNode;
  /**
   * @deprecated Configuração de quiz local. As perguntas vêm do funil
   * publicado no banco; a prop é aceita apenas por compatibilidade.
   */
  quizConfig?: unknown;
};

/**
 * Botão "tudo-em-um" que abre o FunnelModalWrapper. Renderiza um `<a href>`
 * real para o fallback (`/contato?...` ou `/lgpd?...`), intercepta o clique
 * somente no lado cliente e abre o modal com `preventDefault`. Sem JS, o link
 * navega para o funil renderizado em página cheia.
 */
export function FunnelCTAButton({
  pageType,
  serviceSlug,
  serviceFunnels,
  funnelSlug: funnelSlugOverride,
  clientKey,
  companySlug,
  formSlug,
  children,
  intent,
  label = "Solicitar orçamento gratuito",
  className,
  location,
  showArrow = true,
  prefill,
  context,
}: Props) {
  const resolvedPageType: FunnelPageType = pageType ?? "common";
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const portfolioCompany =
    companySlug ??
    clientKey ??
    (currentPath.includes("/portfolio/marido-de-aluguel") ? "marido-de-aluguel" : undefined);
  const effectiveIntent =
    intent ??
    (portfolioCompany
      ? {
          purpose: "proposal" as const,
          source: `portfolio-${portfolioCompany}`,
          pagePath: currentPath,
          placement: "section" as const,
          companySlug: portfolioCompany,
        }
      : undefined);
  const {
    isOpen,
    openFunnel,
    closeFunnel,
    funnelSlug: resolvedFunnelSlug,
  } = useFunnel(resolvedPageType, serviceSlug, serviceFunnels, effectiveIntent);
  const funnelSlug = funnelSlugOverride ?? formSlug ?? resolvedFunnelSlug;

  const clickingRef = useRef(false);

  // Clique disparado antes da hidratação: o script inicial segura o slug e o
  // modal do projeto abre assim que este componente monta.
  useEffect(() => {
    const w = window as unknown as { __0webPendingFunnel?: string; __0webFunnelReady?: boolean };
    // A partir daqui o React responde aos cliques; o script pré-hidratação
    // para de agendar qualquer navegação de fallback.
    w.__0webFunnelReady = true;
    if (w.__0webPendingFunnel && w.__0webPendingFunnel === funnelSlug) {
      w.__0webPendingFunnel = undefined;
      openFunnel();
    }
  }, [funnelSlug, openFunnel]);


  // Páginas de portfólio nunca podem cair no /contato da 0WEB: sem JS o link
  // abre o funil próprio do cliente em página cheia.
  const isPortfolioFunnel = Boolean(portfolioCompany || formSlug);
  const fallbackHref = isPortfolioFunnel
    ? `/f/${funnelSlug}`
    : intent
      ? buildContactFallbackHref(intent)
      : "/contato";

  const runtimeIntent: ContactIntent = effectiveIntent ?? {
    purpose: resolvedPageType === "service" ? "proposal" : "diagnosis",
    source: location ?? `${resolvedPageType}_${serviceSlug ?? "page"}`,
    pagePath: currentPath,
    placement: resolvedPageType === "post" ? "article" : "section",
    serviceSlug,
    companySlug: portfolioCompany,
  };

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    // Preserve normal navigation for Ctrl/Cmd/middle-click.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (clickingRef.current) {
      e.preventDefault();
      return;
    }
    clickingRef.current = true;
    setTimeout(() => {
      clickingRef.current = false;
    }, 400);

    e.preventDefault();
    // Nas páginas de portfólio, o atendimento do cliente tem precedência
    // sobre a captação da plataforma. Isso impede dois diálogos concorrentes.
    if (portfolioCompany && currentPath.startsWith("/portfolio/")) {
      window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-open"));
    }
    trackEvent("contact_cta_click", {
      label: "funnel_cta",
      location: location ?? `${resolvedPageType}_${serviceSlug ?? "page"}`,
      funnel: funnelSlug,
      purpose: intent?.purpose,
      placement: intent?.placement,
      surface: intent?.pagePath,
    });
    openFunnel();
  };

  return (
    <>
      <a
        href={fallbackHref}
        onClick={onClick}
        data-funnel-slug={funnelSlug}
        data-testid="funnel-cta"
        className={
          className ??
          "inline-flex items-center gap-2 rounded-full bg-gradient-primary text-primary-foreground font-semibold px-6 py-3.5 shadow-glow-primary hover:opacity-95 transition-opacity"
        }
      >
        {children ?? label}
        {showArrow && <ArrowRight className="w-4 h-4" />}
      </a>
      <FunnelModalWrapper
        open={isOpen}
        onClose={closeFunnel}
        funnelSlug={funnelSlug}
        serviceSlug={serviceSlug}
        intent={runtimeIntent}
        prefill={prefill}
        context={context}
      />
    </>
  );
}
