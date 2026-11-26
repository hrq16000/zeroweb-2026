import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
describe("LCP shard 0: Thays Camilla e Brechó São Francisco", () => {
  it("usa somente variantes responsivas geradas e separa a prioridade do logo", () => {
    const page = read("src/components/site/ThaysCamillaPage.tsx");
    const gen = read("scripts/generate-portfolio-perf-images.mjs");
    expect(page).toContain('src="/images/_generated/thays-camilla/hero.webp"');
    expect(page).toContain('widths={[480, 720, 960]}');
    expect(page).toContain('widths={[96, 192]}');
    expect(page).toContain('fetchPriority="low"');
    for (const f of ["hero.webp","hero-480.webp","hero-720.webp","hero-960.webp","logo.webp","logo-96.webp","logo-192.webp"]) {
      expect(gen).toContain("public/images/_generated/thays-camilla/" + f);
    }
    expect(page).toContain('managedField="heroImageUrl"');
    expect(page).toContain('managedField="logoUrl"');
  });
  it("preserva o H1 na primeira pintura sem desativar motion global", () => {
    const page = read("src/components/site/BrechoSaoFranciscoPage.tsx");
    const firstPaintStart = page.indexOf("<MotionFirstPaint>");
    const firstPaintEnd = page.indexOf("</MotionFirstPaint>", firstPaintStart);
    const firstPaint =
      firstPaintStart >= 0 && firstPaintEnd > firstPaintStart
        ? page.slice(firstPaintStart, firstPaintEnd)
        : "";
    const reveal = firstPaint.indexOf('<MotionReveal variant="up"');
    const heading = firstPaint.indexOf("<h1");
    const revealEnd = firstPaint.indexOf("</MotionReveal>", heading);
    expect(reveal).toBeGreaterThanOrEqual(0);
    expect(heading).toBeGreaterThan(reveal);
    expect(revealEnd).toBeGreaterThan(heading);
    expect(page).toContain('<MotionScope intensity="SUBTLE">');
  });
});
