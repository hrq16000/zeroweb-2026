import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const wizard = readFileSync("src/routes/_authenticated/app.portfolio.novo.tsx", "utf8");
const adminFns = readFileSync("src/lib/portfolio-admin.functions.ts", "utf8");
const adminCore = readFileSync("src/lib/portfolio-admin.ts", "utf8");

describe("assets dos novos portfolios managed", () => {
  test("wizard envia os cinco tipos de imagem pelo fluxo administrativo", () => {
    expect(wizard).toContain("uploadPortfolioAdminAsset");
    for (const kind of ["logo", "hero", "cover", "social", "gallery"]) {
      expect(wizard).toContain(`handleUpload("${kind}"`);
    }
    expect(wizard).toContain("Salve o rascunho uma vez antes de enviar arquivos.");
  });

  test("upload autoriza projeto managed existente sem abrir upload arbitrário", () => {
    expect(adminFns).toContain('z.enum(["logo", "hero", "cover", "social", "gallery"])');
    expect(adminFns).toContain('.eq("slug", data.slug)');
    expect(adminFns).toContain('.eq("project_kind", "managed")');
    expect(adminFns).toContain("Projeto inexistente ou ainda não salvo.");
  });

  test("assets continuam servidos por rota interna permitida", () => {
    expect(adminCore).toContain('UPLOAD_PUBLIC_PREFIX = "/api/public/portfolio-asset"');
    expect(adminCore).toContain("api\\/public\\/portfolio-asset");
  });
});
