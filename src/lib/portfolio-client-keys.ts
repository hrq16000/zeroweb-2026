/** Chaves públicas de roteamento. Contatos e credenciais permanecem server-only. */
export const PORTFOLIO_CLIENT_KEYS = [
  "lk-alvenaria","vila-da-capivara","ag-electrical-services","refrigeracao-maresia","studio-de-cilios","mp-festas-eventos","confeitaria-chyrley",
  "dyzpromo",
  "renata-beauty",
  "r-beauty",
  "marido-de-aluguel",
  "emporio-lelecute",
  "paraiso-do-hot-dog",
  "rm-fretes",
  "rj-servicos-drywall",
] as const;
export type PortfolioClientKey = (typeof PORTFOLIO_CLIENT_KEYS)[number];

export function isPortfolioClientKey(value: unknown): value is PortfolioClientKey {
  return typeof value === "string" && (PORTFOLIO_CLIENT_KEYS as readonly string[]).includes(value);
}
