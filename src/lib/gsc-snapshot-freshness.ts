/**
 * Classifica a atualidade de um snapshot REAL do Search Console.
 * Um snapshot antigo nunca pode ser interpretado como posicao atual
 * ou prova de que a pagina nao aparece nas buscas.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_AGE_DAYS = 7;

export type GscFreshness = {
  stale: boolean;
  ageDays: number | null;
};

export function assessGscSnapshotFreshness(
  refreshedAt: string | null | undefined,
  now = Date.now(),
  maxAgeDays = DEFAULT_MAX_AGE_DAYS,
): GscFreshness {
  if (!refreshedAt) return { stale: true, ageDays: null };
  const refreshedMs = Date.parse(refreshedAt);
  if (!Number.isFinite(refreshedMs) || !Number.isFinite(now)) {
    return { stale: true, ageDays: null };
  }
  const elapsedMs = now - refreshedMs;
  if (elapsedMs < -60 * 60 * 1000) {
    // Timestamp de coleta muito no futuro é suspeito.
    return { stale: true, ageDays: null };
  }
  const ageDays = Math.floor(Math.max(0, elapsedMs) / DAY_MS);
  return {
    stale: elapsedMs > maxAgeDays * DAY_MS,
    ageDays,
  };
}
