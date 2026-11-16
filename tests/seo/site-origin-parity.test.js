import { describe, expect, it } from "vitest";
import {
  compareSiteInventories,
  fetchInventory,
  runSiteOriginAudit,
} from "../../scripts/audit-site-origin-parity.mjs";

const officialBase = "https://0web.com.br";
const vercelBase = "https://zeroweb-2026.vercel.app";
const make = (paths) => paths.map((p) => officialBase + p);
const inventory = (urls, base = officialBase) => ({
  base, urls, children: ["/sitemap-portfolio.xml"], problems: [],
});

describe("paridade domínio 0WEB vs Vercel sem credenciais", () => {
  it("separa 27 capitais e 6 categorias de portfólios estáticos", () => {
    const slugs = Array.from({ length: 96 }, (_, i) => "portfolio-" + i);
    const portfolio = slugs.map((p) => "/portfolio/" + p);
    const caps = Array.from({ length: 27 }, (_, i) =>
      "/criacao-de-site-institucional/capital-" + i);
    const cats = Array.from({ length: 6 }, (_, i) => "/categoria/tipo-" + i);
    const result = compareSiteInventories(
      inventory(make([...portfolio, ...caps, ...cats])),
      inventory(make(portfolio), vercelBase),
      slugs,
    );
    expect(result.official.entries).toBe(129);
    expect(result.vercel.entries).toBe(96);
    expect(result.dynamicCapitals).toHaveLength(27);
    expect(result.dynamicCategories).toHaveLength(6);
    expect(result.portfolioMissingOfficial).toHaveLength(0);
    expect(result.portfolioMissingVercel).toHaveLength(0);
    expect(result.issues).toEqual([]);
  });

  it("sinaliza portfólio ausente de qualquer provedor, sem criar página", () => {
    const result = compareSiteInventories(
      inventory(make(["/portfolio/a", "/portfolio/b"])),
      inventory(make(["/portfolio/a"]), vercelBase),
      ["a", "b"],
    );
    expect(result.portfolioMissingVercel).toEqual(["/portfolio/b"]);
    expect(result.missingStaticInVercel).toEqual(["/portfolio/b"]);
    expect(result.issues.some((s) => s.includes("/portfolio/b"))).toBe(true);
  });

  it("detecta domínio oficial desatualizado mesmo com preview íntegro", () => {
    const result = compareSiteInventories(
      inventory(make(["/portfolio/a"])),
      inventory(make(["/portfolio/a", "/portfolio/b"]), vercelBase),
      ["a", "b"],
    );
    expect(result.portfolioMissingOfficial).toEqual(["/portfolio/b"]);
    expect(result.addedInVercel).toEqual(["/portfolio/b"]);
    expect(result.issues.some((s) => s.includes("domínio público"))).toBe(true);
  });

  it("mantém erro explícito para sitemap não-XML ou 500", async () => {
    const fetcher = async () => new Response("indisponível", {
      status: 500, headers: { "Content-Type": "text/plain" },
    });
    const result = await fetchInventory(officialBase, fetcher);
    expect(result.urls).toEqual([]);
    expect(result.problems.some((p) => p.includes("HTTP 500"))).toBe(true);
  });

  it("consulta cada sitemap filho NO ambiente verificado, mas preserva loc canônico", async () => {
    const child = "/sitemap-portfolio.xml";
    const sitemap = '<?xml version="1.0"?><sitemapindex><sitemap><loc>' +
      officialBase + child + "</loc></sitemap></sitemapindex>";
    const xml = '<?xml version="1.0"?><urlset><url><loc>' +
      officialBase + "/portfolio/exemplo</loc></url></urlset>";
    const requests = [];
    const fetcher = async (url) => {
      requests.push(url);
      return new Response(url.endsWith("/sitemap.xml") ? sitemap : xml, {
        status: 200, headers: { "Content-Type": "application/xml" },
      });
    };
    const result = await fetchInventory(vercelBase, fetcher);
    expect(requests).toEqual([
      vercelBase + "/sitemap.xml",
      vercelBase + child,
    ]);
    expect(result.urls).toEqual([officialBase + "/portfolio/exemplo"]);
    expect(result.problems).toEqual([]);
  });

  it("recusa index com origem externa em vez de seguir URL suspeita", async () => {
    const external = "https://outro.exemplo/sitemap.xml";
    const sitemap = "<sitemapindex><sitemap><loc>" +
      external + "</loc></sitemap></sitemapindex>";
    const seen = [];
    const fetcher = async (url) => {
      seen.push(url);
      return new Response(sitemap, { status: 200,
        headers: { "Content-Type": "application/xml" } });
    };
    const result = await fetchInventory(vercelBase, fetcher);
    expect(seen).toEqual([vercelBase + "/sitemap.xml"]);
    expect(result.problems).toHaveLength(1);
    expect(result.problems[0]).toMatch(/não canônico/);
  });

  it("executa verificação integrada sem chaves com respostas simuladas", async () => {
    const sitemap = "<sitemapindex><sitemap><loc>" + officialBase +
      "/sitemap-portfolio.xml</loc></sitemap></sitemapindex>";
    const child = "<urlset><url><loc>" + officialBase +
      "/portfolio/a</loc></url></urlset>";
    const fetcher = async (url) => new Response(url.endsWith("/sitemap.xml") ?
      sitemap : child, { status: 200, headers: { "Content-Type": "application/xml" } });
    const report = await runSiteOriginAudit({ portfolioSlugs: ["a"], doFetch: fetcher });
    expect(report.official.entries).toBe(1);
    expect(report.vercel.entries).toBe(1);
    expect(report.issues).toEqual([]);
  });

  it("continua avaliando diante de XML com URL inválida", () => {
    const result = compareSiteInventories(
      inventory(make(["/portfolio/a", "/blog/seo"])),
      inventory([officialBase + "/portfolio/a", "not-a-url"], vercelBase),
      ["a"],
    );
    expect(result.issues).not.toEqual([]);
    expect(result.missingStaticInVercel).toContain("/blog/seo");
  });
});
