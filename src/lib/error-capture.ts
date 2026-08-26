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
  const err = error as { message?: unknown; code?: unknown; name?: unknown };
  const code = typeof err.code === "string" ? err.code : "";
  const message = typeof err.message === "string" ? err.message : String(error);
  return (
    code === "ECONNRESET" ||
    code === "ERR_STREAM_PREMATURE_CLOSE" ||
    err.name === "AbortError" ||
    /^aborted$/i.test(message.trim()) ||
    /aborted|socket hang up|premature close/i.test(message)
  );
}
