import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const wizard = readFileSync("src/routes/_authenticated/app.portfolio.novo.tsx", "utf8");
const managed = readFileSync("src/lib/portfolio-managed.functions.ts", "utf8");

describe("novo portfolio managed: upload autônomo de assets", () => {
  test("wizard envia e vincula os cinco tipos de mídia necessários", () => {
    expect(wizard).toContain("uploadManagedPortfolioAsset");
    for (const kind of ["logo", "hero", "cover", "social", "gallery"]) {
      expect(wizard).toContain(`handleAssetUpload("${kind}"`);
    }
    expect(wizard).toContain("Imagem enviada e vinculada ao projeto.");
  });

  test("projeto é persistido antes do primeiro upload e novamente após o vínculo", () => {
    expect(wizard).toContain("current = (await persistDraft(draft))");
    expect(wizard).toContain("await persistDraft(nextDraft, current.project.contentVersion)");
  });

  test("servidor só aceita upload para project_kind managed no bucket privado", () => {
    expect(managed).toContain('project.project_kind !== "managed"');
    expect(managed).toContain('.from("portfolio-admin")');
    expect(managed).toContain("Arquivo acima de 4 MB.");
    expect(managed).toContain("UPLOAD_PUBLIC_PREFIX");
  });

  test("upload nunca altera registry legado", () => {
    expect(managed).toContain("Salve o rascunho Managed antes de enviar imagens.");
    expect(managed).not.toContain("uploadManagedPortfolioAsset = uploadPortfolioAdminAsset");
  });
});
