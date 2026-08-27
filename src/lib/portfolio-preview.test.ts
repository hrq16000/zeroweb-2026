import { describe, expect, it } from "vitest";
import { isPortfolioPreviewMode } from "./portfolio-preview";

describe("isPortfolioPreviewMode", () => {
  it("reconhece apenas os parâmetros explícitos da 0WEB", () => {
    expect(isPortfolioPreviewMode("?0web_preview=1&v=20260826")).toBe(true);
    expect(isPortfolioPreviewMode("0web_overlays_off=1")).toBe(true);
  });

  it("não suprime overlays com o parâmetro genérico preview=1", () => {
    expect(isPortfolioPreviewMode("?preview=1&v=20260826")).toBe(false);
    expect(isPortfolioPreviewMode("preview=1")).toBe(false);
  });


  it("ignora outras queries", () => {
    expect(isPortfolioPreviewMode("?preview=true")).toBe(false);
    expect(isPortfolioPreviewMode("")).toBe(false);
  });
});
