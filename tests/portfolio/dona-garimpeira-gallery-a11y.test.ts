import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const page = () =>
  readFileSync(resolve(process.cwd(), "src/components/site/DonaGarimpeiraBrechoPage.tsx"), "utf8");

describe("Dona Garimpeira — galeria acessível e sem mídia inventada", () => {
  test("teclado fecha, navega e mantém o foco dentro do lightbox", () => {
    const source = page();
    expect(source).toContain('event.key === "Escape"');
    expect(source).toContain('event.key === "ArrowLeft"');
    expect(source).toContain('event.key === "ArrowRight"');
    expect(source).toContain('event.key === "Tab"');
    expect(source).toContain("closeButtonRef.current?.focus()");
    expect(source).toContain("original?.isConnected");
    expect(source).toContain("original.focus()");
    expect(source).toContain("last.focus()");
    expect(source).toContain("first.focus()");
    expect(source).toContain('aria-modal="true"');
  });

  test("não inventa imagens nem exibe promessa de fotos quando galeria está vazia", () => {
    const source = page();
    expect(source).toContain("const GALLERY_ITEMS: GalleryItem[] = [];");
    expect(source).toContain("A galeria será publicada quando as fotografias oficiais forem verificadas.");
    expect(source).not.toContain("Fotos ilustrativas do acervo");
    expect(source).not.toContain("wa.me/");
  });
});
