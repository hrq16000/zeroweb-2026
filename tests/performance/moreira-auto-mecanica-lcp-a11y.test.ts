import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";

const src = readFileSync(
  resolve(process.cwd(), "src/components/site/MoreiraAutoMecanicaPage.tsx"),
  "utf8",
);

describe("Moreira Auto Mecânica — LCP e contraste", () => {
  it("mostra o headline SSR sem atraso do motion reveal", () => {
    expect(src).toContain('[data-blueprint="moreira-auto-mecanica"] #inicio-oficina h1[data-motion="reveal"]');
    expect(src).toContain('[data-blueprint="moreira-auto-mecanica"] #inicio-oficina p[data-motion="reveal"]');
    expect(src).toContain("opacity: 1 !important");
    expect(src).toContain("transition: none !important");
  });

  it("usa fundo claro real na seção de processo com paleta clara", () => {
    expect(src).toContain('backgroundColor: "oklch(0.955 0.006 250)"');
    expect(src).toContain('color: "oklch(0.21 0.02 249)"');
    expect(src).toContain('theme: lightSurface');
  });

  it("preserva hero, fonte real das fotos e funil individual", () => {
    expect(src).toContain('clientKey="moreira-auto-mecanica"');
    expect(src).toContain('src: "/images/_generated/moreira-auto-mecanica/hero-1200.webp"');
    expect(src).toContain("MEDIA_ATTRIBUTION");
    expect(src).toContain('/images/_generated/moreira-auto-mecanica/google-fachada-960.webp');
    expect(src).toContain('/images/_generated/moreira-auto-mecanica/google-motor-aberto-1200.webp');
    expect(src).toContain('/images/_generated/moreira-auto-mecanica/google-mecanico-atendimento-800.webp');
    expect(src).toContain('src: "/images/_generated/moreira-auto-mecanica/logo-264.webp"');
  });
});
