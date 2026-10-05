import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/SalaoDaMarciaPage.tsx", "utf8");

describe("Salão da Marcia · LCP do hero", () => {
  test("mantém o H1 crítico fora de motion", () => {
    expect(source).toContain('<h1 className="mx-auto mt-5 max-w-3xl');
    expect(source).toContain("Seu momento de ");
    expect(source).not.toContain("<motion.h1");
  });

  test("preserva a imagem hero prioritária e o funil", () => {
    expect(source).toContain('src="/images/salao-da-marcia/depilacao.webp"');
    expect(source).toContain("priority");
    expect(source).toContain("Agendar meu horário");
  });
});
