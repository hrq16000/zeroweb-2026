import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = readFileSync("src/components/site/CentroMegaPage.tsx", "utf8");
const storefront = readFileSync("src/config/centro-mega-storefront.ts", "utf8");
const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const funnel = JSON.parse(readFileSync("src/config/portfolio-funnel-context.json", "utf8"));
const socialLedger = JSON.parse(readFileSync("src/config/portfolio-social-products.json", "utf8"));
const enrichment = JSON.parse(readFileSync("docs/portfolio/enrichment/centro-mega.json", "utf8"));
const mediaPlan = JSON.parse(readFileSync("docs/portfolio/media-plans/centro-mega.json", "utf8"));

describe("Centro Mega Store sample", () => {
  test("transforma a landing em vitrine com busca, filtros e sacola", () => {
    expect(page).toContain("Centro Mega");
    expect(page).toContain("Explorar catálogo");
    expect(page).toContain("Sua sacola");
    expect(page).toContain("setCategory");
    expect(page).toContain("setCartIds");
    expect(page).toContain("MotionParallax");
    expect(page).toContain("MotionOverlay");
  });

  test("carrega a seleção para o funil individual de pedido", () => {
    expect(page).toContain('clientKey="centro-mega"');
    expect(page).toContain('funnelIntent="pedido"');
    expect(page).toContain("order_items");
    expect(page).toContain("skipPrefilledSteps");
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(client?.funnelType).toBe("pedido");
    expect(funnel["centro-mega"].intent).toBe("pedido");
    expect(page).not.toContain("wa.me/");
    expect(page).not.toContain("tel:");
    expect(page).not.toContain("mailto:");
  });

  test("produtos sociais são evidence-first e preço antigo é histórico", () => {
    expect(storefront).toContain("POCO X5 Pro");
    expect(storefront).toContain("Tênis Dunk Low Pro");
    expect(storefront).toContain("historicalPrice");
    const products = socialLedger.clients["centro-mega"].products;
    expect(products.some((item: any) => item.id === "poco-x5-pro-8-256")).toBe(true);
    expect(products.some((item: any) => item.id === "tenis-dunk-low-pro")).toBe(true);
    expect(products[0].historicalCommercialFact.displayPolicy).toBe("HISTORICAL_ONLY");
    expect(enrichment.unverified).toContain("estoque atual de qualquer produto");
  });

  test("Instagram ilegível não vira SKU inventado", () => {
    const unresolved = socialLedger.clients["centro-mega"].unresolvedOfficialPosts;
    expect(unresolved.filter((item: any) => item.network === "instagram").length).toBeGreaterThanOrEqual(6);
    expect(unresolved.every((item: any) => item.action)).toBe(true);
  });

  test("usa schema de loja e mídia de produto não documental", () => {
    expect(route).toContain('isCentroMega');
    expect(route).toContain('"@type": "Store"');
    expect(route).toContain('name: "Centro Mega"');
    expect(mediaPlan.inventory.productVisuals.documentary).toBe(false);
    expect(mediaPlan.inventory.productVisuals.implementation).toContain("CSS");
  });
});
