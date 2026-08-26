/**
 * Camada ÚNICA de resolução de contatos permitidos no bundle público.
 *
 * Regra do projeto: nenhum contato da 0WEB (telefone, e-mail, wa.me) pode ser
 * embutido no JavaScript do cliente — o atendimento sempre passa pelo funil e
 * pela rota tokenizada /r/whatsapp/$token, resolvida no servidor.
 *
 * A única exceção são contatos de CLIENTES exibidos em páginas-vitrine do
 * portfólio (o número mostrado é do próprio cliente, público por natureza).
 * Toda allowlist vive aqui e é consumida pelos dois validadores de build.
 */

/** Dígitos (E.164 sem "+") de contatos de clientes autorizados em vitrines. */
export const CLIENT_ALLOWED_DIGITS = new Set(["554196048639", "554198755277"]);

/** Prefixos de chunks que são páginas-vitrine de clientes. */
export const CLIENT_CHUNK_PREFIXES = [
  "BeautyBookingQuiz",
  "RenataBeautyView",
  "RBeautyEditorialView",
  "portfolio.renata-beauty",
  "portfolio.r_beauty",
  "DyzPromoPage",
  "portfolio.dyzpromo",
];

/** Telefone formatado de cliente autorizado. */
export const CLIENT_ALLOWED_PHONE = /^(?:\+?55[- ]?\(?41\)?[- ]?(?:9604-?8639|9875-?5277))$/;

/** Chunks do painel autenticado (leaks viram warning, não erro). */
export const ADMIN_CHUNK_PREFIXES = [
  "app.pedidos",
  "app.servicos",
  "app.leads",
  "app.painel",
  "app.dashboard",
  "app.crm",
  "app.usuarios",
  "app.integracoes",
  "app.configuracoes",
  "app.marketplace",
  "app.b2b",
  "app.landing-overrides",
  "app.seo-google",
  "app.hydration",
  "app.indexacao-portfolio",
];

export function isClientShowcaseChunk(name) {
  return CLIENT_CHUNK_PREFIXES.some((p) => name.startsWith(p));
}

export function isAdminChunk(name) {
  return ADMIN_CHUNK_PREFIXES.some((p) => name.startsWith(p));
}

export function isAllowedWaDigits(digits) {
  return Boolean(digits) && CLIENT_ALLOWED_DIGITS.has(digits);
}

/**
 * Correlaciona o nome do chunk com a rota provável, para o relatório apontar
 * "onde" o dado entrou (ex.: `portfolio.renata-beauty-XYZ.js` → /portfolio/renata-beauty).
 */
export function routeHintFromChunk(name) {
  const base = name.replace(/-[A-Za-z0-9_-]{6,}\.js$/, "").replace(/\.js$/, "");
  if (base.startsWith("app.")) return `/${base.replace(/\./g, "/")} (painel)`;
  if (/^[a-z0-9._$-]+$/.test(base)) return `/${base.replace(/^index$/, "").replace(/\./g, "/")}`;
  return `componente ${base}`;
}
