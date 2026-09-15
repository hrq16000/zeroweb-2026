/**
 * Registro canônico server-only dos destinos WhatsApp de portfolios.
 *
 * Regra: clientKey exato -> destino próprio. Nunca há fallback entre clientes.
 * Os valores aqui são versionados porque são dados operacionais do próprio
 * projeto, não credenciais. Este arquivo não pode ser importado pelo browser.
 *
 * O resolvedor legado ainda lê env/tabela para os projetos que já estavam em
 * produção. Para os destinos migrados para este registro, a env é apenas um
 * adaptador de compatibilidade em memória — nenhum secret externo é necessário.
 */
if (typeof window !== "undefined") {
  throw new Error("portfolio-whatsapp-registry.server.ts imported from client code");
}

const VERSIONED_PORTFOLIO_WHATSAPP: Readonly<Record<string, string>> = Object.freeze({
  // Histórico do próprio resolvedor + página atual identificada com Renata Beauty.
  "r-beauty": "554196048639",
  // Evidência first-party: proposta Mestre dos Serviços para serviço Marido de Aluguel.
  "marido-de-aluguel": "5541997452053",
  // Perfil profissional atual com CTA explícito de WhatsApp.
  "simone-lacerda-vaz": "5541995129384",
  // Entidade exata atual em São José dos Pinhais; canal móvel do negócio.
  "kitutes-na-mesa": "5541996637899",
  // Entidade exata atual em Quatro Barras; canal móvel da oficina/auto socorro.
  "auto-socorro-dentinho": "5541991481647",
  // Entidade exata + endereço/site do cardápio atual do WoodHouse.
  "woodhouse-hamburgueres": "5541984771179",
});

/**
 * Portfolios publicados que deliberadamente não possuem destinatário WhatsApp
 * de cliente: amostras explicitamente identificadas no catálogo ou conversão
 * externa própria. Casos apenas suspeitos nunca entram nesta lista.
 */
const WHATSAPP_NOT_APPLICABLE = new Set<string>([
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

function envNameForVersionedClient(clientKey: string): string {
  if (clientKey === "marido-de-aluguel") return "MARIDO_DE_ALUGUEL_WHATSAPP_NUMBER";
  return `PORTFOLIO_WHATSAPP_${clientKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
}

export function resolveVersionedPortfolioWhatsApp(
  clientKey?: string | null,
): string | null {
  if (!clientKey) return null;
  const digits = VERSIONED_PORTFOLIO_WHATSAPP[clientKey]?.replace(/\D/g, "") ?? "";
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

/**
 * Ponte temporária para o resolvedor já estabilizado em produção. O valor
 * versionado só preenche a env em memória quando ela está vazia; configuração
 * operacional existente nunca é sobrescrita. Isso elimina a dependência do
 * "cofre" para os projetos migrados sem quebrar os legados ainda não migrados.
 */
export function hydrateLegacyResolverFromVersionedRegistry(
  env: Record<string, string | undefined> = process.env,
): void {
  for (const [clientKey, digits] of Object.entries(VERSIONED_PORTFOLIO_WHATSAPP)) {
    const envName = envNameForVersionedClient(clientKey);
    if (!env[envName]?.trim()) env[envName] = digits;
  }
}

export function isPortfolioWhatsAppNotApplicable(
  clientKey?: string | null,
): boolean {
  return Boolean(clientKey && WHATSAPP_NOT_APPLICABLE.has(clientKey));
}

export function getVersionedPortfolioWhatsAppClientKeys(): readonly string[] {
  return Object.freeze(Object.keys(VERSIONED_PORTFOLIO_WHATSAPP));
}

export function getWhatsAppNotApplicableClientKeys(): readonly string[] {
  return Object.freeze([...WHATSAPP_NOT_APPLICABLE]);
}
