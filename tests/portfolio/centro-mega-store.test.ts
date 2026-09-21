import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = readFileSync("src/components/site/CentroMegaPage.tsx", "utf8");
const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const catalog = JSON.parse(readFileSync("src/config/portfolio-catalog.json", "utf8"));
const funnel = JSON.parse(readFileSync("src/config/portfolio-funnel-context.json", "utf8"));
const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const destinations = JSON.parse(readFileSync("src/config/portfolio-funnel-destinations.json", "utf8"));
const enrichment = JSON.parse(readFileSync("docs/portfolio/enrichment/centro-mega.json", "utf8"));
const mediaPlan = JSON.parse(readFileSync("docs/portfolio/media-plans/centro-mega.json", "utf8"));

describe("Centro Mega — amostra de loja virtual", () => {
  test("vira vitrine interativa com sacola e carryover", () => {
    expect(page).toContain("Vitrine experimental");
    expect(page).toContain("Sacola de interesse");
    expect(page).toContain("toggleCartProduct");
    expect(page).toContain("order_items");
    expect(page).toContain("skipPrefilledSteps");
    expect(page).toContain('funnelIntent="pedido"');
    expect(page).toContain('clientKey="centro-mega"');
  });

  test("usa produtos reais do feed sem fingir estoque atual", () => {
    expect(page).toContain("Poco X5 Pro · 8GB / 256GB");
    expect(page).toContain("Tênis Dunk Low Pro");
    expect(page).toContain("Preço histórico publicado");
    expect(page).toContain("Valor atual sob consulta");
    expect(page).not.toContain("Em estoque");
    expect(enrichment.products[0].currentStockVerified).toBe(false);
    expect(enrichment.products[0].currentPriceVerified).toBe(false);
  });

  test("mantém funnel-only e restaura destino próprio verificado", () => {
    const client = clients.find((item: any) => item.clientKey === "centro-mega");
    expect(client?.funnelType).toBe("pedido");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(client?.funnelRecipientConfigured).toBe(true);
    expect(funnel["centro-mega"].intent).toBe("pedido");
    expect(whatsapp.contacts["centro-mega"].whatsapp).toBe("5541998589419");
    expect(destinations.entries["centro-mega"].status).toBe("VERIFIED");
    expect(page).not.toContain("wa.me/");
    expect(page).not.toContain("tel:");
    expect(page).not.toContain("mailto:");
  });

  test("mídia gerada/abstrata não é apresentada como foto documental", () => {
    const graphic = mediaPlan.inventory.generatedOrGraphicMedia.find((item: any) =>
      String(item.classification).includes("DOM_CSS"),
    );
    expect(graphic?.documentary).toBe(false);
    expect(page).toContain("amostra de loja");
  });

  test("SEO e catálogo representam a loja, não assistência genérica", () => {
    const item = catalog.find((entry: any) => entry.slug === "centro-mega");
    expect(item?.segment).toBe("comercios");
    expect(item?.tags).toContain("loja-virtual");
    expect(route).toContain('"@type": "Store"');
    expect(route).toContain("MobilePhoneStore");
    expect(route).toContain('name: "Centro Mega"');
  });
});
