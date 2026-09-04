#!/usr/bin/env node
/**
 * Auditoria VISUAL de runtime dos projetos /portfolio/:slug.
 *
 * Renderiza TODAS as páginas reais em viewports mobile e desktop e coleta
 * sinais objetivos (overflow, imagens quebradas, tap targets, contraste do
 * hero, densidade editorial). Não emite julgamento: apenas evidência.
 *
 * Saída: reports/portfolio-visual-runtime.json
 *
 * Uso:
 *   node scripts/audit-portfolio-visual-runtime.mjs [--base=http://localhost:8080]
 *                                                   [--slug=a,b] [--limit=N]
 *                                                   [--shots] [--start=N]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (name, fallback) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;

const base = arg("base", "http://localhost:8080").replace(/\/$/, "");
const onlySlugs = (arg("slug", "") || "").split(",").filter(Boolean);
const limit = Number(arg("limit", "0")) || 0;
const start = Number(arg("start", "0")) || 0;
const withShots = args.includes("--shots");
const outFile = path.join(root, "reports/portfolio-visual-runtime.json");

const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "src/config/portfolio-catalog.json"), "utf8"),
);

let slugs = catalog.map((c) => c.slug);
if (onlySlugs.length) slugs = slugs.filter((s) => onlySlugs.includes(s));
if (start) slugs = slugs.slice(start);
if (limit) slugs = slugs.slice(0, limit);

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];

/** Coleta executada dentro da página. */
const COLLECT = `(() => {
  const doc = document;
  const body = doc.body;
  const vw = window.innerWidth;
  const overflowX = Math.max(0, doc.documentElement.scrollWidth - vw);

  const offenders = [];
  if (overflowX > 2) {
    for (const el of Array.from(doc.querySelectorAll("body *")).slice(0, 4000)) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > vw + 2) {
        offenders.push((el.tagName + "." + (el.className && typeof el.className === "string" ? el.className.split(" ").slice(0,2).join(".") : "")).slice(0, 80));
        if (offenders.length >= 5) break;
      }
    }
  }

  const imgs = Array.from(doc.querySelectorAll("img"));
  const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src).slice(0, 10);
  const missingAlt = imgs.filter((i) => !i.hasAttribute("alt")).length;
  const imgSrcs = Array.from(new Set(imgs.map((i) => (i.currentSrc || i.src || "").replace(location.origin, "")))).slice(0, 60);

  const h1s = Array.from(doc.querySelectorAll("h1")).map((h) => (h.textContent || "").trim()).filter(Boolean);
  const h2s = Array.from(doc.querySelectorAll("h2")).map((h) => (h.textContent || "").trim()).filter(Boolean);
  const sections = doc.querySelectorAll("section").length;

  // tap targets pequenos (mobile)
  let smallTargets = 0;
  for (const el of Array.from(doc.querySelectorAll("a,button,[role=button]"))) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.height < 40 || r.width < 40) smallTargets++;
  }

  // hero: bloco do primeiro h1 (ou primeira seção alta), ignorando navegação
  let hero = null;
  const firstH1 = doc.querySelector("h1");
  if (firstH1) hero = firstH1.closest("section, header, div[class*=hero], main > div") || firstH1.parentElement;
  if (!hero) {
    hero = Array.from(doc.querySelectorAll("section, header, main > div")).find(
      (el) => el.getBoundingClientRect().height > 280,
    ) || doc.querySelector("section, header, main > div");
  }
  let heroInfo = null;
  if (hero) {
    const r = hero.getBoundingClientRect();
    const cs = getComputedStyle(hero);
    const heroHeading = hero.querySelector("h1, h2");
    const heroText = (heroHeading?.textContent || "").trim();
    const heroCta = hero.querySelectorAll("a,button").length;
    const heroImgs = hero.querySelectorAll("img").length;
    heroInfo = {
      height: Math.round(r.height),
      backgroundImage: cs.backgroundImage !== "none",
      heading: heroText.slice(0, 160),
      headingSize: heroHeading ? Math.round(parseFloat(getComputedStyle(heroHeading).fontSize)) : 0,
      ctaCount: heroCta,
      imageCount: heroImgs,
    };
  }

  // texto editorial visível
  const text = (body.innerText || "").replace(/\\s+/g, " ").trim();

  // cores dominantes declaradas
  const palette = {};
  for (const el of Array.from(doc.querySelectorAll("body *")).slice(0, 1500)) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") palette[bg] = (palette[bg] || 0) + 1;
  }
  const topColors = Object.entries(palette).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, n]) => ({ color: c, n }));

  return {
    overflowX, offenders, brokenImages: broken, missingAlt,
    imageCount: imgs.length, imageSrcs: imgSrcs,
    h1Count: h1s.length, h1: h1s[0] || "", h2Count: h2s.length,
    sections, smallTargets, hero: heroInfo,
    textLength: text.length,
    text: text.slice(0, 6000),
    docHeight: Math.round(doc.documentElement.scrollHeight),
    topColors,
  };
})()`;

const results = {};
const bundled = chromium.executablePath();
const installedRoot = "/opt/ms-playwright";
const installed = fs.existsSync(installedRoot)
  ? fs
      .readdirSync(installedRoot)
      .filter((n) => n.startsWith("chromium-") && !n.includes("headless"))
      .map((n) => path.join(installedRoot, n, "chrome-linux", "chrome"))
      .find((p) => fs.existsSync(p))
  : undefined;

const browser = await chromium.launch({
  headless: true,
  executablePath: fs.existsSync(bundled) ? bundled : installed,
});

if (withShots) fs.mkdirSync(path.join(root, "reports/portfolio-shots"), { recursive: true });

let index = 0;
for (const slug of slugs) {
  index += 1;
  const entry = { slug, viewports: {}, consoleErrors: [], status: null };
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") entry.consoleErrors.push(m.text().slice(0, 200));
    });
    try {
      const res = await page.goto(`${base}/portfolio/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      entry.status = res?.status() ?? null;
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      entry.viewports[vp.name] = await page.evaluate(COLLECT);
      if (withShots) {
        await page.screenshot({
          path: path.join(root, `reports/portfolio-shots/${slug}-${vp.name}.png`),
        });
      }
    } catch (err) {
      entry.viewports[vp.name] = { error: String(err).slice(0, 300) };
    } finally {
      await context.close();
    }
  }
  results[slug] = entry;
  const m = entry.viewports.mobile || {};
  console.log(
    `[${index}/${slugs.length}] ${slug} → status ${entry.status} · overflow ${m.overflowX ?? "?"} · imgs ${m.imageCount ?? "?"} · broken ${(m.brokenImages || []).length}`,
  );
}

await browser.close();

let previous = {};
if (fs.existsSync(outFile) && (onlySlugs.length || limit || start)) {
  try {
    previous = JSON.parse(fs.readFileSync(outFile, "utf8")).projects ?? {};
  } catch {
    previous = {};
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
  outFile,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      base,
      viewports: VIEWPORTS,
      projects: { ...previous, ...results },
    },
    null,
    2,
  )}\n`,
);
console.log(`\n[visual-runtime] ${Object.keys(results).length} projeto(s) → ${path.relative(root, outFile)}`);
