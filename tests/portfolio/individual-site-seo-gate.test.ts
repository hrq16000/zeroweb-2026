import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { portfolioIndividualSiteAudit } from "@/lib/portfolio-individual-site-gate";

const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const sitemap = readFileSync("src/routes/sitemap-portfolio[.]xml.ts", "utf8");
const shell = readFileSync("src/components/portfolio/PortfolioStandardShell.tsx", "utf8");

describe("PORTFOLIO_INDIVIDUAL_SITE_GATE", () => {
  test("todo portfolio publicado passa no mínimo estrutural de site individual", () => {
    const audit = portfolioIndividualSiteAudit();
    expect(audit.totalPublished).toBeGreaterThanOrEqual(95);
    expect(audit.blockers).toEqual([]);
  });

  test("a dívida de mídia é registrada sem retirar páginas válidas do índice", () => {
    const audit = portfolioIndividualSiteAudit();
    expect(Array.isArray(audit.enrichmentDebt)).toBe(true);
    expect(audit.enrichmentDebt.every((item) => item.code === "MISSING_SPECIFIC_MEDIA")).toBe(true);
  });

  test("head universal mantém metadados individuais para estáticos e managed", () => {
    expect(route).toContain('name: "robots"');
    expect(route).toContain('rel: "canonical"');
    expect(route).toContain('property: "og:title"');
    expect(route).toContain('property: "og:description"');
    expect(route).toContain('property: "og:image"');
    expect(route).toContain('name: "twitter:card"');
    expect(route).toContain("portfolioUniversalSeoTitle");
    expect(route).toContain("portfolioUniversalKeywords");
  });

  test("todo site individual participa de sitemap e rede interna universal", () => {
    expect(sitemap).toContain("getApprovedPortfolioSitemapEntries()");
    expect(shell).toContain("<PortfolioSeoNetwork");
  });

  test("o contrato documental permanece conectado ao repositório", () => {
    const standard = readFileSync("docs/PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md", "utf8");
    const agents = readFileSync("AGENTS.md", "utf8");
    expect(standard).toContain("Cada `/portfolio/:slug` é tratado como **um site individual completo do negócio**");
    expect(standard).toContain("PORTFOLIO_INDIVIDUAL_SITE_GATE");
    expect(agents).toContain("PORTFOLIO_INDIVIDUAL_SITE_SEO_STANDARD.md");
  });
});
