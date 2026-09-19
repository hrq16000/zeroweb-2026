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
const servicosIndexPath = "src/routes/servicos.index.tsx";
const cartFunnelPath = "src/lib/cart-funnel.functions.ts";
const thankYouContentPath = "src/lib/thank-you-content.ts";
const addToCartButtonPath = "src/components/site/AddToCartButton.tsx";
const orderSummaryPath = "src/components/site/OrderSummaryCard.tsx";
const ordersFunctionsPath = "src/lib/orders.functions.ts";
const unifiedLeadsGrantPath = "supabase/migrations/20260919014500_harden_unified_leads_view_grants.sql";
const dynamicFunnelPath = "src/lib/dynamic-funnel.functions.ts";
const adminLeadsPath = "src/routes/_authenticated/app.leads.index.tsx";

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
const servicosIndex = source(servicosIndexPath);
const cartFunnel = source(cartFunnelPath);
const thankYouContent = source(thankYouContentPath);
const addToCartButton = source(addToCartButtonPath);
const orderSummary = source(orderSummaryPath);
const ordersFunctions = source(ordersFunctionsPath);
const unifiedLeadsGrant = source(unifiedLeadsGrantPath);
const dynamicFunnel = source(dynamicFunnelPath);
const adminLeads = source(adminLeadsPath);

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
  /export function upsertCartItem[\s\S]*qty:\s*1/,
  "carrinho perdeu a regra unitária de serviços",
);
requirePattern(
  cartPath,
  cart,
  /const list = upsertCartItem\(readCart\(\), item\)/,
  "addToCart não usa a regra canônica do carrinho",
);
requirePattern(
  cartPath,
  cart,
  /item\.variantId[\s\S]*sameServiceIndex/,
  "troca de variante do mesmo serviço não está protegida",
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
requirePattern(
  servicosIndexPath,
  servicosIndex,
  /paginated\.map[\s\S]*<AddToCartButton/,
  "vitrine perdeu o atalho de adicionar produto ao carrinho",
);
requirePattern(
  servicosIndexPath,
  servicosIndex,
  /MULTI_VARIANT_SERVICE_SLUGS[\s\S]*Escolher plano/,
  "produto com múltiplas variantes pode voltar a entrar no carrinho sem escolha",
);
if (/SERVICE_LIST|numberOfItems:\s*SERVICE_LIST\.length|faqItems/.test(servicosIndex)) {
  errors.push(`${servicosIndexPath}: schema estático pode divergir do catálogo real da loja`);
}
requirePattern(
  servicosIndexPath,
  servicosIndex,
  /"@type":\s*"CollectionPage"/,
  "índice da loja perdeu o schema CollectionPage",
);
requirePattern(
  cartDrawerPath,
  cartDrawer,
  /variantId:\s*i\.variantId[\s\S]*variantLabel:\s*i\.variantLabel/,
  "telemetria do carrinho perdeu a variante comercial",
);
requirePattern(
  cartFunnelPath,
  cartFunnel,
  /variantId:[\s\S]*variantLabel:/,
  "schema do funil do carrinho não preserva variantes",
);
requirePattern(
  checkoutPath,
  checkout,
  /function\s+validateAssistedContact\(\)[\s\S]*phoneDigits\.length\s*<\s*10/,
  "checkout assistido pode aceitar pedido sem contato válido",
);
requirePattern(
  checkoutPath,
  checkout,
  /step:\s*"checkout_started"[\s\S]*paymentChannel:\s*"site"/,
  "entrada no checkout não está registrada na telemetria comercial",
);
requirePattern(
  checkoutPath,
  checkout,
  /saveCartFunnelStep\([\s\S]*step:\s*"handoff_assisted"/,
  "checkout assistido público deixou de registrar no pipeline do carrinho",
);
if (/submitPublicLead\(/.test(checkout)) {
  errors.push(`${checkoutPath}: checkout anônimo voltou a criar fonte paralela fora do pipeline do carrinho`);
}
requirePattern(
  checkoutPath,
  checkout,
  /rotateCartSessionKey\(\)/,
  "sessão concluída do carrinho pode ser sobrescrita por uma nova jornada",
);
requirePattern(
  cartFunnelPath,
  cartFunnel,
  /"handoff_assisted"[\s\S]*"assisted"[\s\S]*p_scope:\s*"checkout_assisted"/,
  "pipeline assistido perdeu step, canal ou rate limit",
);
requirePattern(
  cartPath,
  cart,
  /getCartSessionKey[\s\S]*rotateCartSessionKey/,
  "carrinho perdeu a sessão canônica compartilhada",
);
if (/handleAssistedCheckout\(\)[\s\S]{0,180}if\s*\(!session\)\s*return\s+handleGoogle/.test(checkout)) {
  errors.push(`${checkoutPath}: checkout assistido voltou a exigir login Google`);
}
if (/R\$ 28M\+|98%|4\.9\/5|ROAS médio|custo médio por lead/i.test(thankYouContent)) {
  errors.push(`${thankYouContentPath}: prova social/resultado sem evidência auditável reapareceu`);
}
if (/Salve seu carrinho|window\.location\.href\s*=\s*["']\/auth/i.test(addToCartButton)) {
  errors.push(`${addToCartButtonPath}: compra rápida voltou a pressionar login antes do checkout`);
}
if (/Abrir WhatsApp|Pagamento confirmado!|R\$ 28M\+|4\.9\/5/i.test(thankYouContent)) {
  errors.push(`${thankYouContentPath}: mensagem de obrigado voltou a afirmar canal/resultado sem confirmação`);
}
requirePattern(
  ordersFunctionsPath,
  ordersFunctions,
  /markOrderAssistedHandoff[\s\S]*payment_method:\s*"manual"/,
  "pedido assistido voltou a ser registrado como WhatsApp",
);
requirePattern(
  orderSummaryPath,
  orderSummary,
  /if \(order\.status === "paid"\)[\s\S]*event:\s*"purchase"/,
  "evento purchase pode disparar antes do pagamento confirmado",
);
if (/Proposta no WhatsApp|Em até 1h útil|payment_method === "whatsapp"/i.test(orderSummary)) {
  errors.push(`${orderSummaryPath}: resumo do pedido voltou a prometer canal/SLA legado`);
}
requirePattern(
  cartDrawerPath,
  cartDrawer,
  /i\.variantLabel[\s\S]*font-medium text-primary/,
  "carrinho deixou de exibir a variante escolhida",
);
requirePattern(
  cartDrawerPath,
  cartDrawer,
  /Continuar para checkout/,
  "carrinho perdeu o CTA único de progressão",
);
if (/Finalizar compra[\s\S]*Finalizar com atendimento/.test(cartDrawer)) {
  errors.push(`${cartDrawerPath}: drawer voltou a duplicar decisões que pertencem ao checkout`);
}
requirePattern(
  unifiedLeadsGrantPath,
  unifiedLeadsGrant,
  /REVOKE ALL ON TABLE public\.vw_unified_leads FROM anon/,
  "view unificada voltou a conceder acesso direto ao papel anon",
);
if (/digitsOnly\(String\(wa\.alert_phone\)\)|Boolean\(wa\.redirect_phone\)/.test(dynamicFunnel)) {
  errors.push(`${dynamicFunnelPath}: funil voltou a usar telefone operacional armazenado no formulário`);
}
requirePattern(
  dynamicFunnelPath,
  dynamicFunnel,
  /resolveOperationalWhatsAppContact[\s\S]*operationalAlert/,
  "alerta institucional não usa o contato operacional canônico",
);
requirePattern(
  adminLeadsPath,
  adminLeads,
  /handoff_assisted:\s*"Atendimento solicitado"[\s\S]*cartLeadDetails/,
  "painel unificado não apresenta checkout assistido de forma operacional",
);
requirePattern(
  cartFunnelPath,
  cartFunnel,
  /assistedProtocol[\s\S]*protocol/,
  "checkout assistido não emite protocolo server-side",
);
requirePattern(
  adminLeadsPath,
  adminLeads,
  /Protocolo[\s\S]*cartDetails\.protocol/,
  "painel não exibe o protocolo assistido",
);

if (errors.length) {
  console.error("[portal-architecture] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log("[portal-architecture] OK — Home, loja e portfólio permanecem separados.");
