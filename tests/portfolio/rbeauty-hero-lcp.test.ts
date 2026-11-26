import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
const page = readFileSync("src/components/site/RBeautyEditorialView.tsx", "utf8");
describe("RBeauty SSR hero LCP", () => {
  test("renders the first-fold title without hiding it behind entrance animation", () => {
    expect(page).toContain("A alta costura do olhar");
    const hero = page.split("{/* H1 da primeira dobra")[1]?.split("{/* Hero Visual Card */}")[0] ?? "";
    expect(hero).toContain('<div className="lg:col-span-7 space-y-6">');
    expect(hero).not.toContain("<motion.div");
    expect(hero).not.toContain("initial={{ opacity: 0, y: 30 }}");
    expect(page).toContain("BeautyBookingQuiz");
  });
});
