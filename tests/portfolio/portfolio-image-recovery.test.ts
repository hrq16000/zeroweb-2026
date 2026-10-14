import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { portfolioImageCandidates } from "../../src/lib/portfolio-image-recovery";

describe("recuperação automática de imagens dos portfólios", () => {
  const source = readFileSync("src/components/portfolio/PortfolioImage.tsx", "utf8");
  test("imagem gerenciada quebrada recua para o arquivo original", () => {
    expect(portfolioImageCandidates({
      authoredSrc: "/images/cliente/hero.webp",
      managedSrc: "https://cms.invalid/hero.webp",
    })).toEqual([{ src: "https://cms.invalid/hero.webp" }, { src: "/images/cliente/hero.webp" }]);
  });
  test("srcset inválido é removido antes de abandonar a imagem", () => {
    expect(portfolioImageCandidates({
      authoredSrc: "/images/cliente/hero.webp",
      managedSrc: "/images/cliente/hero.webp",
      responsiveSrcSet: "/images/cliente/hero-480.webp 480w",
    })).toEqual([
      { src: "/images/cliente/hero.webp", srcSet: "/images/cliente/hero-480.webp 480w" },
      { src: "/images/cliente/hero.webp" },
    ]);
  });
  test("imagem sem caminho não inventa URL nem mantém candidatos inválidos", () => {
    expect(portfolioImageCandidates({ authoredSrc: "", managedSrc: "" })).toEqual([]);
    expect(portfolioImageCandidates({ authoredSrc: "/original.webp", managedSrc: "/original.webp" })).toHaveLength(1);
  });
  test("componente preserva LCP e gera fallback final acessível", () => {
    expect(source).toContain("data-portfolio-image-fallback");
    expect(source).toContain("aria-label=");
    expect(source).toContain("portfolioImageCandidates");
    expect(source).toContain("fetchPriority={priority ?");
    expect(source).toContain("failure.signature === signature");
    expect(source).toContain("onError?.(event)");
  });
});
