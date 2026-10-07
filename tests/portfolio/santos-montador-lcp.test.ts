import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/SantosMontadorDeMoveisPage.tsx", "utf8");

describe("Santos Montador · LCP crítico", () => {
  test("mantém o H1 e a subheadline críticos fora de motion", () => {
    expect(source).toContain('<h1 className="mt-6 max-w-[12ch] font-display text-5xl font-bold leading-[.92] tracking-[-.055em] sm:text-6xl lg:text-8xl">');
    expect(source).not.toContain("<motion.h1");
    expect(source).toContain('<p className="mt-6 max-w-xl text-base leading-7 text-secondary-foreground/80 sm:text-lg">Montagem de móveis, pintura e reparos residenciais com qualidade, compromisso e preço justo.</p>');
    expect(source).not.toContain('transition={{ delay: 0.15 }} className="mt-6 max-w-xl text-base leading-7 text-secondary-foreground/80 sm:text-lg"');
  });

  test("preserva hero, CTA e motions não críticos", () => {
    expect(source).toContain('src="/images/santos-montador-de-moveis/hero.webp"');
    expect(source).toContain("Solicitar orçamento sem compromisso");
    expect(source).toContain("<motion.p");
    expect(source).toContain("<motion.article");
  });
});
