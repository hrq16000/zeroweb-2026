import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";

test("Marli não tem botão Compartilhar por cima do CTA principal em tablet/desktop", () => {
  const file = readFileSync("src/components/site/PortfolioShareButton.tsx", "utf8");
  expect(file).toContain('slug === "espaco-marli-nails-guaratuba" && position === "top-right"');
  expect(file).toContain('"right-4 top-20 md:top-36"');
  expect(file).toContain("POSITION[position]");
  expect(file).not.toContain("disabled: true");
});