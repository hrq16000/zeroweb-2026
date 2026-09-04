#!/usr/bin/env node
/**
 * Gate de conformidade dos projetos /portfolio/:slug.
 *
 * Não cria arquitetura nova: apenas agrega as fontes de verdade já existentes
 * (catálogo, clientes, assets, copy de divulgação, rota e componentes) e
 * classifica cada projeto como COMPLETE / PARTIAL / LEGACY.
 *
 * Uso:
 *   node scripts/check-portfolio-projects.mjs            # relatório + exit 1 se houver falha bloqueante
 *   node scripts/check-portfolio-projects.mjs --json     # saída JSON para governança
 *   node scripts/check-portfolio-projects.mjs --slug=x   # audita apenas um projeto
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

const catalog = readJson("src/config/portfolio-catalog.json");
const clients = readJson("src/config/portfolio-clients.json");
const assetsCfg = readJson("src/config/portfolio-assets.json");
const shareCopy = readJson("src/config/portfolio-share-copy.json");
const routeSource = fs.readFileSync(
  path.join(root, "src/routes/portfolio.$slug.tsx"),
  "utf8",
);

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlySlug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

const CODES = {
  BRAND: "PORTFOLIO_BRAND_MISSING",
  LOGO: "PORTFOLIO_LOGO_MISSING",
  HERO: "PORTFOLIO_HERO_MISSING",
  SOCIAL: "PORTFOLIO_SOCIAL_IMAGE_MISSING",
  CTA: "PORTFOLIO_CTA_MISSING",
  SEO: "PORTFOLIO_SEO_MISSING",
  POPUP: "PORTFOLIO_POPUP_MISSING",
  SHARE: "PORTFOLIO_SHARE_COPY_MISSING",
  COMPONENT: "PORTFOLIO_COMPONENT_MISSING",
};

// Falhas bloqueantes (build/CI). As demais são avisos de governança.
const BLOCKING = new Set([CODES.LOGO, CODES.SOCIAL, CODES.SEO, CODES.CTA, CODES.COMPONENT]);

const fileExists = (publicPath) => {
  if (!publicPath || typeof publicPath !== "string") return false;
  if (/^https?:\/\//.test(publicPath)) return true;
  return fs.existsSync(path.join(root, "public", publicPath.replace(/^\//, "")));
};

// O shell padrão embute o pop-up comercial da 0WEB para todos os slugs.
const shellWrapsAllSlugs =
  routeSource.includes("PortfolioStandardShell") &&
  /<PortfolioStandardShell[\s\S]*?slug=\{slug\}/.test(routeSource);

// slug -> variável booleana usada na rota (isFoo)
const slugVar = new Map();
for (const m of routeSource.matchAll(
  /const\s+(is[A-Za-z0-9_]+)\s*=\s*loaderData\?\.slug\s*===\s*"([^"]+)"/g,
)) {
  slugVar.set(m[2], m[1]);
}
const descriptionBlock =
  routeSource.slice(
    routeSource.indexOf("const description ="),
    routeSource.indexOf('{ name: "description"'),
  ) || "";

const clientBySlug = new Map(clients.map((c) => [c.slug ?? c.clientKey, c]));

const results = [];

for (const item of catalog) {
  if (onlySlug && item.slug !== onlySlug) continue;
  const slug = item.slug;
  const issues = [];

  const client = clientBySlug.get(slug);
  const assets = assetsCfg.clients?.[slug];
  const assetsDir = path.join(root, "public/images", slug);
  const dirFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

  // Marca / identidade
  if (!item.title || !item.segment || !(item.summary || item.subtitle)) {
    issues.push(CODES.BRAND);
  }

  // Logo / ícone próprio dentro do diretório do slug
  const ownsPath = (value) =>
    typeof value === "string" &&
    (value.includes(`/images/${slug}/`) || value.includes(slug.split("-")[0]));
  const icon = assets?.icon;
  if (!icon || !ownsPath(icon) || !fileExists(icon)) {
    issues.push(CODES.LOGO);
  }

  // Imagem social própria
  const social = assets?.socialImage;
  if (!social || !ownsPath(social) || !fileExists(social)) {
    issues.push(CODES.SOCIAL);
  }

  // Hero / imagens de apoio: precisa de mais de um asset próprio
  const imageFiles = dirFiles.filter((f) => /\.(webp|avif|jpg|jpeg|png|svg)$/i.test(f));
  if (imageFiles.length < 2) issues.push(CODES.HERO);

  // Componente próprio e CTA/funil
  const componentFile = client?.componentFile;
  let componentSource = "";
  if (componentFile && fs.existsSync(path.join(root, componentFile))) {
    componentSource = fs.readFileSync(path.join(root, componentFile), "utf8");
  } else if (client) {
    issues.push(CODES.COMPONENT);
  }
  if (componentSource) {
    const hasCta =
      /PortfolioCTAQuiz|PortfolioQuizCTA|FunnelCTAButton|FloatingFunnelCTA|ProductActionGate|useFunnel/.test(
        componentSource,
      );
    if (!hasCta) issues.push(CODES.CTA);
  }

  // SEO: descrição dedicada na rota (ou fallback de catálogo suficientemente rico)
  const varName = slugVar.get(slug);
  const hasOwnDescription = varName ? descriptionBlock.includes(varName) : false;
  const catalogDescription = (item.summary || "").trim();
  if (!hasOwnDescription && catalogDescription.length < 80) issues.push(CODES.SEO);

  // Pop-up / banner comercial da 0WEB
  if (!shellWrapsAllSlugs && !/PortfolioUpsellPopup/.test(componentSource)) {
    issues.push(CODES.POPUP);
  }

  // Copiar divulgação
  if (!shareCopy[slug]) issues.push(CODES.SHARE);

  const blocking = issues.filter((i) => BLOCKING.has(i));
  const published = item.status === "published" || item.live === true;
  const status =
    issues.length === 0 ? "COMPLETE" : blocking.length > 0 ? "LEGACY" : "PARTIAL";

  results.push({ slug, title: item.title, published, status, issues, blocking });
}

const failures = results.filter((r) => r.published && r.blocking.length > 0);
const partial = results.filter((r) => r.status === "PARTIAL");
const complete = results.filter((r) => r.status === "COMPLETE");

if (asJson) {
  console.log(JSON.stringify({ results, summary: {
    total: results.length,
    complete: complete.length,
    partial: partial.length,
    blocking: failures.length,
  } }, null, 2));
} else {
  for (const r of results) {
    if (r.issues.length === 0) continue;
    const tag = r.blocking.length > 0 ? "ERRO" : "aviso";
    console.log(`[${tag}] ${r.slug} (${r.status}) → ${r.issues.join(", ")}`);
  }
  console.log(
    `\n[portfolio-projects] ${results.length} projeto(s) · ${complete.length} COMPLETE · ${partial.length} PARTIAL · ${failures.length} bloqueante(s)`,
  );
}

process.exit(failures.length > 0 ? 1 : 0);
