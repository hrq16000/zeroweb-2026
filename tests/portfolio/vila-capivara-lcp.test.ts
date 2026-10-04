import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/VilaDaCapivaraPage.tsx", "utf8");

describe("Vila da Capivara · LCP do hero", () => {
  test("mantém a imagem hero prioritária fora de motion", () => {
    expect(source).toContain('src="/images/vila-da-capivara/capa.webp"');
    expect(source).toContain('alt="Bolos, brigadeiros e salgados da Vila da Capivara" priority');
    expect(source).not.toContain('initial={{ opacity: 0, y: 20, scale: .98 }}');
  });

  test("preserva motion nas interações não críticas", () => {
    expect(source).toContain("<motion.article");
    expect(source).toContain("<motion.figure");
  });
});
