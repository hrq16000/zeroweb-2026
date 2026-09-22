import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { scoreItem } from "../../src/lib/portfolio-search";

const page = readFileSync("src/components/site/CentroMegaPage.tsx", "utf8");
const products = readFileSync("src/config/centro-mega-demo-products.ts", "utf8");
const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const catalog = JSON.parse(readFileSync("src/config/portfolio-catalog.json", "utf8"));
const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const funnelContext = JSON.parse(readFileSync("src/config/portfolio-funnel-context.json", "utf8"));
const discovery = JSON.parse(readFileSync("src/config/portfolio-discovery.json", "utf8"));
const mediaPlan = JSON.parse(readFileSync("docs/portfolio/media-plans/centro-mega.json", "utf8"));
const enrichment = JSON.parse(readFileSync("docs/portfolio/enrichment/centro-mega.json", "utf8"));

describe("Centro Mega — Store Concept", () => {
  test("transforma a landing em vitrine selecionável sem contato direto", () => {
    expect(page).toContain('data-client-slug="centro-mega"');
    expect(page).toContain("Amostra de loja virtual");
    expect(page).toContain("Minha seleção");
    expect(page).toContain('funnelIntent="pedido"');
    expect(page).toContain("orderContext");
    expect(page).toContain("initialAnswers");
    expect(page).toContain("skipPrefilledSteps");
    expect(page).not.toContain("wa.me");
    expect(page).not.toContain("tel:");
    expect(page).not.toContain("mailto:");
  });

  test("produtos sociais reais permanecem históricos e rastreáveis", () => {
    expect(products).toContain("Poco X5 Pro · 8GB / 256GB");
    expect(products).toContain("Tênis Dunk Low Pro");
    expect(products).toContain("Preço exibido na postagem de 25/01/2024");
    expect(products).toContain("confirmar valor e estoque atuais");
    expect(products).toContain("Numeração da postagem variava");
    expect(products).toContain('sourceType: "PUBLIC_SOCIAL_POST"');
    expect(products).not.toContain("estoque disponível");
  });

  test("catálogo complementar do seller é rastreável sem congelar preço atual", () => {
    expect(products).toContain('sourceType: "MARKETPLACE_SELLER"');
    expect(products).toContain("Xiaomi Mi Box S");
    expect(products).toContain("Controle PlayStation 4 · Sony");
    expect(products).toContain("Suporte de celular para Moto & Bike · Renux");
    expect(enrichment.marketplaceProducts).toContain("Xiaomi Mi Box S");
    expect(enrichment.researchLedger.marketplaceSeller.verified).toBe(true);
  });

  test("categorias demonstrativas não são promovidas a SKU com preço", () => {
    expect(products).toContain('name: "Bonés · seleção Outlet"');
    expect(products).toContain('name: "Calçados · oportunidades"');
    expect(products).toContain('sourceType: "OWNER_SUPPLIED_ASSORTMENT"');
    expect(enrichment.ownerSuppliedAssortment).toContain("bonés");
    expect(enrichment.ownerSuppliedAssortment).toContain("calçados");
  });

  test("contrato do portfolio muda para pedido e mantém lead-only seguro", () => {
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    const catalogItem = catalog.find((item: any) => item.slug === "centro-mega");

    expect(client?.ctaMode).toBe("ordering");
    expect(client?.funnelType).toBe("pedido");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(catalogItem?.segment).toBe("comercios");
    expect(funnelContext["centro-mega"].intent).toBe("pedido");
    expect(whatsapp.contacts["centro-mega"].whatsapp).toBeNull();
  });

  test("SEO e discovery refletem loja sem criar Product/Offer de estoque", () => {
    expect(route).toContain('additionalType: "https://schema.org/ElectronicsStore"');
    expect(route).toContain('name: "Centro Mega"');
    expect(route).toContain('"Celulares e smartphones"');
    expect(route).toContain('"Outlet"');
    expect(discovery.projects["centro-mega"].products).toContain("Poco X5 Pro 8GB 256GB");
    expect(discovery.projects["centro-mega"].products).toContain("Tênis Dunk Low Pro");
  });

  test("busca do catálogo encontra produtos reais da Centro Mega", () => {
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    const searchable = {
      slug: "centro-mega",
      clientKey: "centro-mega",
      title: client?.siteName ?? "Centro Mega",
      subtitle: "Loja virtual demo · celulares, acessórios e outlet",
      location: "São José dos Pinhais — PR",
      city: "São José dos Pinhais",
      state: "PR",
      segment: "comercios",
      summary: "Amostra de loja virtual da Centro Mega",
      tags: [] as string[],
    };

    expect(scoreItem("Poco X5 Pro", searchable)).toBeGreaterThan(0);
    expect(scoreItem("Dunk Low Pro", searchable)).toBeGreaterThan(0);
    expect(scoreItem("Xiaomi Mi Box S", searchable)).toBeGreaterThan(0);
  });

  test("mídia ativa da loja não finge fotografia de estoque", () => {
    const activeHero = mediaPlan.inventory.graphicMedia.find(
      (item: any) => item.purpose === "active-store-hero",
    );
    expect(activeHero?.classification).toBe("DOM_CSS_GRAPHIC_COMPOSITION");
    expect(activeHero?.documentary).toBe(false);
    expect(mediaPlan.performance.heavyVideo).toBe(false);
    expect(mediaPlan.performance.newDependencies).toBe(false);
  });
});
