import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/CatharineLimaStudioPage.tsx", "utf8");

describe("Catharine Lima Studio · LCP do hero", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-5 max-w-2xl font-display');
    expect(source).toContain("Seu momento de beleza pode começar com um ");
    expect(source).not.toContain('<MotionReveal as="h1" variant="up"');
  });

  test("preserva motion da mídia hero não-LCP", () => {
    expect(source).toContain('<MotionReveal variant="scale" className="relative mx-auto w-full max-w-2xl">');
    expect(source).toContain('src="/images/catharine-lima-studio/hero.svg"');
    expect(source).toContain("priority");
    expect(source).toContain("<MotionScope intensity=\"BALANCED\">");
  });
});
