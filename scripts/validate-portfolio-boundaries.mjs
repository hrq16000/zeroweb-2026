#!/usr/bin/env node
/** Valida isolamento, recursos obrigatórios e privacidade dos sites de clientes. */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const registryPath = resolve(root, "src/config/portfolio-clients.json");
const errors = [];

if (!existsSync(registryPath)) {
  console.error("[portfolio-boundaries] FAIL — registro de clientes ausente");
  process.exit(1);
}

const clients = JSON.parse(readFileSync(registryPath, "utf8"));
const keys = new Set();
const slugs = new Set();
const forbiddenImports = [
  "@/components/site/Header",
  "@/components/site/Footer",
  "@/components/site/PortfolioUpsellPopup",
];
const publicContactPatterns = [
  [/wa\.me\//i, "link wa.me"],
  [/(?<!\d)(?:\+?55\s*)?\(?\d{2}\)?\s*9\d{4}[-\s]?\d{4}(?!\d)/, "telefone celular"],
];

for (const client of clients) {
  const label = client.clientKey || "cliente-sem-chave";
  if (!client.clientKey || keys.has(client.clientKey)) errors.push(`${label}: clientKey ausente ou duplicada`);
  if (!client.slug || slugs.has(client.slug)) errors.push(`${label}: slug ausente ou duplicado`);
  keys.add(client.clientKey);
  slugs.add(client.slug);

  for (const field of ["siteName", "routeFile", "componentFile", "assetsDir", "ctaMode"]) {
    if (!client[field]) errors.push(`${label}: campo ${field} ausente no registro`);
  }

  const routePath = resolve(root, client.routeFile || "arquivo-inexistente");
  const componentPath = resolve(root, client.componentFile || "arquivo-inexistente");
  const assetsPath = resolve(root, client.assetsDir || "diretorio-inexistente");
  if (!existsSync(routePath)) errors.push(`${label}: rota não encontrada (${client.routeFile})`);
  if (!existsSync(componentPath)) errors.push(`${label}: componente não encontrado (${client.componentFile})`);
  if (!existsSync(assetsPath)) errors.push(`${label}: diretório de assets não encontrado (${client.assetsDir})`);
  if (client.assetsDir === "public/images" && !client.legacySharedAssets) {
    errors.push(`${label}: novo cliente precisa de diretório de assets exclusivo`);
  }
  if (!existsSync(routePath) || !existsSync(componentPath)) continue;

  const route = readFileSync(routePath, "utf8");
  const component = readFileSync(componentPath, "utf8");
  const combined = `${route}\n${component}`;

  const routeRequirements = [
    [/rel:\s*["']canonical["']/, "canonical próprio"],
    [/property:\s*["']og:site_name["']/, "og:site_name próprio"],
    [/property:\s*["']og:image["']/, "imagem social própria"],
    [/rel:\s*["']icon["']/, "ícone próprio"],
    [/application\/ld\+json/, "Schema.org próprio"],
  ];
  for (const [pattern, requirement] of routeRequirements) {
    if (!pattern.test(route)) errors.push(`${label}: ${requirement} ausente`);
  }

  if (!component.includes(`clientKey="${client.clientKey}"`)) {
    errors.push(`${label}: CTA sem clientKey explícita`);
  }
  if (client.socialProofRequired && !component.includes("PortfolioSocialProofPopup")) {
    errors.push(`${label}: mecanismo de prova social ausente`);
  }
  for (const forbidden of forbiddenImports) {
    if (component.includes(forbidden)) errors.push(`${label}: dependência proibida (${forbidden})`);
  }
  for (const [pattern, description] of publicContactPatterns) {
    if (pattern.test(combined)) errors.push(`${label}: ${description} exposto no código público`);
  }
}

if (errors.length) {
  console.error("[portfolio-boundaries] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log(`[portfolio-boundaries] OK — ${clients.length} sites de clientes isolados e parametrizados.`);
