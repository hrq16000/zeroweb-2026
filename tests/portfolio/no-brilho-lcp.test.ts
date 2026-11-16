import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/NoBrilhoHigienizacaoPage.tsx", "utf8");

describe("No Brilho Higienização · LCP do hero", () => {
  test("mantém o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-5 font-display text-4xl font-bold');
    expect(source).toContain("Mais limpeza.");
    expect(source).not.toContain('<MotionReveal as="h1" variant="up" intensity="EXPRESSIVE"');
  });

  test("preserva mídia prioritária e motions não críticos", () => {
    expect(source).toContain('managedField="heroImageUrl"');
    expect(source).toContain("priority");
    expect(source).toContain('<MotionReveal as="article" variant="scale"');
    expect(source).toContain('<MotionScope intensity="SUBTLE">');
  });
});
