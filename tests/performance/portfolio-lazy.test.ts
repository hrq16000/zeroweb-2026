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
    expect(image).toContain('loading={priority ? "eager" : "lazy"}');
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
