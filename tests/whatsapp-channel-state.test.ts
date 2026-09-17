import { describe, expect, it } from "vitest";
// Módulo server-only: o preload de testes cria `window`, então removemos o
// global antes de importar (é exatamente o ambiente real do servidor).
const globalRef = globalThis as { window?: unknown };
const savedWindow = globalRef.window;
delete globalRef.window;
const { getPortfolioWhatsAppChannelState, resolvePortfolioWhatsAppContact } = await import(
  "@/lib/whatsapp-redirect.server"
);
const { resolveVersionedPortfolioWhatsApp, getVersionedPortfolioWhatsAppClientKeys, getPortfolioContactClientKeys } = await import(
  "@/lib/portfolio-whatsapp-registry.server"
);
if (savedWindow !== undefined) globalRef.window = savedWindow;

/**
 * Política SEM COFRE: o WhatsApp do portfolio é dado versionado do próprio
 * clientKey (`src/config/portfolio-whatsapp.json`), nunca secret/env/vault.
 */
describe("estado do canal WhatsApp por projeto (política sem cofre)", () => {
  it("CONFIGURED quando o clientKey tem número versionado", () => {
    const keys = getVersionedPortfolioWhatsAppClientKeys().filter((key) =>
      Boolean(resolveVersionedPortfolioWhatsApp(key)),
    );
    expect(keys.length).toBeGreaterThan(0);
    const key = keys[0]!;
    expect(getPortfolioWhatsAppChannelState(key)).toBe("CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(key)?.digits).toBe(resolveVersionedPortfolioWhatsApp(key));
  });

  it("NOT_CONFIGURED quando o clientKey está sem número (null)", () => {
    const key = getPortfolioContactClientKeys().find(
      (candidate) => !resolveVersionedPortfolioWhatsApp(candidate),
    );
    expect(key).toBeTruthy();
    expect(getPortfolioWhatsAppChannelState(key!)).toBe("NOT_CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(key!)).toBeNull();
  });

  it("nunca resolve canal para chave desconhecida", () => {
    expect(getPortfolioWhatsAppChannelState("projeto-inexistente")).toBe("NOT_CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(null)).toBeNull();
  });

  it("não depende de variáveis de ambiente/secret", () => {
    const key = getVersionedPortfolioWhatsAppClientKeys().find((candidate) =>
      Boolean(resolveVersionedPortfolioWhatsApp(candidate)),
    )!;
    const envLike = `PORTFOLIO_WHATSAPP_${key.toUpperCase().replace(/-/g, "_")}`;
    const saved = process.env[envLike];
    delete process.env[envLike];
    expect(getPortfolioWhatsAppChannelState(key)).toBe("CONFIGURED");
    if (saved !== undefined) process.env[envLike] = saved;
  });

  it("isola números entre clientes distintos", () => {
    const configured = getPortfolioContactClientKeys()
      .map((key) => resolveVersionedPortfolioWhatsApp(key))
      .filter((digits): digits is string => Boolean(digits));
    const renata = resolveVersionedPortfolioWhatsApp("renata-beauty");
    const rBeauty = resolveVersionedPortfolioWhatsApp("r-beauty");
    if (renata && rBeauty) expect(renata).not.toBe(rBeauty);
    expect(configured.every((digits) => digits.length >= 10 && digits.length <= 15)).toBe(true);
  });
});
