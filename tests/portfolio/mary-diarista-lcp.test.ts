import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/MaryDiaristaPage.tsx", "utf8");

describe("Mary Diarista · LCP crítico", () => {
  test("mantém a imagem hero prioritária fora de motion", () => {
    expect(source).toContain('src="/images/mary-diarista/servicos.webp"');
    expect(source).toContain("priority");
    expect(source).not.toContain('initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}');
  });

  test("mantém o H1 crítico fora de motion sem tocar nas interações não críticas", () => {
    expect(source).toContain('<h1 className="mt-5 font-display text-5xl font-bold leading-[.98] sm:text-7xl">');
    expect(source).not.toContain("<motion.h1");
    expect(source).toContain('<p className="text-sm font-bold uppercase tracking-[.2em] text-[#c13d7b]">Limpeza residencial · Curitiba e região</p>');
    expect(source).not.toContain('initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold uppercase tracking-[.2em] text-[#c13d7b]"');
    expect(source).toContain("<motion.article");
    expect(source).toContain("Consultar horários");
  });
});
