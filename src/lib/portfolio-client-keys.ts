/** Chaves públicas de roteamento. Contatos e credenciais permanecem server-only. */
export const PORTFOLIO_CLIENT_KEYS = ["dyzpromo", "renata-beauty", "r-beauty"] as const;
export type PortfolioClientKey = (typeof PORTFOLIO_CLIENT_KEYS)[number];

