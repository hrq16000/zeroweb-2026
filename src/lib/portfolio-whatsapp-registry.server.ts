/**
 * Dados canônicos de WhatsApp dos portfolios.
 *
 * Clientes legados usam o registro versionado. Projetos novos podem apontar
 * para um segredo Vercel PORTFOLIO_WHATSAPP_<CLIENT_KEY>, sempre server-only.
 * A referência deve corresponder exatamente ao clientKey; sem fallback entre clientes.
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
  const expectedEnvKey = `PORTFOLIO_WHATSAPP_${clientKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
  const candidate = typeof raw === "string" && raw.startsWith("env:")
    ? raw === `env:${expectedEnvKey}` ? process.env[expectedEnvKey] ?? null : null
    : raw;
  const digits = typeof candidate === "string" ? candidate.replace(/\D/g, "") : "";
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function isPortfolioWhatsAppEnvironmentConfigured(clientKey?: string | null): boolean {
  if (!clientKey) return false;
  const expectedEnvKey = `PORTFOLIO_WHATSAPP_${clientKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
  return CONTACTS[clientKey]?.whatsapp === `env:${expectedEnvKey}` && Boolean(resolveVersionedPortfolioWhatsApp(clientKey));
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
