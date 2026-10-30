import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const generator = read("scripts/generate-portfolio-perf-images.mjs");
const page = read("src/components/site/AngelMixBrechoPage.tsx");

describe("Angel Mix Brechó — imagem autêntica e LCP responsivo", () => {
  it("preserva a foto original e gera três variantes no prebuild", () => {
    expect(existsSync(resolve("public/images/angel-mix-brecho/capa.png"))).toBe(true);
    expect(generator).toContain('source: "public/images/angel-mix-brecho/capa.png"');
    expect(generator).toContain('output: "public/images/_generated/angel-mix-brecho/capa.webp"');
    for (const width of [480, 960, 1536]) {
      expect(generator).toContain(`output: "public/images/_generated/angel-mix-brecho/capa-${width}.webp"`);
    }
    expect(generator).toContain("small < medium && medium < large");
    expect(generator).toContain("sourcePixels.equals(outputPixels)");
  });

  it("mantém alt, prioridade de LCP, proporções e override do CMS", () => {
    expect(page).toContain('src="/images/_generated/angel-mix-brecho/capa.webp"');
    expect(page).toContain('alt="Angel Mix Brechó"');
    expect(page).toContain("widths={[480, 960, 1536]}");
    expect(page).toContain('sizes="100vw"');
    expect(page).toContain("priority");
    expect(page).toContain('managedField="heroImageUrl"');
    expect(page).toContain('className="h-[78vh] w-full object-cover md:h-[88vh]"');
  });

  it("preserva a identidade editorial e o funil individual", () => {
    expect(page).toContain('clientKey="angel-mix-brecho"');
    expect(page).toContain('formSlug="funnel-angel-mix-brecho"');
    expect(page).toContain('<MotionImageReveal direction="up">');
  });
});
