#!/usr/bin/env node
/**
 * audit-motion-observed — Rodada 2 do GlobalMotionContract.
 *
 * Diferencia três estados, sem aceitar PASS por configuração:
 *   MOTION_DECLARED     perfil existe em src/config/portfolio-motion-profiles.json
 *   MOTION_IMPLEMENTED  o DOM renderizado expõe primitives (data-motion)
 *   MOTION_OBSERVED     o navegador mede transição real e delta perceptível
 *
 * Perceptibilidade (não basta existir no DOM/CSS):
 *   opacity delta >= 0.3  ·  translate >= 6px  ·  escala >= 0.01
 *
 * Uso: node scripts/audit-motion-observed.mjs [url...] [--json]
 * Report-only por padrão; --enforce sai com código 1 em falha.
 */
import { readFileSync } from "node:fs";

const BASE = process.env.MOTION_AUDIT_BASE ?? "http://localhost:8080";
const args = process.argv.slice(2);
const enforce = args.includes("--enforce");
const asJson = args.includes("--json");
const targets = args.filter((a) => !a.startsWith("--"));

const contract = JSON.parse(readFileSync("src/config/global-motion-contract.json", "utf8"));
const T = contract.observability.perceptionThresholds;

let profiles = { overrides: {}, defaultsBySegment: {} };
try {
  profiles = JSON.parse(readFileSync("src/config/portfolio-motion-profiles.json", "utf8"));
} catch {
  /* perfis ausentes só afetam MOTION_DECLARED */
}

const urls = targets.length
  ? targets.map((t) => (t.startsWith("http") ? t : `${BASE}${t}`))
  : [`${BASE}/lab/motion-pilot`];

function declaredFor(url) {
  const slug = url.split("/portfolio/")[1]?.split(/[?#]/)[0];
  if (!slug) return { slug: null, declared: true, reason: "rota não é /portfolio/:slug" };
  const has = Boolean(profiles.overrides?.[slug]);
  return { slug, declared: has, reason: has ? "override próprio" : "sem override próprio" };
}

const { chromium } = await import("playwright");
const executablePath = process.env.MOTION_AUDIT_CHROMIUM ?? "/opt/ms-playwright/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath });
const results = [];

for (const url of urls) {
  const declared = declaredFor(url);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // Páginas com hidratação tardia (catálogo, seções lazy) só expõem os nós
  // data-motion depois do primeiro paint: medir cedo demais dava falso FAIL.
  await page.waitForTimeout(2800);

  const measured = await page.evaluate(
    async ({ T }) => {
      const nodes = Array.from(document.querySelectorAll("[data-motion]"));
      const before = nodes.map((n) => {
        const cs = getComputedStyle(n);
        return {
          opacity: parseFloat(cs.opacity),
          transform: cs.transform,
          top: n.getBoundingClientRect().top + window.scrollY,
        };
      });
      const viewport = window.innerHeight;
      // Microinteração: hover declarado precisa existir como classe de
      // transform/cor no DOM renderizado, não apenas no Blueprint.
      const microObserved = Boolean(
        document.querySelector(
          "[class*='hover:-translate-y-'],[class*='group-hover:scale-'],[class*='hover:scale-']",
        ),
      );


      window.scrollTo(0, document.body.scrollHeight * 0.45);
      await new Promise((r) => setTimeout(r, 900));
      window.scrollTo(0, document.body.scrollHeight * 0.9);
      await new Promise((r) => setTimeout(r, 900));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 900));

      const parse = (t) => {
        if (!t || t === "none") return { x: 0, y: 0, scale: 1 };
        const m = t.match(/matrix(3d)?\(([^)]+)\)/);
        if (!m) return { x: 0, y: 0, scale: 1 };
        const v = m[2].split(",").map(Number);
        return m[1]
          ? { x: v[12], y: v[13], scale: v[0] }
          : { x: v[4], y: v[5], scale: v[0] };
      };

      let perceptible = 0;
      let heroObserved = false;
      let scrollObserved = false;
      const samples = [];
      nodes.forEach((n, i) => {
        const cs = getComputedStyle(n);
        const a = before[i];
        const b = { opacity: parseFloat(cs.opacity), transform: cs.transform };
        const pa = parse(a.transform);
        const pb = parse(b.transform);
        const dOpacity = Math.abs(b.opacity - a.opacity);
        const dTranslate = Math.max(Math.abs(pb.x - pa.x), Math.abs(pb.y - pa.y));
        const dScale = Math.abs(pb.scale - pa.scale);
        const ok =
          dOpacity >= T.minOpacityDelta ||
          dTranslate >= T.minTranslatePx ||
          dScale >= T.minScaleDelta;
        if (ok) perceptible += 1;
        const inHero = a.top < viewport;
        if (inHero && (ok || n.getAttribute("data-motion-state") === "played")) heroObserved = true;
        if (!inHero && ok) scrollObserved = true;
        samples.push({
          primitive: n.getAttribute("data-motion"),
          state: n.getAttribute("data-motion-state"),
          dOpacity: Number(dOpacity.toFixed(3)),
          dTranslate: Number(dTranslate.toFixed(2)),
          dScale: Number(dScale.toFixed(3)),
          perceptible: ok,
        });
      });

      return {
        total: nodes.length,
        perceptible,
        heroObserved,
        scrollObserved,
        microObserved,
        samples: samples.slice(0, 40),
      };
    },
    { T },
  );

  // Reduced motion: conteúdo continua visível e sem deslocamento.
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto(url, { waitUntil: "domcontentloaded" });
  await rmPage.waitForTimeout(1200);
  const reducedOk = await rmPage.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll("[data-motion]"));
    return nodes.every((n) => {
      const cs = getComputedStyle(n);
      const hidden = parseFloat(cs.opacity) < 0.99 && n.getAttribute("data-motion") !== "floatingConversion";
      const moved = cs.transform && cs.transform !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(cs.transform);
      return !hidden && !moved;
    });
  });
  await rmContext.close();
  await context.close();

  const implemented = measured.total > 0;
  /**
   * MOTION_OBSERVED exige três eixos medidos em runtime, não configuração:
   * hero, ao menos uma seção revelada no scroll e uma microinteração.
   */
  const observed =
    implemented &&
    measured.perceptible > 0 &&
    measured.heroObserved &&
    measured.scrollObserved &&
    measured.microObserved;
  results.push({
    url,
    slug: declared.slug,
    MOTION_DECLARED: declared.declared,
    MOTION_IMPLEMENTED: implemented,
    MOTION_OBSERVED: observed,
    heroObserved: measured.heroObserved,
    scrollObserved: measured.scrollObserved,
    microObserved: measured.microObserved,
    reducedMotionSafe: reducedOk,
    nodes: measured.total,
    perceptible: measured.perceptible,
    consoleErrors: consoleErrors.length,
    samples: measured.samples,
  });
}

await browser.close();

if (asJson) {
  console.log(JSON.stringify({ contractVersion: contract.version, results }, null, 2));
} else {
  for (const r of results) {
    console.log(`\n${r.url}`);
    console.log(`  MOTION_DECLARED    ${r.MOTION_DECLARED ? "PASS" : "WARN"} (${r.slug ?? "não-portfolio"})`);
    console.log(`  MOTION_IMPLEMENTED ${r.MOTION_IMPLEMENTED ? "PASS" : "FAIL"} (${r.nodes} nós data-motion)`);
    console.log(
      `  MOTION_OBSERVED    ${r.MOTION_OBSERVED ? "PASS" : "FAIL"} (${r.perceptible} perceptíveis · hero ${r.heroObserved ? "ok" : "não"} · scroll ${r.scrollObserved ? "ok" : "não"} · micro ${r.microObserved ? "ok" : "não"})`,
    );
    console.log(`  REDUCED_MOTION     ${r.reducedMotionSafe ? "PASS" : "FAIL"}`);
    console.log(`  console errors     ${r.consoleErrors}`);
  }
}

const failed = results.filter((r) => !r.MOTION_IMPLEMENTED || !r.MOTION_OBSERVED || !r.reducedMotionSafe);
if (failed.length && enforce) {
  console.error(`\nMOTION_OBSERVED gate falhou em ${failed.length} página(s).`);
  process.exit(1);
}
