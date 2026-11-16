import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/LjCleaningPage.tsx", "utf8");

describe("L&J Cleaning · LCP crítico", () => {
  test("mantém o H1 crítico fora de MotionReveal mask", () => {
    expect(source).toContain('<h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">');
    expect(source).not.toContain('<MotionReveal as="h1" variant="mask"');
  });

  test("preserva mídia e funil", () => {
    expect(source).toContain("<MotionImageReveal");
    expect(source).toContain('clientKey="lj-cleaning"');
    expect(source).toContain("Quero higienizar");
  });
});
