import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/ReparosDoLitoralPage.tsx", "utf8");

describe("Reparos do Litoral · LCP do hero", () => {
  test("mantém o cartão hero crítico fora de MotionReveal", () => {
    expect(source).toContain('<div className="mx-auto max-w-5xl rounded-3xl bg-white p-7 shadow-sm sm:p-10">');
    expect(source).toContain('field="heroHeadline"');
    expect(source).not.toContain('<MotionReveal variant="scale" className="mx-auto max-w-5xl rounded-3xl bg-white p-7 shadow-sm sm:p-10">');
  });

  test("preserva motions não críticos da página", () => {
    expect(source).toContain('<MotionReveal');
    expect(source).toContain('as="li"');
    expect(source).toContain('<MotionScope intensity="SUBTLE">');
  });
});
