/**
 * PORTFOLIO_FUNNEL_OPERATIONAL_GATE
 *
 * Verifica, para TODOS os projetos públicos de /portfolio, três dimensões
 * independentes:
 *
 *  1. FUNNEL_OPERATIONAL — o projeto tem uma variante de funil reconhecida e
 *     nenhum contato direto no bundle (`wa.me`, `api.whatsapp`, `tel:`).
 *  2. DIRECT_DELIVERY    — existe destino operacional reconhecido pelo mesmo
 *     mapa de compatibilidade usado pelo runtime. Ausente =
 *     PENDING_DESTINATION, que é estado aceitável, não falha.
 *  3. RECOVERABILITY     — a camada compartilhada garante que nenhuma conclusão
 *     termine sem entrega E sem meio de retorno (checagem estrutural do
 *     caminho terminal comum a todas as variantes).
 *
 * Falham o gate: projeto sem funil declarado, contato direto no código e
 * qualquer regressão estrutural na garantia de recuperabilidade.
 *
 * Importante: este gate não decide titularidade nem promove destino. Ele só
 * evita que o relatório diga "sem destino" quando o runtime ainda reconhece
 * um alias legado. A confirmação continua sendo uma etapa separada.
 *
 * Uso: node scripts/check-portfolio-funnel-operational.mjs [--json]
 */
import { readFileSync, existsSync } from "node:fs";

const json = process.argv.includes("--json");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const legacyEnvAliases = JSON.parse(
  readFileSync("src/config/portfolio-whatsapp-env-aliases.json", "utf8"),
);

const VARIANTS = [
  ["portfolio_quiz", /BeautyBookingQuiz/],
  ["dynamic_funnel", /FunnelCTAButton|FunnelModalWrapper|FloatingFunnelCTA/],
];
const DIRECT_CONTACT = /wa\.me|api\.whatsapp\.com|href=["'`]tel:/;

function canonicalEnvName(clientKey) {
  return `PORTFOLIO_WHATSAPP_${String(clientKey).toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
}

function runtimeEnvName(clientKey) {
  return legacyEnvAliases[clientKey] ?? canonicalEnvName(clientKey);
}

function envHasValidDestination(clientKey) {
  const raw = (process.env[runtimeEnvName(clientKey)] ?? "").trim();
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

// ---- 1/2: inventário por projeto ------------------------------------------
const rows = [];
for (const c of clients) {
  const file = c.componentFile;
  if (!file || !existsSync(file)) {
    rows.push({ slug: c.slug, variant: "MISSING_COMPONENT", directContact: false, delivery: "UNKNOWN", ok: false });
    continue;
  }
  const src = readFileSync(file, "utf8");
  const found = VARIANTS.filter(([, re]) => re.test(src)).map(([n]) => n);
  const declared = c.funnelVariant ?? null;
  const variant = found[0] ?? declared ?? "NONE";
  const directContact = DIRECT_CONTACT.test(src);
  const configured = envHasValidDestination(c.clientKey);
  const delivery =
    variant === "external_store" ? "NOT_APPLICABLE" : configured ? "CONFIGURED" : "PENDING_DESTINATION";
  rows.push({
    slug: c.slug,
    variant,
    directContact,
    delivery,
    ok: variant !== "NONE" && variant !== "MISSING_COMPONENT" && !directContact,
  });
}

// ---- 3: contrato terminal compartilhado ------------------------------------
const funnelFns = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
const runner = readFileSync("src/components/funnel/FunnelRunner.tsx", "utf8");
const quiz = readFileSync("src/components/site/BeautyBookingQuiz.tsx", "utf8");
const redirect = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");
const recoveryApi = "src/routes/api/public/funnel-recovery.ts";

const structural = [
  ["lead salvo antes de resolver destino", funnelFns.indexOf('.from("dynamic_form_leads")') < funnelFns.indexOf("getPortfolioWhatsAppChannelStateAsync")],
  ["token só é criado com destino resolvido", /destinationConfigured\s*\n?\s*\?\s*await createWhatsAppRedirectToken|channel !== "CONFIGURED"/.test(funnelFns)],
  ["decisão de recuperabilidade no servidor", funnelFns.includes("decideLeadRecoverability")],
  ["ledger registrado em todos os desfechos", funnelFns.includes("recordLeadDelivery")],
  ["runner pede contato de retorno", runner.includes("requiresRecoveryContact") && runner.includes("attachFunnelRecoveryContact")],
  ["quiz pede contato de retorno", quiz.includes("normalizeRecoveryPhone")],
  ["redirect sem beco sem saída", redirect.includes("recoveryToken") && !redirect.includes("Canal indisponível")],
  ["endpoint de recuperação existe", existsSync(recoveryApi)],
  ["redirect marca entrega e falha", redirect.includes("markLeadDelivered") && redirect.includes("markLeadDeliveryFailed")],
];

const failures = rows.filter((r) => !r.ok);
const structuralFailures = structural.filter(([, ok]) => !ok).map(([n]) => n);
const summary = {
  projects: rows.length,
  byVariant: rows.reduce((acc, r) => ({ ...acc, [r.variant]: (acc[r.variant] ?? 0) + 1 }), {}),
  delivery: rows.reduce((acc, r) => ({ ...acc, [r.delivery]: (acc[r.delivery] ?? 0) + 1 }), {}),
  deadEnds: structuralFailures.length,
  failures: failures.map((f) => f.slug),
};

if (json) {
  console.log(JSON.stringify({ summary, rows, structural }, null, 2));
} else {
  console.log("PORTFOLIO_FUNNEL_OPERATIONAL_GATE");
  console.log(
    `${summary.projects} projetos · ` +
      Object.entries(summary.byVariant).map(([k, v]) => `${k}=${v}`).join(" · "),
  );
  console.log(
    `entrega direta: ` + Object.entries(summary.delivery).map(([k, v]) => `${k}=${v}`).join(" · "),
  );
  for (const [name, ok] of structural) console.log(`  ${ok ? "OK  " : "FAIL"} ${name}`);
  for (const f of failures) console.log(`  FAIL ${f.slug} (variante=${f.variant}${f.directContact ? ", contato direto no código" : ""})`);
}

process.exit(failures.length || structuralFailures.length ? 1 : 0);
