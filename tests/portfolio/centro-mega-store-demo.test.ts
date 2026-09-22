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
const publicMediaStandard = readFileSync("docs/PORTFOLIO_PUBLIC_MEDIA_INGESTION_STANDARD.md", "utf8");
const socialLatestSixStandard = readFileSync("docs/PORTFOLIO_SOCIAL_LATEST_SIX_STANDARD.md", "utf8");

describe("Centro Mega — Store Concept", () => {
  test("transforma a landing em vitrine selecionável sem contato direto", () => {
    expect(page).toContain('data-client-slug="centro-mega"');
    expect(page).toContain("Loja virtual Centro Mega");
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
    expect(products).toContain("Xiaomi Mi True Wireless Earbuds Basic 2");
    expect(products).toContain("Controle PlayStation 4 · Sony");
    expect(products).toContain("Suporte de celular para Moto & Bike · Renux");
    expect(enrichment.marketplaceProducts).toContain("Xiaomi Mi Box S");
    expect(enrichment.researchLedger.marketplaceSeller.verified).toBe(true);
  });

  test("vitrine usa mídia real pública e incorpora o Instagram oficial", () => {
    expect(products).toContain("res.cloudinary.com/dqnwlodjs/image/upload");
    expect(products).toContain("centro-mega-mi-box-s.jpg");
    expect(products).toContain("centro-mega-earbuds-basic-2.jpg");
    expect(products).toContain("centro-mega-suporte-renux-01.jpg");
    expect(products).toContain("centro-mega-poco-x5-pro-reference.jpg");
    expect(products).toContain("centro-mega-dunk-low-pro-reference.png");
    expect(products).toContain("centro-mega-ps4-controller-reference.jpg");
    expect(products).toContain("Foto do catálogo público · Centro Mega no Magalu");
    expect(page).toContain("CENTRO_MEGA_SOCIAL_SOURCES");
    expect(page).toContain("Instagram oficial · mídia real");
    expect(page).not.toContain("<iframe");
    expect(page).not.toContain("embed/");
    expect(products).toContain("centro-mega-instagram-DV8haszkdOy.jpg");
    expect(products).toContain("centro-mega-instagram-DHzjkeutEKu.jpg");
    expect(products).toContain("centro-mega-instagram-DDPCypWxVZZ.jpg");
    expect(products).toContain("centro-mega-instagram-DGjBSGIPSKO.jpg");
    expect(products).toContain("centro-mega-instagram-DCt4G0HxLRu.jpg");
    expect(enrichment.researchLedger.instagram.latestSix.mediaResolved).toBe(5);
    expect(enrichment.researchLedger.instagram.latestSix.renderStrategy).toBe("VERSIONED_REAL_MEDIA_NO_IFRAME");
    expect(products).toContain("30/08/2026");
    expect(products).toContain("Ótimo Domingo");
    expect(products).toContain("LATEST_PUBLIC_SOCIAL_SIGNAL");
    expect(enrichment.researchLedger.instagram.latestRefresh.directProviderStatus).toBe("PROVIDER_BLOCKED");
    expect(enrichment.researchLedger.instagram.latestRefresh.knownOfficialEmbeds.length).toBeGreaterThanOrEqual(5);
    expect((products.match(/imageUrl:/g) ?? []).length).toBe(10);
    expect(products).toContain("centro-mega-bone-category-reference.webp");
    expect(products).toContain("centro-mega-calcados-category-reference.jpg");
    expect(products).toContain("centro-mega-xbox360-battery-reference.jpg");
    expect(products).toContain("centro-mega-philips-aa-2450-reference.jpg");
    expect(mediaPlan.inventory.realProductMedia.length).toBeGreaterThanOrEqual(10);
    expect(
      mediaPlan.inventory.realProductMedia.filter(
        (item: any) => item.classification === "EXTERNAL_PRODUCT_REFERENCE",
      ).length,
    ).toBeGreaterThanOrEqual(5);
    expect(
      mediaPlan.inventory.realProductMedia.filter(
        (item: any) => item.classification === "EXTERNAL_CATEGORY_REFERENCE",
      ).length,
    ).toBeGreaterThanOrEqual(2);
    expect(enrichment.researchLedger.photos.found).toBe(true);
    expect(enrichment.researchLedger.photos.status).toBe("PUBLIC_MEDIA_VITRINE_10_OF_10");
  });

  test("política global impede desistir de mídia após bloqueio de provider", () => {
    expect(publicMediaStandard).toContain("PROVIDER_BLOCKED");
    expect(publicMediaStandard).toContain("não encerra a pesquisa");
    expect(publicMediaStandard).toContain("COMMERCE_PRODUCT_MEDIA_MISSING");
    expect(publicMediaStandard).toContain("Ícone Lucide, SVG genérico ou bloco abstrato não pode substituir");
  });

  test("categorias dinâmicas não são promovidas a SKU com preço", () => {
    expect(products).toContain('name: "Bonés · seleção Outlet"');
    expect(products).toContain('name: "Calçados · oportunidades"');
    expect(products).toContain('sourceType: "OWNER_SUPPLIED_ASSORTMENT"');
    expect(enrichment.ownerSuppliedAssortment).toContain("bonés");
    expect(enrichment.ownerSuppliedAssortment).toContain("calçados");
  });

  test("contrato do portfolio muda para pedido e usa destino isolado", () => {
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    const catalogItem = catalog.find((item: any) => item.slug === "centro-mega");

    expect(client?.ctaMode).toBe("ordering");
    expect(client?.funnelType).toBe("pedido");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(catalogItem?.segment).toBe("comercios");
    expect(catalogItem?.projectType).toBe("catalog");
    expect(catalogItem?.subtitle).toBe("Loja virtual · celulares, acessórios, moda e outlet");
    expect(catalogItem?.badge).toBe("Loja virtual ativa");
    expect(catalogItem?.summary).not.toContain("Amostra");
    expect(catalogItem?.summary).not.toContain("demo");
    expect(funnelContext["centro-mega"].intent).toBe("pedido");
    expect(whatsapp.contacts["centro-mega"].whatsapp).toBe("5541998589419");
  });

  test("SEO e discovery refletem loja sem criar Product/Offer de estoque", () => {
    expect(route).toContain('additionalType: "https://schema.org/ElectronicsStore"');
    expect(route).toContain('name: "Centro Mega"');
    expect(route).toContain("Centro Mega em São José dos Pinhais: loja virtual");
    expect(route).not.toContain("Centro Mega em São José dos Pinhais: amostra de loja virtual");
    expect(route).toContain('"Celulares e smartphones"');
    expect(route).toContain('"Outlet"');
    expect(discovery.projects["centro-mega"].products).toContain("Poco X5 Pro 8GB 256GB");
    expect(discovery.projects["centro-mega"].products).toContain("Tênis Dunk Low Pro");
  });

  test("indexa nomes de produtos reais na busca do portfolio", () => {
    const item = { slug: "centro-mega", title: "Centro Mega", tags: [] };
    expect(scoreItem("Poco X5 Pro", item)).toBeGreaterThan(0);
    expect(scoreItem("Dunk Low Pro", item)).toBeGreaterThan(0);
    expect(scoreItem("Xiaomi Mi Box S", item)).toBeGreaterThan(0);
  });

  test("hero mantém largura intrínseca e não colapsa os cards de produto", () => {
    expect(page).toContain("mega-hero-drift relative mx-auto w-full min-w-0 max-w-2xl");
    expect(page).toContain("relative grid min-w-0 gap-4 sm:grid-cols-2");
    expect(page).toContain("CENTRO_MEGA_DEMO_PRODUCTS.slice(0, 2)");
    expect(page).toContain("Foto pública versionada");
    expect(page).not.toContain('absolute left-0 top-5 w-[68%]');
    expect(page).not.toContain('absolute bottom-2 right-0 w-[68%]');
  });

  test("latest-six social é obrigatório e a Centro Mega registra o sexto post pendente", () => {
    expect(socialLatestSixStandard).toContain("6 publicações públicas mais recentes verificáveis");
    expect(socialLatestSixStandard).toContain("SOCIAL_LATEST_6_INCOMPLETE");
    expect(socialLatestSixStandard).toContain("SOCIAL_EMBED_BROKEN");
    expect(socialLatestSixStandard).toContain("não pode ser a única renderização visual");
    expect(enrichment.researchLedger.instagram.latestSix.requiredCount).toBe(6);
    expect(enrichment.researchLedger.instagram.latestSix.resolvedOfficialPermalinks).toBe(5);
    expect(enrichment.researchLedger.instagram.latestSix.status).toBe("SOCIAL_LATEST_6_INCOMPLETE");
    expect(enrichment.researchLedger.instagram.latestSix.orderStatus).toBe("FIVE_RESOLVED_SORTED_DESCENDING");
    expect(enrichment.researchLedger.instagram.latestSix.orderingMethod).toBe("INSTAGRAM_SHORTCODE_MEDIA_ID_TIMESTAMP");
    expect(enrichment.researchLedger.instagram.latestSix.verifiedChronology.map((item: any) => item.shortcode)).toEqual([
      "DV8haszkdOy",
      "DHzjkeutEKu",
      "DGjBSGIPSKO",
      "DDPCypWxVZZ",
      "DCt4G0HxLRu",
    ]);
    expect(products.indexOf("DV8haszkdOy")).toBeLessThan(products.indexOf("DHzjkeutEKu"));
    expect(products.indexOf("DHzjkeutEKu")).toBeLessThan(products.indexOf("DGjBSGIPSKO"));
    expect(products.indexOf("DGjBSGIPSKO")).toBeLessThan(products.indexOf("DDPCypWxVZZ"));
    expect(products.indexOf("DDPCypWxVZZ")).toBeLessThan(products.indexOf("DCt4G0HxLRu"));
    expect(mediaPlan.socialLatestSixGate).toBe("SOCIAL_LATEST_6_INCOMPLETE");
  });

  test("hero gráfico não substitui mídia real da vitrine", () => {
    const activeHero = mediaPlan.inventory.graphicMedia.find(
      (item: any) => item.purpose === "active-store-hero",
    );
    const fallbackGlyphs = mediaPlan.inventory.graphicMedia.find(
      (item: any) => item.purpose === "fallback-only",
    );
    expect(activeHero?.classification).toBe("DOM_CSS_GRAPHIC_COMPOSITION");
    expect(activeHero?.documentary).toBe(false);
    expect(fallbackGlyphs?.purpose).toBe("fallback-only");
    expect(mediaPlan.inventory.realProductMedia.length).toBeGreaterThanOrEqual(10);
    expect(mediaPlan.performance.heavyVideo).toBe(false);
    expect(mediaPlan.performance.newDependencies).toBe(false);
  });
});
