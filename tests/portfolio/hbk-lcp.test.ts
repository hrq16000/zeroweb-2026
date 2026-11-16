import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/HbkIluminacaoLedPage.tsx", "utf8");

describe("HBK Iluminação LED · LCP do hero", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-10 font-display text-4xl font-bold');
    expect(source).toContain('field="heroHeadline"');
    expect(source).not.toContain('<MotionReveal as="h1" variant="scale" intensity="EXPRESSIVE"');
  });

  test("preserva a imagem hero prioritária e motions não críticos", () => {
    expect(source).toContain('src="/images/hbk-iluminacao-led/hero.webp"');
    expect(source).toContain("priority");
    expect(source).toContain("<MotionReveal");
  });
});
