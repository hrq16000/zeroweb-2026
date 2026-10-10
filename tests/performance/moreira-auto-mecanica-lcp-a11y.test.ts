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
    expect(src).toContain("opacity: 1 !important");
    expect(src).toContain("transition: none !important");
  });

  it("usa fundo claro real na seção de processo com paleta clara", () => {
    expect(src).toContain('backgroundColor: "oklch(0.955 0.006 250)"');
    expect(src).toContain('theme: lightSurface');
  });

  it("preserva hero, fonte real das fotos e funil individual", () => {
    expect(src).toContain('clientKey="moreira-auto-mecanica"');
    expect(src).toContain('src: "/images/moreira-auto-mecanica/google-oficina-coberta.jpg"');
    expect(src).toContain("MEDIA_ATTRIBUTION");
  });
});
