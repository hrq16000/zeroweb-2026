import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/EnoelPortasPage.tsx", "utf8");

describe("Enoel Portas · LCP do hero", () => {
  test("mantém a imagem hero prioritária fora de MotionReveal", () => {
    expect(source).toContain('src="/images/enoel-portas/hero.png"');
    expect(source).toContain('priority managedField="heroImageUrl"');
    expect(source).not.toContain('<MotionReveal variant="right" className="relative"><div className="absolute -inset-4');
  });

  test("mantém também o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-6 max-w-2xl');
    expect(source).toContain("Uma boa porta muda a ");
    expect(source).not.toContain('<MotionReveal as="h1" variant="mask"');
    expect(source).toContain('Portas com quem entende');
    expect(source).toContain('border-[var(--enoel-yellow)]/35');
  });
});
