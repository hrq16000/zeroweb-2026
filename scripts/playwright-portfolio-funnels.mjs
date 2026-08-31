/**
 * E2E dos funis individuais de /portfolio/*.
 *
 * Cobre TODO o catálogo de clientes (src/config/portfolio-clients.json) em
 * desktop e mobile. Para cada site:
 *  - a página responde sem 5xx;
 *  - existe CTA de funil do próprio cliente ([data-funnel-cta="portfolio"]);
 *  - o clique (sem force) abre o modal do funil, sem "funil indisponível";
 *  - as 5 etapas avançam e chegam à mensagem pronta;
 *  - o envio usa o clientKey do próprio cliente (isolamento);
 *  - o desfecho é um redirect tokenizado que resolve para WhatsApp
 *    (3xx com destino válido), nunca 5xx nem "Canal indisponível".
 *
 * Nenhum número/telefone é impresso: apenas o host de destino é validado.
 *
 * Uso: node scripts/playwright-portfolio-funnels.mjs
 */
import { chromium } from "playwright";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const configuredBrowser = process.env.E2E_BROWSER_PATH;
const only = process.env.E2E_ONLY_SLUG;

const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const TARGETS = clients
  .filter((client) => !only || client.slug === only)
  .map((client) => ({
    slug: client.slug,
    clientKey: client.clientKey,
    siteName: client.siteName,
    // Sites sem número próprio ainda não têm destinatário: o redirect responde
    // 503 por contrato (nunca cai no WhatsApp da 0WEB). Isso é pendência de
    // configuração do cliente, não regressão de código.
    recipientConfigured: client.funnelRecipientConfigured === true,
  }));


const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 1400 },
  { name: "mobile", width: 393, height: 851 },
];

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
  executablePath:
    configuredBrowser && existsSync(configuredBrowser)
      ? configuredBrowser
      : existsSync(bundled)
        ? bundled
        : installed,
});

const failures = [];
const pending = [];
const ok = [];

const VALID_DESTINATION = /^https:\/\/(api\.whatsapp\.com|wa\.me|web\.whatsapp\.com)\//;

/**
 * O payload das server functions é serializado pelo TanStack Start em
 * `{ p: { k: [chaves], v: [valores] } }`. Extrai o clientKey enviado.
 */
function extractClientKey(body) {
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return undefined;
  }
  const stack = [parsed];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    const shape = node.p;
    if (shape && Array.isArray(shape.k) && Array.isArray(shape.v)) {
      const index = shape.k.indexOf("clientKey");
      const value = index >= 0 ? shape.v[index] : undefined;
      if (value && typeof value.s === "string") return value.s;
    }
    for (const value of Object.values(node)) stack.push(value);
  }
  return undefined;
}

async function runTarget(target, viewport) {
  const id = `${target.slug} [${viewport.name}]`;
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const serverErrors = [];
  const submittedKeys = [];
  let redirect = null;

  page.on("response", (response) => {
    if (response.status() >= 500) serverErrors.push(`${response.status()} em ${new URL(response.url()).pathname}`);
  });
  page.on("request", (request) => {
    if (request.method() !== "POST") return;
    if (!request.url().includes("/_serverFn/")) return;
    const body = request.postData() || "";
    if (process.env.E2E_DEBUG) console.log("DBG POST", request.url().slice(0, 90), body.slice(0, 200));
    if (!body.includes("clientKey")) return;
    const key = extractClientKey(body);
    if (key) submittedKeys.push(key);

  });

  // O destino final é resolvido no servidor; interceptamos para não sair do host.
  await page.route("**/r/whatsapp/*", async (route) => {
    const response = await page.request.get(route.request().url(), { maxRedirects: 0 });
    redirect = { status: response.status(), location: response.headers()["location"] || "" };
    await route.abort();
  });

  try {
    const response = await page.goto(`${baseUrl}/portfolio/${target.slug}`, { waitUntil: "domcontentloaded" });
    if (!response || response.status() >= 400) {
      failures.push(`${id}: página respondeu ${response ? response.status() : "sem resposta"}`);
      return;
    }
    await page.waitForLoadState("load").catch(() => {});
    await page.waitForTimeout(2500);

    // Popup de captação da hospedagem pode cobrir o CTA: fecha se estiver aberto.
    const dismissOverlays = async () => {
      const close = page.getByRole("button", { name: /^(Fechar|Agora não|Dispensar)/i });
      const count = await close.count();
      for (let i = 0; i < count; i += 1) {
        await close.nth(i).click({ timeout: 1500 }).catch(() => {});
      }
    };
    await dismissOverlays();

    const ctas = page.locator('[data-funnel-cta="portfolio"]');
    const ctaCount = await ctas.count();
    if (ctaCount === 0) {
      failures.push(`${id}: nenhum CTA de funil encontrado`);
      return;
    }

    const wrongOwner = await ctas.evaluateAll((nodes, expected) =>
      nodes.map((n) => n.getAttribute("data-funnel-client")).filter((k) => k && k !== expected), target.clientKey);
    if (wrongOwner.length) {
      failures.push(`${id}: CTA aponta para outro cliente (${[...new Set(wrongOwner)].join(", ")})`);
      return;
    }

    // Prioriza o botão flutuante padrão da hospedagem; cai para o CTA principal.
    const dialog = page.locator('[role=dialog][aria-labelledby="portfolio-cta-quiz-title"]').last();
    let opened = false;
    for (let attempt = 0; attempt < 3 && !opened; attempt += 1) {
      const trigger = ctas.nth(Math.max(ctaCount - 1 - attempt, 0));
      await trigger.scrollIntoViewIfNeeded().catch(() => {});
      await trigger.click({ timeout: 8000 }).catch(() => {});
      opened = await dialog
        .waitFor({ state: "visible", timeout: 5000 })
        .then(() => true)
        .catch(() => false);
      if (!opened) await dismissOverlays();
    }
    if (!opened) {
      failures.push(`${id}: CTA não abriu o modal do funil`);
      return;
    }


    for (let step = 0; step < 6; step += 1) {
      const text = await dialog.innerText();
      if (/indispon[ií]vel/i.test(text)) {
        failures.push(`${id}: funil indisponível na etapa ${step}`);
        return;
      }
      if (/mensagem est[áa] personalizada/i.test(text)) break;

      const note = dialog.locator("textarea");
      if (await note.count()) {
        await note.first().fill("Teste automatizado de funil.");
        await dialog.getByRole("button", { name: /Ver minha mensagem pronta/i }).click({ timeout: 8000 });
      } else {
        const options = dialog.locator("div.grid > button");
        if (!(await options.count())) {
          failures.push(`${id}: etapa ${step} sem opções clicáveis`);
          return;
        }
        await options.first().click({ timeout: 8000 });
      }
      await page.waitForTimeout(300);
    }

    const finish = dialog.getByRole("button", { name: /Continuar/i }).first();
    if (!(await finish.count())) {
      failures.push(`${id}: etapa final sem botão de conclusão`);
      return;
    }
    await finish.click({ timeout: 8000 });
    await page.waitForTimeout(4000);

    const errorText = await dialog.innerText().catch(() => "");
    if (/N[ãa]o foi poss[íi]vel abrir/i.test(errorText)) {
      failures.push(`${id}: erro ao concluir o funil`);
      return;
    }
    const appErrors = serverErrors.filter((entry) => !entry.includes("/r/whatsapp/"));
    if (appErrors.length) {
      failures.push(`${id}: ${[...new Set(appErrors)].join(", ")}`);
      return;
    }
    if (!submittedKeys.length) {
      failures.push(`${id}: envio do funil não chegou ao servidor`);
      return;
    }
    const foreign = submittedKeys.filter((key) => key !== target.clientKey);
    if (foreign.length) {
      failures.push(`${id}: envio usou clientKey de outro cliente`);
      return;
    }
    if (!redirect) {
      failures.push(`${id}: funil não gerou redirect tokenizado`);
      return;
    }
    if (redirect.status === 503 && !target.recipientConfigured) {
      pending.push(`${id}: destinatário do cliente ainda não configurado (503 por contrato)`);
      console.log(`• ${id} → funil completo; destinatário pendente de configuração`);
      return;
    }
    if (redirect.status >= 500) {
      failures.push(`${id}: redirect respondeu ${redirect.status}`);
      return;
    }
    if (!VALID_DESTINATION.test(redirect.location)) {
      failures.push(`${id}: destino do redirect inválido (status ${redirect.status})`);
      return;
    }
    ok.push(id);
    console.log(`✓ ${id} → funil completo e redirect válido`);

  } catch (error) {
    failures.push(`${id}: ${String(error).split("\n")[0].slice(0, 180)}`);
  } finally {
    await context.close();
  }
}

const queue = [];
for (const target of TARGETS) for (const viewport of VIEWPORTS) queue.push([target, viewport]);

const CONCURRENCY = Number(process.env.E2E_CONCURRENCY || 2);
let cursor = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < queue.length) {
      const index = cursor++;
      const [target, viewport] = queue[index];
      await runTarget(target, viewport);
    }
  }),
);

await browser.close();

console.log(`\nResumo: ${ok.length} OK · ${pending.length} pendentes de configuração · ${queue.length} executados.`);
if (pending.length) {
  console.log("\nPendências de configuração (não bloqueiam o gate):");
  pending.forEach((p) => console.log(`  - ${p}`));
}
if (failures.length) {
  console.error("\n✗ Falhas nos funis de portfólio:");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("✓ Todos os funis de portfólio concluíram com redirect válido.");
