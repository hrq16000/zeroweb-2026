// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  if (isClientAbortError(error)) return;
  lastCapturedError = { error, at: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

/**
 * Falhas de rede de saída (Supabase/APIs) durante o SSR. O h3 engole o throw
 * original e devolve um 500 genérico ("HTTPError"), então guardamos aqui a URL
 * e o status do request que quebrou para que o log final seja acionável.
 * Nunca guardamos corpo, headers, querystring ou qualquer credencial.
 */
type OutboundFailure = { target: string; detail: string; at: number };
const outboundFailures: OutboundFailure[] = [];
const OUTBOUND_TTL_MS = 10_000;
const OUTBOUND_MAX = 10;

function safeTarget(input: unknown): string {
  try {
    const raw =
      typeof input === "string"
        ? input
        : input instanceof Request
          ? input.url
          : input instanceof URL
            ? input.href
            : String(input);
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "unknown";
  }
}

function recordOutboundFailure(target: string, detail: string): void {
  outboundFailures.push({ target, detail, at: Date.now() });
  if (outboundFailures.length > OUTBOUND_MAX) outboundFailures.shift();
}

export function consumeRecentOutboundFailures(): string[] {
  const cutoff = Date.now() - OUTBOUND_TTL_MS;
  const recent = outboundFailures.filter((f) => f.at >= cutoff);
  outboundFailures.length = 0;
  return recent.map((f) => `${f.target} -> ${f.detail}`);
}

let fetchInstrumented = false;

export function instrumentOutboundFetch(): void {
  if (fetchInstrumented || typeof globalThis.fetch !== "function") return;
  fetchInstrumented = true;
  const originalFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const response = await originalFetch(input as RequestInfo, init);
      if (response.status >= 500) {
        recordOutboundFailure(safeTarget(input), `status ${response.status}`);
      }
      return response;
    } catch (error) {
      if (!isClientAbortError(error)) {
        const message = error instanceof Error ? error.message : String(error);
        recordOutboundFailure(safeTarget(input), message.slice(0, 200));
      }
      throw error;
    }
  }) as typeof globalThis.fetch;
}

instrumentOutboundFetch();

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}

/**
 * `Error: aborted` (node:_http_server abortIncoming) e ECONNRESET acontecem
 * quando o navegador fecha a conexão no meio do streaming SSR — não é um erro
 * da aplicação e não deve virar página de erro nem telemetria.
 */
export function isClientAbortError(error: unknown): boolean {
  if (!error) return false;
  const err = error as { message?: unknown; code?: unknown; name?: unknown; cause?: unknown };
  const code = typeof err.code === "string" ? err.code : "";
  const message = typeof err.message === "string" ? err.message : String(error);
  const directlyAborted = (
    code === "ECONNRESET" ||
    code === "ERR_STREAM_PREMATURE_CLOSE" ||
    err.name === "AbortError" ||
    /^aborted$/i.test(message.trim()) ||
    /aborted|socket hang up|premature close/i.test(message)
  );
  if (directlyAborted) return true;
  return err.cause !== error && isClientAbortError(err.cause);
}
