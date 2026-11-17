#!/usr/bin/env node
/**
 * E2E do botão "Copiar divulgação" em todos os portfólios canônicos.
 *
 * Garante no navegador:
 *  - exatamente um botão global de divulgação por portfolio;
 *  - clique executa o caminho real de clipboard;
 *  - texto copiado é exatamente a copy canônica normalizada do Git;
 *  - não há \\n literal, markdown-link ou URL contaminada;
 *  - confirmação visual "Divulgação copiada" aparece após o clique.
 */
import { chromium } from "playwright";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const catalog = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/config/portfolio-catalog.json"), "utf8"),
);
const shareCopy = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/config/portfolio-share-copy.json"), "utf8"),
);

const only = (process.env.SHARE_COPY_SLUGS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const slugs = catalog
  .map((item) => item.slug)
  .filter((slug) => only.length === 0 || only.includes(slug));

function normalize(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\\\\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const bundled = chromium.executablePath();
const root = "/opt/ms-playwright";
const installed = existsSync(root)
  ? readdirSync(root)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .map((name) => join(root, name, "chrome-linux", "chrome"))
      .find((path) => existsSync(path))
  : undefined;

const browser = await chromium.launch({
  headless: true,
  executablePath: existsSync(bundled) ? bundled : installed,
});

const failures = [];
const concurrency = Math.max(1, Number(process.env.SHARE_COPY_CONCURRENCY || 6));

async function checkSlug(slug) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    Object.defineProperty(window, "__portfolioCopiedText", {
      value: "",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__portfolioCopiedText = String(text);
        },
      },
    });
  });

  try {
    const response = await page.goto(`${baseUrl}/portfolio/${slug}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (!response || !response.ok()) {
      throw new Error(`HTTP ${response?.status() ?? "sem resposta"}`);
    }

    const button = page.locator('button[aria-label^="Copiar divulgação de"]');
    const count = await button.count();
    if (count !== 1) {
      throw new Error(`esperado 1 botão Copiar divulgação, encontrado ${count}`);
    }

    await button.click({ timeout: 10000 });
    await page
      .getByText("Divulgação copiada", { exact: true })
      .waitFor({ state: "visible", timeout: 3000 });

    const copied = await page.evaluate(() => window.__portfolioCopiedText);
    const expected = normalize(shareCopy[slug]);

    if (!expected) throw new Error("copy canônica ausente");
    if (copied !== expected) {
      throw new Error(
        `clipboard divergiu da fonte canônica (copiado=${JSON.stringify(copied)}, esperado=${JSON.stringify(expected)})`,
      );
    }
    if (copied.includes("\\n")) throw new Error("clipboard contém \\n literal");
    if (/\[[^\]]+\]\(https?:\/\//.test(copied)) throw new Error("clipboard contém link markdown");

    const canonicalUrl = `https://0web.com.br/portfolio/${slug}`;
    const urls = copied.match(/https?:\/\/[^\s]+/g) ?? [];
    if (urls.length !== 1 || urls[0] !== canonicalUrl) {
      throw new Error(`URL copiada inválida: ${urls.join(", ") || "nenhuma"}`);
    }

    console.log(`[share-copy] /portfolio/${slug} OK`);
  } catch (error) {
    failures.push(
      `/portfolio/${slug}: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.error(`[share-copy] /portfolio/${slug} FALHOU`);
  } finally {
    await context.close();
  }
}

const queue = [...slugs];
const workers = Array.from(
  { length: Math.min(concurrency, Math.max(1, queue.length)) },
  async () => {
    for (let slug = queue.shift(); slug; slug = queue.shift()) {
      await checkSlug(slug);
    }
  },
);
await Promise.all(workers);
await browser.close();

if (failures.length) {
  console.error(`\n[share-copy] FAIL — ${failures.length} problema(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\n[share-copy] OK — ${slugs.length} portfolio(s) com clipboard canônico`);
