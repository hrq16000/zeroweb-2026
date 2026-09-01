/** Chaves públicas de roteamento. Contatos e credenciais permanecem server-only. */
export const PORTFOLIO_CLIENT_KEYS = [
  "miro-tech","premium-envelopamentos","angel-mix-brecho","brecho-sao-francisco","reuse-house-brecho","toquinho-de-gente-brecho","dlara-pizzaria","woodhouse-hamburgueres","beto-pasteis","marmitaria-dom-diego","sos-presentes-cosmeticos",
  "santos-montador-de-moveis","jkl-marcenaria","acai-total-araucaria","mary-diarista","eisenfer-tubos-acos","eletro-solucoes-eficazes","eletrovale-eletromecanica","aguia-sul-sinalizacao","diego-montador-moveis","espaco-cih-luh","salao-da-marcia","no-brilho-higienizacao","ecommerce-on","paulo-mestre-de-obras","lucas-arruma-maquina-lavar","lk-alvenaria","vila-da-capivara","ag-electrical-services","refrigeracao-maresia","studio-de-cilios","mp-festas-eventos","confeitaria-chyrley",
  "dyzpromo",
  "renata-beauty",
  "r-beauty",
  "marido-de-aluguel",
  "emporio-lelecute",
  "paraiso-do-hot-dog",
  "rm-fretes",
  "rj-servicos-drywall",
  "lolipa-arte-em-festas","confeitaria-sabor-da-realeza",
] as const;
export type PortfolioClientKey = (typeof PORTFOLIO_CLIENT_KEYS)[number];

export function isPortfolioClientKey(value: unknown): value is PortfolioClientKey {
  return typeof value === "string" && (PORTFOLIO_CLIENT_KEYS as readonly string[]).includes(value);
}
