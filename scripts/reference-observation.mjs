#!/usr/bin/env node
/**
 * Inspeção passiva e limitada de páginas públicas pertencentes à 0WEB.
 * Produz um relatório de estrutura/SEO/conversão para investigação posterior.
 * NÃO é o REA, não submete formulários nem instala dependências.
 * Uso: node scripts/reference-observation.mjs https://0web.com.br/portfolio
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const OWNED_ORIGINS = new Set([
  "https://0web.com.br",
  "https://www.0web.com.br",
  "https://zeroweb-2026.vercel.app",
]);

export function checkedTarget(raw) {
  let target;
  try {
    target = new URL(raw);
  } catch {
    throw new Error("Informe uma URL HTTPS absoluta da 0WEB.");
  }
  if (target.protocol !== "https:" || !OWNED_ORIGINS.has(target.origin)) {
    throw new Error("Origem não autorizada. Este piloto permite apenas os domínios públicos da 0WEB.");
  }
  if (target.username || target.password || target.search || target.hash) {
    throw new Error("Credenciais, parâmetros de consulta e fragmentos não são permitidos.");
  }
  return target.toString();
}

export function allowsPassiveRequest(method, rawUrl) {
  if (!new Set(["GET", "HEAD"]).has(String(method).toUpperCase())) return false;
  try {
    checkedTarget(rawUrl);
    return true;
  } catch {
    return false;
  }
}

export async function observeOwnedPage(rawUrl, { chromiumLoader } = {}) {
  const url = checkedTarget(rawUrl);
  const { chromium } = await (chromiumLoader || (() => import("playwright")))();
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      locale: "pt-BR",
      serviceWorkers: "block",
      acceptDownloads: false,
    });
    await context.route("**/*", async (route) => {
      const request = route.request();
      if (!allowsPassiveRequest(request.method(), request.url())) {
        await route.abort("blockedbyclient");
        return;
      }
      await route.continue();
    });
    const page = await context.newPage();
    page.on("download", (download) => void download.cancel());
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // Cobre hidratação básica sem clicar nem aceitar cookies.
    await page.waitForTimeout(800);
    const finalUrl = checkedTarget(page.url());
    const observation = await page.evaluate(() => {
      const norm = (value, max = 150) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
      const meta = (selector) => norm(document.querySelector(selector)?.getAttribute("content"), 240) || null;
      const headings = [...document.querySelectorAll("h1,h2,h3")].slice(0, 40).map((el) => ({
        level: Number(el.tagName.slice(1)), text: norm(el.textContent),
      }));
      const actions = [...document.querySelectorAll("button,a[href]")]
        .filter((el) => el.matches("button,[data-funnel-cta],a[href*='/contato'],a[href*='/orcamento']"))
        .slice(0, 60).map((el) => ({
          kind: el.tagName.toLowerCase(),
          label: norm(el.getAttribute("aria-label") || el.textContent, 100),
          isFunnel: el.hasAttribute("data-funnel-cta"),
        }));
      const forms = [...document.querySelectorAll("form")].slice(0, 15).map((form) => ({
        method: norm(form.getAttribute("method") || "get", 12).toUpperCase(),
        fieldTypes: [...form.querySelectorAll("input,select,textarea")]
          .slice(0, 40).map((el) => ({
            kind: el.tagName.toLowerCase(),
            type: norm(el.getAttribute("type") || "text", 24),
            required: el.hasAttribute("required"),
          })),
      }));
      const imgs = [...document.querySelectorAll("img")];
      const buttons = [...document.querySelectorAll("button")];
      return {
        title: norm(document.title, 180),
        description: meta('meta[name="description"]'),
        robots: meta('meta[name="robots"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        headings,
        actions,
        forms,
        counts: {
          images: imgs.length,
          imagesWithoutAlt: imgs.filter((el) => !el.hasAttribute("alt")).length,
          buttonsWithoutLabel: buttons.filter((el) => !norm(el.getAttribute("aria-label") || el.textContent)).length,
          links: document.querySelectorAll("a[href]").length,
        },
      };
    });
    return {
      schema: "0web.reference_observation.v1",
      status: "OBSERVED_LIMITED",
      requestedUrl: url,
      finalUrl,
      observedAt: new Date().toISOString(),
      httpStatus: response?.status() ?? null,
      ...observation,
      limitations: [
        "Captura da estrutura renderizada em navegador descartável, sem autenticação.",
        "Nenhum clique, envio de formulário, armazenamento pessoal ou captura de tráfego.",
        "Solicitações não GET/HEAD e origens externas são bloqueadas; dados dinâmicos podem estar incompletos.",
        "Não comprova persistência de leads, funcionamento de agendamento ou indexação no Google.",
        "REA não foi executado; este relatório é apenas a linha de base para um futuro piloto autorizado.",
      ],
    };
  } finally {
    await browser.close();
  }
}

export async function main(args) {
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    process.stdout.write("Uso: node scripts/reference-observation.mjs https://0web.com.br/portfolio\n");
    return;
  }
  if (args.length !== 1) throw new Error("Informe uma única URL HTTPS da 0WEB, sem parâmetros.");
  const report = await observeOwnedPage(args[0]);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`Inspeção não concluída: ${error.message}\n`);
    process.exitCode = 1;
  });
}
