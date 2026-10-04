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

  test("reserva fetchpriority alto para a imagem hero", () => {
    expect(source).toContain('<PortfolioImage loading="eager" managedField="logoUrl"');
    expect(source).not.toContain('<PortfolioImage priority managedField="logoUrl"');
    expect(source).toContain('<PortfolioImage priority managedField="heroImageUrl"');
  });

  test("mantém também o H1 crítico fora de MotionReveal", () => {
    expect(source).toContain('<h1 className="mt-6 max-w-xl font-serif');
    expect(source).toContain('A rota certa para um ');
    expect(source).not.toContain('<MotionReveal variant="up"><h1');
    expect(source).toContain('Arte de presença digital · não é foto documental');
  });
});
