import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const presence = readFileSync("src/routes/servicos.presenca-digital.tsx", "utf8");
const traffic = readFileSync("src/routes/servicos.trafego-pago-local.tsx", "utf8");
const lhci = readFileSync(".lighthouserc.cjs", "utf8");

describe("Capas dos serviços com rotas próprias", () => {
  test("Presença Digital usa JPEG local, incluindo metadados sociais absolutos", () => {
    expect(presence).toContain('import coverLocal from "@/assets/cover-local.jpg"');
    expect(presence).toContain("src={coverLocal}");
    expect(presence).toContain("imageUrl: coverLocal");
    expect(presence).toContain('content: absUrl(coverLocal)');
    expect(presence).not.toContain("presenca-digital-google-capa.png.asset.json");
    expect(presence).not.toContain("cover.url");
  });
  test("Tráfego Pago Local usa JPEG local sem tamanhos OG inventados", () => {
    expect(traffic).toContain('import trafficCover from "@/assets/cover-trafego-pago.jpg"');
    expect(traffic).toContain("src={trafficCover}");
    expect(traffic).toContain("imageUrl: trafficCover");
    expect(traffic).toContain("image: absUrl(trafficCover)");
    expect(traffic).toContain('content: absUrl(trafficCover)');
    expect(traffic).not.toContain("trafego-pago-499-capa.png.asset.json");
    expect(traffic).not.toContain("capa.url");
    expect(traffic).not.toContain('property: "og:image:width"');
  });
  test("Lighthouse cobre as duas rotas atingidas", () => {
    expect(lhci).toContain("servicos/presenca-digital");
    expect(lhci).toContain("servicos/trafego-pago-local");
    expect(lhci).toContain("servicos/google-meu-negocio");
  });
  test("mantém ofertas e os funis existentes nas duas páginas", () => {
    expect(presence).toContain('price: 399');
    expect(traffic).toContain('price: 499');
    expect(presence).toContain("<ServicePurchasePanel");
    expect(traffic).toContain("<ProductActionGate");
  });
});
