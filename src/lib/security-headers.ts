/**
 * Cabeçalhos de segurança aplicados a TODAS as respostas do worker SSR.
 *
 * A CSP é deliberadamente compatível com o app atual (hidratação inline do
 * TanStack Start, Google Tag/Analytics, fontes e imagens remotas). O objetivo
 * desta fase é eliminar misconfiguração (HSTS/nosniff/referrer) e travar
 * `object-src`, `base-uri` e `form-action`, sem quebrar recursos.
 */

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.lovable.app https://*.lovable.dev https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https: wss:",
  "media-src 'self' https: data:",
  "worker-src 'self' blob:",
  "frame-src 'self' https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": CSP_DIRECTIVES,
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "SAMEORIGIN",
  "permissions-policy": "geolocation=(), microphone=(), camera=(), payment=()",
};

/** Injeta os cabeçalhos preservando o stream original da resposta. */
export function applySecurityHeaders(response: Response): Response {
  if (response.status === 499 || !response.body) {
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      if (!headers.has(key)) headers.set(key, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
