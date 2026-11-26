import { describe, expect, it } from "bun:test";
import { isPublicPortfolioCatalogItem } from "@/lib/portfolio-public-catalog";

describe("public portfolio catalog", () => {
  it("excludes review-only drafts even when their direct route is live", () => {
    expect(isPublicPortfolioCatalogItem({
      status: "draft",
      live: true,
      indexable: false,
    })).toBe(false);
  });

  it("includes explicitly published and approved entries", () => {
    expect(isPublicPortfolioCatalogItem({
      status: "published",
      live: true,
      indexable: true,
    })).toBe(true);
    expect(isPublicPortfolioCatalogItem({
      status: "approved",
      live: true,
    })).toBe(true);
  });

  it("fails closed for missing status and non-indexable records", () => {
    expect(isPublicPortfolioCatalogItem({ live: true })).toBe(false);
    expect(isPublicPortfolioCatalogItem({
      status: "published",
      live: true,
      indexable: false,
    })).toBe(false);
  });
});
