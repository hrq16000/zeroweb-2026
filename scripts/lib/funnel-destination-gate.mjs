/**
 * FUNNEL_DESTINATION_GATE — projetos NOVOS (ciclo de vida gerenciado).
 *
 * Um projeto novo cujo fluxo comercial termina em WhatsApp não pode ficar
 * READY nem ser publicado apenas com protocolo: precisa de destino operacional
 * resolvido (segredo do projeto) E evidência registrada no livro-razão.
 *
 * Legado NÃO é avaliado aqui: continua publicado, com aviso operacional P0.
 * Nada neste módulo lê, imprime ou compara números — apenas presença e estado.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function readJson(rel, fallback) {
  const p = path.resolve(root, rel);
  if (!existsSync(p)) return fallback;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

const OK_STATUSES = new Set(["VERIFIED", "AUTO_RESOLVED", "NOT_APPLICABLE"]);

/** Convenção canônica de novos projetos (sem mapa legado). */
export function canonicalDestinationEnvName(clientKey) {
  if (!clientKey) return null;
  return `PORTFOLIO_WHATSAPP_${String(clientKey).toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
}

/** Um funil que espera entrega operacional termina em WhatsApp do cliente. */
export function expectsOperationalDelivery(client) {
  if (!client) return true;
  if (client.contactMode === "none") return false;
  return client.funnelDelivery !== "protocol_only";
}

/**
 * @returns {{ status: "PASS"|"FAIL"|"NOT_APPLICABLE", blockers: string[], warnings: string[] }}
 */
export function evaluateFunnelDestination(slug, { clients, ledger } = {}) {
  const allClients = clients ?? readJson("src/config/portfolio-clients.json", []);
  const book = ledger ?? readJson("src/config/portfolio-funnel-destinations.json", { entries: {} });
  const entries = book.entries ?? {};

  const client = allClients.find((c) => c.slug === slug);
  const clientKey = client?.clientKey ?? slug;
  const blockers = [];
  const warnings = [];

  if (!expectsOperationalDelivery(client)) {
    return { status: "NOT_APPLICABLE", blockers, warnings };
  }

  const envName = canonicalDestinationEnvName(clientKey);
  const configured = Boolean((process.env[envName] ?? "").replace(/\D/g, "").length >= 10);
  const entry = entries[clientKey] ?? entries[slug] ?? null;
  const status = entry?.status ?? (configured ? "CONFIGURED_UNVERIFIED" : "UNRESOLVED");

  if (!configured) {
    blockers.push(
      `FUNNEL_DESTINATION_GATE: destino operacional ausente (cadastre o segredo ${envName}); o funil terminaria só em protocolo`,
    );
  }
  if (status === "CONFLICT") {
    blockers.push("FUNNEL_DESTINATION_GATE: conflito de destino registrado — exige decisão humana");
  } else if (!OK_STATUSES.has(status)) {
    blockers.push(
      `FUNNEL_DESTINATION_GATE: destino sem evidência verificada (${status}); registre a proveniência em src/config/portfolio-funnel-destinations.json`,
    );
  }
  if (!entry?.evidence?.length && !blockers.length) {
    warnings.push("FUNNEL_DESTINATION_GATE: destino verificado sem evidência detalhada no livro-razão");
  }

  return { status: blockers.length ? "FAIL" : "PASS", blockers, warnings };
}
