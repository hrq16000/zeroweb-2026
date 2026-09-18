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

const header = source(headerPath);
const footer = source(footerPath);
const float = source(floatPath);
const home = source(homePath);
const marketplace = source(marketplacePath);
const marketplaceRedirect = source(marketplaceRedirectPath);
const gmb = source(gmbPath);
const architecture = source(architecturePath);

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

if (errors.length) {
  console.error("[portal-architecture] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log("[portal-architecture] OK — Home, loja e portfólio permanecem separados.");
