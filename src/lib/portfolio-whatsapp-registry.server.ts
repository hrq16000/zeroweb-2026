/**
 * Dados canônicos de WhatsApp dos portfolios.
 *
 * WhatsApp é dado do próprio projeto, não credencial. A fonte é o arquivo
 * versionado `src/config/portfolio-whatsapp.json`, por clientKey exato.
 * Nunca existe fallback entre clientes e ausência de número é válida.
 */
if (typeof window !== "undefined") {
  throw new Error("portfolio-whatsapp-registry.server.ts imported from client code");
}

import contactData from "@/config/portfolio-whatsapp.json";

type PortfolioContactRow = { whatsapp?: string | null };
type PortfolioContactData = { contacts?: Record<string, PortfolioContactRow> };

const CONTACTS = (contactData as PortfolioContactData).contacts ?? {};

/**
 * Portfolios em que WhatsApp não é o canal operacional esperado. Esta
 * classificação é apenas de auditoria; no funil, `whatsapp: null` já é um
 * estado normal e sempre preserva o lead.
 */
const WHATSAPP_NOT_APPLICABLE = new Set<string>([
  "angel-mix-brecho",
  "bh-barreiro-marmitas",
  "guaratuba-atelie-presentes",
  "guaratuba-oficina-nautica",
  "guaratuba-reparos-residenciais",
  "guaratuba-sabores-da-baia",
  "mirassol-conserta-celular",
  "mirassol-delicias-caseiras",
  "uberlandia-eletrica-residencial",
  "papelemi-personalizados",
]);

export function resolveVersionedPortfolioWhatsApp(
  clientKey?: string | null,
): string | null {
  if (!clientKey) return null;
  const raw = CONTACTS[clientKey]?.whatsapp;
  const digits = typeof raw === "string" ? raw.replace(/\D/g, "") : "";
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function isPortfolioWhatsAppNotApplicable(
  clientKey?: string | null,
): boolean {
  return Boolean(clientKey && WHATSAPP_NOT_APPLICABLE.has(clientKey));
}

export function getVersionedPortfolioWhatsAppClientKeys(): readonly string[] {
  return Object.freeze(
    Object.keys(CONTACTS).filter((clientKey) => Boolean(resolveVersionedPortfolioWhatsApp(clientKey))),
  );
}

export function getPortfolioContactClientKeys(): readonly string[] {
  return Object.freeze(Object.keys(CONTACTS));
}

export function getWhatsAppNotApplicableClientKeys(): readonly string[] {
  return Object.freeze([...WHATSAPP_NOT_APPLICABLE]);
}
