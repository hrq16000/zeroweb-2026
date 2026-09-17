/**
 * Fonte única de verdade do estado do destinatário por clientKey.
 *
 * Política SEM COFRE (docs/PORTFOLIO_WHATSAPP_POLICY.md): o WhatsApp é dado
 * versionado do próprio portfolio (`src/config/portfolio-whatsapp.json`),
 * resolvido pelo resolver canônico do produto. Não há env/secret/vault nem
 * tabela privada no caminho de resolução.
 *
 * Saída: seo-reports/portfolio-destination-state.json — apenas booleanos e
 * classificação. NENHUM número é impresso ou gravado.
 *
 * Uso: bun run scripts/report-portfolio-destination-state.ts
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolvePortfolioWhatsAppContact, getPortfolioWhatsAppChannelState } from "../src/lib/whatsapp-redirect.server";
import { isPortfolioWhatsAppNotApplicable } from "../src/lib/portfolio-whatsapp-registry.server";

type Client = { clientKey: string; slug: string; siteName: string };
const clients: Client[] = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));

const rows: Array<{
  clientKey: string;
  slug: string;
  state: "CONFIGURED" | "MISSING" | "NOT_APPLICABLE";
  source: "versioned_config" | "none";
}> = [];

for (const client of clients) {
  const configured =
    getPortfolioWhatsAppChannelState(client.clientKey) === "CONFIGURED" &&
    Boolean(resolvePortfolioWhatsAppContact(client.clientKey));
  const state = configured
    ? "CONFIGURED"
    : isPortfolioWhatsAppNotApplicable(client.clientKey)
      ? "NOT_APPLICABLE"
      : "MISSING";
  rows.push({
    clientKey: client.clientKey,
    slug: client.slug,
    state,
    source: configured ? "versioned_config" : "none",
  });
}

const summary = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.state]: (acc[r.state] ?? 0) + 1 }), {});

mkdirSync("seo-reports", { recursive: true });
writeFileSync(
  "seo-reports/portfolio-destination-state.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), summary, rows }, null, 2),
);

console.log("PORTFOLIO_DESTINATION_STATE");
console.log(
  Object.entries(summary)
    .map(([k, v]) => `${k}=${v}`)
    .join(" · "),
);
for (const r of rows.filter((r) => r.state !== "CONFIGURED")) {
  console.log(`  ${r.state} ${r.clientKey}`);
}
