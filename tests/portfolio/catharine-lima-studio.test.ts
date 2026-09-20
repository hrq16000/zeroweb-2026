import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const route = readFileSync("src/routes/portfolio.$slug.tsx", "utf8");
const page = readFileSync("src/components/site/CatharineLimaStudioPage.tsx", "utf8");
const whatsapp = JSON.parse(readFileSync("src/config/portfolio-whatsapp.json", "utf8"));
const catalog = JSON.parse(readFileSync("src/config/portfolio-catalog.json", "utf8"));

describe("Catharine Lima Studio", () => {
  test("publica rota e página própria", () => {
    expect(route).toContain('slug === "catharine-lima-studio"');
    expect(route).toContain("<CatharineLimaStudioPage />");
    expect(page).toContain('clientKey="catharine-lima-studio"');
  });

  test("funil usa o destino comprovado informado", () => {
    expect(whatsapp.contacts["catharine-lima-studio"].whatsapp).toBe("5541998884095");
  });

  test("catálogo aponta para assets próprios", () => {
    const item = catalog.find((entry: any) => entry.slug === "catharine-lima-studio");
    expect(item.status).toBe("published");
    expect(item.image).toContain("/images/catharine-lima-studio/");
  });

  test("não inventa preço nem avaliação", () => {
    expect(page).not.toMatch(/R\$\s*\d/);
    expect(page).not.toContain("5,0");
    expect(page).toContain("Valores e disponibilidade são confirmados no atendimento.");
  });
});
