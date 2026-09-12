/**
 * FUNNEL_DESTINATION_GATE — integridade operacional da conversão.
 *
 * Audita todos os projetos públicos `/portfolio/:slug` e verifica se cada um
 * possui destino operacional explicitamente resolvido pela fonte canônica
 * (segredo operacional do projeto → configuração privada do cliente),
 * cruzando com a telemetria já existente para priorizar por risco real.
 *
 * Nunca imprime número completo: apenas máscara, origem e estado.
 * Uso: bun run scripts/audit-funnel-destinations.ts [--json] [--enforce]
 */
import { auditPortfolioDestinations, summarizeDestinations } from "@/lib/portfolio-funnel-destination.server";
import { isDestinationOk } from "@/lib/portfolio-funnel-destination";

const args = new Set(process.argv.slice(2));
const rows = await auditPortfolioDestinations();
const summary = summarizeDestinations(rows);

if (args.has("--json")) {
  console.log(JSON.stringify({ summary, rows }, null, 2));
} else {
  console.log("FUNNEL_DESTINATION_GATE");
  console.log(
    `${summary.total} projetos · ${summary.published} publicados · ` +
      Object.entries(summary.counts)
        .map(([k, v]) => `${k}=${v}`)
        .join(" · "),
  );
  console.log(
    `prioridade: ` +
      Object.entries(summary.priorities)
        .map(([k, v]) => `${k}=${v}`)
        .join(" · ") +
      ` · conclusões sem entrega (90d): ${summary.conversionsAtRisk}`,
  );
  for (const row of rows) {
    if (isDestinationOk(row.destinationStatus) && row.publicState === "published") continue;
    console.log(
      `  ${row.priority.padEnd(3)} ${row.destinationStatus.padEnd(22)} ${row.slug.padEnd(34)} ` +
        `v30=${String(row.telemetry.views30).padStart(5)} funis=${String(row.telemetry.funnelCompletes90).padStart(3)} ` +
        `leads=${String(row.telemetry.leads90).padStart(3)} ${row.destinationSource.padEnd(19)} ${
          row.destinationValueMasked ?? "—"
        }${row.deliveryNotConfigured ? "  DELIVERY_NOT_CONFIGURED" : ""}`,
    );
  }
}

const blocking = rows.filter(
  (r) =>
    r.publicState === "published" &&
    (r.destinationStatus === "UNRESOLVED" || r.destinationStatus === "CONFLICT"),
);

console.error(
  `\nPublicados sem destino operacional (UNRESOLVED/CONFLICT): ${blocking.length}` +
    (blocking.length ? `\n  ${blocking.map((r) => r.slug).join("\n  ")}` : ""),
);

// --enforce só é usado por projetos novos / publicação individual. A auditoria
// global roda em modo relatório para não bloquear o legado já publicado.
process.exit(args.has("--enforce") && blocking.length ? 1 : 0);
