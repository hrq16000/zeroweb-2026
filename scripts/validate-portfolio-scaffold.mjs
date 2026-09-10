#!/usr/bin/env node
/**
 * Portão do playbook: todo projeto em /portfolio/<slug> nasce completo.
 *
 * Valida, por cliente registrado:
 *  - componente exclusivo existente e sem Header/Footer da 0WEB;
 *  - diretório próprio de assets (salvo legado explicitamente marcado);
 *  - funil individual referenciado;
 *  - registro no site registry;
 *  - cobertura da casca compartilhada;
 *  - perfil de experiência/motion;
 *  - para creativeContractVersion >= 2: brief criativo e workbench não publicável.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (p) => (existsSync(resolve(root, p)) ? readFileSync(resolve(root, p), "utf8") : "");
const errors = [];

const clients = JSON.parse(read("src/config/portfolio-clients.json") || "[]");
const motionProfiles = JSON.parse(read("src/config/portfolio-motion-profiles.json") || "{}");
const catalogProjects = (() => {
  const c = JSON.parse(read("src/config/portfolio-catalog.json") || "[]");
  return c.projects ?? c;
})();
const catalogBySlug = new Map(catalogProjects.map((p) => [p.slug, p]));
const segmentBySlug = new Map(catalogProjects.map((p) => [p.slug, p.segment]));
const routeSource = read("src/routes/portfolio.$slug.tsx");
const registrySource = read("src/lib/portfolio-site-registry.ts");
const upsellConfigRaw = read("src/config/portfolio-upsell.json");

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
const CREATIVE_PLACEHOLDER = /\[PREENCHER\]/i;
const SCAFFOLD_MARKER = /CREATIVE_BRIEF_REQUIRED/;

for (const client of clients) {
  const label = `[${client.slug}]`;
  const catalogProject = catalogBySlug.get(client.slug);
  const isPublished = catalogProject?.status === "published";
  const isCreativeV2 = Number(client.creativeContractVersion ?? 0) >= 2;

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
    /(PortfolioCTAQuiz|FunnelCTAButton|BeautyBookingQuiz|ProductActionGate|FunnelModalWrapper|data-portfolio-external-cta)/.test(
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
  if (!/clientKey=["'`]/.test(componentSource) && !/data-portfolio-external-cta=["'`]/.test(componentSource)) {
    errors.push(`${label} CTA sem clientKey (roteamento privado de WhatsApp)`);
  }

  // --- Creative contract v2 ---------------------------------------------
  if (isCreativeV2) {
    if (!client.creativeBriefFile) {
      errors.push(`${label} creativeContractVersion=2 sem creativeBriefFile`);
    } else {
      const brief = read(client.creativeBriefFile);
      if (!brief) {
        errors.push(`${label} creative brief ausente: ${client.creativeBriefFile}`);
      } else if (isPublished && CREATIVE_PLACEHOLDER.test(brief)) {
        errors.push(`${label} publicado com creative brief ainda contendo [PREENCHER]`);
      }
    }

    if (isPublished && SCAFFOLD_MARKER.test(componentSource)) {
      errors.push(`${label} publicado com workbench de scaffold (CREATIVE_BRIEF_REQUIRED)`);
    }

    // Novo portfolio publicado precisa de gramática de motion própria; o
    // default por segmento é fallback legado, não direção criativa final.
    if (isPublished && !motionProfiles.overrides?.[client.slug]) {
      errors.push(`${label} creative v2 publicado sem override próprio de motion`);
    }
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
    /\btransition\b|transition-/.test(componentSource) ||
    /(?:group-)?hover:/.test(componentSource) ||
    // Projeto conduzido pelo Portfolio Blueprint: o motion é declarado por
    // seção (`motion: { intensity | reveal | stagger }`) e executado pelo
    // renderer compartilhado, que usa os primitives de `@/components/motion`.
    (/PortfolioBlueprintRenderer/.test(componentSource) &&
      /motion:\s*\{/.test(componentSource));
  if (!hasMotionSignal) {
    errors.push(`${label} sem nenhum sinal de experiência/motion (página estática)`);
  }

  if (
    !/prefers-reduced-motion|@\/components\/motion|from "motion\/react"/.test(componentSource) &&
    /animation:[^;]*infinite/i.test(componentSource)
  ) {
    errors.push(`${label} animação infinita sem guarda de reduced motion`);
  }

  const usesSharedRoute = client.routeFile.includes("portfolio.$slug.tsx");
  if (usesSharedRoute) {
    if (registrySource && !registrySource.includes(`"${client.slug}"`)) {
      errors.push(`${label} ausente em src/lib/portfolio-site-registry.ts (sitemap/SEO/card)`);
    }
  } else {
    const dedicatedSource = read(client.routeFile);
    const dedicatedShell = /PortfolioStandardShell/.test(dedicatedSource);
    if (!dedicatedShell && !/PortfolioUpsellPopup/.test(componentSource)) {
      errors.push(`${label} rota dedicada sem pop-up de captação da 0WEB`);
    }
    if (dedicatedSource && !/rel: "canonical"|rel: 'canonical'/.test(dedicatedSource)) {
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
