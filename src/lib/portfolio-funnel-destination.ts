/**
 * Contrato público (client-safe) do destino operacional do funil.
 *
 * Aqui NÃO existe número: apenas o vocabulário de estados, a máscara e os
 * tipos usados pelo painel. A resolução real é server-only
 * (`portfolio-funnel-destination.server.ts`), sobre o resolver canônico já
 * existente (`whatsapp-redirect.server.ts`).
 */

/** Estados formais do destino operacional de conclusão do funil. */
export const DESTINATION_STATUSES = [
  "VERIFIED",
  "CONFIGURED_UNVERIFIED",
  "AUTO_RESOLVED",
  "UNRESOLVED",
  "CONFLICT",
  "NOT_APPLICABLE",
] as const;

export type DestinationStatus = (typeof DESTINATION_STATUSES)[number];

/** Origem do destino. Nunca inclui valor. */
export type DestinationSource =
  | "OPERATIONAL_SECRET"
  | "CLIENT_SETTINGS"
  | "NONE";

export type DestinationRow = {
  slug: string;
  projectName: string;
  clientKey: string | null;
  funnelType: string;
  contactMode: "funnelOnly" | "none";
  destinationStatus: DestinationStatus;
  destinationSource: DestinationSource;
  /** Sempre mascarado. Número completo nunca sai do servidor. */
  destinationValueMasked: string | null;
  confidence: number | null;
  lastVerifiedAt: string | null;
  publicState: "published" | "draft" | "offline";
  /** Motivo legível quando o destino não está OK. Sem PII. */
  note: string | null;
};

/** Estados que representam entrega operacional garantida. */
export function isDestinationOk(status: DestinationStatus): boolean {
  return status === "VERIFIED" || status === "AUTO_RESOLVED" || status === "NOT_APPLICABLE";
}

/**
 * Máscara canônica: `(41) 9****-0764`.
 * Recebe apenas dígitos (com ou sem DDI 55). Nunca registra o valor inteiro.
 */
export function maskWhatsAppDigits(digits: string | null | undefined): string | null {
  const d = String(digits ?? "").replace(/\D/g, "");
  if (d.length < 10) return null;
  const national = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
  const ddd = national.slice(0, 2);
  const rest = national.slice(2);
  const head = rest.slice(0, 1);
  const tail = rest.slice(-4);
  return `(${ddd}) ${head}${"*".repeat(Math.max(rest.length - 5, 0))}-${tail}`;
}
