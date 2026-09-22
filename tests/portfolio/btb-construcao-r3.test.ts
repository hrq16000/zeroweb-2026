import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const page = readFileSync("src/components/site/BtbConstrucaoPage.tsx", "utf8");
const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const clients = JSON.parse(readFileSync("src/config/portfolio-clients.json", "utf8"));
const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const destinations = JSON.parse(readFileSync("src/config/portfolio-funnel-destinations.json", "utf8"));
const mediaPlan = JSON.parse(readFileSync("docs/portfolio/media-plans/btb-construcao.json", "utf8"));

describe("BTB Construção — evolução R3", () => {
  test("usa Mapa da Reforma com carryover para o funil", () => {
    expect(page).toContain("Mapa da");
    expect(page).toContain("initialAnswers={initialAnswers}");
    expect(page).toContain("skipPrefilledSteps");
    expect(page).toContain('clientKey="btb-construcao"');
    expect(page).toContain('mode="proposal"');
    expect(page).not.toContain("wa.me/");
    expect(page).not.toContain("tel:");
  });

  test("preserva isolamento e destino operacional sem inventar verificação", () => {
    const client = clients.find((item: any) => item.clientKey === "btb-construcao");
    expect(client?.funnelType).toBe("orcamento");
    expect(client?.contactMode).toBe("funnelOnly");
    expect(client?.funnelRecipientConfigured).toBe(true);
    expect(whatsapp.contacts["btb-construcao"].whatsapp).toBe("5541999706634");
    expect(destinations.entries["btb-construcao"].status).toBe("CONFIGURED_UNVERIFIED");
  });

  test("mídia contextual não é promovida como obra real", () => {
    expect(mediaPlan.heroMedia.documentary).toBe(false);
    const flyer = mediaPlan.referenceOnlyAssets.find((item: any) =>
      String(item.file).includes("flyer-reference.png"),
    );
    expect(flyer?.editorialAllowed).toBe(false);
    expect(page.toLowerCase()).toContain("composição editorial");
  });

  test("remove condição comercial não revalidada e usa schema da BTB", () => {
    expect(page.toLowerCase()).not.toContain("parcelamento");
    expect(page.toLowerCase()).not.toContain("desconto");
    expect(route).toContain('"@type": "GeneralContractor"');
    expect(route).toContain('name: "BTB Construção"');
  });
});
