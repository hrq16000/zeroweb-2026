import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/LjCleaningPage.tsx", "utf8");

describe("L&J Cleaning · ficha factual", () => {
  test("restaura o briefing do item já validado na onda GSC 16", () => {
    expect(source).toContain('id="ficha-do-item"');
    expect(source).toContain("O que precisa de higienização");
    expect(source).toContain("Tamanho ou quantidade");
    expect(source).toContain("Residencial ou automotivo");
    expect(source).toContain("Próximo passo");
  });

  test("preserva a estabilização do H1 crítico", () => {
    expect(source).toContain('<h1 className="max-w-2xl text-4xl font-black');
    expect(source).not.toContain('<MotionReveal as="h1" variant="mask"');
  });
});
