import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * HTML browser icon: same-origin resources use local URLs in preview/production.
 * Canonical, JSON-LD, OpenGraph and external favicon URLs remain unchanged.
 */
const route = readFileSync(new URL("../../src/routes/portfolio.$slug.tsx", import.meta.url), "utf8");
const browserIconHref = (href: string) =>
  href.replace(/^https:\/\/0web\.com\.br(?=\/)/i, "");

describe("favicon de portfólios na própria origem", () => {
  it("aplica a conversão somente nas duas entradas rel=icon da rota", () => {
    expect(route).toContain('href: icon.replace(/^https:\\/\\/0web\\.com\\.br(?=\\/)/i, "")');
    expect(route).toContain('href: effIcon.replace(/^https:\\/\\/0web\\.com\\.br(?=\\/)/i, "")');
    expect(route.match(/rel: "icon"/g)).toHaveLength(2);
  });

  it("mantém caminho e parâmetros das imagens reais sem chamar domínio externo", () => {
    expect(browserIconHref("https://0web.com.br/images/dyzpromo/logo-dyz-promo.webp"))
      .toBe("/images/dyzpromo/logo-dyz-promo.webp");
    expect(browserIconHref("HTTPS://0WEB.COM.BR/images/logo.webp?v=1#icon"))
      .toBe("/images/logo.webp?v=1#icon");
  });

  it("não reescreve domínio parecido, URL externa, data URL ou caminho local", () => {
    for (const value of [
      "https://0web.com.br.evil.example/icon.png",
      "https://arildomadeiras.guiapinhais.com.br/favicon.ico",
      "/favicon.svg",
      "data:image/png;base64,abcd",
      "",
    ]) expect(browserIconHref(value)).toBe(value);
  });

  it("preserva canonical e OpenGraph absolutos da rota", () => {
    expect(route).toContain('rel: "canonical", href: url');
    expect(route).toContain('rel: "canonical", href: eff.canonicalUrl');
    expect(route).toContain('property: "og:url", content: eff.canonicalUrl');
  });
});
