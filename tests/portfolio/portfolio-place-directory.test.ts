import { describe, expect, test } from "bun:test";
import { findPortfolioPlaceHub } from "@/lib/portfolio-places";
import {
  portfolioPlaceDirectoryDescription,
  portfolioPlaceDirectoryGroups,
  portfolioPlaceDirectoryIntro,
  portfolioPlaceDirectoryTitle,
} from "@/lib/portfolio-place-directory";

describe("hubs de guia comercial local", () => {
  const jardim = findPortfolioPlaceHub("jardim-italia-sao-jose-dos-pinhais-pr");

  test("Jardim Itália existe e reúne densidade comercial real", () => {
    expect(jardim).toBeTruthy();
    expect(jardim?.kind).toBe("neighborhood");
    expect(jardim?.projects.length).toBe(6);
    expect(jardim?.projects.some((p) => p.slug === "beto-pasteis")).toBe(true);
    expect(jardim?.projects.some((p) => p.slug === "woodhouse-hamburgueres")).toBe(true);
    expect(jardim?.projects.some((p) => p.slug === "maximos-cabeleireiros")).toBe(true);
  });

  test("categorias são derivadas dos negócios do catálogo", () => {
    if (!jardim) throw new Error("hub ausente");
    const groups = portfolioPlaceDirectoryGroups(jardim);
    expect(groups.find((g) => g.key === "restaurantes")?.projects.length).toBe(4);
    expect(groups.find((g) => g.key === "beleza")?.projects.length).toBe(1);
    expect(groups.find((g) => g.key === "comercios")?.projects.length).toBe(1);
  });

  test("metadata é curta e específica do local", () => {
    if (!jardim) throw new Error("hub ausente");
    const title = portfolioPlaceDirectoryTitle(jardim);
    const description = portfolioPlaceDirectoryDescription(jardim);
    expect(title).toContain("Jardim Itália");
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description).toContain("6 negócios");
    expect(description.length).toBeLessThanOrEqual(160);
  });

  test("intro posiciona o hub como guia comercial sem inventar proximidade", () => {
    if (!jardim) throw new Error("hub ausente");
    const intro = portfolioPlaceDirectoryIntro(jardim);
    expect(intro).toContain("guia comercial");
    expect(intro).toContain("Jardim Itália");
    expect(intro).not.toContain("perto de você");
  });
});
