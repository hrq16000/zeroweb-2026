import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { recoverGoogleAdsGallery } from "../../src/lib/service-gallery-recovery";

const oldGallery = [
  { path: "/__l5e/assets-v1/bdb41320-73ca-45ee-bbef-8bdc4eed77e5/google-ads-299-capa.png", url: null, alt: "Capa antiga" },
  { path: "/__l5e/assets-v1/52dfe9c7-f306-4a1c-befc-23f196b0c1c0/google-ads-299-horizontal.png", url: null, alt: "Banner horizontal" },
  { path: "/__l5e/assets-v1/c72d8859-f2ab-4ae1-b156-2033d42fd469/google-ads-299-vertical.png", url: null, alt: "Story vertical" },
];
const editorial = { campaigns: "/assets/blog-google-ads.jpg", results: "/assets/blog-roi-trafego.jpg" };

describe("Google Ads — galeria legada sem imagens", () => {
  test("substitui só duas imagens ausentes por arte editorial distinta e não duplica a capa", () => {
    const recovered = recoverGoogleAdsGallery("google-ads-299", oldGallery, editorial);
    expect(recovered.map((x) => x.url)).toEqual([editorial.campaigns, editorial.results]);
    expect(recovered.every((x) => x.alt?.includes("Ilustração editorial"))).toBe(true);
    expect(recovered.every((x) => x.url !== null)).toBe(true);
  });
  test("preserva quaisquer novos uploads do CMS e outros serviços", () => {
    const upload = { path: "uploads/novo.webp", url: "https://storage.example/novo.webp", alt: "Imagem oficial" };
    expect(recoverGoogleAdsGallery("google-ads-299", [upload], editorial)).toEqual([upload]);
    expect(recoverGoogleAdsGallery("outro-servico", oldGallery, editorial)).toEqual(oldGallery);
  });
  test("listagem e página individual compartilham a recuperação pontual", () => {
    const src = readFileSync("src/lib/services-public.functions.ts", "utf8");
    const handlers = src.slice(src.indexOf("export const listServicesPublic"));
    const listHandler = handlers.split("export const getServicePublic")[0];
    const detailHandler = handlers.split("export const getServicePublic")[1];
    expect(listHandler).toContain("recoverGoogleAdsGallery(");
    expect(detailHandler).toContain("recoverGoogleAdsGallery(");
    expect(listHandler).toContain("await signImage(signer, r.og_image_path)");
    expect(detailHandler).toContain("await signImage(signer, r.og_image_path)");
  });

  test("o carregamento público usa os assets locais e mantém o checkout", () => {
    const src = readFileSync("src/lib/services-public.functions.ts", "utf8");
    expect(src).toContain("recoverGoogleAdsGallery(");
    expect(src).toContain("blogGoogleAdsCover");
    expect(src).toContain("blogRoiTrafegoCover");
    const route = readFileSync("src/routes/servicos.$slug.tsx", "utf8");
    expect(route).toContain("<ProductGallery key={slug}");
    expect(route).toContain("<ServicePurchasePanel");
  });
});
