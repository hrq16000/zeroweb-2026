import { describe, expect, it } from "vitest";
import { isValidGa4, isValidGtm, SITE } from "./site-config";

describe("analytics id validation", () => {
  it("rejeita os placeholders versionados", () => {
    expect(SITE.GA4_ID).toBe("G-XXXXXXXXXX");
    expect(SITE.GTM_ID).toBe("GTM-XXXXXXX");
    expect(isValidGa4(SITE.GA4_ID)).toBe(false);
    expect(isValidGtm(SITE.GTM_ID)).toBe(false);
  });

  it("rejeita placeholders X mesmo com comprimentos diferentes", () => {
    expect(isValidGa4("G-XXXXXX")).toBe(false);
    expect(isValidGa4("G-XXXXXXXXXXXX")).toBe(false);
    expect(isValidGtm("GTM-XXXXX")).toBe(false);
    expect(isValidGtm("GTM-XXXXXXXXXX")).toBe(false);
  });

  it("mantém IDs reais compatíveis com os formatos aceitos", () => {
    expect(isValidGa4("G-ABC1234567")).toBe(true);
    expect(isValidGtm("GTM-ABC1234")).toBe(true);
  });

  it("rejeita vazio e formatos inválidos", () => {
    expect(isValidGa4("")).toBe(false);
    expect(isValidGa4("UA-123456")).toBe(false);
    expect(isValidGtm(null)).toBe(false);
    expect(isValidGtm("G-ABC1234567")).toBe(false);
  });
});
