import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = readFileSync("src/components/site/CentroMegaPage.tsx", "utf8");
const storefront = readFileSync("src/config/centro-mega-storefront.ts", "utf8");
const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const funnel = JSON.parse(readFileSync("src/config/portfolio-funnel-context.json", "utf8"));
const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const enrichment = JSON.parse(readFileSync("docs/portfolio/enrichment/centro-mega.json", "utf8"));
const mediaPlan = JSON.parse(readFileSync("docs/portfolio/media-plans/centro-mega.json", "utf8"));

describe("Centro Mega Store — amostra social-commerce evidence-first", () => {
  test("converte apenas produtos sociais com evidência legível", () => {
    expect(storefront).toContain("POCO X5 Pro · 8 GB / 256 GB");
    expect(storefront).toContain("Tênis Dunk Low Pro");
    expect(storefront).toContain('source: "SOCIAL_PUBLIC_POST_MIRROR"');
    expect(storefront).toContain("historicalPrice");
    expect(storefront).toContain("Preço exibido na amostra é histórico");
    expect(enrichment.socialProducts).toHaveLength(2);
    expect(enrichment.socialProducts[0].currentState).toContain("REVALIDATION");
    expect(enrichment.socialProducts[1].currentState).toContain("REVALIDATION");
  });

  test("posts oficiais de Instagram sem caption legível ficam como fonte, não SKU", () => {
    expect(enrichment.instagramOfficialPosts).toHaveLength(6);
    expect(enrichment.researchLedger.instagram.status).toBe(
      "OFFICIAL_PROFILE_AND_POST_URLS_RESOLVED_CAPTIONS_NOT_READABLE",
    );
    for (const href of enrichment.instagramOfficialPosts) {
      expect(storefront).toContain(href);
    }
    expect(page).toContain("usa produtos somente quando a fonte permite identificar o item com segurança");
  });

  test("catálogo complementar usa seller público sem persistir preço atual", () => {
    expect(enrichment.marketplaceProducts.length).toBeGreaterThanOrEqual(7);
    expect(storefront).toContain("MAGALU_SELLER");
    expect(storefront).toContain("Xiaomi Mi Box S");
    expect(storefront).toContain("Controle PlayStation 4");
    expect(storefront).toContain("Lattafa Yara");
    expect(page).toContain("Preço e estoque só são tratados como atuais depois de confirmação");
  });

  test("sacola preserva produtos no funil individual e não expõe contato direto", () => {
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    expect(client?.funnelType).toBe("pedido");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(funnel["centro-mega"]?.intent).toBe("pedido");
    expect(page).toContain('clientKey="centro-mega"');
    expect(page).toContain("order_items");
    expect(page).toContain("skipPrefilledSteps");
    expect(page).not.toContain("wa.me/");
    expect(page).not.toContain("tel:");
    expect(page).not.toContain("mailto:");
    expect(whatsapp.contacts["centro-mega"].whatsapp).toBeNull();
  });

  test("schema e mídia deixam claro que é loja/amostra, sem prova visual inventada", () => {
    expect(route).toContain('"@type": "Store"');
    expect(route).toContain('name: "Centro Mega"');
    expect(mediaPlan.inventory.productVisuals.documentary).toBe(false);
    expect(mediaPlan.inventory.productVisuals.disclosure).toBe("visual de amostra");
    expect(page).toContain("visual de amostra");
  });
});
