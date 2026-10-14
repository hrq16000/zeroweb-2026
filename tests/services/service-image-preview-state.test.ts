import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { serviceImagePreviewState } from "../../src/lib/service-image-preview-state";

describe("admin /app/servicos-imagens — diagnóstico de prévia CMS", () => {
  test("não confunde caminho de Storage com imagem realmente disponível", () => {
    expect(serviceImagePreviewState(null, null)).toBe("missing-path");
    expect(serviceImagePreviewState("services/signed.jpg", null)).toBe("missing-url");
    expect(serviceImagePreviewState("services/signed.jpg", "https://storage.example/image", true)).toBe("failed-load");
    expect(serviceImagePreviewState("services/signed.jpg", "https://storage.example/image", false)).toBe("ready");
  });

  test("painel detecta erro de carregamento e oferece reenvio sem botão aninhado em link", () => {
    const src = readFileSync("src/routes/_authenticated/app.servicos-imagens.tsx", "utf8");
    expect(src).toContain("onError={() => setLoadFailed(true)}");
    expect(src).toContain('imageStatus === "missing-url"');
    expect(src).toContain("Reenviar capa");
    expect(src).toContain("</Link>\n      <div className=\"px-2 pb-2\">");
    expect(src).toContain("missingPreviewUrls");
  });

  test("upload preserva OG própria, mas atualiza OG que apontava à capa antiga", () => {
    const src = readFileSync("src/routes/_authenticated/app.servicos-imagens.tsx", "utf8");
    expect(src).toContain("row.og_image_path === row.image_path");
    expect(src).toContain("? path\n            : row.og_image_path");
  });
});
