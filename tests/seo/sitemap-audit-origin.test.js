import { describe, expect, it } from "vitest";
import { resolveSitemapChildFetchUrl } from "../../scripts/sitemap-audit-origin.mjs";

describe("auditoria HTTP de sitemap por ambiente", () => {
  const canonical = "https://0web.com.br/sitemap-portfolio.xml";

  it("não mistura preview localhost e sitemap de produção", () => {
    expect(resolveSitemapChildFetchUrl(canonical, "http://127.0.0.1:18080")).toBe(
      "http://127.0.0.1:18080/sitemap-portfolio.xml",
    );
  });

  it("lê o domínio real quando o alvo da auditoria é produção", () => {
    expect(resolveSitemapChildFetchUrl(canonical, "https://0web.com.br")).toBe(canonical);
  });

  it("preserva caminho, encoding e query da URL filha", () => {
    expect(resolveSitemapChildFetchUrl(
      "https://0web.com.br/sitemap-portfolio.xml?modo=1",
      "https://preview.example.test/",
    )).toBe("https://preview.example.test/sitemap-portfolio.xml?modo=1");
  });

  it("permite sitemap filho já apontando ao host em teste", () => {
    expect(resolveSitemapChildFetchUrl(
      "http://localhost:8080/sitemap-blog.xml",
      "http://localhost:8080",
    )).toBe("http://localhost:8080/sitemap-blog.xml");
  });

  it("rejeita host externo ou credencial na URL filha", () => {
    expect(() => resolveSitemapChildFetchUrl(
      "https://site-externo.invalid/sitemap.xml",
      "http://localhost:8080",
    )).toThrow(/não autorizada/);
    expect(() => resolveSitemapChildFetchUrl(
      "https://usuario:senha@0web.com.br/sitemap.xml",
      "http://localhost:8080",
    )).toThrow(/inválida/);
  });

  it("rejeita URL não HTTP e não acessa ambiente sem validar", () => {
    expect(() => resolveSitemapChildFetchUrl(
      "file:///etc/passwd", "http://localhost:8080",
    )).toThrow(/inválida/);
    expect(() => resolveSitemapChildFetchUrl(
      canonical, "file:///tmp/test",
    )).toThrow(/HTTP/);
  });
});
