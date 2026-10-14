import { describe, expect, test } from "bun:test";
import { auditServiceFallbackAssets } from "../../scripts/validate-service-fallback-assets.mjs";
const valid = {
  coverSource: 'import coverGoogle from "@/assets/cover-google-ads.jpg";',
  routeSource: 'const COVERS = { "google-ads.jpg": "/9j/..." };',
  bindings: { basePath: "/api/public/catalog-image", bindings: { "google-ads": "google-ads.jpg" } },
  imageIssue: () => null,
};
describe("integridade das capas automáticas da loja", () => {
  test("aceita assets e manifesto consistentes", () => {
    expect(auditServiceFallbackAssets(valid)).toEqual([]);
  });
  test("bloqueia uma imagem removida do build", () => {
    expect(auditServiceFallbackAssets({ ...valid, imageIssue: () => "arquivo não encontrado" }))
      .toContain("Capa institucional cover-google-ads.jpg: arquivo não encontrado");
  });
  test("bloqueia um vínculo canônico sem bytes", () => {
    expect(auditServiceFallbackAssets({ ...valid, routeSource: "const COVERS = {};" }))
      .toContain("Capa canônica sem bytes na rota: google-ads -> google-ads.jpg");
  });
});
