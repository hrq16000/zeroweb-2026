/**
 * PORTFOLIO_FUNNEL_OPERATIONAL_GATE
 *
 * Verifica, para TODOS os projetos públicos de /portfolio:
 *
 *  1. FUNNEL_OPERATIONAL — variante reconhecida e sem CTA direto que burle o funil.
 *  2. DESTINATION_ISOLATION — cada clientKey possui entrada canônica em
 *     `portfolio-whatsapp.json`; número, null ou referência a segredo próprio são válidos.
 *  3. TERMINAL_CONTRACT — lead é salvo antes do redirect; com número abre o
 *     WhatsApp do mesmo clientKey; sem número conclui em modo LEAD_ONLY.
 *  4. NO_VAULT — clientes legados mantêm dados versionados; novos projetos
 *     podem resolver segredo Vercel server-only pelo clientKey exato, sem fallback cross-client.
 *
 * Uso: node scripts/check-portfolio-funnel-operational.mjs [--json]
 */
import { readFileSync, existsSync } from "node:fs";
import { isSecretDestinationReference } from "./lib/funnel-destination-gate.mjs";

const json = process.argv.includes("--json");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const contactConfig = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const contacts = contactConfig?.contacts ?? {};
const ledger = JSON.parse(readFileSync("src/config/portfolio-funnel-destinations.json", "utf8")).entries ?? {};

const VARIANTS = [
  ["portfolio_quiz", /BeautyBookingQuiz|PortfolioCTAQuiz|submitPortfolioQuiz/],
  ["dynamic_funnel", /FunnelCTAButton|FunnelModalWrapper|FloatingFunnelCTA/],
  ["direct_lead_form", /InfinitoSpaLeadForm|submitInfinitoSpaPublicLead/],
  ["hosted_form", /data-funnel-provider="jotform"/],
];
const DIRECT_CONTACT = /wa\.me|api\.whatsapp\.com|href=["'`]tel:/;

function validWhatsApp(raw) {
  if (typeof raw !== "string") return false;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

const rows = [];
for (const c of clients) {
  const file = c.componentFile;
  if (!file || !existsSync(file)) {
    rows.push({
      slug: c.slug,
      clientKey: c.clientKey,
      variant: "MISSING_COMPONENT",
      directContact: false,
      contactEntry: false,
      delivery: "UNKNOWN",
      ok: false,
    });
    continue;
  }

  const src = readFileSync(file, "utf8");
  const found = VARIANTS.filter(([, re]) => re.test(src)).map(([n]) => n);
  const declared = c.funnelVariant ?? null;
  const variant = found[0] ?? declared ?? "NONE";
  const directContact = DIRECT_CONTACT.test(src);
  const contactEntry = Object.prototype.hasOwnProperty.call(contacts, c.clientKey);
  const whatsapp = contactEntry ? contacts[c.clientKey]?.whatsapp : undefined;
  const configured = validWhatsApp(whatsapp);
  const provenance = ledger[c.clientKey] ?? ledger[c.slug] ?? null;
  const expectedEnvKey = `PORTFOLIO_WHATSAPP_${String(c.clientKey).toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
  const secretConfigured = isSecretDestinationReference(whatsapp, provenance, expectedEnvKey);
  const explicitNull = contactEntry && whatsapp === null;

  const delivery =
    variant === "external_store"
      ? "EXTERNAL_STORE"
      : configured
        ? "WHATSAPP"
        : secretConfigured
          ? "WHATSAPP_SECRET"
          : explicitNull
          ? "LEAD_ONLY"
          : "INVALID_CONTACT_DATA";

  rows.push({
    slug: c.slug,
    clientKey: c.clientKey,
    variant,
    directContact,
    contactEntry,
    delivery,
    ok:
      variant !== "NONE" &&
      variant !== "MISSING_COMPONENT" &&
      !directContact &&
      contactEntry &&
      (configured || secretConfigured || explicitNull || variant === "external_store"),
  });
}

const funnelFns = readFileSync("src/lib/dynamic-funnel.functions.ts", "utf8");
const portfolioQuizUi = readFileSync("src/components/site/BeautyBookingQuiz.tsx", "utf8");
const infinitoPage = readFileSync("src/components/site/InfinitoSpaPage.tsx", "utf8");
const infinitoLeadForm = readFileSync("src/components/site/InfinitoSpaLeadForm.tsx", "utf8");
const whatsappRoute = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");
const redirectServer = readFileSync("src/lib/whatsapp-redirect.server.ts", "utf8");
const destinationConfirm = readFileSync("src/lib/portfolio-destination-confirm.server.ts", "utf8");
const registry = readFileSync("src/lib/portfolio-whatsapp-registry.server.ts", "utf8");
const redirectRoute = readFileSync("src/routes/r.whatsapp.$token.ts", "utf8");
const messageSyncTest = "tests/leads/funnel-message-sync.test.ts";

const leadInsert = funnelFns.indexOf('.from("dynamic_form_leads")');
const destinationLookup = funnelFns.indexOf("getPortfolioWhatsAppChannelStateAsync");
const privateTableReadOrWrite = /\.from\(\s*["'`]portfolio_client_settings["'`]\s*\)/;
const syncResolverStart = redirectServer.indexOf("export function resolvePortfolioWhatsAppContact(");
const asyncResolverStart = redirectServer.indexOf("export async function resolvePortfolioWhatsAppContactAsync");
const syncResolverSource =
  syncResolverStart >= 0 && asyncResolverStart > syncResolverStart
    ? redirectServer.slice(syncResolverStart, asyncResolverStart)
    : "";
const legacyResolverReadsPrivateTable = privateTableReadOrWrite.test(syncResolverSource);
const managedResolverIsExact =
  asyncResolverStart >= 0 &&
  redirectServer.slice(asyncResolverStart).includes('.eq("client_key", clientKey)') &&
  redirectServer.slice(asyncResolverStart).includes('.eq("project_kind", "managed")') &&
  redirectServer.slice(asyncResolverStart).includes('.eq("lifecycle_status", "published")') &&
  redirectServer.slice(asyncResolverStart).includes('.eq("published", true)');
const adminReadsOrWritesLegacyPrivateTable = privateTableReadOrWrite.test(destinationConfirm);

const structural = [
  ["lead salvo antes de resolver destino", leadInsert >= 0 && destinationLookup >= 0 && leadInsert < destinationLookup],
  ["Infinito Spa captures contact details and stores the correct client/source", infinitoLeadForm.includes("name: name.trim()") && infinitoLeadForm.includes("phone: phone.trim()") && infinitoPage.includes('clientKey="infinito-spa"') && infinitoLeadForm.includes("clientKey,") && infinitoLeadForm.includes('source: `portfolio:${clientKey}`') && infinitoLeadForm.includes("submitInfinitoSpaPublicLead") && whatsappRoute.includes('token === "portfolio-infinito-spa"') && whatsappRoute.includes('return handleInfinitoSpaWhatsAppRedirect(request)') &&
    readFileSync("src/lib/infinito-spa-whatsapp.server.ts", "utf8").includes('resolveVersionedPortfolioWhatsApp("infinito-spa")')],
  ["token só é criado quando existe destino", /destinationConfigured\s*\n?\s*\?\s*await createWhatsAppRedirectToken|channel !== "CONFIGURED"/.test(funnelFns)],
  ["portfolio sem número conclui sem recuperação obrigatória", funnelFns.includes("requiresRecoveryContact: clientKey ? false") && funnelFns.includes("leadOnly: !destinationConfigured") && funnelFns.includes("requiresRecoveryContact: false")],
  ["registro canônico versionado existe", registry.includes("@/config/portfolio-whatsapp.json") && registry.includes("resolveVersionedPortfolioWhatsApp")],
  ["resolvedor legado não lê tabela privada", !legacyResolverReadsPrivateTable],
  ["resolvedor managed consulta somente clientKey exato publicado", managedResolverIsExact],
  ["admin de destino não lê/grava tabela privada", !adminReadsOrWritesLegacyPrivateTable],
  ["segredo Vercel é resolvido pelo registry server-only", registry.includes("process.env[expectedEnvKey]") && registry.includes("PORTFOLIO_WHATSAPP_")],
  ["resolvedor de redirect não lê secret diretamente", !redirectServer.includes("PORTFOLIO_WHATSAPP_")],
  ["resolvedor usa apenas clientKey canônico", redirectServer.includes("resolveVersionedPortfolioWhatsApp(clientKey)")],
  ["admin valida apenas dado versionado", destinationConfirm.includes("current.digits !== parsed.digits") && destinationConfirm.includes("CHANGE_PENDING") && !destinationConfirm.includes("funnel_recipient")],
  ["sem fallback institucional para portfolio", !/resolvePortfolioWhatsAppContact[\s\S]{0,1200}resolveOperationalWhatsAppContact/.test(redirectServer)],
  ["ledger de entrega continua registrado", funnelFns.includes("recordLeadDelivery")],
  ["redirect marca entrega e falha", redirectRoute.includes("markLeadDelivered") && redirectRoute.includes("markLeadDeliveryFailed")],
  ["ZERO_FUNNEL_DRIFT usa gerador canônico", redirectRoute.includes("buildPortfolioQuizMessage")],
  ["localização da prévia é persistida", funnelFns.includes("preview_location: data.previewLocation") && redirectRoute.includes("meta.preview_location")],
  ["gate de sincronismo existe", existsSync(messageSyncTest)],
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
    `destinos: ` + Object.entries(summary.delivery).map(([k, v]) => `${k}=${v}`).join(" · "),
  );
  for (const [name, ok] of structural) console.log(`  ${ok ? "OK  " : "FAIL"} ${name}`);
  for (const f of failures) {
    console.log(
      `  FAIL ${f.slug} (variante=${f.variant}, destino=${f.delivery}` +
        `${f.directContact ? ", contato direto no código" : ""}` +
        `${!f.contactEntry ? ", sem entrada canônica" : ""})`,
    );
  }
}

process.exit(failures.length || structuralFailures.length ? 1 : 0);
