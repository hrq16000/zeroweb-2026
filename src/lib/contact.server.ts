/**
 * Server-only contact data for the institutional 0WEB operation.
 *
 * Portfolio WhatsApp destinations do not live here and do not depend on
 * secrets. They are ordinary project data resolved by clientKey from
 * `src/config/portfolio-whatsapp.json`.
 */

const SERVER_ONLY_MARKER = "__contact_server_only__" as const;

if (typeof window !== "undefined") {
  throw new Error(
    "contact.server.ts was imported from client code — this module is server-only.",
  );
}

export type OperationalContact = {
  whatsappNumber: string;
  supportEmail: string | null;
};

/**
 * Contato operacional institucional da 0WEB. Nunca é fallback de portfolio.
 */
export function getOperationalContact(): OperationalContact {
  const whatsappNumber =
    process.env.SUPPORT_WHATSAPP_NUMBER ??
    process.env.UAZAPI_ALERT_NUMBER ??
    "";
  const supportEmail = process.env.SUPPORT_EMAIL ?? null;
  return { whatsappNumber, supportEmail };
}

/**
 * Build a wa.me URL for a verified 0WEB order-support flow. This helper is not
 * used as a portfolio fallback.
 */
export function buildOrderSupportLink(params: {
  orderRef: string;
  message: string;
}): string | null {
  const { whatsappNumber } = getOperationalContact();
  if (!whatsappNumber) return null;
  const digits = whatsappNumber.replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(
    `${params.message}\n\n—\nRef.: ${params.orderRef}`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export const __serverOnlyContactMarker = SERVER_ONLY_MARKER;
