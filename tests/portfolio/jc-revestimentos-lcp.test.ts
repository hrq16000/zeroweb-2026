import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/JcRevestimentosPage.tsx", "utf8");

describe("JC Revestimentos · LCP crítico", () => {
  test("mantém o bloco hero crítico fora de MotionReveal", () => {
    expect(source).toContain('<div className="max-w-2xl pb-6">');
    expect(source).toContain('field="heroHeadline"');
    expect(source).not.toContain('<MotionReveal variant="right" className="max-w-2xl pb-6">');
  });

  test("preserva imagem prioritária e motions não críticos", () => {
    expect(source).toContain('src="/images/jc-revestimentos/hero-v2.png"');
    expect(source).toContain("priority");
    expect(source).toContain("<MotionReveal");
    expect(source).toContain("Ver a linha completa");
  });
});
