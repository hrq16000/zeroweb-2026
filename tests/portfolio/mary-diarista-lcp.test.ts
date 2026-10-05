import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/MaryDiaristaPage.tsx", "utf8");

describe("Mary Diarista · LCP do hero", () => {
  test("mantém a imagem hero prioritária fora de motion", () => {
    expect(source).toContain('src="/images/mary-diarista/servicos.webp"');
    expect(source).toContain("priority");
    expect(source).not.toContain('initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}');
  });

  test("preserva o H1 animado e as interações não críticas", () => {
    expect(source).toContain("<motion.h1");
    expect(source).toContain("<motion.article");
    expect(source).toContain("Consultar horários");
  });
});
