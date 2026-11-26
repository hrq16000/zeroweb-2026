/**
 * Preload para `bun test`: registra um DOM (happy-dom) globalmente para que
 * testes que dependem de sessionStorage/localStorage/window rodem isolados.
 * Vitest usa a diretiva `// @vitest-environment happy-dom` por arquivo.
 */
import { GlobalRegistrator } from "@happy-dom/global-registrator";

// DOM tests must not replace Bun's networking/abort implementations used by
// real integration tests. Keep the DOM but preserve the native transport.
const transport = {
  fetch: globalThis.fetch,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  AbortController: globalThis.AbortController,
  AbortSignal: globalThis.AbortSignal,
};

if (typeof globalThis.window === "undefined") {
  GlobalRegistrator.register({ url: "https://0web.com.br/" });
  Object.assign(globalThis, transport);
}
