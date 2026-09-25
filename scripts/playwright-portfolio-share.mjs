#!/usr/bin/env node
/**
 * E2E do botão "Copiar divulgação" em todos os portfólios canônicos.
 *
 * Garante no navegador:
 * - um único botão global de divulgação por portfolio;
 * - clique real no botão;
 * - chamada ao Clipboard API;
 * - texto copiado idêntico à copy canônica versionada no Git;
 * - nenhuma barra-n literal, markdown de link ou URL fora do slug;
 * - feedback visual "Divulgação copiada".
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const shareCopy = JSON.parse(readFileSync("src/config/portfolio-share-copy.json", "utf8"));
const only = (process.env.SHARE_ONLY_SLUGS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const targets = clients.filter((client) => only.length === 0 || only.includes(client.slug));
const concurrency = Math.max(1, Number(process.env.SHARE_E2E_CONCURRENCY || 4));

const bundled = chromium.executablePath();
const root = "/opt/ms-playwright";
const installed = existsSync(root)
  ? readdirSync(root)
      .filter((name) => name.startsWith("chromium-") && !name.includes("headless"))
      .map((name) => join(root, name, "chrome-linux", "chrome"))
      .find((path) => existsSync(path))
  : undefined;

function normalize(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function validateStructure(slug, value) {
  const message = normalize(value);
  const canonicalUrl = `https://0web.com.br/portfolio/${slug}`;
  const urls = message.match(/https?:\/\/[^\s]+/g) ?? [];
  const hashtags = message.match(/#[A-Za-z0-9_]+/g) ?? [];
  const issues = [];
  if (message.includes("\\n")) issues.push("contém \\\\n literal");
  if (!message.includes("\n\n")) issues.push("sem separação de parágrafos");
  if (urls.length !== 1 || urls[0] !== canonicalUrl) issues.push("URL canônica incorreta ou duplicada");
  if (!message.split("\n").some((line) => line.trim() === canonicalUrl)) issues.push("URL fora de linha própria");
  if (hashtags.at(-1) !== "#0WEB") issues.push("última hashtag não é #0WEB");
  if (/\[[^\]]+\]\(https?:\/\//.test(message)) issues.push("link markdown detectado");
  return issues;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: existsSync(bundled) ? bundled : installed,
});
const failures = [];
const passed = [];

async function runTarget(client) {
  const slug = client.slug;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.addInitScript(() => {
      window.__portfolioCopiedText = null;
      const clipboard = {
        writeText: async (text) => {
          window.__portfolioCopiedText = String(text);
        },
      };
      try {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: clipboard,
        });
      } catch {
        try {
          Object.defineProperty(Navigator.prototype, "clipboard", {
            configurable: true,
            get: () => clipboard,
          });
        } catch {}
      }
    });

    const response = await page.goto(
      `${baseUrl}/portfolio/${slug}?0web_preview=1`,
      { waitUntil: "domcontentloaded", timeout: 30_000 },
    );
    if (!response || response.status() >= 400) {
      throw new Error(`HTTP ${response?.status() ?? "sem resposta"}`);
    }

    const button = page.locator('button[aria-label^="Copiar divulgação de "]');
    const count = await button.count();
    if (count !== 1) throw new Error(`esperado 1 botão; encontrado ${count}`);
    await button.first().waitFor({ state: "visible", timeout: 10_000 });
    await button.first().click({ timeout: 10_000 });

    await page.waitForFunction(
      () => typeof window.__portfolioCopiedText === "string" && window.__portfolioCopiedText.length > 0,
      undefined,
      { timeout: 5_000 },
    );
    const copied = await page.evaluate(() => window.__portfolioCopiedText);
    const expected = normalize(shareCopy[slug]);
    if (!expected) throw new Error("copy canônica ausente");
    if (normalize(copied) !== expected) throw new Error("clipboard diverge da copy canônica");

    const structural = validateStructure(slug, copied);
    if (structural.length) throw new Error(structural.join("; "));

    await page
      .getByRole("button", { name: /Copiar divulgação de/i })
      .filter({ hasText: "Divulgação copiada" })
      .waitFor({ state: "visible", timeout: 3_000 });

    passed.push(slug);
    console.log(`[share] ${slug} OK`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push({ slug, message: message.split("\n")[0].slice(0, 240) });
    console.error(`[share] ${slug} FALHOU — ${message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}

let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(concurrency, targets.length) }, async () => {
    while (cursor < targets.length) {
      const index = cursor++;
      await runTarget(targets[index]);
    }
  }),
);

await browser.close();

mkdirSync("seo-reports", { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  total: targets.length,
  passed: passed.length,
  failed: failures.length,
  passedSlugs: passed,
  failures,
};
writeFileSync("seo-reports/portfolio-share-e2e.json", JSON.stringify(report, null, 2));

if (failures.length) {
  console.error(`\n[share] FAIL — ${failures.length}/${targets.length} portfolio(s)`);
  process.exit(1);
}
console.log(`\n[share] OK — ${passed.length}/${targets.length} botões copiar divulgação validados no navegador`);
