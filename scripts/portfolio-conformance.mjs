/**
 * Contrato ÚNICO de conformidade dos projetos /portfolio/:slug.
 *
 * Fonte de verdade dos códigos e das regras. Consumido por:
 *  - scripts/check-portfolio-projects.mjs (gate de prebuild/CI)
 *  - scripts/build-portfolio-admin-seed.mjs (seed do admin)
 *
 * Não duplicar regra de conformidade fora deste arquivo.
 */
import fs from "node:fs";
import path from "node:path";

export const CODES = {
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

/** Falhas bloqueantes (build/CI). As demais são avisos de governança. */
export const BLOCKING = new Set([
  CODES.LOGO,
  CODES.SOCIAL,
  CODES.SEO,
  CODES.CTA,
  CODES.COMPONENT,
]);

export function buildRecords(root) {
  const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

  const catalog = readJson("src/config/portfolio-catalog.json");
  const clients = readJson("src/config/portfolio-clients.json");
  const assetsCfg = readJson("src/config/portfolio-assets.json");
  const shareCopy = readJson("src/config/portfolio-share-copy.json");
  const routeSource = fs.readFileSync(
    path.join(root, "src/routes/portfolio.$slug.tsx"),
    "utf8",
  );

  const fileExists = (publicPath) => {
    if (!publicPath || typeof publicPath !== "string") return false;
    if (/^https?:\/\//.test(publicPath)) return true;
    return fs.existsSync(path.join(root, "public", publicPath.replace(/^\//, "")));
  };

  // O shell padrão embute o pop-up comercial da 0WEB para todos os slugs.
  const shellWrapsAllSlugs =
    routeSource.includes("PortfolioStandardShell") &&
    /<PortfolioStandardShell[\s\S]*?slug=\{slug\}/.test(routeSource);

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
  const records = [];

  for (const item of catalog) {
    const slug = item.slug;
    const issues = [];

    const client = clientBySlug.get(slug);
    const assets = assetsCfg.clients?.[slug];
    const assetsDir = path.join(root, "public/images", slug);
    const dirFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

    if (!item.title || !item.segment || !(item.summary || item.subtitle)) {
      issues.push(CODES.BRAND);
    }

    const ownsPath = (value) =>
      typeof value === "string" &&
      (value.includes(`/images/${slug}/`) || value.includes(slug.split("-")[0]));

    const icon = assets?.icon;
    if (!icon || !ownsPath(icon) || !fileExists(icon)) issues.push(CODES.LOGO);

    const social = assets?.socialImage;
    if (!social || !ownsPath(social) || !fileExists(social)) issues.push(CODES.SOCIAL);

    const imageFiles = dirFiles.filter((f) => /\.(webp|avif|jpg|jpeg|png|svg)$/i.test(f));
    if (imageFiles.length < 2) issues.push(CODES.HERO);

    const componentFile = client?.componentFile;
    let componentSource = "";
    if (componentFile && fs.existsSync(path.join(root, componentFile))) {
      componentSource = fs.readFileSync(path.join(root, componentFile), "utf8");
    } else if (client) {
      issues.push(CODES.COMPONENT);
    }
    let hasCta = false;
    if (componentSource) {
      hasCta =
        /PortfolioCTAQuiz|PortfolioQuizCTA|FunnelCTAButton|FunnelModalWrapper|FloatingFunnelCTA|ProductActionGate|useFunnel/.test(
          componentSource,
        );
      if (!hasCta) issues.push(CODES.CTA);
    }

    const varName = slugVar.get(slug);
    const hasOwnDescription = varName ? descriptionBlock.includes(varName) : false;
    const catalogDescription = (item.summary || "").trim();
    if (!hasOwnDescription && catalogDescription.length < 80) issues.push(CODES.SEO);

    if (!shellWrapsAllSlugs && !/PortfolioUpsellPopup/.test(componentSource)) {
      issues.push(CODES.POPUP);
    }

    if (!shareCopy[slug]) issues.push(CODES.SHARE);

    const blocking = issues.filter((i) => BLOCKING.has(i));
    const published = item.status === "published" || item.live === true;
    const status =
      issues.length === 0 ? "COMPLETE" : blocking.length > 0 ? "LEGACY" : "PARTIAL";

    records.push({
      slug,
      clientKey: item.clientKey ?? slug,
      title: item.title ?? "",
      segment: item.segment ?? "",
      city: item.city ?? "",
      state: item.state ?? "",
      summary: item.summary ?? "",
      subtitle: item.subtitle ?? "",
      image: item.image ?? "",
      icon: icon ?? "",
      socialImage: social ?? "",
      socialVersion: assets?.socialVersion ?? "",
      componentFile: componentFile ?? "",
      routeFile: client?.routeFile ?? "",
      assetsDir: client?.assetsDir ?? `public/images/${slug}`,
      ctaMode: client?.ctaMode ?? "",
      hasCta,
      hasOwnDescription,
      hasClientEntry: Boolean(client),
      gallery: imageFiles.map((f) => `/images/${slug}/${f}`),
      shareCopy: shareCopy[slug] ?? "",
      published,
      status,
      issues,
      blocking,
    });
  }

  return records;
}
