import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/YourBrutusBurguerPage.tsx", "utf8");

describe("Your Brutus · LCP do hero", () => {
  test("mantém a imagem prioritária fora de MotionReveal", () => {
    expect(source).toContain('managedField="heroImageUrl"');
    expect(source).toContain('src="/images/your-brutus-burguer/hero-og.png"');
    expect(source).toContain('<div className="relative"><PortfolioImage priority managedField="heroImageUrl"');
    expect(source).not.toContain('<MotionReveal variant="scale" className="relative"><PortfolioImage priority managedField="heroImageUrl"');
  });

  test("preserva o motion do H1 não-LCP e a composição", () => {
    expect(source).toContain('<MotionReveal variant="up"><h1');
    expect(source).toContain('Arte de presença digital · não é foto documental');
  });
});
