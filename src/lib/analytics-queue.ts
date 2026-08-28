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

/** Limite aceito pela policy de INSERT em analytics_events. */
const MAX_EVENT_NAME = 128;

/** Nome usado quando o chamador não informou um evento válido. */
export const FALLBACK_EVENT_NAME = "unknown_event";

/**
 * Normaliza o nome do evento para o formato aceito pela RLS.
 * Nunca retorna vazio: nomes ausentes viram `unknown_event`, para que a
 * telemetria continue auditável em vez de sumir silenciosamente.
 */
export function sanitizeEventName(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  return (raw || FALLBACK_EVENT_NAME).slice(0, MAX_EVENT_NAME);
}

/** Log visível apenas em desenvolvimento — nunca quebra a UX. */
function devWarn(message: string, detail?: unknown) {
  const isDev = typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV);
  if (isDev && typeof console !== "undefined") console.warn(`[analytics] ${message}`, detail);
}

/**
 * Envia uma linha para analytics_events de forma idempotente.
 *
 * Usa INSERT puro (não `upsert`): o PostgREST exige política de UPDATE para
 * `on_conflict`, o que fazia toda gravação anônima ser rejeitada com 42501.
 * A idempotência vem do `id` gerado no cliente — uma chave duplicada (23505)
 * significa que o evento já foi gravado e é tratada como sucesso.
 */
/** Nome do evento sentinela usado para auditar descartes no painel. */
export const DISCARD_EVENT_NAME = "analytics_event_discarded";

/**
 * Registra o descarte como um evento válido e auditável.
 * Sem isso o descarte só existia no console do visitante e o painel
 * não conseguia medir perda de telemetria por rota.
 */
async function reportDiscard(row: Record<string, unknown>, reason: string) {
  const original = (row as { event_name?: unknown }).event_name;
  if (original === DISCARD_EVENT_NAME) return; // nunca reportar o próprio sentinela
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("analytics_events").insert({
      event_name: DISCARD_EVENT_NAME,
      path: typeof row.path === "string" ? row.path : null,
      page: typeof row.page === "string" ? row.page : null,
      session_id: typeof row.session_id === "string" ? row.session_id : null,
      visitor_id: typeof row.visitor_id === "string" ? row.visitor_id : null,
      metadata_json: {
        reason,
        original_event_name: typeof original === "string" ? original.slice(0, 120) : String(original ?? "null"),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  } catch {
    /* descarte é diagnóstico: nunca deve quebrar o fluxo do visitante */
  }
}

async function sendRow(id: string, row: Record<string, unknown>): Promise<boolean> {
  const eventName = sanitizeEventName((row as { event_name?: unknown }).event_name);
  if (!eventName) {
    if (typeof console !== "undefined") {
      console.warn("[analytics] evento descartado: event_name inválido", row);
    }
    void reportDiscard(row, "invalid_event_name");
    return true; // inválido por definição: não reenfileirar
  }
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase
      .from("analytics_events")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({ ...(row as any), id, event_name: eventName });
    if (!error) return true;
    // 23505 = chave duplicada → o evento já está persistido.
    return error.code === "23505";
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
