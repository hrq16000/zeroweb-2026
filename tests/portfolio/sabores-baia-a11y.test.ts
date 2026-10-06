import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/SaboresDaBaiaPage.tsx", "utf8");

describe("Sabores da Baía · acessibilidade", () => {
  test("reforça contraste dos elementos apontados pelo Lighthouse", () => {
    expect(source).toContain('text-[#c9eae8]">Centro · Guaratuba — PR');
    expect(source).toContain('text-[#ffe3a3]">Cozinha caiçara');
    expect(source).toContain('bg-[#b94436]');
    expect(source).toContain('text-[#48686a]');
    expect(source).toContain('text-lg font-bold text-[#b94436]');
  });

  test("mantém dt e dd em agrupamento sem wrapper MotionReveal", () => {
    expect(source).toContain('<div key={k} className="rounded-2xl bg-white p-5');
    expect(source).not.toContain('<MotionReveal key={k} variant="right" delay={i * 120}');
  });
});
