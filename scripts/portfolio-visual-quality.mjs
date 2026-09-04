/**
 * Contrato ÚNICO de QUALIDADE VISUAL dos projetos /portfolio/:slug.
 *
 * Separação deliberada:
 *   - CONFORMIDADE TÉCNICA  → scripts/portfolio-conformance.mjs (COMPLETE/PARTIAL/LEGACY)
 *   - QUALIDADE VISUAL      → este arquivo (PREMIUM/STANDARD/NEEDS_UPGRADE)
 *
 * Uma página pode ser COMPLETE + NEEDS_UPGRADE. Isso não é contradição.
 *
 * Evidência usada:
 *   - registries (catálogo, clients, assets, share copy)
 *   - arquivos reais em public/images/<slug> (dimensões via sharp + hash sha1)
 *   - reports/portfolio-originality.json (similaridade estrutural já existente)
 *   - reports/portfolio-visual-runtime.json (render real em 390px e 1440px)
 *   - src/config/portfolio-visual-review.json (julgamento humano, quando existir)
 *
 * Nada aqui inventa informação ausente: o que não pôde ser medido vira UNKNOWN.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { buildRecords } from "./portfolio-conformance.mjs";

export const WEIGHTS = {
  identity: 15,
  logo: 10,
  cover: 15,
  hero: 15,
  images: 10,
  content: 10,
  originality: 10,
  mobile: 10,
  social: 5,
};

export const THRESHOLDS = { PREMIUM: 85, STANDARD: 70 };

/** Catálogo de issues: código → { severity, group, penalty, label } */
export const ISSUES = {
  ASSET_CROSS_CLIENT: { severity: "P0", group: "images", penalty: 10, label: "Asset de marca compartilhado com outro cliente" },
  COVER_CROSS_CLIENT: { severity: "P0", group: "cover", penalty: 15, label: "Capa do catálogo é o mesmo arquivo de outro projeto" },
  SOCIAL_CROSS_CLIENT: { severity: "P0", group: "social", penalty: 5, label: "Imagem social é o mesmo arquivo de outro projeto" },
  COVER_BROKEN: { severity: "P0", group: "cover", penalty: 15, label: "Capa do catálogo ausente ou quebrada" },
  LOGO_BROKEN: { severity: "P0", group: "logo", penalty: 10, label: "Logo ausente ou quebrada" },
  IMAGE_BROKEN_RUNTIME: { severity: "P0", group: "mobile", penalty: 10, label: "Imagem quebrada na renderização real" },
  PAGE_ERROR: { severity: "P0", group: "mobile", penalty: 10, label: "Página não renderizou (erro ou status != 200)" },

  COVER_NOT_DEDICATED: { severity: "P1", group: "cover", penalty: 6, label: "Sem capa dedicada no catálogo (card cai no fallback social/logo)" },
  COVER_SEVERE_CROP: { severity: "P1", group: "cover", penalty: 7, label: "Capa com proporção incompatível com o card (corte severo)" },
  COVER_IS_LOGO: { severity: "P1", group: "cover", penalty: 6, label: "Capa do catálogo é a própria logo" },
  COVER_LOW_RES: { severity: "P1", group: "cover", penalty: 5, label: "Capa com resolução insuficiente para o card" },
  LOGO_PLACEHOLDER: { severity: "P1", group: "logo", penalty: 6, label: "Logo aparenta ser placeholder/sintética" },
  HERO_NO_HEADLINE: { severity: "P1", group: "hero", penalty: 7, label: "Hero sem headline própria" },
  HERO_NO_CTA: { severity: "P1", group: "hero", penalty: 6, label: "Hero sem CTA visível" },
  MOBILE_OVERFLOW: { severity: "P1", group: "mobile", penalty: 6, label: "Overflow horizontal em 390px" },
  CONTENT_NEAR_DUPLICATE: { severity: "P1", group: "originality", penalty: 7, label: "Copy editorial quase idêntica a outro projeto" },
  ORIGINALITY_FAIL: { severity: "P1", group: "originality", penalty: 7, label: "Similaridade estrutural em nível de clone" },
  SOCIAL_WRONG_RATIO: { severity: "P1", group: "social", penalty: 3, label: "Imagem social fora de 1200x630" },

  LOGO_NOT_DEDICATED: { severity: "P2", group: "logo", penalty: 4, label: "Logo é uma foto/asset genérico, não uma marca dedicada" },
  LOGO_LOW_RES: { severity: "P2", group: "logo", penalty: 3, label: "Logo com resolução baixa" },
  COVER_REUSES_SOCIAL: { severity: "P2", group: "cover", penalty: 3, label: "Capa reaproveita a imagem social" },
  HERO_NO_IMAGE: { severity: "P2", group: "hero", penalty: 4, label: "Hero sem imagem própria" },
  HERO_WEAK_HIERARCHY: { severity: "P2", group: "hero", penalty: 3, label: "Headline do hero pequena para o viewport" },
  FEW_IMAGES: { severity: "P2", group: "images", penalty: 4, label: "Poucas imagens próprias do cliente" },
  IMAGES_LOW_DIVERSITY: { severity: "P2", group: "images", penalty: 3, label: "Imagens repetidas dentro do próprio projeto" },
  CONTENT_THIN: { severity: "P2", group: "content", penalty: 5, label: "Conteúdo editorial insuficiente" },
  CONTENT_PLACEHOLDER: { severity: "P2", group: "content", penalty: 4, label: "Conteúdo com linguagem de placeholder" },
  IDENTITY_WEAK: { severity: "P2", group: "identity", penalty: 6, label: "Identidade pouco distinguível de outros projetos" },
  ORIGINALITY_WARNING: { severity: "P2", group: "originality", penalty: 4, label: "Similaridade estrutural alta com outro projeto" },
  SEGMENT_UNCLEAR: { severity: "P2", group: "identity", penalty: 4, label: "Segmento não é legível nos primeiros 3 segundos" },

  MOBILE_TAP_TARGETS: { severity: "P3", group: "mobile", penalty: 2, label: "Alvos de toque menores que 40px" },
  HEADING_STRUCTURE: { severity: "P3", group: "mobile", penalty: 1, label: "Estrutura de headings irregular (h1)" },
  IMAGE_ALT_MISSING: { severity: "P3", group: "mobile", penalty: 1, label: "Imagens sem atributo alt" },
  CONTENT_SHORT_SERVICES: { severity: "P3", group: "content", penalty: 2, label: "Serviços pouco explicados" },
  COVER_NO_FOCAL_POINT: { severity: "P3", group: "cover", penalty: 1, label: "Capa sem focal point definido" },
};

const IMG_EXT = /\.(webp|avif|jpg|jpeg|png|svg)$/i;

function sha1(buf) {
  return crypto.createHash("sha1").update(buf).digest("hex");
}

function imageMeta(sharp, absPath) {
  const buf = fs.readFileSync(absPath);
  const meta = { hash: sha1(buf), bytes: buf.length, width: null, height: null };
  if (/\.svg$/i.test(absPath)) {
    const txt = buf.toString("utf8").slice(0, 4000);
    const vb = txt.match(/viewBox="([\d.\s-]+)"/);
    if (vb) {
      const p = vb[1].trim().split(/\s+/).map(Number);
      meta.width = p[2] ?? null;
      meta.height = p[3] ?? null;
    }
    meta.svg = txt;
    return meta;
  }
  if (sharp) {
    try {
      // metadata síncrono não existe; usamos o cache preenchido antes.
    } catch {
      /* noop */
    }
  }
  return meta;
}

/** Remove boilerplate compartilhado (shell, popup, footer, CTA 0WEB). */
function editorialText(text, boilerplate) {
  let out = text;
  for (const phrase of boilerplate) out = out.split(phrase).join(" ");
  return out.replace(/\s+/g, " ").trim();
}

function trigrams(text) {
  const norm = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = norm.split(" ");
  const set = new Set();
  for (let i = 0; i + 2 < words.length; i += 1) set.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return Math.round((inter / (a.size + b.size - inter)) * 100);
}

export async function buildVisualQuality(root, opts = {}) {
  const readJson = (rel, fallback = null) => {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) return fallback;
    try {
      return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch {
      return fallback;
    }
  };

  let sharp = null;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    sharp = null;
  }

  const records = buildRecords(root);
  const catalog = readJson("src/config/portfolio-catalog.json", []);
  const assetsCfg = readJson("src/config/portfolio-assets.json", { clients: {} });
  const originality = readJson("reports/portfolio-originality.json", { projects: [] });
  const runtime = readJson("reports/portfolio-visual-runtime.json", { projects: {} });
  const review = readJson("src/config/portfolio-visual-review.json", {});

  const catalogBySlug = new Map(catalog.map((c) => [c.slug, c]));
  const originBySlug = new Map((originality.projects ?? []).map((p) => [p.slug, p]));

  // ---------- assets: hash + dimensões ----------
  const assetIndex = new Map(); // publicPath → meta
  const hashToPaths = new Map();
  const dirCache = new Map();

  const listDir = (slug) => {
    if (dirCache.has(slug)) return dirCache.get(slug);
    const dir = path.join(root, "public/images", slug);
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => IMG_EXT.test(f)).map((f) => `/images/${slug}/${f}`)
      : [];
    dirCache.set(slug, files);
    return files;
  };

  const allPaths = new Set();
  for (const r of records) {
    for (const p of listDir(r.slug)) allPaths.add(p);
    for (const p of [r.icon, r.socialImage, catalogBySlug.get(r.slug)?.image, catalogBySlug.get(r.slug)?.fallbackImage]) {
      if (typeof p === "string" && p.startsWith("/")) allPaths.add(p);
    }
  }

  for (const publicPath of allPaths) {
    const abs = path.join(root, "public", publicPath.replace(/^\//, ""));
    if (!fs.existsSync(abs)) {
      assetIndex.set(publicPath, { missing: true });
      continue;
    }
    const meta = imageMeta(sharp, abs);
    if (sharp && !/\.svg$/i.test(abs)) {
      try {
        const m = await sharp(abs).metadata();
        meta.width = m.width ?? null;
        meta.height = m.height ?? null;
      } catch {
        /* imagem ilegível */
      }
    }
    assetIndex.set(publicPath, meta);
    if (meta.hash) {
      if (!hashToPaths.has(meta.hash)) hashToPaths.set(meta.hash, []);
      hashToPaths.get(meta.hash).push(publicPath);
    }
  }

  const knownSlugs = new Set(records.map((r) => r.slug));
  /** Dono do arquivo: só quando ele vive no diretório de um projeto conhecido. */
  const slugOfPath = (p) => {
    const s = p.match(/^\/images\/([^/]+)\//)?.[1] ?? null;
    return s && knownSlugs.has(s) ? s : null;
  };
  const ownersOf = (paths) => new Set((paths ?? []).map(slugOfPath).filter(Boolean));

  // ---------- boilerplate compartilhado (para similaridade editorial justa) ----------
  const runtimeText = new Map();
  for (const [slug, entry] of Object.entries(runtime.projects ?? {})) {
    const t = entry?.viewports?.desktop?.text || entry?.viewports?.mobile?.text || "";
    if (t) runtimeText.set(slug, t);
  }
  const sentenceCount = new Map();
  for (const t of runtimeText.values()) {
    const seen = new Set();
    for (const s of t.split(/(?<=[.!?])\s+|\n+/)) {
      const k = s.trim();
      if (k.length < 12 || seen.has(k)) continue;
      seen.add(k);
      sentenceCount.set(k, (sentenceCount.get(k) ?? 0) + 1);
    }
  }
  const half = Math.max(3, Math.floor(runtimeText.size * 0.5));
  const boilerplate = [...sentenceCount.entries()].filter(([, n]) => n >= half).map(([s]) => s);

  const editorial = new Map();
  for (const [slug, t] of runtimeText) editorial.set(slug, editorialText(t, boilerplate));
  const grams = new Map([...editorial].map(([slug, t]) => [slug, trigrams(t)]));

  const contentPairs = [];
  const slugsWithText = [...grams.keys()];
  for (let i = 0; i < slugsWithText.length; i += 1) {
    for (let j = i + 1; j < slugsWithText.length; j += 1) {
      const score = jaccard(grams.get(slugsWithText[i]), grams.get(slugsWithText[j]));
      if (score >= 35) contentPairs.push({ a: slugsWithText[i], b: slugsWithText[j], score });
    }
  }
  contentPairs.sort((x, y) => y.score - x.score);
  const worstContentMatch = new Map();
  for (const pair of contentPairs) {
    for (const [self, other] of [[pair.a, pair.b], [pair.b, pair.a]]) {
      const cur = worstContentMatch.get(self);
      if (!cur || pair.score > cur.score) worstContentMatch.set(self, { slug: other, score: pair.score });
    }
  }

  // ---------- assets cruzados ----------
  const crossAssets = [];
  for (const [hash, paths] of hashToPaths) {
    const slugs = [...ownersOf(paths)];
    if (slugs.length < 2) continue;
    const usage = paths.map((p) => {
      const s = slugOfPath(p);
      const rec = records.find((r) => r.slug === s);
      const cat = catalogBySlug.get(s);
      const roles = [];
      if (rec?.icon === p) roles.push("logo");
      if (rec?.socialImage === p) roles.push("social");
      if (cat?.image === p) roles.push("cover");
      if (!roles.length) roles.push("gallery");
      return { path: p, slug: s, roles };
    });
    const brandRole = usage.some((u) => u.roles.some((r) => r !== "gallery"));
    crossAssets.push({
      hash,
      slugs,
      usage,
      classification: brandRole ? "INVALID_CROSS_CLIENT" : "SUSPICIOUS",
    });
  }

  // ---------- ficha por projeto ----------
  const projects = [];
  for (const rec of records) {
    const slug = rec.slug;
    const cat = catalogBySlug.get(slug) ?? {};
    const orig = originBySlug.get(slug) ?? null;
    const rt = runtime.projects?.[slug] ?? null;
    const mob = rt?.viewports?.mobile ?? null;
    const desk = rt?.viewports?.desktop ?? null;
    const manual = review[slug] ?? {};
    const issues = [];
    const add = (code, detail) => {
      if (!ISSUES[code]) return;
      if (issues.some((i) => i.code === code)) return;
      issues.push({ code, ...ISSUES[code], detail: detail ?? null });
    };

    const galleryPaths = listDir(slug);
    const gallery = galleryPaths.map((p) => ({ path: p, ...(assetIndex.get(p) ?? {}) }));

    // --- logo ---
    const logoPath = rec.icon;
    const logo = logoPath ? assetIndex.get(logoPath) ?? { missing: true } : { missing: true };
    if (!logoPath || logo.missing) add("LOGO_BROKEN", logoPath || null);
    else {
      const isSyntheticSvg = Boolean(logo.svg && /data-generated|identity-placeholder/.test(logo.svg));
      const initialsOnly = Boolean(logo.svg && (logo.svg.match(/<text/g) ?? []).length >= 1 && (logo.svg.match(/<(path|image)/g) ?? []).length === 0);
      if (isSyntheticSvg || initialsOnly) add("LOGO_PLACEHOLDER", logoPath);
      const nameLooksLogo = /(logo|marca|icon|brand|símbolo|simbolo)/i.test(logoPath);
      if (!nameLooksLogo) add("LOGO_NOT_DEDICATED", logoPath);
      const side = Math.min(logo.width ?? 0, logo.height ?? 0);
      if (side && side < 128 && !/\.svg$/i.test(logoPath)) add("LOGO_LOW_RES", `${logo.width}x${logo.height}`);
      const shared = hashToPaths.get(logo.hash) ?? [];
      if (ownersOf(shared).size > 1) add("ASSET_CROSS_CLIENT", `logo: ${shared.join(", ")}`);
    }

    // --- capa ---
    // Precedência real do card em /portfolio: catalog.image → social → logo → default.
    const dedicatedCover = typeof cat.image === "string" && cat.image ? cat.image : null;
    const coverPath = dedicatedCover ?? rec.socialImage ?? rec.icon ?? "";
    if (!dedicatedCover) add("COVER_NOT_DEDICATED", coverPath || "/og-default.jpg");
    const cover = coverPath ? assetIndex.get(coverPath) ?? { missing: true } : { missing: true };
    if (!coverPath || cover.missing) add("COVER_BROKEN", coverPath || null);
    else {
      const ratio = cover.width && cover.height ? cover.width / cover.height : null;
      if (ratio && Math.abs(ratio - 16 / 9) > 0.55) add("COVER_SEVERE_CROP", `ratio ${ratio.toFixed(2)}`);
      if (cover.width && cover.width < 900) add("COVER_LOW_RES", `${cover.width}x${cover.height}`);
      if (coverPath === logoPath) add("COVER_IS_LOGO", coverPath);
      if (coverPath === rec.socialImage) add("COVER_REUSES_SOCIAL", coverPath);
      const shared = hashToPaths.get(cover.hash) ?? [];
      if (ownersOf(shared).size > 1) add("COVER_CROSS_CLIENT", shared.join(", "));
      if (!cat.imageFocalPoint && !cat.focalPoint) add("COVER_NO_FOCAL_POINT");
    }

    // --- social ---
    const socialPath = rec.socialImage;
    const social = socialPath ? assetIndex.get(socialPath) ?? { missing: true } : { missing: true };
    if (socialPath && !social.missing) {
      if (social.width && social.height && !(social.width === 1200 && social.height === 630)) {
        add("SOCIAL_WRONG_RATIO", `${social.width}x${social.height}`);
      }
      const shared = hashToPaths.get(social.hash) ?? [];
      if (ownersOf(shared).size > 1) add("SOCIAL_CROSS_CLIENT", shared.join(", "));
    }

    // --- runtime / hero / mobile ---
    if (!rt || rt.status !== 200 || mob?.error || desk?.error) {
      add("PAGE_ERROR", rt ? `status ${rt.status}` : "sem coleta de runtime");
    }
    const hero = mob?.hero ?? desk?.hero ?? null;
    if (hero) {
      if (!hero.heading || hero.heading.length < 8) add("HERO_NO_HEADLINE");
      if (!hero.ctaCount) add("HERO_NO_CTA");
      if (!hero.imageCount && !hero.backgroundImage) add("HERO_NO_IMAGE");
      if (hero.headingSize && hero.headingSize < 26) add("HERO_WEAK_HIERARCHY", `${hero.headingSize}px`);
    }
    if (mob) {
      if ((mob.overflowX ?? 0) > 2) add("MOBILE_OVERFLOW", `${mob.overflowX}px · ${(mob.offenders ?? []).join(" | ")}`);
      if ((mob.brokenImages ?? []).length) add("IMAGE_BROKEN_RUNTIME", mob.brokenImages.join(", "));
      if ((mob.smallTargets ?? 0) > 8) add("MOBILE_TAP_TARGETS", `${mob.smallTargets} alvos`);
      if ((mob.h1Count ?? 0) !== 1) add("HEADING_STRUCTURE", `h1=${mob.h1Count}`);
      if ((mob.missingAlt ?? 0) > 0) add("IMAGE_ALT_MISSING", `${mob.missingAlt} imagem(ns)`);
    }

    // --- imagens ---
    const distinctHashes = new Set(gallery.map((g) => g.hash).filter(Boolean));
    if (gallery.length < 4) add("FEW_IMAGES", `${gallery.length} arquivo(s)`);
    if (gallery.length >= 4 && distinctHashes.size < gallery.length - 1) add("IMAGES_LOW_DIVERSITY");
    for (const g of gallery) {
      const shared = hashToPaths.get(g.hash) ?? [];
      if (ownersOf(shared).size > 1) add("ASSET_CROSS_CLIENT", shared.join(", "));
    }

    // --- conteúdo ---
    const edit = editorial.get(slug) ?? "";
    if (edit) {
      if (edit.length < 900) add("CONTENT_THIN", `${edit.length} caracteres editoriais`);
      if (/presen[çc]a digital de/i.test(edit) && edit.length < 1500) add("CONTENT_PLACEHOLDER");
      const serviceish = (edit.match(/servi[çc]o|atendimento|or[çc]amento|entrega|instala|manuten/gi) ?? []).length;
      if (serviceish < 3) add("CONTENT_SHORT_SERVICES", `${serviceish} menções`);
    }

    // --- originalidade ---
    const origScore = orig?.score ?? null;
    let originalityStatus = "UNREVIEWED";
    if (origScore !== null) {
      originalityStatus = origScore > 60 ? "FAIL" : origScore > 40 ? "WARNING" : "PASS";
      if (originalityStatus === "FAIL") add("ORIGINALITY_FAIL", `${origScore} vs ${orig?.nearestMatch ?? "?"}`);
      else if (originalityStatus === "WARNING") add("ORIGINALITY_WARNING", `${origScore} vs ${orig?.nearestMatch ?? "?"}`);
    }
    if (manual.originalityReview && manual.originalityReview !== "UNREVIEWED") {
      originalityStatus = manual.originalityReview;
    }
    const contentMatch = worstContentMatch.get(slug) ?? null;
    if (contentMatch && contentMatch.score >= 60) {
      add("CONTENT_NEAR_DUPLICATE", `${contentMatch.score}% vs ${contentMatch.slug}`);
    }

    // --- identidade / segmento ---
    const identitySignals = [];
    if (origScore !== null && origScore > 60) identitySignals.push("estrutura quase idêntica a outro projeto");
    if (issues.some((i) => i.code === "LOGO_PLACEHOLDER" || i.code === "LOGO_NOT_DEDICATED")) identitySignals.push("marca fraca");
    if (contentMatch && contentMatch.score >= 50) identitySignals.push("copy repetida");
    if (identitySignals.length >= 2) add("IDENTITY_WEAK", identitySignals.join(" · "));

    const firstScreen = `${cat.title ?? ""} ${hero?.heading ?? ""} ${cat.subtitle ?? ""} ${(mob?.text ?? "").slice(0, 400)}`.toLowerCase();
    const segmentWords = (cat.segment ?? "").split(/[-_ ]/).filter((w) => w.length > 3);
    const tagWords = (cat.tags ?? []).flatMap((t) => String(t).split("-")).filter((w) => w.length > 3);
    const segmentVisible = [...segmentWords, ...tagWords].some((w) =>
      firstScreen.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(w.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
    );
    if (firstScreen.trim() && !segmentVisible) add("SEGMENT_UNCLEAR", cat.segment ?? "");

    // --- score ---
    const groupScores = {};
    for (const [group, weight] of Object.entries(WEIGHTS)) {
      const penalty = issues.filter((i) => i.group === group).reduce((s, i) => s + i.penalty, 0);
      groupScores[group] = Math.max(0, weight - Math.min(weight, penalty));
    }
    let score = Object.values(groupScores).reduce((a, b) => a + b, 0);
    score = Math.max(0, Math.min(100, Math.round(score)));

    const severities = { P0: 0, P1: 0, P2: 0, P3: 0 };
    for (const i of issues) severities[i.severity] += 1;

    const coverReview = manual.coverReview ?? (issues.some((i) => ["COVER_BROKEN", "COVER_CROSS_CLIENT", "COVER_IS_LOGO", "COVER_SEVERE_CROP"].includes(i.code)) ? "NEEDS_REVIEW" : "UNREVIEWED");

    // --- teto de classificação ---
    const premiumBlockers = [];
    if (severities.P0 > 0) premiumBlockers.push("issue P0");
    if (severities.P1 > 0) premiumBlockers.push("issue P1");
    if (originalityStatus === "FAIL") premiumBlockers.push("originalidade FAIL");
    if (coverReview === "REJECTED") premiumBlockers.push("capa REJECTED");
    if (!rt) premiumBlockers.push("sem inspeção visual");

    let visual;
    if (severities.P0 > 0) visual = "NEEDS_UPGRADE";
    else if (score >= THRESHOLDS.PREMIUM && premiumBlockers.length === 0) visual = "PREMIUM";
    else if (score >= THRESHOLDS.STANDARD) visual = "STANDARD";
    else visual = "NEEDS_UPGRADE";
    if (manual.visualOverride) visual = manual.visualOverride;

    const charm =
      manual.charm ?? (visual === "PREMIUM" ? "HIGH" : visual === "STANDARD" && originalityStatus === "PASS" ? "MEDIUM" : "LOW");

    const priority = severities.P0 > 0 ? 1 : severities.P1 > 0 || visual === "NEEDS_UPGRADE" ? 2 : 3;

    projects.push({
      slug,
      businessName: rec.title,
      segment: rec.segment,
      city: rec.city,
      componentType: rec.componentFile ? "custom" : "managed",
      componentFile: rec.componentFile,
      preset: orig?.fallbackVertical ?? null,
      technical: rec.status,
      published: rec.published,
      visual,
      score,
      groupScores,
      originalityScore: origScore,
      originalityStatus,
      originalityNearest: orig?.nearestMatch ?? null,
      contentSimilarity: contentMatch,
      charm,
      coverReview,
      visuallyReviewed: Boolean(rt),
      assets: {
        logo: logoPath ? { path: logoPath, ...logo, svg: undefined } : null,
        cover: coverPath ? { path: coverPath, ...cover, svg: undefined } : null,
        social: socialPath ? { path: socialPath, ...social, svg: undefined } : null,
        galleryCount: gallery.length,
      },
      runtime: mob
        ? {
            statusCode: rt?.status ?? null,
            mobileOverflow: mob.overflowX ?? null,
            mobileImages: mob.imageCount ?? null,
            desktopImages: desk?.imageCount ?? null,
            heroHeadline: hero?.heading ?? null,
            heroHeight: hero?.height ?? null,
            editorialChars: edit.length,
            smallTargets: mob.smallTargets ?? null,
            consoleErrors: (rt?.consoleErrors ?? []).length,
          }
        : null,
      severities,
      issues: issues.map((i) => ({ code: i.code, severity: i.severity, group: i.group, label: i.label, detail: i.detail })),
      priority,
    });
  }

  projects.sort((a, b) => a.priority - b.priority || a.score - b.score || a.slug.localeCompare(b.slug));

  const summary = {
    total: projects.length,
    visuallyReviewed: projects.filter((p) => p.visuallyReviewed).length,
    technical: {
      COMPLETE: projects.filter((p) => p.technical === "COMPLETE").length,
      PARTIAL: projects.filter((p) => p.technical === "PARTIAL").length,
      LEGACY: projects.filter((p) => p.technical === "LEGACY").length,
    },
    visual: {
      PREMIUM: projects.filter((p) => p.visual === "PREMIUM").length,
      STANDARD: projects.filter((p) => p.visual === "STANDARD").length,
      NEEDS_UPGRADE: projects.filter((p) => p.visual === "NEEDS_UPGRADE").length,
    },
    originality: {
      PASS: projects.filter((p) => p.originalityStatus === "PASS").length,
      WARNING: projects.filter((p) => p.originalityStatus === "WARNING").length,
      FAIL: projects.filter((p) => p.originalityStatus === "FAIL").length,
      UNREVIEWED: projects.filter((p) => p.originalityStatus === "UNREVIEWED").length,
    },
    issues: {
      P0: projects.reduce((s, p) => s + p.severities.P0, 0),
      P1: projects.reduce((s, p) => s + p.severities.P1, 0),
      P2: projects.reduce((s, p) => s + p.severities.P2, 0),
      P3: projects.reduce((s, p) => s + p.severities.P3, 0),
    },
    averageScore: projects.length
      ? Math.round(projects.reduce((s, p) => s + p.score, 0) / projects.length)
      : 0,
  };

  return {
    generatedAt: new Date().toISOString(),
    weights: WEIGHTS,
    thresholds: THRESHOLDS,
    runtimeGeneratedAt: runtime.generatedAt ?? null,
    summary,
    projects,
    crossAssets,
    contentPairs: contentPairs.slice(0, 40),
    boilerplateSentences: boilerplate.length,
    opts,
  };
}
