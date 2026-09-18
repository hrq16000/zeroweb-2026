/**
 * FUNNEL_DESTINATION_GATE — projetos do ciclo de vida gerenciado.
 *
 * Fonte operacional única: src/config/portfolio-whatsapp.json.
 * - whatsapp válido => WHATSAPP do próprio clientKey
 * - whatsapp null => LEAD_ONLY intencional (lead + protocolo, sem redirect)
 * - entrada ausente / valor inválido => FAIL
 *
 * O livro-razão de proveniência continua útil como evidência histórica, mas
 * não substitui nem bloqueia o registro operacional versionado.
 * Nenhum secret/env/tabela privada participa desta decisão.
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

function validWhatsApp(raw) {
  if (typeof raw !== "string") return false;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** Cliente sem canal comercial não participa do gate. */
export function expectsOperationalDelivery(client) {
  if (!client) return true;
  return client.contactMode !== "none";
}

/**
 * @returns {{
 *   status: "PASS"|"FAIL"|"NOT_APPLICABLE",
 *   mode: "WHATSAPP"|"LEAD_ONLY"|"NONE"|"INVALID",
 *   blockers: string[],
 *   warnings: string[],
 *   provenanceStatus: string|null
 * }}
 */
export function evaluateFunnelDestination(slug, { clients, ledger, contacts } = {}) {
  const allClients = clients ?? readJson("src/config/portfolio-clients.json", []);
  const book = ledger ?? readJson("src/config/portfolio-funnel-destinations.json", { entries: {} });
  const registry =
    contacts ??
    readJson("src/config/portfolio-whatsapp.json", { contacts: {} }).contacts ??
    {};
  const entries = book.entries ?? {};

  const client = allClients.find((c) => c.slug === slug);
  const clientKey = client?.clientKey ?? slug;
  const blockers = [];
  const warnings = [];

  if (!expectsOperationalDelivery(client)) {
    return {
      status: "NOT_APPLICABLE",
      mode: "NONE",
      blockers,
      warnings,
      provenanceStatus: null,
    };
  }

  if (!Object.prototype.hasOwnProperty.call(registry, clientKey)) {
    blockers.push(
      "FUNNEL_DESTINATION_GATE: clientKey sem entrada em src/config/portfolio-whatsapp.json",
    );
    return {
      status: "FAIL",
      mode: "INVALID",
      blockers,
      warnings,
      provenanceStatus: entries[clientKey]?.status ?? null,
    };
  }

  const whatsapp = registry[clientKey]?.whatsapp;
  const provenance = entries[clientKey] ?? entries[slug] ?? null;
  const provenanceStatus = provenance?.status ?? null;

  if (whatsapp === null) {
    // Estado deliberado: o projeto salva lead/protocolo e não redireciona.
    return {
      status: "PASS",
      mode: "LEAD_ONLY",
      blockers,
      warnings,
      provenanceStatus,
    };
  }

  if (!validWhatsApp(whatsapp)) {
    blockers.push(
      "FUNNEL_DESTINATION_GATE: entrada canônica possui WhatsApp inválido",
    );
    return {
      status: "FAIL",
      mode: "INVALID",
      blockers,
      warnings,
      provenanceStatus,
    };
  }

  if (!provenance) {
    warnings.push(
      "FUNNEL_DESTINATION_GATE: destino operacional versionado sem entrada detalhada no livro-razão de proveniência",
    );
  } else if (provenanceStatus === "CONFLICT") {
    warnings.push(
      "FUNNEL_DESTINATION_GATE: livro-razão histórico ainda registra CONFLICT; o runtime usa exclusivamente o destino canônico versionado",
    );
  }

  return {
    status: "PASS",
    mode: "WHATSAPP",
    blockers,
    warnings,
    provenanceStatus,
  };
}
