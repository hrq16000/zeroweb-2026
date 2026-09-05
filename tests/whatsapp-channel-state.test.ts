import { describe, expect, it, afterEach } from "bun:test";
import {
  getPortfolioWhatsAppChannelState,
  portfolioWhatsAppEnvName,
  resolvePortfolioWhatsAppContact,
} from "@/lib/whatsapp-redirect.server";

const KEY = "heloa-gas";
const ENV = portfolioWhatsAppEnvName(KEY)!;
const original = process.env[ENV];

afterEach(() => {
  if (original === undefined) delete process.env[ENV];
  else process.env[ENV] = original;
});

describe("estado do canal WhatsApp por projeto", () => {
  it("CONFIGURED quando o número oficial está cadastrado", () => {
    process.env[ENV] = "5541988253751";
    expect(getPortfolioWhatsAppChannelState(KEY)).toBe("CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(KEY)?.digits).toBe("5541988253751");
  });

  it("NOT_CONFIGURED quando não há número cadastrado", () => {
    delete process.env[ENV];
    expect(getPortfolioWhatsAppChannelState(KEY)).toBe("NOT_CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(KEY)).toBeNull();
  });

  it("INVALID quando o número cadastrado é malformado", () => {
    process.env[ENV] = "123";
    expect(getPortfolioWhatsAppChannelState(KEY)).toBe("INVALID");
    expect(resolvePortfolioWhatsAppContact(KEY)).toBeNull();
  });

  it("nunca resolve canal para chave desconhecida", () => {
    expect(getPortfolioWhatsAppChannelState("projeto-inexistente")).toBe("NOT_CONFIGURED");
    expect(resolvePortfolioWhatsAppContact(null)).toBeNull();
  });

  it("permite cadastrar novos clientes por convenção, sem alterar código", () => {
    expect(portfolioWhatsAppEnvName("rm-fretes")).toBeTruthy();
  });
});
