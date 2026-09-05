/**
 * Contrato ÚNICO de originalidade dos projetos /portfolio/:slug.
 *
 * Mede o quanto a COMPOSIÇÃO FINAL percebida pelo usuário se repete entre
 * projetos. Reutilização de infraestrutura compartilhada (Button, Container,
 * shell, CTA de funil, SEO, analytics, tokens) é desejável e NÃO conta como
 * similaridade — ver SHARED_INFRA.
 *
 * Consumido por:
 *  - scripts/check-portfolio-originality.mjs (gate report-only + anti-regressão)
 *  - src/config/portfolio-originality.json  (visão do admin, gerada pelo gate)
 *
 * Não duplicar regra de originalidade fora deste arquivo.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/** Reason codes. */
export const REASONS = {
  IDENTICAL_COMPONENT_STRUCTURE: "IDENTICAL_COMPONENT_STRUCTURE",
  NEAR_DUPLICATE_LAYOUT: "NEAR_DUPLICATE_LAYOUT",
  COPY_ONLY_VARIATION: "COPY_ONLY_VARIATION",
  COLOR_ONLY_VARIATION: "COLOR_ONLY_VARIATION",
  ICON_ONLY_VARIATION: "ICON_ONLY_VARIATION",
  SHARED_VERTICAL_FALLBACK: "SHARED_VERTICAL_FALLBACK",
  EXCESSIVE_COPY_SIMILARITY: "EXCESSIVE_COPY_SIMILARITY",
  VISUAL_COMPOSITION_CLONE: "VISUAL_COMPOSITION_CLONE",
  SAME_FAMILY: "SAME_FAMILY",
  DISTINCT: "DISTINCT",
};

/** Sinais secundários (não pontuam estrutura, aparecem no relatório). */
export const SIGNALS = {
  COVER_MISSING: "COVER_MISSING",
  COVER_IS_SOCIAL_IMAGE: "COVER_IS_SOCIAL_IMAGE",
  COVER_IS_LOGO: "COVER_IS_LOGO",
  COVER_SHARED_ASSET: "COVER_SHARED_ASSET",
  COVER_RATIO_MISMATCH: "COVER_RATIO_MISMATCH",
  COVER_SEVERE_CROP: "COVER_SEVERE_CROP",
  COVER_NO_FOCAL_POINT: "COVER_NO_FOCAL_POINT",
  LOGO_MISSING: "LOGO_MISSING",
  LOGO_PLACEHOLDER: "LOGO_PLACEHOLDER",
  LOGO_SHARED: "LOGO_SHARED",
  LOGO_OUTSIDE_ASSETS_DIR: "LOGO_OUTSIDE_ASSETS_DIR",
  LOGO_NO_CONTRAST_VARIANT: "LOGO_NO_CONTRAST_VARIANT",
  ASSET_EXPECTED_SHARED: "ASSET_EXPECTED_SHARED",
  ASSET_SUSPICIOUS_SHARED: "ASSET_SUSPICIOUS_SHARED",
  ASSET_INVALID_CROSS_CLIENT: "ASSET_INVALID_CROSS_CLIENT",
};

/**
 * Assets cuja repetição entre projetos é esperada (design system / 0WEB).
 * Tudo que é foto, logo, capa ou social image de cliente NÃO entra aqui.
 */
export const EXPECTED_SHARED_ASSETS = [
  /^\/images\/0web\//,
  /^\/images\/system\//,
  /^\/images\/shared\//,
  /^\/favicon/,
  /^\/og-default/,
  /^\/placeholder\./,
];

export const STATUS = {
  ORIGINAL: "ORIGINAL",
  ACCEPTABLE: "ACCEPTABLE",
  ATTENTION: "ATTENTION",
  HIGH_SIMILARITY: "HIGH_SIMILARITY",
  CLONE: "CLONE",
  SHARED_FALLBACK: "SHARED_FALLBACK",
};

/** Pesos da fórmula (soma = 1). Estrutura pesa mais que cor/copy. */
export const WEIGHTS = {
  structure: 0.28,
  sectionOrder: 0.22,
  component: 0.18,
  style: 0.13,
  copy: 0.12,
  assetPattern: 0.04,
  identity: 0.03,
};

/**
 * Copy compartilhada por contrato (popup 0WEB, crédito de hospedagem, avisos,
 * labels técnicos, navegação). Não é sinal de clone e sai do cálculo editorial.
 */
export const COPY_BOILERPLATE = [
  /0web/i,
  /pol[ií]tica de privacidade/i,
  /termos de uso/i,
  /todos os direitos/i,
  /hospedagem|presen[çc]a digital/i,
  /whats?app/i,
  /falar (com|no)/i,
  /enviar|abrir|fechar|voltar|carregando|menu|copiar divulga/i,
  /^(sim|n[ãa]o|ok)$/i,
];

/** Limiares de status pelo maior score par-a-par. */
export const THRESHOLDS = { acceptable: 21, attention: 41, high: 61, clone: 81 };

/**
 * Infraestrutura compartilhada: reutilizar é desejável, não é clone.
 * Removida do fingerprint de componentes.
 */
export const SHARED_INFRA = new Set([
  "PortfolioStandardShell",
  "PortfolioUpsellPopup",
  "PortfolioSocialProofPopup",
  "PortfolioCTAQuiz",
  "PortfolioQuizCTA",
  "PortfolioImage",
  "PortfolioCover",
  "LazySection",
  "FunnelCTAButton",
  "FunnelModalWrapper",
  "FloatingFunnelCTA",
  "ProductActionGate",
  "Button",
  "Container",
  "Card",
  "CardContent",
  "CardHeader",
  "Badge",
  "Input",
  "Label",
  "Textarea",
  "Dialog",
  "DialogContent",
  "Accordion",
  "AccordionItem",
  "AccordionTrigger",
  "AccordionContent",
  "Link",
  "Helmet",
  "Seo",
]);

const BLOCK_TAGS = new Set([
  "header", "nav", "main", "section", "article", "aside", "footer", "form",
  "ul", "ol", "li", "figure", "picture", "img", "button", "a", "table",
  "h1", "h2", "h3", "h4", "p", "div", "span",
]);

/** Palavras que identificam o papel de uma seção. */
const SECTION_HINTS = [
  ["hero", /hero|banner|principal/i],
  ["services", /servi[cç]|cardapio|card[aá]pio|produtos?|catalog/i],
  ["gallery", /galeria|gallery|portfolio|fotos/i],
  ["about", /sobre|quem-somos|hist[oó]ria/i],
  ["proof", /depoiment|avalia|prova|review/i],
  ["faq", /faq|d[uú]vidas|perguntas/i],
  ["cta", /cta|contato|or[cç]amento|agende|pe[cç]a|whats/i],
  ["hours", /hor[aá]rio|atendimento|agenda/i],
  ["coverage", /cobertura|regi[aã]o|bairros|onde/i],
  ["pricing", /pre[cç]o|tabela|planos?/i],
];

const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);

const jaccard = (a, b) => {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const v of a) if (b.has(v)) inter += 1;
  return inter / (a.size + b.size - inter);
};

const ngrams = (arr, n = 2) => {
  const out = new Set();
  for (let i = 0; i + n <= arr.length; i += 1) out.add(arr.slice(i, i + n).join(">"));
  if (arr.length && arr.length < n) out.add(arr.join(">"));
  return out;
};

/** Classes Tailwind estruturais (layout), sem cor. */
const STRUCTURAL_CLASS = /^(grid|flex|block|inline|hidden|absolute|relative|fixed|sticky|container|mx-auto|aspect-|grid-cols-|gap-|space-[xy]-|items-|justify-|flex-|col-span-|row-span-|max-w-|min-h-|w-|h-|p[xytblr]?-|m[xytblr]?-|rounded|order-|overflow-|z-|top-|bottom-|left-|right-|object-)/;
const COLOR_CLASS = /(^|-)(bg|text|border|ring|from|via|to|fill|stroke|shadow|outline)-/;

/** Extrai o fingerprint estrutural de um fonte JSX/TSX. */
export function fingerprintSource(source, { label = "" } = {}) {
  const src = source ?? "";

  // 1. estrutura: sequência de tags de bloco na ordem em que aparecem
  const tagSeq = [];
  for (const m of src.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)[\s/>]/g)) {
    const tag = m[1];
    if (BLOCK_TAGS.has(tag)) tagSeq.push(tag);
  }

  // 2. ordem de seções: papel inferido por id/aria-label/classe/comentário
  const sectionOrder = [];
  for (const m of src.matchAll(/<(section|header|footer|main)\b([^>]*)>/g)) {
    const attrs = m[2];
    const role = SECTION_HINTS.find(([, re]) => re.test(attrs))?.[0]
      ?? (m[1] === "section" ? "block" : m[1]);
    sectionOrder.push(role);
  }

  // 3. componentes próprios usados (infra compartilhada excluída)
  const components = new Set();
  for (const m of src.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)) {
    if (!SHARED_INFRA.has(m[1])) components.add(m[1]);
  }

  // 4. estilo estrutural: classes de layout normalizadas (sem cor)
  const style = new Set();
  for (const m of src.matchAll(/class(?:Name)?=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    for (const raw of (m[1] ?? m[2] ?? "").split(/\s+/)) {
      const cls = raw.replace(/^(sm|md|lg|xl|2xl|hover|focus|group-hover|dark):/, "");
      if (!cls || COLOR_CLASS.test(cls)) continue;
      if (STRUCTURAL_CLASS.test(cls)) style.add(cls.replace(/\[[^\]]*\]/g, "[]"));
    }
  }

  // 4b. copy específica do cliente (boilerplate compartilhado excluído)
  const copy = new Set();
  const pushCopy = (raw) => {
    const text = String(raw)
      .replace(/\\u[0-9a-fA-F]{4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)))
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    if (text.length < 12) return;
    if (COPY_BOILERPLATE.some((re) => re.test(text))) return;
    for (const gram of ngrams(text.split(" "), 3)) copy.add(gram);
  };
  for (const m of src.matchAll(/>([^<>{}]{12,})</g)) pushCopy(m[1]);
  for (const m of src.matchAll(/fallback=\{?"((?:\\.|[^"])+)"/g)) pushCopy(m[1]);

  // 5. identidade cosmética (peso muito baixo): hex, ícones, texto
  const colors = new Set([...src.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0].toLowerCase()));
  const icons = new Set(
    [...src.matchAll(/from\s+"lucide-react"|<([A-Z][A-Za-z0-9]*)\s+className="[^"]*h-\d/g)]
      .map((m) => m[1])
      .filter(Boolean),
  );

  // esqueleto puro: fonte sem strings, sem hex, sem nomes de ícone
  const skeleton = src
    .replace(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, '""')
    .replace(/#[0-9a-fA-F]{3,8}\b/g, "#")
    .replace(/>[^<>{}]+</g, "><")
    .replace(/\s+/g, " ")
    .trim();

  return {
    label,
    lines: src ? src.split("\n").length : 0,
    bytes: src.length,
    structure: tagSeq,
    structureNgrams: [...ngrams(tagSeq, 3)],
    sectionOrder,
    sectionNgrams: [...ngrams(sectionOrder, 2)],
    sectionCount: sectionOrder.length,
    components: [...components].sort(),
    copy: [...copy].sort(),
    style: [...style].sort(),
    colors: [...colors].sort(),
    icons: [...icons].sort(),
    skeletonHash: hash(skeleton),
    sourceHash: hash(src),
    structureHash: hash(tagSeq.join(">")),
  };
}

/** Similaridade multidimensional entre dois fingerprints (0–100 por dimensão). */
export function compareFingerprints(a, b) {
  const set = (arr) => new Set(arr);
  const dims = {
    STRUCTURE_SIMILARITY: jaccard(set(a.structureNgrams), set(b.structureNgrams)),
    SECTION_ORDER_SIMILARITY: jaccard(set(a.sectionNgrams), set(b.sectionNgrams)),
    COMPONENT_SIMILARITY: jaccard(set(a.components), set(b.components)),
    STYLE_SIMILARITY: jaccard(set(a.style), set(b.style)),
    COPY_SIMILARITY: jaccard(set(a.copy ?? []), set(b.copy ?? [])),
    ASSET_PATTERN_SIMILARITY: jaccard(set(a.assetPattern ?? []), set(b.assetPattern ?? [])),
    IDENTITY_SIMILARITY: jaccard(set([...a.colors, ...a.icons]), set([...b.colors, ...b.icons])),
  };
  const score =
    dims.STRUCTURE_SIMILARITY * WEIGHTS.structure +
    dims.SECTION_ORDER_SIMILARITY * WEIGHTS.sectionOrder +
    dims.COMPONENT_SIMILARITY * WEIGHTS.component +
    dims.STYLE_SIMILARITY * WEIGHTS.style +
    dims.COPY_SIMILARITY * WEIGHTS.copy +
    dims.ASSET_PATTERN_SIMILARITY * WEIGHTS.assetPattern +
    dims.IDENTITY_SIMILARITY * WEIGHTS.identity;

  const pct = (v) => Math.round(v * 1000) / 10;
  return {
    score: Math.round(score * 100),
    dimensions: Object.fromEntries(Object.entries(dims).map(([k, v]) => [k, pct(v)])),
  };
}

/** Reason code do par, priorizando duplicação quase exata. */
export function pairReason(a, b, cmp) {
  if (a.fallbackVertical && a.fallbackVertical === b.fallbackVertical) {
    return REASONS.SHARED_VERTICAL_FALLBACK;
  }
  if (a.skeletonHash === b.skeletonHash) {
    const sameColors = a.colors.join() === b.colors.join();
    const sameIcons = a.icons.join() === b.icons.join();
    if (sameColors && sameIcons) return REASONS.COPY_ONLY_VARIATION;
    if (sameIcons) return REASONS.COLOR_ONLY_VARIATION;
    if (sameColors) return REASONS.ICON_ONLY_VARIATION;
    return REASONS.IDENTICAL_COMPONENT_STRUCTURE;
  }
  if (a.structureHash === b.structureHash) return REASONS.IDENTICAL_COMPONENT_STRUCTURE;
  if (cmp.dimensions.COPY_SIMILARITY >= 60) return REASONS.EXCESSIVE_COPY_SIMILARITY;
  if (
    cmp.score >= THRESHOLDS.high
    && cmp.dimensions.STRUCTURE_SIMILARITY >= 80
    && cmp.dimensions.SECTION_ORDER_SIMILARITY >= 80
  ) {
    return REASONS.VISUAL_COMPOSITION_CLONE;
  }
  if (cmp.score >= THRESHOLDS.clone) return REASONS.NEAR_DUPLICATE_LAYOUT;
  if (cmp.score >= THRESHOLDS.high) return REASONS.NEAR_DUPLICATE_LAYOUT;
  if (cmp.score >= THRESHOLDS.attention) return REASONS.SAME_FAMILY;
  return REASONS.DISTINCT;
}

export function statusFromScore(score, { fallback = false } = {}) {
  if (fallback) return STATUS.SHARED_FALLBACK;
  if (score >= THRESHOLDS.clone) return STATUS.CLONE;
  if (score >= THRESHOLDS.high) return STATUS.HIGH_SIMILARITY;
  if (score >= THRESHOLDS.attention) return STATUS.ATTENTION;
  if (score >= THRESHOLDS.acceptable) return STATUS.ACCEPTABLE;
  return STATUS.ORIGINAL;
}

/* ------------------------------------------------------------------ */
/* Leitura barata de dimensões de imagem (sem dependência externa)      */
/* ------------------------------------------------------------------ */
export function imageSize(file) {
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return null;
  }
  if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const fmt = buf.toString("ascii", 12, 16);
    if (fmt === "VP8X") return { width: (buf.readUIntLE(24, 3) & 0xffffff) + 1, height: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
    if (fmt === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (fmt === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off += 1; continue; }
      const marker = buf[off + 1];
      const len = buf.readUInt16BE(off + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
      }
      off += 2 + len;
    }
  }
  return null;
}

/** Detecta logo placeholder gerada por script (monograma SVG). */
export function isPlaceholderLogo(file) {
  if (!file.endsWith(".svg")) return false;
  let src = "";
  try {
    src = fs.readFileSync(file, "utf8");
  } catch {
    return false;
  }
  if (src.length > 4000) return false;
  const monogram = /<text[^>]*>[A-ZÀ-Ú]{2,4}<\/text>/.test(src);
  const simple = (src.match(/<(rect|circle|path|text)\b/g) ?? []).length <= 8;
  return monogram && simple;
}

/* ------------------------------------------------------------------ */
/* Análise completa do portfólio                                        */
/* ------------------------------------------------------------------ */
export function analyzePortfolio(root) {
  const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  const catalog = readJson("src/config/portfolio-catalog.json");
  const clients = readJson("src/config/portfolio-clients.json");
  const assetsCfg = readJson("src/config/portfolio-assets.json");
  // Status de capa NÃO é recalculado aqui: vem do contrato canônico
  // (src/lib/portfolio-cover-status.mjs → src/config/portfolio-cover-status.json).
  const coverStatus = readJson("src/config/portfolio-cover-status.json");
  const coverStatusBySlug = new Map((coverStatus.projects ?? []).map((r) => [r.slug, r]));
  const clientBySlug = new Map(clients.map((c) => [c.slug ?? c.clientKey, c]));

  // Template de vertical usado como fallback quando não há componente próprio.
  const verticalSource = fs.readFileSync(path.join(root, "src/routes/sites.$vertical.tsx"), "utf8");
  const verticalKeys = [...verticalSource.matchAll(/^\s{2}([a-z][a-z0-9-]*):\s*\{/gm)].map((m) => m[1]);
  const verticalFingerprint = fingerprintSource(verticalSource, { label: "sites.$vertical.tsx" });

  const publicPath = (p) => path.join(root, "public", String(p ?? "").replace(/^\//, ""));

  // uso compartilhado de assets
  const assetUsage = new Map();
  const bump = (key, slug) => {
    if (!key) return;
    if (!assetUsage.has(key)) assetUsage.set(key, new Set());
    assetUsage.get(key).add(slug);
  };
  for (const item of catalog) {
    const a = assetsCfg.clients?.[item.slug];
    bump(item.image, item.slug);
    bump(a?.icon, item.slug);
    bump(a?.socialImage, item.slug);
  }

  /* ---- hash de conteúdo dos assets percebidos (marca, capa, social) ---- */
  const fileHash = (file) => {
    try {
      return crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex").slice(0, 16);
    } catch {
      return null;
    }
  };
  const isExpectedShared = (p) => EXPECTED_SHARED_ASSETS.some((re) => re.test(String(p ?? "")));
  const assetHashOwners = new Map(); // hash -> [{slug, kind, path}]
  const perSlugAssets = new Map();
  for (const item of catalog) {
    const a = assetsCfg.clients?.[item.slug] ?? {};
    const entries = [
      ["BRAND", a.icon],
      ["COVER", item.image],
      ["SOCIAL_IMAGE", a.socialImage],
    ].filter(([, v]) => v);
    perSlugAssets.set(item.slug, entries);
    for (const [kind, rel] of entries) {
      const h = fileHash(publicPath(rel));
      if (!h) continue;
      if (!assetHashOwners.has(h)) assetHashOwners.set(h, []);
      assetHashOwners.get(h).push({ slug: item.slug, kind, path: rel });
    }
  }

  const projects = [];
  for (const item of catalog) {
    const slug = item.slug;
    const client = clientBySlug.get(slug);
    const assets = assetsCfg.clients?.[slug] ?? {};
    const componentFile = client?.componentFile ?? "";
    const componentPath = componentFile ? path.join(root, componentFile) : "";
    const hasOwnComponent = Boolean(componentPath && fs.existsSync(componentPath));

    const fallbackVertical = hasOwnComponent
      ? null
      : (verticalKeys.find((v) => (item.segment ?? "").toLowerCase().includes(v.slice(0, 5)))
        ?? item.segment ?? "generico");

    const source = hasOwnComponent ? fs.readFileSync(componentPath, "utf8") : verticalSource;
    const fp = hasOwnComponent
      ? fingerprintSource(source, { label: componentFile })
      : { ...verticalFingerprint, label: `sites.$vertical.tsx#${fallbackVertical}` };

    // padrão de assets: nomes normalizados dos arquivos do diretório do projeto
    const dir = path.join(root, "public/images", slug);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).sort() : [];
    fp.assetPattern = files
      .filter((f) => /\.(webp|avif|jpe?g|png|svg)$/i.test(f))
      .map((f) => f.toLowerCase().replace(/\d+/g, "#"));
    fp.fallbackVertical = fallbackVertical;

    /* ---- sinais de capa ---- */
    const cover = [];
    const catalogImage = item.image ?? "";
    if (!catalogImage) cover.push(SIGNALS.COVER_MISSING);
    if (catalogImage && catalogImage === assets.socialImage) cover.push(SIGNALS.COVER_IS_SOCIAL_IMAGE);
    if (/hero-og|(^|\/)og[-.]/i.test(catalogImage)) cover.push(SIGNALS.COVER_IS_SOCIAL_IMAGE);
    if (catalogImage && catalogImage === assets.icon) cover.push(SIGNALS.COVER_IS_LOGO);
    if (/logo/i.test(catalogImage)) cover.push(SIGNALS.COVER_IS_LOGO);
    if (catalogImage && (assetUsage.get(catalogImage)?.size ?? 0) > 1) cover.push(SIGNALS.COVER_SHARED_ASSET);

    const coverFile = catalogImage || assets.socialImage || assets.icon || "";
    const dims = coverFile && !/^https?:/.test(coverFile) ? imageSize(publicPath(coverFile)) : null;
    let ratio = null;
    if (dims && dims.height) {
      ratio = Math.round((dims.width / dims.height) * 100) / 100;
      const target = 1.6; // aspect-[16/10] do card
      const delta = Math.abs(ratio - target) / target;
      if (delta > 0.08) cover.push(SIGNALS.COVER_RATIO_MISMATCH);
      if (delta > 0.25) cover.push(SIGNALS.COVER_SEVERE_CROP);
    }
    if (!item.coverFocal) cover.push(SIGNALS.COVER_NO_FOCAL_POINT);

    /* ---- sinais de logo ---- */
    const logo = [];
    const iconPath = assets.icon ?? "";
    if (!iconPath || !fs.existsSync(publicPath(iconPath))) logo.push(SIGNALS.LOGO_MISSING);
    else {
      if (isPlaceholderLogo(publicPath(iconPath))) logo.push(SIGNALS.LOGO_PLACEHOLDER);
      if ((assetUsage.get(iconPath)?.size ?? 0) > 1) logo.push(SIGNALS.LOGO_SHARED);
      if (!iconPath.includes(`/images/${slug}/`)) logo.push(SIGNALS.LOGO_OUTSIDE_ASSETS_DIR);
      const variants = files.filter((f) => /logo/i.test(f));
      if (variants.length < 2) logo.push(SIGNALS.LOGO_NO_CONTRAST_VARIANT);
    }

    /* ---- compartilhamento de assets entre clientes ---- */
    const assetSharing = [];
    for (const [kind, rel] of perSlugAssets.get(slug) ?? []) {
      const h = fileHash(publicPath(rel));
      const owners = h ? (assetHashOwners.get(h) ?? []) : [];
      const others = owners.filter((o) => o.slug !== slug);
      if (!others.length) continue;
      const classification = isExpectedShared(rel)
        ? SIGNALS.ASSET_EXPECTED_SHARED
        : kind === "BRAND"
          ? SIGNALS.ASSET_INVALID_CROSS_CLIENT
          : SIGNALS.ASSET_SUSPICIOUS_SHARED;
      assetSharing.push({
        kind,
        path: rel,
        classification,
        sharedWith: [...new Set(others.map((o) => o.slug))].sort(),
      });
    }

    projects.push({
      slug,
      assetSharing,
      title: item.title ?? slug,
      segment: item.segment ?? "",
      componentFile: hasOwnComponent ? componentFile : "src/routes/sites.$vertical.tsx",
      hasOwnComponent,
      fallbackVertical,
      fingerprint: fp,
      coverSignals: [...new Set(cover)].sort(),
      coverRatio: ratio,
      canonicalCoverStatus: coverStatusBySlug.get(slug)?.status ?? "UNCERTAIN_ORIGIN",
      canonicalCoverReason: coverStatusBySlug.get(slug)?.reason ?? null,
      logoSignals: [...new Set(logo)].sort(),
    });
  }

  projects.sort((a, b) => a.slug.localeCompare(b.slug));

  /* ---- comparação par-a-par ---- */
  const pairs = [];
  for (let i = 0; i < projects.length; i += 1) {
    for (let j = i + 1; j < projects.length; j += 1) {
      const cmp = compareFingerprints(projects[i].fingerprint, projects[j].fingerprint);
      const reason = pairReason(projects[i].fingerprint, projects[j].fingerprint, cmp);
      pairs.push({ a: projects[i].slug, b: projects[j].slug, ...cmp, reason });
    }
  }

  for (const p of projects) {
    const mine = pairs.filter((x) => x.a === p.slug || x.b === p.slug);
    mine.sort((x, y) => y.score - x.score || (x.a + x.b).localeCompare(y.a + y.b));
    const top = mine[0];
    p.score = top?.score ?? 0;
    p.nearestMatch = top ? (top.a === p.slug ? top.b : top.a) : null;
    p.nearestMatchScore = top?.score ?? 0;
    p.dimensions = top?.dimensions ?? {};
    p.reasons = [];
    if (!p.hasOwnComponent) p.reasons.push(REASONS.SHARED_VERTICAL_FALLBACK);
    if (top && top.reason !== REASONS.DISTINCT) p.reasons.push(top.reason);
    p.originalityStatus = statusFromScore(p.score, { fallback: !p.hasOwnComponent });
  }

  /* ---- clusters (ligação simples acima do limiar HIGH) ---- */
  const parent = new Map(projects.map((p) => [p.slug, p.slug]));
  const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
  for (const pair of pairs) {
    if (pair.score < THRESHOLDS.clone) continue;
    const ra = find(pair.a);
    const rb = find(pair.b);
    if (ra !== rb) parent.set(ra, rb);
  }
  const groups = new Map();
  for (const p of projects) {
    const root_ = find(p.slug);
    if (!groups.has(root_)) groups.set(root_, []);
    groups.get(root_).push(p.slug);
  }
  const clusters = [...groups.values()]
    .filter((g) => g.length > 1)
    .map((members) => members.sort())
    .sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]))
    .map((members, idx) => {
      const inner = pairs.filter((x) => members.includes(x.a) && members.includes(x.b));
      const avg = Math.round(inner.reduce((s, x) => s + x.score, 0) / (inner.length || 1));
      const reasonCounts = new Map();
      for (const x of inner) reasonCounts.set(x.reason, (reasonCounts.get(x.reason) ?? 0) + 1);
      const reason = [...reasonCounts.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? REASONS.SAME_FAMILY;
      const base = projects.find((p) => p.slug === members[0])?.componentFile ?? "";
      return {
        id: `CLUSTER_${String(idx + 1).padStart(2, "0")}`,
        members,
        averageScore: avg,
        reason,
        baseComponent: base,
        risk: avg >= THRESHOLDS.clone ? "ALTO" : avg >= THRESHOLDS.high ? "MEDIO" : "BAIXO",
      };
    });

  const count = (fn) => projects.filter(fn).length;
  const summary = {
    total: projects.length,
    original: count((p) => p.originalityStatus === STATUS.ORIGINAL),
    acceptable: count((p) => p.originalityStatus === STATUS.ACCEPTABLE),
    attention: count((p) => p.originalityStatus === STATUS.ATTENTION),
    highSimilarity: count((p) => p.originalityStatus === STATUS.HIGH_SIMILARITY),
    clone: count((p) => p.originalityStatus === STATUS.CLONE),
    sharedFallback: count((p) => p.originalityStatus === STATUS.SHARED_FALLBACK),
    clusters: clusters.length,
    placeholderLogos: count((p) => p.logoSignals.includes(SIGNALS.LOGO_PLACEHOLDER)),
    missingLogos: count((p) => p.logoSignals.includes(SIGNALS.LOGO_MISSING)),
    // Legado (compatibilidade de baseline): "sem campo image no catálogo".
    missingCovers: count((p) => p.coverSignals.includes(SIGNALS.COVER_MISSING)),
    // Canônico: capa publicável segundo o contrato único.
    coverValid: count((p) => p.canonicalCoverStatus === "VALID"),
    coverPending: count((p) => p.canonicalCoverStatus !== "VALID"),
    coversAsSocialImage: count((p) => p.coverSignals.includes(SIGNALS.COVER_IS_SOCIAL_IMAGE)),
    sharedCovers: count((p) => p.coverSignals.includes(SIGNALS.COVER_SHARED_ASSET)),
    severeCrop: count((p) => p.coverSignals.includes(SIGNALS.COVER_SEVERE_CROP)),
    invalidCrossClientAssets: count((p) =>
      (p.assetSharing ?? []).some((x) => x.classification === SIGNALS.ASSET_INVALID_CROSS_CLIENT)),
    suspiciousSharedAssets: count((p) =>
      (p.assetSharing ?? []).some((x) => x.classification === SIGNALS.ASSET_SUSPICIOUS_SHARED)),
  };

  return {
    generator: "scripts/portfolio-originality.mjs",
    weights: WEIGHTS,
    thresholds: THRESHOLDS,
    summary,
    projects: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      segment: p.segment,
      componentFile: p.componentFile,
      score: p.score,
      originalityStatus: p.originalityStatus,
      nearestMatch: p.nearestMatch,
      nearestMatchScore: p.nearestMatchScore,
      dimensions: p.dimensions,
      reasons: p.reasons,
      fallbackVertical: p.hasOwnComponent ? null : p.fallbackVertical,
      coverSignals: p.coverSignals,
      canonicalCoverStatus: p.canonicalCoverStatus,
      canonicalCoverReason: p.canonicalCoverReason,
      coverRatio: p.coverRatio,
      logoSignals: p.logoSignals,
      assetSharing: p.assetSharing ?? [],
      fingerprint: {
        skeletonHash: p.fingerprint.skeletonHash,
        structureHash: p.fingerprint.structureHash,
        sectionCount: p.fingerprint.sectionCount,
        lines: p.fingerprint.lines,
      },
    })),
    clusters,
    topPairs: [...pairs].sort((a, b) => b.score - a.score).slice(0, 25),
    pairMatrix: {
      threshold: THRESHOLDS,
      totalPairs: pairs.length,
      nearest: Object.fromEntries(
        projects.map((p) => {
          const mine = pairs
            .filter((x) => x.a === p.slug || x.b === p.slug)
            .sort((x, y) => y.score - x.score)
            .slice(0, 3)
            .map((x) => ({ slug: x.a === p.slug ? x.b : x.a, score: x.score, reason: x.reason }));
          return [p.slug, mine];
        }),
      ),
    },
  };
}

/** Baseline mínima e comparação de regressão. */
export function toBaseline(report) {
  return {
    generatedBy: "check:portfolio-originality --write-baseline",
    summary: report.summary,
    projects: Object.fromEntries(
      report.projects.map((p) => [
        p.slug,
        {
          score: p.score,
          status: p.originalityStatus,
          fallback: Boolean(p.fallbackVertical),
          placeholderLogo: p.logoSignals.includes(SIGNALS.LOGO_PLACEHOLDER),
          missingLogo: p.logoSignals.includes(SIGNALS.LOGO_MISSING),
          missingCover: p.coverSignals.includes(SIGNALS.COVER_MISSING),
          sharedCover: p.coverSignals.includes(SIGNALS.COVER_SHARED_ASSET),
        },
      ]),
    ),
  };
}

const COUNTERS = [
  ["highSimilarity", "projetos HIGH_SIMILARITY"],
  ["clone", "clones"],
  ["sharedFallback", "fallbacks compartilhados"],
  ["placeholderLogos", "logos placeholder"],
  ["missingLogos", "logos ausentes"],
  ["missingCovers", "capas sem arquivo no catálogo (legado)"],
  ["sharedCovers", "capas compartilhadas"],
];

/**
 * Regra de não regressão:
 *  - LEGACY: passivo existente é reportado, não bloqueia.
 *  - NEW_OR_MODIFIED: projeto novo ou que piorou de status não passa.
 */
export function detectRegressions(report, baseline) {
  const regressions = [];
  const improvements = [];
  if (!baseline) return { verdict: "NO_BASELINE", regressions, improvements };

  for (const [key, label] of COUNTERS) {
    const before = baseline.summary?.[key] ?? 0;
    const after = report.summary[key] ?? 0;
    if (after > before) {
      regressions.push({ kind: "COUNTER", key, label, before, after });
    } else if (after < before) {
      improvements.push({ kind: "COUNTER", key, label, before, after });
    }
  }

  const rank = [STATUS.ORIGINAL, STATUS.ACCEPTABLE, STATUS.ATTENTION, STATUS.SHARED_FALLBACK, STATUS.HIGH_SIMILARITY, STATUS.CLONE];
  for (const p of report.projects) {
    const prev = baseline.projects?.[p.slug];
    if (!prev) {
      if ([STATUS.CLONE, STATUS.HIGH_SIMILARITY, STATUS.SHARED_FALLBACK].includes(p.originalityStatus)) {
        regressions.push({
          kind: "NEW_PROJECT",
          slug: p.slug,
          status: p.originalityStatus,
          score: p.score,
          nearestMatch: p.nearestMatch,
        });
      }
      continue;
    }
    const worse = rank.indexOf(p.originalityStatus) > rank.indexOf(prev.status);
    if (worse) {
      regressions.push({
        kind: "MODIFIED_PROJECT",
        slug: p.slug,
        before: prev.status,
        after: p.originalityStatus,
        beforeScore: prev.score,
        afterScore: p.score,
      });
    } else if (rank.indexOf(p.originalityStatus) < rank.indexOf(prev.status)) {
      improvements.push({ kind: "MODIFIED_PROJECT", slug: p.slug, before: prev.status, after: p.originalityStatus });
    }
  }

  return {
    verdict: regressions.length === 0 ? "PASS" : "FAIL",
    regressions,
    improvements,
  };
}
