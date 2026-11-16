import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — planner independente em JS puro, exercitado no build Node
import { planNewPortfolioResponsiveMedia } from "../../scripts/lib/portfolio-responsive-media.mjs";

const slug = "cafe-exemplo";
const version4 = { contractVersion: 4 };
const plan = (value: Record<string, unknown> = {}) => ({ slug, ...value });
const manual = (source: string, role: string, widths?: number[]) =>
  ({ source, role, approved: true, ...(widths ? { widths } : {}) });

describe("WebP automatico de novos portfolio-sites", () => {
  test("apenas v4 entra no pipeline — nao altera seis gerenciados e 90 legados", () => {
    expect(planNewPortfolioResponsiveMedia(slug, { contractVersion: 3 }, null)).toEqual([]);
    expect(planNewPortfolioResponsiveMedia(slug, {}, null)).toEqual([]);
    expect(planNewPortfolioResponsiveMedia(slug, version4, plan())).toEqual([]);
  });

  test("hero local aprovado gera base e larguras responsivas previsiveis", () => {
    const targets = planNewPortfolioResponsiveMedia(slug, version4, plan({
      heroMedia: { asset: `public/images/${slug}/hero.jpg`, approved: true },
    }));
    expect(targets).toEqual([{
      slug,
      source: `public/images/${slug}/hero.jpg`,
      output: `public/images/_generated/${slug}/hero.webp`,
      role: "hero",
      widths: [480, 960, 1440],
      lossless: false,
    }]);
  });

  test("logo lossless e imagem de galeria opt-in nao exigem editar gerador", () => {
    const targets = planNewPortfolioResponsiveMedia(slug, version4, plan({
      performanceImages: [
        manual(`/images/${slug}/logo.png`, "logo"),
        manual(`public/images/${slug}/galeria/imagem-1.jpeg`, "content", [360, 720]),
      ],
    }));
    expect(targets).toHaveLength(2);
    expect(targets[0]).toMatchObject({
      output: `public/images/_generated/${slug}/logo.webp`,
      widths: [128, 256],
      lossless: true,
    });
    expect(targets[1]).toMatchObject({
      output: `public/images/_generated/${slug}/imagem-1.webp`,
      widths: [360, 720],
      lossless: false,
    });
  });

  test("nao converte hero remoto, SVG, inapropriado ou sem aprovacao", () => {
    for (const heroMedia of [
      { asset: "https://site-exemplo.com/foto.jpg", approved: true },
      { asset: `public/images/${slug}/marca.svg`, approved: true },
      { asset: `public/images/${slug}/foto.png`, approved: false },
      { asset: `public/images/${slug}/foto.png` },
      { asset: `public/images/${slug}/foto.png`, approved: true, status: "unsuitable" },
    ]) {
      expect(planNewPortfolioResponsiveMedia(slug, version4, plan({ heroMedia }))).toEqual([]);
    }
  });

  test("reprova fontes fora da pasta exclusiva, remotas, SVG e traversal", () => {
    for (const source of [
      "public/images/outro-cliente/logo.jpg",
      `public/images/${slug}/../outro.jpg`,
      `public/images/${slug}//fake.jpg`,
      `public/images/${slug}/foto.svg`,
      "https://exemplo.com/foto.jpg",
    ]) {
      expect(() => planNewPortfolioResponsiveMedia(slug, version4, plan({
        performanceImages: [manual(source, "content")],
      }))).toThrow();
    }
  });

  test("exige aprovacao, papel conhecido, widths seguros e plano do cliente", () => {
    expect(() => planNewPortfolioResponsiveMedia(slug, version4, { slug: "outro" })).toThrow();
    expect(() => planNewPortfolioResponsiveMedia(slug, version4, plan({
      performanceImages: [{ source: `public/images/${slug}/foto.jpg`, role: "hero" }],
    }))).toThrow("aprovacao editorial");
    expect(() => planNewPortfolioResponsiveMedia(slug, version4, plan({
      performanceImages: [manual(`public/images/${slug}/foto.jpg`, "banner")],
    }))).toThrow();
    for (const widths of [[960, 480], [480, 480], [0, 480], [480.5], [3000]]) {
      expect(() => planNewPortfolioResponsiveMedia(slug, version4, plan({
        performanceImages: [manual(`public/images/${slug}/foto.jpg`, "content", widths)],
      }))).toThrow("widths invalidas");
    }
  });

  test("nao colide assets homonimos e evita duplicacao do mesmo hero", () => {
    const hero = `public/images/${slug}/hero.jpg`;
    const targets = planNewPortfolioResponsiveMedia(slug, version4, plan({
      heroMedia: { asset: hero, approved: true },
      performanceImages: [manual(hero, "hero")],
    }));
    expect(targets).toHaveLength(1);
    expect(() => planNewPortfolioResponsiveMedia(slug, version4, plan({
      performanceImages: [
        manual(`public/images/${slug}/foto.jpg`, "content"),
        manual(`public/images/${slug}/foto.png`, "content"),
      ],
    }))).toThrow("mesmo WebP");
  });

  test("scaffold e build ligados ao planner sem modificar os alvos legados", () => {
    const scaffold = readFileSync("scripts/scaffold-portfolio-client.mjs", "utf8");
    const generator = readFileSync("scripts/generate-portfolio-perf-images.mjs", "utf8");
    expect(scaffold).toContain("performanceImages: []");
    expect(generator).toContain("planNewPortfolioResponsiveMedia");
    expect(generator).toContain("refrigeracao-maresia/logo.png");
    expect(generator).toContain("auto-socorro-dentinho/hero-v2.png");
    expect(generator).toContain("moreira-auto-mecanica/google-oficina-coberta.jpg");
    expect(generator).toContain("beforePixels.equals(afterPixels)");
  });
});
