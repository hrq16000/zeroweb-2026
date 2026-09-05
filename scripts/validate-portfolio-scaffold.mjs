#!/usr/bin/env node
/**
 * Portão do playbook: todo projeto em /portfolio/<slug> nasce completo.
 *
 * Valida, por cliente registrado:
 *  - componente exclusivo existente e sem Header/Footer da 0WEB;
 *  - diretório próprio de assets (salvo legado explicitamente marcado);
 *  - funil individual `funnel-<slug>` referenciado (nunca funil universal);
 *  - registro no site registry (sitemap/SEO/card);
 *  - cobertura de pop-up/share herdada da rota compartilhada;
 *  - configuração central do pop-up válida.
 *
 * Uso: node scripts/validate-portfolio-scaffold.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (p) => (existsSync(resolve(root, p)) ? readFileSync(resolve(root, p), "utf8") : "");
const errors = [];

const clients = JSON.parse(read("src/config/portfolio-clients.json") || "[]");
// Contrato de experiência (Onda 6): todo projeto — inclusive os futuros criados
// pelo wizard — precisa nascer com perfil de motion resolvível e movimento real.
const motionProfiles = JSON.parse(read("src/config/portfolio-motion-profiles.json") || "{}");
const catalogProjects = (() => {
  const c = JSON.parse(read("src/config/portfolio-catalog.json") || "[]");
  return c.projects ?? c;
})();
const segmentBySlug = new Map(catalogProjects.map((p) => [p.slug, p.segment]));
const routeSource = read("src/routes/portfolio.$slug.tsx");
const registrySource = read("src/lib/portfolio-site-registry.ts");
const upsellConfigRaw = read("src/config/portfolio-upsell.json");

// A casca padrão (PortfolioStandardShell) já garante pop-up de captação,
// botão de compartilhar, contato flutuante e rodapé da hospedagem.
const sharedShell = /<PortfolioStandardShell/.test(routeSource);
if (!sharedShell && !/<PortfolioUpsellPopup/.test(routeSource)) {
  errors.push("rota compartilhada não renderiza PortfolioUpsellPopup");
}
if (!sharedShell && !/<PortfolioShareButton/.test(routeSource)) {
  errors.push("rota compartilhada não renderiza PortfolioShareButton");
}


if (!upsellConfigRaw) {
  errors.push("configuração central do pop-up ausente (src/config/portfolio-upsell.json)");
} else {
  let cfg;
  try {
    cfg = JSON.parse(upsellConfigRaw);
  } catch {
    errors.push("src/config/portfolio-upsell.json inválido");
  }
  const d = cfg?.default;
  const required = ["kicker", "title", "description", "ctaLabel", "dismissLabel", "funnelSlug"];
  for (const key of required) {
    if (!d?.[key]) errors.push(`config do pop-up sem "${key}" no default`);
  }
  if (!Array.isArray(d?.bullets) || d.bullets.length === 0) {
    errors.push("config do pop-up sem bullets");
  }
  const disp = d?.display ?? {};
  if (!(disp.timerMs > 0) || !(disp.fallbackMs > 0) || !(disp.scrollPct > 0 && disp.scrollPct <= 1)) {
    errors.push("regras de exibição do pop-up inválidas (timerMs, fallbackMs, scrollPct)");
  }
}

const UNIVERSAL_FUNNELS = ["diagnostico-0web", "funnel-service", "funnel-order-support"];

for (const client of clients) {
  const label = `[${client.slug}]`;
  if (!client.clientKey || !client.siteName) errors.push(`${label} registro incompleto`);

  const componentSource = read(client.componentFile);
  if (!componentSource) {
    errors.push(`${label} componente ausente: ${client.componentFile}`);
    continue;
  }
  for (const forbidden of ["@/components/site/Header", "@/components/site/Footer"]) {
    if (componentSource.includes(forbidden)) {
      errors.push(`${label} importa identidade da 0WEB (${forbidden})`);
    }
  }
  if (client.hostCaptureRequired && !/PortfolioHostCredit/.test(componentSource)) {
    errors.push(`${label} sem crédito de hospedagem (PortfolioHostCredit)`);
  }
  if (!client.legacySharedAssets && !existsSync(resolve(root, client.assetsDir))) {
    errors.push(`${label} sem diretório exclusivo de assets (${client.assetsDir})`);
  }

  const hasClientCta =
    /(PortfolioCTAQuiz|FunnelCTAButton|BeautyBookingQuiz|ProductActionGate|FunnelModalWrapper)/.test(
      componentSource,
    );
  if (!hasClientCta) {
    errors.push(`${label} nenhum CTA de funil próprio no componente do cliente`);
  }
  const declaredFunnels = [
    ...componentSource.matchAll(/(?:formSlug|funnelSlug)=["'`]([^"'`]+)["'`]/g),
  ].map((m) => m[1]);
  for (const slug of declaredFunnels) {
    if (UNIVERSAL_FUNNELS.includes(slug)) {
      errors.push(`${label} usa funil universal da 0WEB (${slug})`);
    }
  }
  if (!/clientKey=["'`]/.test(componentSource)) {
    errors.push(`${label} CTA sem clientKey (roteamento privado de WhatsApp)`);
  }

  // --- Contrato de experiência ------------------------------------------
  const segment = segmentBySlug.get(client.slug);
  const hasProfile = Boolean(
    motionProfiles.overrides?.[client.slug] ??
      (segment && motionProfiles.defaultsBySegment?.[segment]) ??
      motionProfiles.defaultsBySegment?.default,
  );
  if (!hasProfile) {
    errors.push(`${label} sem perfil de motion resolvível (segmento "${segment ?? "—"}")`);
  }
  const hasMotionSignal =
    /@\/components\/motion/.test(componentSource) ||
    /from "motion\/react"/.test(componentSource) ||
    /\banimate-/.test(componentSource) ||
    /transition-/.test(componentSource);
  if (!hasMotionSignal) {
    errors.push(`${label} sem nenhum sinal de experiência/motion (página estática)`);
  }
  if (!/prefers-reduced-motion|@\/components\/motion|from "motion\/react"/.test(componentSource) &&
      /animation:[^;]*infinite/i.test(componentSource)) {
    errors.push(`${label} animação infinita sem guarda de reduced motion`);
  }

  const usesSharedRoute = client.routeFile.includes("portfolio.$slug.tsx");
  if (usesSharedRoute) {
    if (registrySource && !registrySource.includes(`"${client.slug}"`)) {
      errors.push(`${label} ausente em src/lib/portfolio-site-registry.ts (sitemap/SEO/card)`);
    }
  } else {
    // Rota dedicada: a cobertura vem da casca padrão ou do próprio componente.
    const dedicatedSource = read(client.routeFile);
    const dedicatedShell = /PortfolioStandardShell/.test(dedicatedSource);
    if (!dedicatedShell && !/PortfolioUpsellPopup/.test(componentSource)) {
      errors.push(`${label} rota dedicada sem pop-up de captação da 0WEB`);
    }
    const dedicatedRoute = dedicatedSource;
    if (dedicatedRoute && !/rel: "canonical"|rel: 'canonical'/.test(dedicatedRoute)) {
      errors.push(`${label} rota dedicada sem canonical`);
    }
  }
}

if (errors.length) {
  console.error(`[portfolio-scaffold] FAIL — ${errors.length} problema(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`[portfolio-scaffold] OK — ${clients.length} projeto(s) conformes ao playbook`);
