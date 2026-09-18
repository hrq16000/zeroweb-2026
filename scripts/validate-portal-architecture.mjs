#!/usr/bin/env node
/**
 * Gate estrutural do portal 0WEB.
 *
 * Protege as fronteiras canônicas:
 * Home = posicionamento/direcionamento
 * /servicos = loja
 * /portfolio = galeria
 * /portfolio/:slug = experiência isolada do cliente
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];

function source(path) {
  const full = resolve(root, path);
  if (!existsSync(full)) {
    errors.push(`arquivo ausente: ${path}`);
    return "";
  }
  return readFileSync(full, "utf8");
}
function requirePattern(path, text, pattern, message) {
  if (!pattern.test(text)) errors.push(`${path}: ${message}`);
}

const headerPath = "src/components/site/Header.tsx";
const footerPath = "src/components/site/Footer.tsx";
const floatPath = "src/components/site/WhatsAppFloat.tsx";
const homePath = "src/components/site/HomeExperienceV2.tsx";
const marketplacePath = "src/routes/servicos.marketplace.tsx";
const marketplaceRedirectPath = "src/routes/marketplace.tsx";
const gmbPath = "src/routes/servicos.google-meu-negocio.tsx";
const architecturePath = "docs/PORTAL_ARCHITECTURE.md";
const cartPath = "src/lib/cart.ts";
const cartDrawerPath = "src/components/site/CartDrawer.tsx";
const checkoutPath = "src/routes/checkout.tsx";
const googleMeuNegocioPath = "src/routes/servicos.google-meu-negocio.tsx";
const redesSociaisPath = "src/routes/servicos.gestao-redes-sociais.tsx";
const dynamicServicePath = "src/routes/servicos.$slug.tsx";

const header = source(headerPath);
const footer = source(footerPath);
const float = source(floatPath);
const home = source(homePath);
const marketplace = source(marketplacePath);
const marketplaceRedirect = source(marketplaceRedirectPath);
const gmb = source(gmbPath);
const architecture = source(architecturePath);
const cart = source(cartPath);
const cartDrawer = source(cartDrawerPath);
const checkout = source(checkoutPath);
const googleMeuNegocio = source(googleMeuNegocioPath);
const redesSociais = source(redesSociaisPath);
const dynamicService = source(dynamicServicePath);

requirePattern(headerPath, header, /const\s+isLojaArea\s*=/, "não classifica as rotas da loja");
requirePattern(
  headerPath,
  header,
  /!isLojaArea\s*&&\s*\([\s\S]*?Solicitar Diagnóstico/,
  "CTA institucional do header não está protegido fora da loja",
);
requirePattern(footerPath, footer, /const\s+isLojaArea\s*=/, "não classifica as rotas da loja");
requirePattern(
  footerPath,
  footer,
  /!isLojaArea\s*&&\s*\([\s\S]*?Iniciar diagnóstico/,
  "CTA institucional do footer não está protegido fora da loja",
);
requirePattern(
  floatPath,
  float,
  /if\s*\(isLojaArea\)\s*return\s+null/,
  "botão flutuante institucional pode reaparecer dentro da loja",
);
requirePattern(homePath, home, /to="\/servicos"/, "Home não aponta explicitamente para a loja");
requirePattern(homePath, home, /to="\/portfolio"/, "Home não aponta explicitamente para o portfólio");
requirePattern(homePath, home, /Loja de Serviços/, "Home perdeu a nomenclatura canônica da loja");
requirePattern(homePath, home, /Portfólio/, "Home perdeu a nomenclatura canônica do portfólio");

requirePattern(
  marketplaceRedirectPath,
  marketplaceRedirect,
  /to:\s*"\/servicos\/marketplace"/,
  "/marketplace não redireciona para a rota canônica",
);
requirePattern(
  marketplacePath,
  marketplace,
  /canonical",\s*href:\s*\x60\$\{ORIGIN\}\/servicos\/marketplace\x60/,
  "canonical do marketplace não aponta para /servicos/marketplace",
);
if (marketplace.includes("${ORIGIN}/marketplace")) {
  errors.push(`${marketplacePath}: referência SEO antiga para /marketplace`);
}

requirePattern(
  gmbPath,
  gmb,
  /name:\s*"Serviços",\s*item:\s*"https:\/\/0web\.com\.br\/servicos"/,
  "breadcrumb de Google Meu Negócio não aponta para /servicos",
);

requirePattern(
  architecturePath,
  architecture,
  /\/portfolio\/:slug[\s\S]*funil próprio/i,
  "documentação não fixa o funil próprio por projeto",
);
requirePattern(
  architecturePath,
  architecture,
  /\/servicos[\s\S]*loja virtual/i,
  "documentação não fixa /servicos como loja",
);

requirePattern(
  cartPath,
  cart,
  /Object\.assign\(existing, item, \{ qty: 1 \}\)/,
  "carrinho de serviços voltou a multiplicar quantidade por clique",
);
if (/existing\.qty\s*\+=\s*1/.test(cart)) {
  errors.push(`${cartPath}: serviço não pode multiplicar quantidade`);
}
if (/aria-label="Aumentar"|aria-label="Diminuir"/.test(cartDrawer)) {
  errors.push(`${cartDrawerPath}: controle de quantidade reapareceu para serviços`);
}
if (/wa\.me|api\.whatsapp\.com|href=["'`]tel:/i.test(checkout)) {
  errors.push(`${checkoutPath}: checkout voltou a expor contato direto`);
}
requirePattern(
  checkoutPath,
  checkout,
  /hasRecurring[\s\S]*handleAssistedCheckout/,
  "checkout recorrente não está protegido contra cobrança Stripe one-time",
);
requirePattern(
  googleMeuNegocioPath,
  googleMeuNegocio,
  /variantId:\s*"plano-unico"[\s\S]*variantId:\s*"plano-pro"/,
  "Google Meu Negócio perdeu as variantes comerciais do carrinho",
);
requirePattern(
  googleMeuNegocioPath,
  googleMeuNegocio,
  /<AddToCartButton[\s\S]*GMB_UNICO_PRODUCT[\s\S]*<AddToCartButton[\s\S]*GMB_PRO_PRODUCT/,
  "planos do Google Meu Negócio não fecham pela loja",
);
requirePattern(
  redesSociaisPath,
  redesSociais,
  /function\s+planCartItem[\s\S]*<AddToCartButton/,
  "planos de Gestão de Redes Sociais não fecham pela loja",
);
requirePattern(
  dynamicServicePath,
  dynamicService,
  /\{!isProduct\s*&&\s*<CTA\s*\/>\}/,
  "CTA institucional final pode reaparecer em produto da loja",
);
requirePattern(
  dynamicServicePath,
  dynamicService,
  /isProduct\s*\?\s*\([\s\S]*?<ProductActionGate[\s\S]*?\)\s*:\s*\([\s\S]*?<ServiceCTA/,
  "CTA pós-recomendações não diferencia produto de serviço consultivo",
);

if (errors.length) {
  console.error("[portal-architecture] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log("[portal-architecture] OK — Home, loja e portfólio permanecem separados.");
