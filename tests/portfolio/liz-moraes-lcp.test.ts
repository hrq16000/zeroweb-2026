import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/LizMoraesNailDesignerPage.tsx", "utf8");

describe("Liz Moraes · LCP crítico", () => {
  test("mantém a mídia hero prioritária fora de motion", () => {
    expect(source).toContain('src="/images/liz-moraes-nail-designer/hero.png"');
    expect(source).toContain("priority width={1080} height={1200}");
    expect(source).not.toContain('initial={{ opacity: 0, y: 18, rotate: 1 }}');
  });

  test("preserva CTA e motions não críticos", () => {
    expect(source).toContain("Agendar meu horário");
    expect(source).toContain("<motion.article");
  });
});
