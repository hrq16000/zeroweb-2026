#!/usr/bin/env node
/**
 * Portão de prévia social e ícones dos projetos /portfolio/<slug>.
 *
 * Valida, antes do build:
 *  - imagem social existente no disco, em formato aceito por WhatsApp/Facebook
 *    (JPEG ou PNG — WebP não renderiza em prévia de link);
 *  - versão de cache-busting (socialVersion) presente;
 *  - ícone do cliente existente;
 *  - conjunto global de ícones do site (favicon.ico, SVG, PNGs, apple-touch-icon).
 *
 * Uso: node scripts/validate-portfolio-icons.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const clients = JSON.parse(readFileSync(resolve("src/config/portfolio-clients.json"), "utf8"));
const assets = JSON.parse(readFileSync(resolve("src/config/portfolio-assets.json"), "utf8"));

const SOCIAL_OK = /\.(jpe?g|png)$/i;
const errors = [];
const warnings = [];

const GLOBAL_ICONS = [
  "public/favicon.ico",
  "public/favicon.svg",
  "public/favicon-32.png",
  "public/favicon-192.png",
  "public/favicon-512.png",
  "public/apple-touch-icon.png",
];
for (const icon of GLOBAL_ICONS) {
  if (!existsSync(resolve(icon))) errors.push(`ícone global ausente: ${icon}`);
}

const rootHead = readFileSync(resolve("src/routes/__root.tsx"), "utf8");
for (const rel of ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png"]) {
  if (!rootHead.includes(rel)) errors.push(`__root.tsx não referencia ${rel}`);
}

for (const client of clients) {
  const entry = assets.clients?.[client.clientKey];
  const label = `[${client.slug}]`;
  if (!entry) {
    errors.push(`${label} sem entrada em portfolio-assets.json`);
    continue;
  }
  const social = entry.socialImage;
  if (!social) errors.push(`${label} socialImage ausente`);
  else {
    if (!SOCIAL_OK.test(social)) {
      errors.push(`${label} socialImage em formato não suportado por prévia social: ${social}`);
    }
    if (social.startsWith("/images/") && !existsSync(resolve("public", social.slice(1)))) {
      errors.push(`${label} socialImage não encontrada no disco (${social})`);
    }
  }
  if (!entry.socialVersion) {
    warnings.push(`${label} sem socialVersion (rode: node scripts/generate-social-jpg.mjs)`);
  }
  if (!entry.icon) errors.push(`${label} icon ausente`);
  else if (entry.icon.startsWith("/images/") && !existsSync(resolve("public", entry.icon.slice(1)))) {
    errors.push(`${label} icon não encontrado no disco (${entry.icon})`);
  }
}

for (const w of warnings) console.warn(`[portfolio-icons] WARN ${w}`);
if (errors.length) {
  console.error(`[portfolio-icons] FAIL — ${errors.length} problema(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `[portfolio-icons] OK — ${clients.length} projeto(s) com prévia social e ícone válidos (${warnings.length} aviso(s))`,
);
