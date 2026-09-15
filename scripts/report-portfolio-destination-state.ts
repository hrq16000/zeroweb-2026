/**
 * Fonte única de verdade do estado do destinatário por clientKey.
 *
 * Usa EXATAMENTE o resolver canônico do produto
 * (`resolvePortfolioWhatsAppContactAsync`: env do cliente → configuração
 * privada `portfolio_client_settings`), nunca uma segunda lógica paralela.
 *
 * Saída: seo-reports/portfolio-destination-state.json — apenas booleanos e
 * classificação. NENHUM número é impresso ou gravado.
 *
 * Uso: bun run scripts/report-portfolio-destination-state.ts
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import {
  portfolioWhatsAppEnvName,
  resolvePortfolioWhatsAppContactAsync,
  resolvePortfolioWhatsAppContact,
  getPortfolioWhatsAppChannelState,
} from "../src/lib/whatsapp-redirect.server";

type Client = { clientKey: string; slug: string; siteName: string };
const clients: Client[] = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));

const rows: Array<{
  clientKey: string;
  slug: string;
  state: "CONFIGURED" | "MISSING" | "INVALID_FORMAT";
  source: "env" | "private_config" | "none";
  envName: string | null;
}> = [];

for (const client of clients) {
  const envName = portfolioWhatsAppEnvName(client.clientKey);
  const envState = getPortfolioWhatsAppChannelState(client.clientKey);
  if (envState === "INVALID") {
    rows.push({ clientKey: client.clientKey, slug: client.slug, state: "INVALID_FORMAT", source: "env", envName });
    continue;
  }
  const fromEnv = resolvePortfolioWhatsAppContact(client.clientKey);
  if (fromEnv) {
    rows.push({ clientKey: client.clientKey, slug: client.slug, state: "CONFIGURED", source: "env", envName });
    continue;
  }
  const resolved = await resolvePortfolioWhatsAppContactAsync(client.clientKey);
  rows.push({
    clientKey: client.clientKey,
    slug: client.slug,
    state: resolved ? "CONFIGURED" : "MISSING",
    source: resolved ? "private_config" : "none",
    envName,
  });
}

const summary = rows.reduce<Record<string, number>>(
  (acc, r) => ({ ...acc, [r.state]: (acc[r.state] ?? 0) + 1 }),
  {},
);

mkdirSync("seo-reports", { recursive: true });
writeFileSync(
  "seo-reports/portfolio-destination-state.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), summary, rows }, null, 2),
);

console.log("PORTFOLIO_DESTINATION_STATE");
console.log(Object.entries(summary).map(([k, v]) => `${k}=${v}`).join(" · "));
for (const r of rows.filter((r) => r.state !== "CONFIGURED")) {
  console.log(`  ${r.state} ${r.clientKey}`);
}
