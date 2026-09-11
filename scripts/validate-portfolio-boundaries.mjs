#!/usr/bin/env node
/** Valida isolamento, recursos obrigatórios e privacidade dos sites de clientes. */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CLIENT_ALLOWED_DIGITS } from "./contact-allowlist.mjs";

const root = process.cwd();
const registryPath = resolve(root, "src/config/portfolio-clients.json");
const whatsappRedirectPath = resolve(root, "src/routes/r.whatsapp.$token.ts");
const errors = [];

if (!existsSync(registryPath)) {
  console.error("[portfolio-boundaries] FAIL — registro de clientes ausente");
  process.exit(1);
}

const clients = JSON.parse(readFileSync(registryPath, "utf8"));

if (!existsSync(whatsappRedirectPath)) {
  errors.push("roteador privado de WhatsApp ausente");
} else {
  const redirectSource = readFileSync(whatsappRedirectPath, "utf8");
  if (/clientContact\s*\?\?\s*resolveOperationalWhatsAppContact\s*\(/.test(redirectSource)) {
    errors.push("roteador permite fallback de cliente para o contato central da 0WEB");
  }
  if (
    !/typeof clientKey === ["']string["']\s*\?\s*clientContact\s*:\s*resolveOperationalWhatsAppContact\s*\(/s.test(
      redirectSource,
    )
  ) {
    errors.push("roteador não garante separação explícita entre cliente e contato central");
  }
}
const previewSource = existsSync(resolve(root, "src/lib/portfolio-preview.ts"))
  ? readFileSync(resolve(root, "src/lib/portfolio-preview.ts"), "utf8")
  : "";
if (/get\(["']preview["']\)/.test(previewSource)) {
  errors.push(
    "supressão de overlays usa o parâmetro genérico `preview` (usar `0web_preview`)",
  );
}

// A casca padrão é a dona única da camada de captação da hospedagem.
const shellPath = resolve(root, "src/components/portfolio/PortfolioStandardShell.tsx");
const shellSource = existsSync(shellPath) ? readFileSync(shellPath, "utf8") : "";
const shellOwnsUpsell = /<PortfolioUpsellPopup/.test(shellSource);
if (!shellOwnsUpsell) {
  errors.push("casca padrão do portfólio não monta o pop-up de captação da 0WEB");
}
if (!/isPortfolioEmbedded/.test(previewSource)) {
  errors.push("supressão de overlays não reconhece pré-visualização embutida (iframe)");
}

const keys = new Set();
const slugs = new Set();
const forbiddenImports = ["@/components/site/Header", "@/components/site/Footer"];
const publicContactPatterns = [
  [/wa\.me\//i, "link wa.me"],
  [/(?<!\d)(?:\+?55\s*)?\(?\d{2}\)?\s*9\d{4}[-\s]?\d{4}(?!\d)/, "telefone celular"],
];

for (const client of clients) {
  const label = client.clientKey || "cliente-sem-chave";
  if (!client.clientKey || keys.has(client.clientKey))
    errors.push(`${label}: clientKey ausente ou duplicada`);
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
  if (!existsSync(componentPath))
    errors.push(`${label}: componente não encontrado (${client.componentFile})`);
  if (!existsSync(assetsPath))
    errors.push(`${label}: diretório de assets não encontrado (${client.assetsDir})`);
  if (client.assetsDir === "public/images" && !client.legacySharedAssets) {
    errors.push(`${label}: novo cliente precisa de diretório de assets exclusivo`);
  }
  if (!existsSync(routePath) || !existsSync(componentPath)) continue;

  const route = readFileSync(routePath, "utf8");
  const component = readFileSync(componentPath, "utf8");
  const combined = `${route}\n${component}`;

  if (client.contactMode === "funnelOnly") {
    if (/href\s*=\s*["'`]tel:/i.test(component) || /tel:\+?\d/i.test(component)) {
      errors.push(`${label}: CONTACT_FUNNEL_GATE — contactMode=funnelOnly proíbe tel:`);
    }
    if (/href\s*=\s*["'`](?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)/i.test(component)) {
      errors.push(`${label}: CONTACT_FUNNEL_GATE — contato comercial bypassa o funil`);
    }
  }

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
  // Camada obrigatória da hospedagem: a casca padrão monta o pop-up para todo
  // /portfolio/<slug>. Landings do pipeline atual (contactMode=funnelOnly) não
  // podem montar uma segunda cópia — duplicar a instância era a origem de
  // exibições silenciadas e de posse ambígua entre casca e conteúdo.
  if (!shellOwnsUpsell && !combined.includes("PortfolioUpsellPopup")) {
    errors.push(`${label}: pop-up de captação da 0WEB ausente`);
  }
  if (shellOwnsUpsell && client.contactMode === "funnelOnly" && /<PortfolioUpsellPopup/.test(component)) {
    errors.push(
      `${label}: pop-up de captação montado manualmente na landing (a camada é da casca padrão)`,
    );
  }
  if (!component.includes("PortfolioHostCredit")) {
    errors.push(`${label}: crédito universal com link da 0WEB ausente`);
  }
  for (const forbidden of forbiddenImports) {
    if (component.includes(forbidden)) errors.push(`${label}: dependência proibida (${forbidden})`);
  }
  for (const [pattern, description] of publicContactPatterns) {
    const match = combined.match(pattern);
    if (!match) continue;
    // Telefone público do PRÓPRIO cliente, explicitamente autorizado na
    // allowlist compartilhada (scripts/contact-allowlist.mjs), é conteúdo
    // legítimo da vitrine dele — não vazamento de contato operacional da 0WEB.
    const digits = match[0].replace(/\D/g, "");
    const e164 = digits.length === 11 ? `55${digits}` : digits;
    if (CLIENT_ALLOWED_DIGITS.has(e164)) continue;
    errors.push(`${label}: ${description} exposto no código público`);
  }
}

if (errors.length) {
  console.error("[portfolio-boundaries] FAIL");
  for (const error of errors) console.error(`  ✖ ${error}`);
  process.exit(1);
}

console.log(
  `[portfolio-boundaries] OK — ${clients.length} sites de clientes isolados e parametrizados.`,
);
