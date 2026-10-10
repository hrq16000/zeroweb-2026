/**
 * Protege o recorte histórico de 90 portfolios contra inclusão/substituição
 * disfarçada de "legado". O SHA é o blob Git congelado em 2026-09-22.
 *
 * Qualquer alteração deliberada nesta lista exige PR com evidência e revisão
 * explícita da governança (inclusive atualização consciente deste contrato).
 * Nenhum portfólio novo deve ser classificado como legado.
 */
import { createHash } from "node:crypto";

export const FROZEN_LEGACY_BASELINE_BLOB_SHA =
  "3f44b7b52babe9f006f3d48cf0e16d90e8d7a7d6";

export function checkFrozenLegacyBaseline(content) {
  if (typeof content !== "string" || content.length === 0) {
    return "baseline legado ausente: lista congelada não pode ser removida";
  }
  const gitBlobSha = createHash("sha1")
    .update(`blob ${Buffer.byteLength(content, "utf8")}\0`)
    .update(content, "utf8")
    .digest("hex");

  return gitBlobSha === FROZEN_LEGACY_BASELINE_BLOB_SHA
    ? null
    : "baseline legado alterado: inclusão, substituição ou mudança histórica exige aprovação explícita; novos portfolios devem possuir manifesto gerenciado";
}
