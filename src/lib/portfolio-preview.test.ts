import { describe, expect, it } from "vitest";
import { isPortfolioPreviewMode } from "./portfolio-preview";

describe("isPortfolioPreviewMode", () => {
  it("reconhece preview=1", () => {
    expect(isPortfolioPreviewMode("?preview=1&v=20260826")).toBe(true);
    expect(isPortfolioPreviewMode("preview=1")).toBe(true);
  });

  it("ignora outras queries", () => {
    expect(isPortfolioPreviewMode("?preview=true")).toBe(false);
    expect(isPortfolioPreviewMode("")).toBe(false);
  });
});
