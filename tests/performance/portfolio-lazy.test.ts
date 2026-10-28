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

describe("loader global: não carregar logo 0WEB antes de a navegação ficar pendente", () => {
  const loader = read("src/components/site/RouteLoader.tsx");

  test("monta o logo apenas quando o overlay estiver visível", () => {
    expect(loader).toMatch(/\{visible && \(\s*<BrandLogo\b/);
    expect(loader).toContain("setTimeout(() => setVisible(true), 120)");
    expect(loader).toContain("setVisible(false)");
  });

  test("mantém barra de progresso e acessibilidade do loader", () => {
    expect(loader).toContain('animate-route-progress');
    expect(loader).toContain('aria-live="polite"');
    expect(loader).toContain('aria-label="Carregando página"');
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
  });

  test("primeira imagem do hero usa a variante local sem mudar o funil", () => {
    expect(page).toContain('"/images/_generated/lolipa-arte-em-festas/galeria-temas.webp"');
    expect(page).toContain('managedField: "heroImageUrl"');
    expect(page).toContain('formSlug="funnel-lolipa-arte-em-festas"');
    expect(page).toContain('clientKey="lolipa-arte-em-festas"');
  });
});
