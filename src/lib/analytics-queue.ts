/**
 * Fila resiliente de eventos analíticos.
 *
 * Garante que impressões/cliques (inclusive do pop-up de captação) não sejam
 * perdidos quando o endpoint analítico estiver indisponível:
 *  - cada evento recebe um `event_id` (uuid) gerado no cliente;
 *  - a gravação usa upsert idempotente por `id` — reenvios não duplicam;
 *  - falhas vão para uma fila em localStorage com retry/backoff exponencial;
 *  - a fila é drenada ao voltar a conexão (`online`), ao reexibir a aba
 *    (`visibilitychange`) e periodicamente enquanto houver pendências.
 *
 * Nenhum dado de contato é armazenado na fila — apenas o payload de evento.
 */

const QUEUE_KEY = "0web:analytics-queue:v1";
const MAX_QUEUE = 200;
const MAX_ATTEMPTS = 8;
const BASE_DELAY_MS = 5_000;
const MAX_DELAY_MS = 5 * 60_000;

export type QueuedEvent = {
  /** uuid usado como PK em analytics_events (dedupe idempotente). */
  id: string;
  row: Record<string, unknown>;
  attempts: number;
  nextAttemptAt: number;
  createdAt: number;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readQueue(): QueuedEvent[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedEvent[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedEvent[]) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-MAX_QUEUE)));
  } catch {
    /* quota/private mode: descartar silenciosamente */
  }
}

export function backoffDelay(attempts: number): number {
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** Math.max(0, attempts - 1));
}

export function enqueueEvent(id: string, row: Record<string, unknown>, attempts = 1) {
  if (attempts > MAX_ATTEMPTS) return;
  const queue = readQueue().filter((e) => e.id !== id);
  queue.push({
    id,
    row,
    attempts,
    nextAttemptAt: Date.now() + backoffDelay(attempts),
    createdAt: Date.now(),
  });
  writeQueue(queue);
  scheduleFlush();
}

let flushing = false;
let timer: number | null = null;
let listenersBound = false;

/** Envia uma linha para analytics_events de forma idempotente. */
async function sendRow(id: string, row: Record<string, unknown>): Promise<boolean> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase
      .from("analytics_events")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({ id, ...(row as any) }, { onConflict: "id", ignoreDuplicates: true });
    return !error;
  } catch {
    return false;
  }
}

export async function flushQueue(): Promise<{ sent: number; pending: number }> {
  if (flushing || !canUseStorage()) return { sent: 0, pending: readQueue().length };
  flushing = true;
  let sent = 0;
  try {
    const now = Date.now();
    const queue = readQueue();
    const remaining: QueuedEvent[] = [];
    for (const item of queue) {
      if (item.nextAttemptAt > now) {
        remaining.push(item);
        continue;
      }
      const ok = await sendRow(item.id, item.row);
      if (ok) {
        sent++;
        continue;
      }
      const attempts = item.attempts + 1;
      if (attempts > MAX_ATTEMPTS) continue; // desiste após o teto de tentativas
      remaining.push({ ...item, attempts, nextAttemptAt: Date.now() + backoffDelay(attempts) });
    }
    writeQueue(remaining);
    if (remaining.length > 0) scheduleFlush();
    return { sent, pending: remaining.length };
  } finally {
    flushing = false;
  }
}

function scheduleFlush() {
  if (typeof window === "undefined") return;
  bindListeners();
  if (timer !== null) return;
  timer = window.setTimeout(() => {
    timer = null;
    void flushQueue();
  }, BASE_DELAY_MS);
}

function bindListeners() {
  if (listenersBound || typeof window === "undefined") return;
  listenersBound = true;
  window.addEventListener("online", () => void flushQueue());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void flushQueue();
  });
}

/** Drena pendências acumuladas em sessões anteriores. */
export function initAnalyticsQueue() {
  if (typeof window === "undefined") return;
  bindListeners();
  if (readQueue().length > 0) void flushQueue();
}

/**
 * Grava um evento com garantia de entrega: tenta enviar agora e,
 * em caso de falha, mantém na fila para reenvio idempotente.
 */
export async function sendOrQueueEvent(row: Record<string, unknown>): Promise<boolean> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const ok = await sendRow(id, row);
  if (!ok) enqueueEvent(id, row);
  return ok;
}
