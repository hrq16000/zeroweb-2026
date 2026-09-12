/** Rollout QA em produção: amostras VERIFIED/UNRESOLVED + viewports. */
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const base = "https://0web.com.br";
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

const dialogButtons = (page) =>
  page.locator("div[role='dialog'] button:visible, [aria-modal='true'] button:visible");

async function openFunnel(page, slug) {
  await page.goto(`${base}/portfolio/${slug}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const names = /or(ç|c)amento|encomenda|festa|agendar|atendimento|pedido|solicitar|frete|or(ç|c)ar/i;
  const cta = page.getByRole("button", { name: names });
  const total = await cta.count();
  for (let i = 0; i < Math.max(total, 1); i++) {
    await cta.nth(i).click({ force: true, timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    if (await dialogButtons(page).count()) return true;
  }
  return (await dialogButtons(page).count()) > 0;
}

async function runQuiz(page) {
  for (let i = 0; i < 10; i++) {
    const ready = page.locator("button:visible").filter({ hasText: /mensagem pronta/i });
    if (await ready.count()) {
      const ta = page.locator("textarea:visible").first();
      if (await ta.count()) await ta.fill("QA de rollout — garantia de recuperabilidade.");
      await ready.first().click({ force: true });
      await page.waitForTimeout(1200);
      return true;
    }
    const b = dialogButtons(page);
    const n = await b.count();
    if (!n) { await page.waitForTimeout(600); continue; }
    await b.nth(n > 1 ? 1 : 0).click({ force: true }).catch(() => {});
    await page.waitForTimeout(700);
  }
  return false;
}

const out = [];
async function probe(slug, viewport = { width: 1280, height: 1800 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const opened = await openFunnel(page, slug);
  const finished = opened ? await runQuiz(page) : false;
  const rec = page.locator("#portfolio-quiz-recovery");
  const hasRec = (await rec.count()) > 0;
  let label = null, overflow = null, focusable = null;
  if (hasRec) {
    label = await page.evaluate(() => {
      const el = document.getElementById("portfolio-quiz-recovery");
      if (!el) return null;
      const l = document.querySelector('label[for="portfolio-quiz-recovery"]');
      return (l?.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 160);
    });
    overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await rec.focus().catch(() => {});
    focusable = await page.evaluate(() => document.activeElement?.id === "portfolio-quiz-recovery");
  } else {
    overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  }
  out.push({ slug, viewport: viewport.width, opened, finished, hasRec, label, overflow, errors: errors.length });
  await ctx.close();
}

for (const s of ["carecas-infotec", "moreira-auto-mecanica", "jkl-decor", "paraiso-do-hot-dog"]) await probe(s);
for (const s of ["confeitaria-chyrley", "rm-fretes", "rj-servicos-drywall"]) await probe(s);
for (const w of [390, 768, 1440]) await probe("confeitaria-chyrley", { width: w, height: 900 });

await browser.close();
console.log(JSON.stringify(out, null, 1));
