/**
 * Contrato universal de novos portfolios (v4+).
 *
 * Os seis manifests pré-v4 já existentes em 2026-10-10 são dívida histórica
 * explicitamente congelada. Esta exceção não pode crescer silenciosamente:
 * todo novo slug gerenciado precisa do contrato individual com os seis gates.
 * O baseline dos outros 90 slugs é protegido separadamente pelo scaffold.
 */
export const HISTORICAL_MANAGED_PRE_V4_SLUGS = Object.freeze([
  "carecas-infotec",
  "moreira-auto-mecanica",
  "jkl-decor",
  "adhonep-curitiba",
  "autoescola-aptos",
  "arildo-madeiras",
]);

const historicalManaged = new Set(HISTORICAL_MANAGED_PRE_V4_SLUGS);

export function checkNewPortfolioIndividualSiteVersion(slug, manifest) {
  if (historicalManaged.has(slug)) return null;

  const version = manifest?.contractVersion;
  if (typeof version !== "number" || !Number.isSafeInteger(version) || version < 4) {
    return "PORTFOLIO_INDIVIDUAL_SITE_GATE: portfolio novo exige contractVersion >= 4; manifesto antigo/ausente nao pode dispensar os gates SEO individuais";
  }
  return null;
}
