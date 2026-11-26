#!/usr/bin/env node
/**
 * Regressão visual da Home, do índice e das rotas `/portfolio/:slug`
 * (desktop + tablet + mobile).
 *
 * Primeira execução cria as baselines em tests/visual/baseline/.
 * Execuções seguintes comparam pixel a pixel e falham acima do limiar,
 * gravando o diff em seo-reports/visual/.
 *
 * Robustez (motivo da correção): o script original abria um contexto novo por
 * captura e esperava `networkidle` + 2,5 s em ~93 combinações, estourando o
 * tempo do CI — o browser era encerrado no meio e o run falhava com erro de
 * `newContext`. Agora há um contexto por viewport, paralelismo controlado,
 * timeout por rota e animações desligadas para capturas determinísticas.
 *
 * Uso:
 *   node scripts/playwright-visual-regression.mjs            # compara
 *   node scripts/playwright-visual-regression.mjs --update   # regrava baselines
 *   VISUAL_ONLY=home,rm-fretes node scripts/playwright-visual-regression.mjs
 */
import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PNG } from "pngjs";
import { repeatedTopStripRows } from "./visual-screenshot-integrity.mjs";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const update = process.argv.includes("--update");
const threshold = Number(process.env.VISUAL_THRESHOLD ?? 0.02); // 2% dos pixels
const routeTimeout = Number(process.env.VISUAL_ROUTE_TIMEOUT_MS ?? 20000);
const settleMs = Math.max(600, Number(process.env.VISUAL_SETTLE_MS ?? 1200) || 1200);
const concurrency = Math.max(1, Number(process.env.VISUAL_CONCURRENCY ?? 3));
const viewportSpec = process.env.VISUAL_VIEWPORTS ?? "";
const only = (process.env.VISUAL_ONLY ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const skip = (process.env.VISUAL_SKIP ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const baselineDir = resolve(
  process.cwd(),
  process.env.VISUAL_BASELINE_DIR ?? "tests/visual/baseline",
);
const outDir = resolve(process.cwd(), "seo-reports/visual");
const approvedHashesPath = resolve(process.cwd(), "tests/visual/approved-hashes.json");
const approvedHashes = existsSync(approvedHashesPath)
  ? JSON.parse(readFileSync(approvedHashesPath, "utf8"))
  : {};
mkdirSync(baselineDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const clients = JSON.parse(readFileSync(resolve(process.cwd(), "src/config/portfolio-clients.json"), "utf8"));
// Prévia nova tem rota e screenshots próprios; nunca adicioná-la ao gate global
// da produção, onde deve responder 404 por política de não afiliação.
const previewRoutes = only.some((name) => name.startsWith("preview-"))
  ? readdirSync(resolve(process.cwd(), "src/routes"))
      .map((file) => file.match(/^portfolio-preview\.([a-z0-9-]+)\.tsx$/)?.[1])
      .filter(Boolean)
      .map((slug) => ({
        path: `/portfolio-preview/${slug}`,
        name: `preview-${slug}`,
        preview: true,
      }))
  : [];
const allRoutes = [
  ...previewRoutes,
  { path: "/", name: "home" },
  { path: "/portfolio", name: "portfolio-index" },
  ...clients.map((c) => ({ path: `/portfolio/${c.slug}`, name: c.slug })),
];
// Dedicated new demos may be outside portfolio-clients.json while commercial
// ownership is pending. Explicit VISUAL_ONLY still captures the real route.
const dedicatedOnly = only
  .filter((slug) => /^[a-z0-9-]+$/.test(slug))
  .filter((slug) => !allRoutes.some((route) => route.name === slug))
  .filter((slug) => existsSync(resolve(process.cwd(), `src/routes/portfolio.${slug}.tsx`)))
  .map((slug) => ({ path: `/portfolio/${slug}`, name: slug }));
const selectedRoutes = only.length
  ? [...allRoutes.filter((r) => only.includes(r.name)), ...dedicatedOnly]
  : allRoutes;
const routes = selectedRoutes.filter((route) => !skip.includes(route.name));
const viewports = viewportSpec
  ? viewportSpec.split(",").map((entry) => {
      const [name, dimensions] = entry.trim().split(":");
      const [width, height] = (dimensions ?? "").split("x").map(Number);
      if (!name || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        throw new Error(`[visual] viewport inválido: ${entry}`);
      }
      return { name, width, height };
    })
  : [
      { name: "desktop", width: 1280, height: 900 },
      { name: "tablet", width: 834, height: 1112 },
      { name: "mobile", width: 393, height: 852 },
    ];

/**
 * CSS injetado antes do primeiro paint.
 *  - elimina animações, transições e caret piscando;
 *  - oculta (sem tirar do fluxo) blocos legitimamente voláteis, que mudam por
 *    dados do banco ou por tempo: destaques/spotlight da home, banner de
 *    consentimento, chatbot e demais camadas fixas (CTAs flutuantes, toasts).
 *    Sem isso a home acusava ~20% de diferença entre duas execuções idênticas.
 */
const FREEZE_CSS = `
*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
  caret-color: transparent !important;
}
/* O cue Framer da D.Y.Z escreve transform inline mesmo quando CSS animations=none.
   Congelar só nos screenshots torna a comparação determinística, sem tocar no produto. */
[data-visual-freeze-dyz-arrow="true"] {
  transform: none !important;
}
#servicos-destaque,
#spotlight,
[data-visual-volatile="true"] {
  visibility: hidden !important;
}
`;

const MANAGED_IMAGE_VALIDATION_ROUTES = new Set([
  "studio-de-cilios",
  "refrigeracao-maresia",
  "lk-alvenaria",
  "paulo-mestre-de-obras",
]);

/** Camadas fixas (chatbot, cookies, CTAs flutuantes) são removidas do paint. */
const HIDE_FIXED_LAYERS = `
  (() => {
    const hideAll = () => {
      for (const el of document.querySelectorAll('body *')) {
        const pos = getComputedStyle(el).position;
        if (pos === 'fixed') {
          el.style.visibility = 'hidden';
          continue;
        }
        if (pos === 'sticky') {
          // Chromium pode manter a layer sticky no compositor mesmo invisível e
          // duplicá-la no rodapé da captura. Rebaixar para fluxo normal remove
          // somente essa layer no ambiente visual, preservando espaço/layout.
          el.style.setProperty('position', 'static', 'important');
          el.style.setProperty('top', 'auto', 'important');
          el.style.setProperty('bottom', 'auto', 'important');
          el.style.visibility = 'hidden';
        }
      }
    };
    hideAll();
    // Widgets flutuantes (prova social, upsell, chatbot) montam com atraso via
    // framer-motion e reapareciam depois do hide, gerando diffs falsos.
    if (!window.__0webHideObserver) {
      window.__0webHideObserver = new MutationObserver(hideAll);
      window.__0webHideObserver.observe(document.body, { childList: true, subtree: true });
    }
  })();
`;



const bundled = chromium.executablePath();
const root = "/opt/ms-playwright";
const installed = existsSync(root)
  ? readdirSync(root)
      .filter((n) => n.startsWith("chromium-") && !n.includes("headless"))
      .map((n) => join(root, n, "chrome-linux", "chrome"))
      .find((p) => existsSync(p))
  : undefined;

const browser = await chromium.launch({
  headless: true,
  executablePath: existsSync(bundled) ? bundled : installed,
});

const failures = [];
const created = [];
const compared = [];

function pixelSha256(png) {
  return createHash("sha256")
    .update(`${png.width}x${png.height}\0`)
    .update(png.data)
    .digest("hex");
}

function approvedPixelReference(routeName, viewportName, png) {
  const approval = approvedHashes?.[routeName]?.viewports?.[viewportName];
  if (!approval) return false;
  return (
    Number(approval.width) === png.width &&
    Number(approval.height) === png.height &&
    approval.pixelSha256 === pixelSha256(png)
  );
}

function diffRatio(a, b) {
  if (a.width !== b.width || a.height !== b.height) return 1;
  let diff = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
    const db = Math.abs(a.data[i + 2] - b.data[i + 2]);
    if (dr + dg + db > 30) diff += 1;
  }
  return diff / (a.width * a.height);
}

/**
 * Overrides de A/B fixados na variante "A".
 * Sem isso a home sorteava hero/CTA/spotlight a cada execução e o diff
 * acusava até 20% de pixels alterados sem nenhuma regressão real.
 */
const AB_OVERRIDES = JSON.stringify({
  hero_copy: "A",
  hero_cta: "A",
  hero_primary_cta: "A",
  home_spotlight_copy: "A",
  testimonials_headline: "A",
});

async function capture(context, route, viewport) {
  const key = `${route.name}-${viewport.name}.png`;
  const page = await context.newPage();
  page.setDefaultTimeout(routeTimeout);
  // Reduced motion prevents JS-driven reveals from being captured mid-transition.
  await page.emulateMedia({ reducedMotion: "reduce" });
  try {
    if (process.env.VISUAL_READ_ONLY === "1") {
      await page.addInitScript(() => {
        try {
          Object.defineProperty(navigator, "sendBeacon", {
            configurable: true,
            value: () => true,
          });
        } catch {
          /* navegador pode expor sendBeacon como propriedade não configurável */
        }
      });
      await page.route("**/*", async (route) => {
        const method = route.request().method();
        if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
          await route.abort();
          return;
        }
        await route.continue();
      });
    }

    await page.addInitScript(
      (ab) => {
        try {
          localStorage.setItem("0web_ab_winner_v1", ab);
        } catch {
          /* modo privado: segue com variante sorteada */
        }
      },
      AB_OVERRIDES,
    );
    // `0web_preview=1` silencia overlays da hospedagem: screenshots estáveis.
    const navigation = await page.goto(`${baseUrl}${route.path}?0web_preview=1`, {
      waitUntil: "domcontentloaded",
      timeout: routeTimeout,
    });
    if (route.preview) {
      if (navigation?.status() !== 200) throw new Error(`prévia retornou HTTP ${navigation?.status() ?? "sem resposta"}`);
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      if (!robots?.includes("noindex")) throw new Error("prévia sem noindex");
      const content = (await page.locator("main").innerText()).toLowerCase();
      if (!content.includes("não oficial")) throw new Error("prévia não informa caráter não oficial");
    }
    await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});
    // Estabiliza a captura: imagens decodificadas + fontes prontas, com teto de tempo.
    await page
      .waitForFunction(() => Array.from(document.images).every((img) => img.complete), undefined, {
        timeout: Math.min(8000, routeTimeout),
      })
      .catch(() => {});
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    // complete=true means the bytes arrived, not necessarily that the image was decoded/painted.
    await page.evaluate(async () => {
      const images = Array.from(document.images).filter((img) => img.complete && img.naturalWidth > 0);
      await Promise.all(images.map(async (img) => {
        if (typeof img.decode !== "function") return;
        try {
          await img.decode();
        } catch {
          // A broken optional/third-party image remains visible to the normal QA gates.
        }
      }));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }).catch(() => {});
    if (process.env.VISUAL_READ_ONLY === "1" && MANAGED_IMAGE_VALIDATION_ROUTES.has(route.name)) {
      const selector = '[data-portfolio-slug="' + route.name + '"] img[data-portfolio-managed-field]';
      const managedImages = await page.locator(selector).evaluateAll((images) =>
        images
          .filter((image) => {
            const rect = image.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 1.25 && rect.bottom > 0;
          })
          .map((image) => ({
            src: image.getAttribute("src"),
            loaded: image.complete && image.naturalWidth > 0,
          })),
      );
      if (managedImages.some((image) => !image.src || !image.loaded)) {
        throw new Error("imagem administrada quebrada na Production: " + route.name);
      }
      if (!managedImages.length) {
        // Sem service-role, o override administrado pode não existir em Production.
        // A captura continua obrigatória: valida o fallback estático e aplica o mesmo
        // limite visual de 2%, sem descartar a rota nem reduzir cobertura.
        const fallbackImages = await page.locator(
          '[data-portfolio-slug="' + route.name + '"] img:not([data-portfolio-managed-field])',
        ).evaluateAll((images) =>
          images
            .filter((image) => {
              const rect = image.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 1.25 && rect.bottom > 0;
            })
            .map((image) => image.complete && image.naturalWidth > 0),
        );
        if (!fallbackImages.some(Boolean)) {
          throw new Error("imagem de fallback ausente na Production: " + route.name);
        }
        console.log("[visual] fallback estático validado: " + route.name);
      }
    }
    await page.waitForTimeout(settleMs);
    await page.evaluate(HIDE_FIXED_LAYERS).catch(() => {});
    let buffer = await page.screenshot({ timeout: routeTimeout, animations: "disabled" });
    let currentPng = PNG.sync.read(buffer);
    const longPage = await page
      .evaluate(() => document.documentElement.scrollHeight > window.innerHeight * 1.25)
      .catch(() => false);
    let repeatedRows = longPage ? repeatedTopStripRows(currentPng) : 0;

    if (repeatedRows) {
      console.warn(
        `[visual] ${key}: compositor repetiu ${repeatedRows}px do topo no rodapé; refazendo captura`,
      );
      await page
        .evaluate(async () => {
          window.scrollTo(0, 96);
          void document.documentElement.getBoundingClientRect();
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          window.scrollTo(0, 0);
          void document.documentElement.getBoundingClientRect();
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        })
        .catch(() => {});
      await page.waitForTimeout(120);
      buffer = await page.screenshot({ timeout: routeTimeout, animations: "disabled" });
      currentPng = PNG.sync.read(buffer);
      repeatedRows = repeatedTopStripRows(currentPng);
      if (repeatedRows) {
        console.warn(
          `[visual] ${key}: retry comum ainda repetiu ${repeatedRows}px; usando captura CDP sem surface compositor`,
        );
        let cdp;
        try {
          cdp = await context.newCDPSession(page);
          const shot = await cdp.send("Page.captureScreenshot", {
            format: "png",
            fromSurface: false,
            captureBeyondViewport: false,
          });
          buffer = Buffer.from(shot.data, "base64");
          currentPng = PNG.sync.read(buffer);
          repeatedRows = repeatedTopStripRows(currentPng);
        } finally {
          await cdp?.detach().catch(() => {});
        }
      }
      if (repeatedRows) {
        writeFileSync(join(outDir, key), buffer);
        failures.push(
          `${key}: artefato do compositor persistiu após retry + CDP (topo repetido nos últimos ${repeatedRows}px)`,
        );
        return;
      }
    }

    const baselinePath = join(baselineDir, key);

    if (update || !existsSync(baselinePath)) {
      writeFileSync(baselinePath, buffer);
      created.push(key);
      return;
    }
    const baselinePng = PNG.sync.read(readFileSync(baselinePath));
    const ratio = diffRatio(baselinePng, currentPng);
    compared.push(key);
    if (ratio > threshold) {
      writeFileSync(join(outDir, key), buffer);
      if (approvedPixelReference(route.name, viewport.name, currentPng)) {
        const evidence = approvedHashes?.[route.name]?.evidence;
        console.log(
          `[visual] ${key} APPROVED (${(ratio * 100).toFixed(2)}%) · evidence run ${evidence?.runId ?? "n/a"}`,
        );
      } else {
        failures.push(
          `${key}: ${(ratio * 100).toFixed(2)}% de pixels alterados (limite ${(threshold * 100).toFixed(0)}%)`,
        );
      }
    } else {
      console.log(`[visual] ${key} OK (${(ratio * 100).toFixed(2)}%)`);
    }
  } catch (error) {
    failures.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await page.close().catch(() => {});
  }
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
  });
  try {
    const queue = [...routes];
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      for (let route = queue.shift(); route; route = queue.shift()) {
        await capture(context, route, viewport);
      }
    });
    await Promise.all(workers);
  } finally {
    await context.close().catch(() => {});
  }
}

await browser.close();

if (created.length) console.log(`[visual] baselines gravadas: ${created.length}`);
if (failures.length) {
  console.error(`\n[visual] FAIL — ${failures.length} diferença(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\n[visual] OK — ${compared.length} comparação(ões) dentro do limiar, ${created.length} baseline(s) nova(s)`);