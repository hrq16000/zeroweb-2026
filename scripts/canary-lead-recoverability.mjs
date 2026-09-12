/**
 * CANÁRIO — garantia de entrega no funil de portfólio.
 *
 * A) projeto com atendimento verificado: conclui e vai para o redirect
 *    tokenizado, sem pedir contato extra;
 * B) projeto sem atendimento: conclui, pede WhatsApp de retorno e salva o
 *    lead como recuperável.
 *
 * Não publica nada e não altera páginas.
 */
import { chromium } from "playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const VERIFIED = process.env.CANARY_VERIFIED || "carecas-infotec";
const UNRESOLVED = process.env.CANARY_UNRESOLVED || "confeitaria-chyrley";
const RECOVERY_PHONE = "41900000002";

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
const fail = (m) => { failures.push(m); console.error(`✗ ${m}`); };
const ok = (m) => console.log(`✓ ${m}`);

async function openFunnel(page, slug) {
  await page.goto(`${baseUrl}/portfolio/${slug}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const cta = page.getByRole("button", { name: /or(ç|c)amento|encomenda|festa|agendar|atendimento|pedido/i }).first();
  await cta.click({ timeout: 15000, force: true });
  await page.waitForTimeout(1000);
}

const dialogButtons = (page) =>
  page.locator("div[role='dialog'] button:visible, [aria-modal='true'] button:visible");

async function runQuiz(page) {
  for (let i = 0; i < 4; i++) {
    const buttons = dialogButtons(page);
    const n = await buttons.count();
    if (!n) break;
    await buttons.nth(n > 1 ? 1 : 0).click({ force: true }).catch(() => {});
    await page.waitForTimeout(700);
  }
  if (process.env.CANARY_DEBUG) {
    console.log("  [debug] botões:", (await dialogButtons(page).allInnerTexts()).join(" | "));
  }
  const textarea = page.locator("textarea:visible").first();
  if (await textarea.count()) await textarea.fill("Teste automatizado de garantia de entrega.");
  const next = page.locator("button:visible").filter({ hasText: /mensagem pronta/i }).first();
  if (await next.count()) await next.click({ force: true });
  await page.waitForTimeout(900);
}

async function canary(slug, expectRecovery) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const requests = [];
  page.on("request", (r) => requests.push(`${r.url()} ${r.postData() ?? ""}`));
  let redirected = null;
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame() && f.url().includes("/r/whatsapp/")) redirected = f.url();
  });

  try {
    await openFunnel(page, slug);
    await runQuiz(page);
    const recovery = page.locator("#portfolio-quiz-recovery");
    const hasRecovery = (await recovery.count()) > 0;
    if (expectRecovery) {
      if (!hasRecovery) {
        // O campo pode aparecer só depois da recusa do servidor.
        const complete = page.locator("button:visible").filter({ hasText: /continuar/i }).first();
        await complete.click({ force: true }).catch(() => {});
        await page.waitForTimeout(2500);
      }
      if (!(await page.locator("#portfolio-quiz-recovery").count())) {
        fail(`${slug}: projeto sem atendimento não pediu WhatsApp de retorno`);
      } else {
        ok(`${slug}: pediu WhatsApp de retorno`);
        await page.locator("#portfolio-quiz-recovery").fill(RECOVERY_PHONE);
        await page.locator("button:visible").filter({ hasText: /continuar/i }).first().click({ force: true });
        await page.waitForTimeout(3000);
        const done = await page.locator("text=Solicitação registrada").count();
        if (done) ok(`${slug}: pedido salvo e recuperável`);
        else fail(`${slug}: não confirmou registro recuperável`);
      }
    } else {
      if (hasRecovery) fail(`${slug}: pediu contato extra mesmo com atendimento verificado`);
      else ok(`${slug}: funil enxuto, sem contato extra`);
      await page.locator("button:visible").filter({ hasText: /continuar/i }).first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(3000);
      if (redirected || page.url().includes("/r/whatsapp/")) ok(`${slug}: entrega pelo redirect tokenizado`);
      else fail(`${slug}: não gerou redirect de entrega`);
    }
    const leaked = requests.filter((r) => r.includes(RECOVERY_PHONE) && !r.includes("_serverFn"));
    if (leaked.length) fail(`${slug}: número apareceu fora da chamada de servidor`);
    else ok(`${slug}: número não vazou para telemetria`);
    if (errors.length) fail(`${slug}: erros de console (${errors.length})`);
    else ok(`${slug}: console limpo`);
  } finally {
    await context.close();
  }
}

await canary(VERIFIED, false);
await canary(UNRESOLVED, true);
await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} falha(s) no canário.`);
  process.exit(1);
}
console.log("\n✓ canário de recuperabilidade OK");
