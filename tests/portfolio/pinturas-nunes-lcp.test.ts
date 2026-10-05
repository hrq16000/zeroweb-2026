import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/PinturasNunesPage.tsx", "utf8");

describe("Pinturas Nunes · LCP do hero", () => {
  test("mantém o H1 crítico fora de MotionReveal mask", () => {
    expect(source).toContain('<h1 className="mt-6 max-w-3xl');
    expect(source).toContain("Transformando ambientes.");
    expect(source).toContain("Realizando sonhos.");
    expect(source).not.toContain('as="h1"\n                  variant="mask"');
  });

  test("preserva a mídia hero prioritária e motions não críticos", () => {
    expect(source).toContain('src="/images/pinturas-nunes/material-original.png"');
    expect(source).toContain("priority");
    expect(source).toContain('className="relative mx-auto w-full max-w-[620px] border-[10px]');
    expect(source).not.toContain('variant="left"\n                className="relative mx-auto w-full max-w-[620px]');
    expect(source).toContain('<MotionScope intensity="BALANCED">');
  });
});
