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
const IS_PULL_REQUEST = process.env.GITHUB_EVENT_NAME === "pull_request";
const TARGET_URL = IS_PULL_REQUEST
  ? "http://127.0.0.1:8080"
  : process.env.LHCI_TARGET_URL || "https://0web.com.br";
const clients = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));
const shardCount = Math.max(1, Number(process.env.LHCI_SHARD_COUNT || 1));
const shardIndex = Math.max(0, Number(process.env.LHCI_SHARD_INDEX || 0));
const portfolioUrls = clients
  .filter((_, index) => index % shardCount === shardIndex)
  .map(({ slug }) => `${TARGET_URL}/portfolio/${slug}`);
const commonUrls =
  shardIndex === 0
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
      url: [...commonUrls, ...portfolioUrls],
      ...(IS_PULL_REQUEST
        ? {
            // PR mede o artefato da própria branch, não a produção anterior.
            // Assim um gate só reprova por regressão presente no código revisado.
            startServerCommand: "bun run build && bun run preview:prod",
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
        "categories:seo": ["error", { minScore: 0.95 }],
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
        "canonical": "error",
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
