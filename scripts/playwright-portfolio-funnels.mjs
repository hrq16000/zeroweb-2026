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
 *  - com WhatsApp versionado: gera redirect tokenizado para WhatsApp;
 *  - com whatsapp:null: salva/encerra em modo lead-only, sem redirect e sem erro.
 *
 * Em CI sem SUPABASE_SERVICE_ROLE_KEY, E2E_DRY_RUN=1 valida todo o fluxo visual
 * até a etapa final sem executar escrita externa. O gate completo de escrita é
 * exercitado automaticamente quando a credencial de integração está disponível.
 *
 * Nenhum número/telefone é impresso: apenas o host de destino é validado.
 *
 * Uso: node scripts/playwright-portfolio-funnels.mjs
 * Sharding CI: E2E_SHARD_COUNT=4 E2E_SHARD_INDEX=0..3
 */
import { chromium } from "playwright";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:8080";
const configuredBrowser = process.env.E2E_BROWSER_PATH;
const only = process.env.E2E_ONLY_SLUG;
const onlySlugs = (process.env.E2E_ONLY_SLUGS || only || "")
  .split(",")
  .map((slug) => slug.trim())
  .filter(Boolean);
const shardCount = Math.max(1, Number(process.env.E2E_SHARD_COUNT || 1));
const shardIndex = Math.max(0, Number(process.env.E2E_SHARD_INDEX || 0));

const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const whatsappRegistry = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const hostedFormRegistry = JSON.parse(readFileSync("src/config/portfolio-hosted-form-registry.json", "utf8"));
const DRY_RUN = process.env.E2E_DRY_RUN === "1";
const TARGETS = clients
  .filter((client, index) => (onlySlugs.length === 0 || onlySlugs.includes(client.slug)) && index % shardCount === shardIndex)
  .map((client) => ({
    slug: client.slug,
    clientKey: client.clientKey,
    siteName: client.siteName,
    // A fonte canônica é o cadastro versionado por clientKey. Metadados legados
    // em portfolio-clients.json não decidem mais o destino operacional.
    recipientConfigured: Boolean(whatsappRegistry.contacts?.[client.clientKey]?.whatsapp),
    hostedForm: hostedFormRegistry.forms?.[client.clientKey] ?? null,
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
const leadOnly = [];
const dryRunOk = [];
const hostedOk = [];
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
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: viewport.reducedMotion ?? "no-preference",
  });
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

  // Em QA o iframe não faz chamadas à Jotform: a persistência real é verificada
  // separadamente pelo provedor. Este gate valida integração e isolamento no DOM.
  await page.route("https://form.jotform.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/html; charset=utf-8",
      body: "<!doctype html><html lang=pt-BR><title>Jotform QA isolado</title><body>Fixture local sem envio de dados</body></html>" });
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

    const marliQa = target.slug === "espaco-marli-nails-guaratuba" && [390, 768, 1440].includes(viewport.width);
    if (marliQa) {
      const { mkdirSync } = await import("node:fs");
      mkdirSync("seo-reports/portfolio-funnels-marli", { recursive: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
      if (overflow) {
        failures.push(`${id}: rolagem horizontal em ${viewport.width}px`);
        return;
      }
      await page.screenshot({ path: `seo-reports/portfolio-funnels-marli/page-${viewport.width}.png` });
    }

    // Formulários hospedados já verificados possuem fluxo próprio: não inventar
    // 5 etapas de quiz ou forçar escrita no backend Supabase em CI.
    // Ainda exigimos CTA do cliente, abertura real, owner único e src exato.
    if (target.hostedForm?.status === "verified" && target.hostedForm.provider === "jotform") {
      const formUrl = target.hostedForm.url;
      if (!/^https:\/\/form\.jotform\.com\/\d+$/.test(formUrl) ||
          !target.hostedForm.testSubmissionVerified ||
          target.hostedForm.clientKey !== target.clientKey) {
        failures.push(`${id}: registro Jotform inválido ou sem evidência de persistência`);
        return;
      }
      const clientCtas = page.locator(
        `[data-funnel-cta="portfolio"][data-funnel-client="${target.clientKey}"]:visible`,
      );
      if (!(await clientCtas.count())) {
        failures.push(`${id}: nenhum CTA de funil hospedado do cliente encontrado`);
        return;
      }
      const foreignCtas = await page.locator('[data-funnel-cta="portfolio"]').evaluateAll(
        (nodes, expected) => nodes
          .map((node) => node.getAttribute("data-funnel-client"))
          .filter((key) => key !== expected),
        target.clientKey,
      );
      if (foreignCtas.length) {
        failures.push(`${id}: CTA com chave estrangeira ou ausente`);
        return;
      }
      await clientCtas.first().scrollIntoViewIfNeeded();
      await clientCtas.first().click({ timeout: 8000 });
      const provider = page.locator(
        `[data-funnel-provider="jotform"][data-client-key="${target.clientKey}"]`,
      );
      await provider.waitFor({ state: "visible", timeout: 8000 });
      const ownerCount = await provider.count();
      const foreignProviders = await page.locator(
        '[data-funnel-provider="jotform"][data-client-key]',
      ).evaluateAll((nodes, expected) => nodes
        .map((node) => node.getAttribute("data-client-key"))
        .filter((key) => key !== expected), target.clientKey);
      if (ownerCount !== 1 || foreignProviders.length) {
        failures.push(`${id}: formulário Jotform não é único/isolado por clientKey`);
        return;
      }
      // Agropet identifica o contêiner; Marli/Cantinho identificam o iframe.
      const iframe = page.locator(
        `iframe[data-funnel-provider="jotform"][data-client-key="${target.clientKey}"], [data-funnel-provider="jotform"][data-client-key="${target.clientKey}"] iframe`,
      );
      if (await iframe.count() !== 1 || !await iframe.first().isVisible()) {
        failures.push(`${id}: iframe Jotform ausente ou não visível`);
        return;
      }
      const actualUrl = await iframe.first().getAttribute("src");
      if (actualUrl !== formUrl) {
        failures.push(`${id}: URL do iframe diverge do registro verificado`);
        return;
      }
      if (serverErrors.length || redirect || submittedKeys.length) {
        failures.push(`${id}: erro HTTP, redirect ou POST legado indevido no fluxo hospedado`);
        return;
      }
      if (marliQa) {
        await page.screenshot({ path: `seo-reports/portfolio-funnels-marli/modal-${viewport.width}.png` });
      }
      hostedOk.push(id);
      console.log(`✓ ${id} → Jotform verificado, único, visível e sem escrita externa (QA isolado)`);
      return;
    }

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
    if (DRY_RUN) {
      dryRunOk.push(id);
      console.log(`✓ ${id} → fluxo visual completo até a conclusão (dry-run)`);
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
    if (!target.recipientConfigured) {
      if (redirect) {
        failures.push(`${id}: portfolio lead-only gerou redirect indevido`);
        return;
      }
      leadOnly.push(id);
      console.log(`✓ ${id} → funil completo em modo lead-only, sem redirect`);
      return;
    }

    if (!redirect) {
      failures.push(`${id}: funil com WhatsApp configurado não gerou redirect tokenizado`);
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
// Preserva literalmente o contrato de cobertura global, auditado por unit test.
for (const target of TARGETS) for (const viewport of VIEWPORTS) queue.push([target, viewport]);

// Os três cenários adicionais são exclusivos da Marli, sem substituir a matriz global.
const marliTarget = TARGETS.find((target) => target.slug === "espaco-marli-nails-guaratuba");
if (marliTarget) {
  for (const viewport of [
    { name: "mobile-390-reduced", width: 390, height: 844, reducedMotion: "reduce" },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1440", width: 1440, height: 900 },
  ]) queue.push([marliTarget, viewport]);
}

const CONCURRENCY = Number(process.env.E2E_CONCURRENCY || 1);
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

// Relatório de evidência (JSON + HTML). Nenhum número/telefone é gravado:
// apenas identificadores de cenário e o status do contrato.
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  scenarios: queue.length,
  mode: DRY_RUN ? "dry-run" : "write",
  ok: ok.length,
  leadOnly: leadOnly.length,
  dryRunOk: dryRunOk.length,
  hostedOk: hostedOk.length,
  failed: failures.length,
  details: { ok, leadOnly, dryRunOk, hostedOk, failures },
};
try {
  const { mkdirSync, writeFileSync } = await import("node:fs");
  mkdirSync("seo-reports", { recursive: true });
  writeFileSync("seo-reports/portfolio-funnels-e2e.json", JSON.stringify(report, null, 2));
  const li = (items) => items.map((i) => `<li>${String(i).replace(/[<>&]/g, "")}</li>`).join("");
  writeFileSync(
    "seo-reports/portfolio-funnels-e2e.html",
    `<!doctype html><meta charset="utf-8"><title>E2E funis de portfólio</title>` +
      `<h1>E2E funis de portfólio</h1>` +
      `<p>${report.generatedAt} · base ${baseUrl}</p>` +
      `<p><strong>${report.scenarios}</strong> cenários · modo ${report.mode} · ${report.ok} redirects OK · ${report.leadOnly} lead-only · ${report.dryRunOk} dry-run OK · ${report.hostedOk} Jotform verificados · ${report.failed} falhas</p>` +
      `<h2>Redirects OK</h2><ul>${li(ok)}</ul>` +
      `<h2>Lead-only</h2><ul>${li(leadOnly)}</ul>` +
      `<h2>Dry-run OK</h2><ul>${li(dryRunOk)}</ul>` +
      `<h2>Jotform QA isolado</h2><ul>${li(hostedOk)}</ul>` +
      `<h2>Falhas</h2><ul>${li(failures)}</ul>`,
  );
} catch (error) {
  console.error(`Aviso: não foi possível gravar o relatório (${String(error).slice(0, 120)})`);
}

console.log(
  `\nResumo: ${ok.length} redirects OK · ${leadOnly.length} lead-only · ${dryRunOk.length} dry-run OK · ${hostedOk.length} Jotform verificados · ${queue.length} executados.`,
);
if (failures.length) {
  console.error("\n✗ Falhas nos funis de portfólio:");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(
  DRY_RUN
    ? "✓ Funis legados chegaram ao final em dry-run; formulários Jotform validados por URL, clientKey e modal sem escrita."
    : "✓ Todos os funis de portfólio respeitaram o contrato de redirect/lead-only.",
);
