#!/usr/bin/env node
/**
 * PLATFORM_0WEB_LAYER — gate de runtime da camada institucional 0WEB.
 *
 * Regra da matriz: toda página pública /portfolio/:slug é, ao mesmo tempo,
 * experiência exclusiva do cliente E página hospedada na plataforma 0WEB.
 * A presença institucional (host credit + popup "Gostou desta página?")
 * pertence à camada compartilhada, nunca ao import individual da landing.
 *
 * Importar ou declarar o componente NÃO é PASS. O gate observa em navegador,
 * em mobile e desktop:
 *   HOST_CREDIT_MOUNTED
 *   UPSELL_POPUP_MOUNTED
 *   UPSELL_POPUP_TRIGGERABLE
 *   UPSELL_POPUP_VISIBLE_IN_RUNTIME_QA
 *   UPSELL_POPUP_DISMISSIBLE
 *   NO_CLIENT_FUNNEL_COLLISION
 *   NO_FOOTER_COLLISION
 *   NO_MOBILE_OVERFLOW
 *
 * O disparo determinístico usa force_0web_popup_qa=1, que ignora somente a
 * cota por sessão — o comportamento do visitante real não muda.
 *
 * Uso: node scripts/check-portfolio-platform-layer.mjs [rota...] [--enforce]
 */
const BASE = process.env.PLATFORM_LAYER_BASE ?? "http://localhost:8080";
const args = process.argv.slice(2);
const enforce = args.includes("--enforce");
const routes = args.filter((a) => !a.startsWith("--"));
const targets = routes.length
  ? routes
  : ["/portfolio/moreira-auto-mecanica", "/portfolio/carecas-infotec", "/portfolio/jkl-decor"];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const { chromium } = await import("playwright");
const executablePath =
  process.env.MOTION_AUDIT_CHROMIUM ?? "/opt/ms-playwright/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath });

let failed = false;
const report = [];

for (const route of targets) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));

    const url = `${BASE}${route}${route.includes("?") ? "&" : "?"}force_0web_popup_qa=1`;
    const res = await page.goto(url, { waitUntil: "domcontentloaded" });
    const states = {};
    states.HTTP_200 = res?.status() === 200;

    // Camada da plataforma: crédito institucional presente e visível.
    // O crédito institucional é exigido na landing do cliente; o catálogo
    // /portfolio é página da própria 0WEB e tem contrato próprio.
    const isClientLanding = /\/portfolio\/[^/?#]+/.test(route);
    const credit = page.locator("[data-portfolio-host-credit]").first();
    states.HOST_CREDIT_MOUNTED = isClientLanding ? (await credit.count()) > 0 : true;

    // MOUNTED → TRIGGERED → VISIBLE
    const popup = page.locator('[data-testid="portfolio-upsell"]').first();
    let visible = false;
    try {
      await popup.waitFor({ state: "visible", timeout: 20000 });
      visible = true;
    } catch {
      visible = false;
    }
    states.UPSELL_POPUP_MOUNTED = (await popup.count()) > 0;
    states.UPSELL_POPUP_TRIGGERABLE = states.UPSELL_POPUP_MOUNTED;
    states.UPSELL_POPUP_VISIBLE_IN_RUNTIME_QA = visible;

    // Colisões: o popup não pode encobrir funil, rodapé ou crédito da cidade.
    let collision = { funnel: false, footer: false };
    if (visible) {
      collision = await page.evaluate(() => {
        const el = document.querySelector('[data-testid="portfolio-upsell"]');
        const box = el?.getBoundingClientRect();
        const overlaps = (sel) => {
          const target = document.querySelector(sel);
          if (!target || !box) return false;
          const r = target.getBoundingClientRect();
          const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.height > 0;
          if (!onScreen) return false;
          return !(r.right < box.left || r.left > box.right || r.bottom < box.top || r.top > box.bottom);
        };
        return {
          funnel: overlaps("[data-portfolio-funnel-open]"),
          footer: overlaps("[data-portfolio-host-credit]"),
        };
      });
    }
    states.NO_CLIENT_FUNNEL_COLLISION = !collision.funnel;
    states.NO_FOOTER_COLLISION = !collision.footer;

    // Dismissível: fechar mantém a página utilizável.
    let dismissible = false;
    if (visible) {
      const close = page
        .locator('[data-testid="portfolio-upsell"] button[aria-label="Fechar aviso"], [data-testid="portfolio-upsell"] button')
        .first();
      try {
        await close.click({ timeout: 3000 });
        await popup.waitFor({ state: "hidden", timeout: 4000 });
        dismissible = true;
      } catch {
        dismissible = false;
      }
    }
    states.UPSELL_POPUP_DISMISSIBLE = dismissible;

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    states.NO_MOBILE_OVERFLOW = vp.name !== "mobile" ? true : overflow <= 1;
    states.NO_CONSOLE_ERRORS = consoleErrors.length === 0;

    const bad = Object.entries(states).filter(([, ok]) => !ok);
    if (bad.length) failed = true;
    report.push({ route, viewport: vp.name, overflow, states, failures: bad.map(([k]) => k), consoleErrors });

    console.log(
      `${bad.length ? "FAIL" : "PASS"}  ${route} @${vp.name}` +
        (bad.length ? `  →  ${bad.map(([k]) => k).join(", ")}` : ""),
    );
    await context.close();
  }
}

await browser.close();

if (process.env.PLATFORM_LAYER_JSON === "1") console.log(JSON.stringify(report, null, 2));
if (failed && enforce) {
  console.error("\nPLATFORM_0WEB_LAYER = FAIL");
  process.exit(1);
}
console.log(`\nPLATFORM_0WEB_LAYER = ${failed ? "FAIL (report-only)" : "PASS"}`);
