/**
 * Lighthouse CI config.
 *
 * Runs against the published / preview URL and fails CI when Performance or
 * SEO scores drop below the targets, or when Core Web Vitals regress.
 *
 * Local: `bun run lhci` (requires LHCI_TARGET_URL env or defaults to preview).
 * CI:    .github/workflows/lighthouse.yml
 */
const fs = require("node:fs");
const IS_PULL_REQUEST =
  process.env.LHCI_IS_PULL_REQUEST === "1" ||
  process.env.GITHUB_EVENT_NAME === "pull_request";
const USE_LOCAL_SERVER =
  process.env.LHCI_USE_LOCAL === "1" ||
  IS_PULL_REQUEST;
const TARGET_URL = USE_LOCAL_SERVER
  ? "http://127.0.0.1:8080"
  : process.env.LHCI_TARGET_URL || "https://0web.com.br";
const clients = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));
const shardCount = Math.max(1, Number(process.env.LHCI_SHARD_COUNT || 1));
const shardIndex = Math.max(0, Number(process.env.LHCI_SHARD_INDEX || 0));
const LIGHTHOUSE_SCOPE = process.env.LHCI_SCOPE || "full";
const PREVIEW_ONLY = LIGHTHOUSE_SCOPE === "preview";
const LIGHTHOUSE_ONLY = (process.env.LHCI_ONLY || "")
  .split(",")
  .map((slug) => slug.trim())
  .filter(Boolean);
// Noindex commercial demonstrations are intentionally not Google-indexable.
// The *aggregate* SEO score includes the crawlability penalty. Individual SEO
// requirements (title, description, lang, canonical, valid response and alt)
// remain errors, as do performance, accessibility and Core Web Vitals.
// This exception is narrowly limited to dedicated unlisted demo routes whose
// actual source explicitly declares noindex and non-official status.
const DEMO_ONLY =
  LIGHTHOUSE_SCOPE === "portfolio" &&
  LIGHTHOUSE_ONLY.length > 0 &&
  LIGHTHOUSE_ONLY.every((slug) => {
    if (!/^[a-z0-9-]+$/.test(slug) || clients.some((item) => item.slug === slug)) return false;
    const routePath = `src/routes/portfolio.${slug}.tsx`;
    if (!fs.existsSync(routePath)) return false;
    const route = fs.readFileSync(routePath, "utf8");
    return route.includes('content: "noindex,follow') &&
      route.includes("Portfólio demonstrativo") &&
      route.includes('rel: "canonical"');
  });

const regionalUrls =
  LIGHTHOUSE_SCOPE === "regional" && shardIndex === 0
    ? [`${TARGET_URL}/portfolio/servicos-locais/barreiro`]
    : [];
// Mesmo orçamento (>=90 performance, >=95 SEO/A11y) aplicado às páginas
// afetadas por mudanças exclusivas de imagens da loja e dos destaques.
const serviceUrls = LIGHTHOUSE_SCOPE === "services" && shardIndex === 0
  ? [
      `${TARGET_URL}/`,
      `${TARGET_URL}/servicos`,
      `${TARGET_URL}/servicos/site-express`,
      `${TARGET_URL}/servicos/google-ads-299`,
      `${TARGET_URL}/servicos/google-meu-negocio`,
      `${TARGET_URL}/servicos/presenca-digital`,
      `${TARGET_URL}/servicos/trafego-pago-local`,
      `${TARGET_URL}/servicos/seo`,
    ]
  : [];
const previewUrls = PREVIEW_ONLY && shardIndex === 0
  ? LIGHTHOUSE_ONLY.filter((name) => /^preview-[a-z0-9-]+$/.test(name))
      .map((name) => `${TARGET_URL}/portfolio-preview/${name.slice(8)}`)
  : [];
const portfolioIndexOnly = LIGHTHOUSE_ONLY.includes("portfolio-index");
const individualPortfolioOnly = LIGHTHOUSE_ONLY.filter((slug) => slug !== "portfolio-index");
const portfolioUrls = LIGHTHOUSE_SCOPE === "services" || PREVIEW_ONLY ? [] : individualPortfolioOnly.length
  ? individualPortfolioOnly.map((slug) => `${TARGET_URL}/portfolio/${slug}`)
  : LIGHTHOUSE_ONLY.length
    ? []
    : LIGHTHOUSE_SCOPE === "regional"
      ? []
      : clients
          .filter((_, index) => index % shardCount === shardIndex)
          .map(({ slug }) => `${TARGET_URL}/portfolio/${slug}`);
const commonUrls =
  LIGHTHOUSE_SCOPE === "services" || PREVIEW_ONLY ? [] :
  portfolioIndexOnly && shardIndex === 0
    ? [`${TARGET_URL}/portfolio`]
    : LIGHTHOUSE_ONLY.length === 0 && LIGHTHOUSE_SCOPE !== "regional" && shardIndex === 0
      ? [
          `${TARGET_URL}/`,
          `${TARGET_URL}/blog`,
          `${TARGET_URL}/blog/3-palavras-chatgpt-respostas-inteligentes`,
          `${TARGET_URL}/servicos`,
          `${TARGET_URL}/servicos/criacao-de-sites`,
          `${TARGET_URL}/portfolio`,
        ]
      : [];

module.exports = {
  ci: {
    collect: {
      url: [...previewUrls, ...regionalUrls, ...serviceUrls, ...commonUrls, ...portfolioUrls],
      ...(USE_LOCAL_SERVER
        ? {
            // PR e push em main medem o artefato do próprio commit.
            // workflow_dispatch é o modo explícito para auditar URL externa.
            startServerCommand: PREVIEW_ONLY
              ? "VERCEL_ENV=preview bun run build && VERCEL_ENV=preview bun run preview:prod"
              : "bun run build && bun run preview:prod",
            startServerReadyPattern: "Ready on",
            startServerReadyTimeout: 180000,
          }
        : {}),
      numberOfRuns: 2,
      settings: {
        preset: "desktop",
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      assertions: {
        // Budgets mínimos — bloqueiam o PR quando quebrados.
        "categories:performance": ["error", { minScore: 0.9 }],
        // Uma prévia deliberadamente noindex não é uma página elegível ao Google.
        // SEO público permanece obrigatório nos portfolios indexáveis.
        "categories:seo": [PREVIEW_ONLY || DEMO_ONLY ? "warn" : "error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],

        // Core Web Vitals (lab proxies; INP estimated via TBT)
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],

        // SEO musts
        "meta-description": "error",
        "document-title": "error",
        "html-has-lang": "error",
        "canonical": PREVIEW_ONLY ? "off" : "error",
        "robots-txt": "error",
        "image-alt": "error",
        "http-status-code": "error",

        // Performance dos projetos de portfólio: imagens e JS sob demanda.
        "uses-responsive-images": ["warn", { maxLength: 0 }],
        "modern-image-formats": ["warn", { maxLength: 0 }],
        "offscreen-images": ["error", { maxLength: 0 }],
        "unused-javascript": ["warn", { maxNumericValue: 150000 }],
        "uses-long-cache-ttl": ["warn", { maxNumericValue: 200000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
