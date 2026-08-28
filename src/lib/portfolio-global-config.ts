/**
 * Padrões universais da zona `/portfolio/:slug`.
 *
 * A configuração global vale para TODOS os projetos, atuais e futuros.
 * Cada cliente pode sobrescrever apenas aparência/rótulo — nunca desligar
 * os elementos obrigatórios da hospedagem (crédito e captação da 0WEB).
 *
 * Documentação: docs/PORTFOLIO_GLOBAL_STANDARDS.md
 */
import globalConfig from "@/config/portfolio-global-config.json";
import clients from "@/config/portfolio-clients.json";
import { isPortfolioClientKey, type PortfolioClientKey } from "@/lib/portfolio-client-keys";
import type { PortfolioQuizConfig } from "@/components/site/BeautyBookingQuiz";

export type SharePosition = "top-right" | "top-left" | "bottom-right";
export type FloatingPosition = "bottom-right" | "bottom-left";
export type SurfaceVariant = "light" | "dark";
export type ContactTheme = "pink" | "gold" | "navy";
export type ContactMode = "booking" | "proposal";

export type PortfolioStandards = {
  shareButton: { enabled: boolean; position: SharePosition; variant: SurfaceVariant; label: string };
  contactFloating: {
    enabled: boolean;
    behavior: "funnel-modal";
    position: FloatingPosition;
    label: string;
    theme: ContactTheme;
    recipientName: string;
    /** Derivado de `portfolio-clients.json` (ctaMode), com override opcional. */
    mode: ContactMode;
    studioName: string;
    /** Perguntas do funil específicas do segmento do cliente. */
    quizConfig?: PortfolioQuizConfig;
  };
  footer: { enabled: boolean; hostCredit: boolean; showYear: boolean; variant: SurfaceVariant };
  hostCapturePopup: { enabled: true };
  seo: { canonicalRequired: boolean; socialImageRequired: boolean; robots: string };
  tracking: { enabled: boolean; pageType: string };
};

type PortfolioClientRecord = {
  clientKey: string;
  slug: string;
  siteName: string;
  ctaMode?: string;
};

const CLIENTS = clients as PortfolioClientRecord[];

export function listPortfolioClients(): PortfolioClientRecord[] {
  return CLIENTS;
}

export function findPortfolioClient(slugOrKey: string): PortfolioClientRecord | undefined {
  return CLIENTS.find((client) => client.slug === slugOrKey || client.clientKey === slugOrKey);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

/**
 * Resolve os padrões de um projeto: defaults globais + override do cliente.
 * Elementos obrigatórios da hospedagem são forçados após o merge.
 */
export function resolvePortfolioStandards(slugOrKey: string): PortfolioStandards {
  const config = globalConfig as unknown as {
    defaults: Record<string, unknown>;
    overrides?: Record<string, Record<string, unknown>>;
  };
  const client = findPortfolioClient(slugOrKey);
  const key = client?.clientKey ?? slugOrKey;
  const override = asRecord(config.overrides?.[key]);
  const defaults = config.defaults;

  const merge = <T,>(section: string): T => ({
    ...asRecord(defaults[section]),
    ...asRecord(override[section]),
  }) as T;

  const contact = merge<PortfolioStandards["contactFloating"]>("contactFloating");
  const ctaMode = client?.ctaMode === "booking" ? "booking" : "proposal";

  return {
    shareButton: merge<PortfolioStandards["shareButton"]>("shareButton"),
    contactFloating: {
      ...contact,
      behavior: "funnel-modal",
      mode: (contact.mode ?? ctaMode) as ContactMode,
      studioName: contact.studioName ?? client?.siteName ?? "Este projeto",
      // Invariante: o botão flutuante abre o MESMO funil do CTA da página.
      // Precedência: override explícito do cliente > registro gerado da página.
      quizConfig: contact.quizConfig ?? resolvePortfolioQuizConfig(key),
    },
    footer: merge<PortfolioStandards["footer"]>("footer"),
    // Camada da hospedagem: não pode ser desativada por configuração de cliente.
    hostCapturePopup: { enabled: true },
    seo: merge<PortfolioStandards["seo"]>("seo"),
    tracking: merge<PortfolioStandards["tracking"]>("tracking"),
  };
}

/** Chave tipada quando o projeto está registrado no contrato de clientes. */
export function resolvePortfolioClientKey(slugOrKey: string): PortfolioClientKey | undefined {
  const key = findPortfolioClient(slugOrKey)?.clientKey ?? slugOrKey;
  return isPortfolioClientKey(key) ? key : undefined;
}
