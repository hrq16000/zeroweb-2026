import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

/**
 * Garante que as otimizações de performance de `/portfolio/:slug` continuam
 * aplicadas: code splitting por cliente, Suspense na rota e defaults corretos
 * de lazy loading nas abstrações de imagem/seção.
 *
 * Ver docs/PORTFOLIO_PERFORMANCE.md.
 */
const root = process.cwd();
const read = (p: string) => readFileSync(resolve(root, p), "utf8");

const CLIENT_PAGES = [
  "MaridoDeAluguelPage",
  "EmporioLelecutePage",
  "ParaisoHotDogPage",
  "RMFretesPage",
];

describe("code splitting da rota /portfolio/$slug", () => {
  const route = read("src/routes/portfolio.$slug.tsx");

  for (const page of CLIENT_PAGES) {
    test(`${page} é carregado sob demanda (chunk próprio)`, () => {
      expect(route).toContain(`m.${page}`);
      expect(route).toMatch(new RegExp(`const ${page} = lazy\\(`));
      // Nenhum import estático do componente pesado na rota compartilhada.
      expect(route).not.toMatch(new RegExp(`^import \\{[^}]*${page}[^}]*\\} from`, "m"));
    });
  }

  test("rota envolve os sites em Suspense com fallback", () => {
    expect(route).toContain("<Suspense");
    expect(route).toContain("fallback=");
  });

  test("SEO da rota não depende do componente pesado do cliente", () => {
    expect(route).toContain('from "@/components/site/marido-de-aluguel-faq"');
    expect(existsSync(resolve(root, "src/components/site/marido-de-aluguel-faq.ts"))).toBe(true);
  });
});

describe("abstrações de performance", () => {
  const image = read("src/components/portfolio/PortfolioImage.tsx");
  const lazySection = read("src/components/portfolio/LazySection.tsx");

  test("PortfolioImage é lazy por padrão e eager apenas com priority", () => {
    expect(image).toContain('loading={priority ? "eager" : loading ?? "lazy"}');
    expect(image).toContain('fetchPriority={priority ? "high" : "auto"}');
    expect(image).toContain('decoding="async"');
  });

  test("PortfolioImage só emite srcset quando há variantes declaradas", () => {
    expect(image).toContain("widths && widths.length > 0");
    expect(image).toContain("srcSet={srcSet}");
  });

  test("LazySection monta por IntersectionObserver e reserva altura", () => {
    expect(lazySection).toContain("IntersectionObserver");
    expect(lazySection).toContain("minHeight");
    expect(lazySection).toContain("Suspense");
  });
});

describe("Lolipa: imagem LCP autêntica em variante WebP lossless", () => {
  const generator = read("scripts/generate-portfolio-perf-images.mjs");
  const page = read("src/components/site/LolipaArteEmFestasPage.tsx");

  test("variante é gerada do PNG original, sem baixar nem trocar a imagem", () => {
    expect(existsSync(resolve(root, "public/images/lolipa-arte-em-festas/galeria-temas.png"))).toBe(true);
    expect(generator).toContain('source: "public/images/lolipa-arte-em-festas/galeria-temas.png"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/galeria-temas.webp"');
    expect(generator).toContain("webp({ lossless: true, effort: 6 })");
    expect(generator).toContain("sourcePixels.equals(outputPixels)");
    expect(generator).toContain('source: "public/images/lolipa-arte-em-festas/decoracao-branca.png"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-branca.webp"');
    expect(generator).toContain('source: "public/images/lolipa-arte-em-festas/decoracao-colorida.png"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-colorida.webp"');
    expect(generator).toContain('source: "public/images/lolipa-arte-em-festas/decoracao-infantil.png"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-infantil.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/galeria-temas-480.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/galeria-temas-960.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-branca-480.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-branca-960.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-colorida-480.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-colorida-960.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-infantil-480.webp"');
    expect(generator).toContain('output: "public/images/_generated/lolipa-arte-em-festas/decoracao-infantil-960.webp"');
    expect(generator).toContain("quality: 92");
    expect(generator).toContain("pipeline.webp({ quality: target.quality, effort: 6 })");
    expect(generator).toContain('Lolipa responsive variants must be ordered by size');
    expect(generator).toContain('if (smaller >= larger)');
    // Só as oito variantes da Lolipa: outros projetos também podem usar Q92.
    const lolipaQ92 = [...generator.matchAll(/source: "public\/images\/lolipa-arte-em-festas\/[^"]+",\s*width: (?:480|960),\s*quality: 92,/g)];
    expect(lolipaQ92).toHaveLength(8);
    expect(generator).toContain("pipeline.webp({ lossless: true, effort: 6 })");
  });

  test("primeira imagem do hero usa a variante local sem mudar o funil", () => {
    expect(page).toContain('"/images/_generated/lolipa-arte-em-festas/galeria-temas.webp"');
    expect(page).toContain('"/images/_generated/lolipa-arte-em-festas/decoracao-branca.webp"');
    expect(page).toContain('"/images/_generated/lolipa-arte-em-festas/decoracao-colorida.webp"');
    expect(page).toContain('"/images/_generated/lolipa-arte-em-festas/decoracao-infantil.webp"');
    expect(page).toContain("widths={[480, 960]}");
    expect(page).toContain('(min-width: 640px) 25vw, 50vw');
    expect(page).toContain('managedField: "heroImageUrl"');
    expect(page).toContain('formSlug="funnel-lolipa-arte-em-festas"');
    expect(page).toContain('clientKey="lolipa-arte-em-festas"');
  });

  test("primeiro tile LCP não usa máscara animada; demais imagens mantêm MotionImageReveal", () => {
    expect(page).toContain("return index === 0 ? (");
    expect(page).toContain("const image = (");
    expect(page).toContain('<div key={src} className={`overflow-hidden ${span}`}>');
    expect(page).toContain('<MotionImageReveal key={src}');
    expect(page).toContain("priority={index === 0}");
  });
});

describe("Lolipa: auditor visual resistente à hidratação SSR", () => {
  const audit = read("scripts/verify-lolipa-hero.mjs");
  test("aguarda quatro fotos carregadas e não rola por nós substituíveis", () => {
    expect(audit).toContain("await page.waitForFunction(");
    expect(audit).toContain("Array.from(photos).every(");
    expect(audit).not.toContain("scrollIntoViewIfNeeded(");
    expect(audit).toContain('const clip = await page.evaluate(() => {');
    expect(audit).toContain('await page.screenshot({');
    expect(audit).toContain('clip,');
    expect(audit).not.toContain('page.locator("section#inicio").screenshot({');
    expect(audit).toContain('name: "mobile"');
    expect(audit).toContain('name: "tablet"');
    expect(audit).toContain('name: "desktop"');
  });
});


describe("SOS Presentes: variantes responsivas sem regressão de escopo", () => {
  const generator = read("scripts/generate-portfolio-perf-images.mjs");
  const page = read("src/components/site/SosPresentesCosmeticosPage.tsx");
  const names = ["cesta-lilas", "cestas-feliz-aniversario", "canecas-combo"];

  test("mantém três PNGs autênticos e gera 480/960 sem ampliar nem mascarar incremento de bytes", () => {
    for (const name of names) {
      expect(existsSync(resolve(root, `public/images/sos-presentes-cosmeticos/${name}.png`))).toBe(true);
      for (const width of [480, 960]) {
        expect(generator).toContain(`public/images/_generated/sos-presentes-cosmeticos/${name}-${width}.webp`);
      }
    }
    expect(generator).toContain("if (mobile >= desktop)");
    expect(generator).toContain("if (after >= before)");
    expect(generator).toContain("optimized.width !== original.width");
    expect(generator).toContain("optimized.height !== original.height");
  });

  test("página usa srcset somente com imagens locais reais e preserva override e funil", () => {
    expect(page).toContain("widths={[480, 960]}");
    expect(page).toContain('managedField="heroImageUrl"');
    expect(page).toContain('clientKey="sos-presentes-cosmeticos"');
    expect(page).toContain('recipientName="SOS Presentes & Cosméticos"');
  });
});
