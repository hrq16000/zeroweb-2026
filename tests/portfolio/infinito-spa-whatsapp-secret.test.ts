import { afterEach, describe, expect, test } from "bun:test";

const envKey = "PORTFOLIO_WHATSAPP_INFINITO_SPA";
const original = process.env[envKey];
const hadWindow = "window" in globalThis;
const originalWindow = (globalThis as typeof globalThis & { window?: unknown }).window;

async function resolver() {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: undefined,
  });
  return import("../../src/lib/portfolio-whatsapp-registry.server");
}

afterEach(() => {
  if (original === undefined) delete process.env[envKey];
  else process.env[envKey] = original;
  if (hadWindow) {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  } else {
    Reflect.deleteProperty(globalThis, "window");
  }
});

describe("Infinito Spa â€” destino privado server-side", () => {
  test("resolve apenas a variÃ¡vel correspondente ao clientKey", async () => {
    process.env[envKey] = "56911112222";
    const { isPortfolioWhatsAppEnvironmentConfigured, resolveVersionedPortfolioWhatsApp } = await resolver();
    expect(resolveVersionedPortfolioWhatsApp("infinito-spa")).toBe("56911112222");
    expect(isPortfolioWhatsAppEnvironmentConfigured("infinito-spa")).toBe(true);
    expect(resolveVersionedPortfolioWhatsApp("outro-cliente")).toBeNull();
  });

  test("sem segredo, mantÃ©m o lead sem destino WhatsApp", async () => {
    delete process.env[envKey];
    const { isPortfolioWhatsAppEnvironmentConfigured, r¶»§q«^