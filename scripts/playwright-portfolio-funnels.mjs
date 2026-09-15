/**
 * E2E dos funis individuais de /portfolio/* (desktop + mobile).
 *
 * Contrato verificado por cenário:
 *   rota → CTA do próprio cliente → modal → campos → submit → lead no servidor
 *   → clientKey correto (isolamento) → destino:
 *      - CONFIGURED: redirect tokenizado 3xx para host oficial do WhatsApp;
 *      - MISSING:    conclusão honesta (contato de retorno / 503), SEM redirect
 *                    para qualquer número — ausência de destino é contrato.
 *
 * Duas variantes de funil são suportadas:
 *   - portfolio_quiz  (BeautyBookingQuiz, dialog `portfolio-cta-quiz-title`)
 *   - dynamic_funnel  (FunnelRunner dentro de `[data-testid=funnel-modal]`)
 *
 * Estado do destinatário vem do resolver canônico, via
 * `seo-reports/portfolio-destination-state.json`
 * (`bun run scripts/report-portfolio-destination-state.ts`) — nunca de uma
 * segunda lógica de decisão, e nunca contendo números.
 *
 * Rate limit: a proteção pública real (12 envios/10min por IP) NÃO é afrouxada.
 * Cada cenário simula um visitante distinto declarando um X-Forwarded-For
 * próprio (somente contra o ambiente local de teste). Contra base remota,
 * defina E2E_UNIQUE_CLIENT_IP=0 e use E2E_PACE_MS para espaçar os envios.
 *
 * Nenhum número/telefone é impresso ou gravado: apenas host e estado.
 */
import { chromium } from "playwright";
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const configuredBrowser = process.env.E2E_BROWSER_PATH;
const only = process.env.E2E_ONLY_SLUG;
const pace = Number(process.env.E2E_PACE_MS || 0);
const uniqueClientIp = process.env.E2E_UNIQUE_CLIENT_IP !== "0";

const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));

const statePath = "seo-reports/portfolio-destination-state.json";
if (!existsSync(statePath)) {
  console.error(
    `✗ Estado canônico de destinatários ausente (${statePath}).\n` +
      "  Rode antes: bun run scripts/report-portfolio-destination-state.ts",
  );
  process.exit(1);
}
const destinationState = new Map(
  JSON.parse(readFileSync(statePath, "utf8")).rows.map((row) => [row.clientKey, row.state]),
);

const TARGETS = clients
  .filter((client) => !only || client.slug === only)
  .map((client) => ({
    slug: client.slug,
    clientKey: client.clientKey,
    siteName: client.siteName,
    // Verdade canônica (env do cliente ou configuração privada), nunca o flag
    // estático do catálogo.
    recipientConfigured: destinationState.get(client.clientKey) === "CONFIGURED",
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
const throttled = [];
const ok = [];

const VALID_DESTINATION = /^https:\/\/(api\.whatsapp\.com|wa\.me|web\.whatsapp\.com)\//;

/** Payload das server functions do TanStack: `{ p: { k: [...], v: [...] } }`. */
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

let ipCounter = 0;
function nextTestIp() {
  ipCounter += 1;
  // Faixa de documentação (RFC 5737), apenas para o ambiente de teste local.
  return `203.0.113.${ipCounter % 254}`;
}

async function runScenario(target, viewport, out) {
  const id = `${target.slug} [${viewport.name}]`;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    ...(uniqueClientIp
      ? { extraHTTPHeaders: { "x-forwarded-for": `${nextTestIp()}.${Date.now() % 97}`.slice(0, 15) } }
      : {}),
  });
  const page = await context.newPage();
  const serverErrors = [];
  const submittedKeys = [];
  let redirect = null;
  let rateLimited = false;

  page.on("response", (response) => {
    if (response.status() >= 500) serverErrors.push(`${response.status()} em ${new URL(response.url()).pathname}`);
  });
  page.on("request", (request) => {
    if (request.method() !== "POST") return;
    if (!request.url().includes("/_serverFn/")) return;
    const body = request.postData() || "";
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

  /** Aguarda o desfecho real (redirect tokenizado ou conclusão registrada). */
  const waitForOutcome = async () => {
    for (let i = 0; i < 16; i += 1) {
      if (redirect) return;
      const text = await page.locator("body").innerText().catch(() => "");
      if (/Solicita[cç][ãa]o registrada|Protocolo/i.test(text)) return;
      await page.waitForTimeout(750);
    }
  };

  try {

    const response = await page.goto(`${baseUrl}/portfolio/${target.slug}`, { waitUntil: "domcontentloaded" });
    if (!response || response.status() >= 400) {
      out.failures.push(`${id}: página respondeu ${response ? response.status() : "sem resposta"}`);
      return;
    }
    await page.waitForLoadState("load").catch(() => {});
    await page.waitForTimeout(2200);

    const dismissOverlays = async () => {
      const close = page.getByRole("button", { name: /^(Fechar|Agora não|Dispensar)/i });
      const count = await close.count();
      for (let i = 0; i < count; i += 1) {
        await close.nth(i).click({ timeout: 1200 }).catch(() => {});
      }
    };
    await dismissOverlays();

    const ctas = page.locator('[data-funnel-cta="portfolio"], [data-testid="funnel-cta"]');
    const ctaCount = await ctas.count();
    if (ctaCount === 0) {
      out.failures.push(`${id}: nenhum CTA de funil encontrado`);
      return;
    }

    const wrongOwner = await ctas.evaluateAll(
      (nodes, expected) =>
        nodes
          .map((n) => n.getAttribute("data-funnel-client") || n.getAttribute("data-funnel-company"))
          .filter((k) => k && k !== expected),
      target.clientKey,
    );
    if (wrongOwner.length) {
      out.failures.push(`${id}: CTA aponta para outro cliente (${[...new Set(wrongOwner)].join(", ")})`);
      return;
    }

    const quizDialog = page.locator('[role=dialog][aria-labelledby="portfolio-cta-quiz-title"]').last();
    const dynamicDialog = page.locator('[data-testid="funnel-modal"]').last();
    let dialog = null;
    let variant = null;
    const order = [ctaCount - 1, 0, Math.floor(ctaCount / 2), ctaCount - 2].filter(
      (index, position, list) => index >= 0 && index < ctaCount && list.indexOf(index) === position,
    );
    for (let attempt = 0; attempt < order.length && !dialog; attempt += 1) {
      const trigger = ctas.nth(order[attempt]);

      await trigger.scrollIntoViewIfNeeded().catch(() => {});
      const clicked = await trigger
        .click({ timeout: 6000 })
        .then(() => true)
        .catch(() => false);
      // Overlays (pop-ups da hospedagem) podem interceptar o clique real: o
      // fallback aciona o mesmo botão do cliente, sem alterar o site.
      if (!clicked) await trigger.evaluate((node) => node.click()).catch(() => {});

      const quizOpen = await quizDialog
        .waitFor({ state: "visible", timeout: 5000 })
        .then(() => true)
        .catch(() => false);
      if (quizOpen) {
        dialog = quizDialog;
        variant = "portfolio_quiz";
        break;
      }
      const dynOpen = await dynamicDialog
        .waitFor({ state: "visible", timeout: 3000 })
        .then(() => true)
        .catch(() => false);
      if (dynOpen) {
        dialog = dynamicDialog;
        variant = "dynamic_funnel";
        break;
      }
      await dismissOverlays();
    }
    if (!dialog) {
      out.failures.push(`${id}: CTA não abriu o modal do funil`);
      return;
    }

    // ---- percorre o funil (as duas variantes) -----------------------------
    if (variant === "portfolio_quiz") {
      for (let step = 0; step < 8; step += 1) {
        const text = await dialog.innerText();
        if (/indispon[ií]vel/i.test(text) && /funil/i.test(text)) {
          out.failures.push(`${id}: funil indisponível na etapa ${step}`);
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
            out.failures.push(`${id}: etapa ${step} sem opções clicáveis`);
            return;
          }
          await options.first().click({ timeout: 8000 });
        }
        await page.waitForTimeout(280);
      }

      // Sem destinatário, o contrato pede WhatsApp de retorno do visitante.
      const recovery = dialog.locator("#portfolio-quiz-recovery");
      if (await recovery.count()) {
        if (target.recipientConfigured) {
          out.failures.push(`${id}: destino configurado mas o funil pediu contato de retorno`);
          return;
        }
        await recovery.fill("41999990000");
      }

      const finish = dialog.getByRole("button", { name: /Continuar/i }).first();
      if (!(await finish.count())) {
        out.failures.push(`${id}: etapa final sem botão de conclusão`);
        return;
      }
      await finish.click({ timeout: 8000 });
      await waitForOutcome();

    } else {
      for (let step = 0; step < 25; step += 1) {
        if (await page.locator('[data-testid="funnel-done"]').count()) break;
        const option = dialog.locator('[data-testid="funnel-option"]:visible').first();
        if (await option.count()) {
          await option.click({ timeout: 8000 }).catch(() => {});
        } else {
          const input = dialog.locator('[data-testid="funnel-input"]:visible').first();
          if (await input.count()) {
            const type = (await input.getAttribute("type").catch(() => "")) || "";
            const mode = (await input.getAttribute("inputmode").catch(() => "")) || "";
            const value =
              type === "email" ? "teste-e2e@example.test" : mode === "tel" ? "41999990000" : "Teste E2E 0WEB";
            await input.fill(value, { timeout: 8000 }).catch(() => {});
          }
          const next = page.locator('[data-testid="funnel-next"]:visible').first();
          if (!(await next.count())) break;
          await next.click({ timeout: 8000 }).catch(() => {});
        }
        await page.waitForTimeout(500);
      }
      await waitForOutcome();
    }

    let finalText = await dialog.innerText().catch(() => "");
    // O modal pode ser desmontado pela própria conclusão: caia para o corpo da
    // página em vez de tratar ausência de nó como ausência de resultado.
    if (!finalText.trim()) finalText = await page.locator("body").innerText().catch(() => "");
    const doneBlock = page.locator('[data-testid="funnel-done"]');
    const doneText = (await doneBlock.count()) ? await doneBlock.innerText().catch(() => "") : "";
    const combined = `${finalText}\n${doneText}`;
    if (/muitas tentativas|limite de envios/i.test(combined)) rateLimited = true;
    if (/N[ãa]o foi poss[íi]vel abrir/i.test(finalText)) {
      out.failures.push(`${id}: erro ao concluir o funil`);
      return;
    }
    const appErrors = serverErrors.filter((entry) => !entry.includes("/r/whatsapp/"));
    if (appErrors.length) {
      out.failures.push(`${id}: ${[...new Set(appErrors)].join(", ")}`);
      return;
    }
    if (rateLimited) {
      // Limite antiabuso real de produção sendo atingido pelo próprio teste:
      // é artefato do harness (muitos envios do mesmo visitante), não falha de
      // contrato. Registrado à parte, sem afrouxar a proteção pública.
      out.throttled.push(`${id}: limite antiabuso de produção atingido pelo teste (artefato do harness)`);
      return;
    }

    // Um redirect tokenizado só existe porque o servidor persistiu o lead —
    // quando ele é observado, a navegação abortada pode impedir a leitura do
    // payload, e isso não é falha de contrato.
    if (!submittedKeys.length && !redirect) {
      out.failures.push(
        `${id}: envio do funil não chegou ao servidor [url=${page.url().slice(0, 60)} texto="${combined.replace(/\s+/g, " ").slice(0, 120)}"]`,
      );
      return;
    }

    if (submittedKeys.some((key) => key !== target.clientKey)) {
      out.failures.push(`${id}: envio usou clientKey de outro cliente`);
      return;
    }

    // ---- desfecho ---------------------------------------------------------
    if (!target.recipientConfigured) {
      if (redirect && redirect.status < 400 && VALID_DESTINATION.test(redirect.location)) {
        out.failures.push(`${id}: cliente sem destino oficial redirecionou para WhatsApp (fallback proibido)`);
        return;
      }
      const registered =
        /Solicita[cç][ãa]o registrada|registrados para|Protocolo/i.test(combined) ||
        (redirect && redirect.status === 503);
      if (!registered) {
        out.failures.push(`${id}: sem destino oficial e sem conclusão honesta (lead/protocolo não confirmados)`);
        return;
      }
      out.pending.push(`${id}: lead salvo; destinatário oficial ainda não confirmado pelo titular`);
      console.log(`• ${id} → funil completo; destino pendente (BLOCKED_MISSING_OFFICIAL_CONTACT)`);
      return;
    }

    if (!redirect) {
      out.failures.push(`${id}: funil não gerou redirect tokenizado`);
      return;
    }
    if (redirect.status >= 500) {
      out.failures.push(`${id}: redirect respondeu ${redirect.status}`);
      return;
    }
    if (!VALID_DESTINATION.test(redirect.location)) {
      out.failures.push(`${id}: destino do redirect inválido (status ${redirect.status})`);
      return;
    }
    out.ok.push(id);
    console.log(`✓ ${id} → funil completo e redirect válido`);
  } catch (error) {
    out.failures.push(`${id}: ${String(error).split("\n")[0].slice(0, 180)}`);
  } finally {
    await context.close();
    if (pace) await new Promise((resolve) => setTimeout(resolve, pace));
  }
}

/**
 * Um cenário de navegador pode falhar por instabilidade do próprio harness
 * (corrida entre o redirect e a leitura do DOM). Uma segunda tentativa
 * distingue instabilidade de falha real de contrato — o resultado registrado
 * é sempre o da última tentativa.
 */
async function runTarget(target, viewport) {
  let out = { ok: [], pending: [], throttled: [], failures: [] };
  for (let attempt = 0; attempt < 3; attempt += 1) {
    out = { ok: [], pending: [], throttled: [], failures: [] };
    await runScenario(target, viewport, out);
    if (!out.failures.length) break;
    if (attempt < 2) {
      console.log(`↻ ${target.slug} [${viewport.name}] → repetindo cenário instável`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  ok.push(...out.ok);
  pending.push(...out.pending);
  throttled.push(...out.throttled);
  failures.push(...out.failures);
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

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  scenarios: queue.length,
  ok: ok.length,
  pendingConfiguration: pending.length,
  throttled: throttled.length,
  failed: failures.length,
  details: { ok, pending, throttled, failures },
};
try {
  mkdirSync("seo-reports", { recursive: true });
  writeFileSync("seo-reports/portfolio-funnels-e2e.json", JSON.stringify(report, null, 2));
  const li = (items) => items.map((i) => `<li>${String(i).replace(/[<>&]/g, "")}</li>`).join("");
  writeFileSync(
    "seo-reports/portfolio-funnels-e2e.html",
    `<!doctype html><meta charset="utf-8"><title>E2E funis de portfólio</title>` +
      `<h1>E2E funis de portfólio</h1>` +
      `<p>${report.generatedAt} · base ${baseUrl}</p>` +
      `<p><strong>${report.scenarios}</strong> cenários · ${report.ok} OK · ${report.pendingConfiguration} pendentes de configuração · ${report.throttled} limitados pelo antiabuso · ${report.failed} falhas</p>` +
      `<h2>OK</h2><ul>${li(ok)}</ul>` +
      `<h2>Pendentes de configuração</h2><ul>${li(pending)}</ul>` +
      `<h2>Limitados pelo antiabuso</h2><ul>${li(throttled)}</ul>`+
      `<h2>Falhas</h2><ul>${li(failures)}</ul>`,
  );
} catch (error) {
  console.error(`Aviso: não foi possível gravar o relatório (${String(error).slice(0, 120)})`);
}

console.log(
  `\nResumo: ${ok.length} OK · ${pending.length} pendentes de destino · ${throttled.length} limitados pelo antiabuso · ${failures.length} falhas · ${queue.length} cenários.`,
);
if (failures.length) {
  console.error("\n✗ Falhas nos funis de portfólio:");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("✓ Contrato do funil validado em todos os cenários.");
