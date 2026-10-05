import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/LkAlvenariaPage.tsx", "utf8");

describe("LK Alvenaria · LCP do hero", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-4 max-w-3xl font-display');
    expect(source).toContain('fallback={"Sua obra com contrato e garantia."}');
    expect(source).not.toContain('<MotionReveal as="h1" variant="up" intensity="EXPRESSIVE"');
  });

  test("preserva motions não críticos e a mídia hero", () => {
    expect(source).toContain('<MotionReveal as="li" variant="left"');
    expect(source).toContain('<motion.div initial={{ opacity: 0, y: 16 }}');
    expect(source).toContain('fetchPriority="high"');
    expect(source).toContain('<MotionScope intensity="BALANCED">');
  });
});
