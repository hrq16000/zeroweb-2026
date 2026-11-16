import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
// @ts-expect-error — gate Node em JS puro, importado nos testes Bun
import { checkNewPortfolioImagePerformance } from "../../scripts/lib/portfolio-v4-image-gate.mjs";

const slug = "exemplo-loja";
const path = (name: string) => `public/images/_generated/${slug}/${name}`;
const generated = new Set([
  path("hero.webp"), path("hero-480.webp"), path("hero-960.webp"),
  path("logo.webp"), path("logo-128.webp"), path("logo-256.webp"),
]);
const validate = (code: string, files: Set<string> = generated): string[] =>
  checkNewPortfolioImagePerformance(slug, code, (p: string) => files.has(p));

describe("portfolio v4 — srcset existente e LCP nao ambiguo", () => {
  test("imagem WebP aprovada com variantes reais e prioridade unica", () => {
    const code = '<PortfolioImage src="/images/_generated/exemplo-loja/hero.webp" widths={[480, 960]} priority alt="Loja" />';
    expect(validate(code)).toEqual([]);
  });

  test("falha quando variante ou base referenciada nao existe", () => {
    expect(validate('<PortfolioImage src="/images/_generated/exemplo-loja/hero.webp" widths={[480, 1440]} />')
      .join(" ")).toContain("hero-1440.webp");
    expect(validate('<PortfolioImage src="/images/_generated/exemplo-loja/nao-existe.webp" widths={[480]} />')
      .join(" ")).toContain("imagem base nao encontrada");
  });

  test("nao inventa srcset de outra marca ou URL remota", () => {
    for (const src of [
      "/images/outra-loja/hero.webp",
      "https://cdn.exemplo.org/hero.webp",
      "/images/_generated/exemplo-loja/../outra/hero.webp",
      "/images/_generated/exemplo-loja//hero.webp",
    ]) {
      expect(validate(`<PortfolioImage src="${src}" widths={[480]} />`).join(" "))
        .toContain("src com widths precisa estar");
    }
  });

  test("widths deve ser literal, crescente e validavel", () => {
    const base = "/images/_generated/exemplo-loja/hero.webp";
    for (const attr of ["widths={dinamicas}", "widths={[960, 480]}", "widths={[480, 480]}",
      "widths={[]}", "widths={[0]}", "widths={[480.5]}", "widths={[3000]}"]) {
      expect(validate(`<PortfolioImage src="${base}" ${attr} />`).length).toBeGreaterThan(0);
    }
    expect(validate('<PortfolioImage src={hero} widths={[480]} />')
      .join(" ")).toContain("src literal");
  });

  test("bloqueia overrides capazes de contornar fetchPriority ou srcSet", () => {
    for (const attr of ['srcSet="https://externo.com/a.jpg 480w"', 'fetchPriority="low"', "{...props}"]) {
      expect(validate(`<PortfolioImage src="/images/_generated/exemplo-loja/hero.webp" ${attr} />`)
        .join(" ")).toMatch(/manual|spread/);
    }
  });

  test("no maximo uma imagem candidata LCP, sem contar priority=false", () => {
    expect(validate(
      '<PortfolioImage src="/images/_generated/exemplo-loja/hero.webp" priority />'
      + '<PortfolioImage src="/images/_generated/exemplo-loja/logo.webp" priority={true} />',
    ).join(" ")).toContain("maximo permitido 1");
    expect(validate(
      '<PortfolioImage src="/images/_generated/exemplo-loja/hero.webp" priority={false} />'
      + '<PortfolioImage src="/images/_generated/exemplo-loja/logo.webp" priority />',
    )).toEqual([]);
    expect(validate('<PortfolioImage src="/images/_generated/exemplo-loja/logo.webp" priority={condicao} />')
      .join(" ")).toContain("booleano literal");
  });

  test("img crua eager exige prioridade alta e conta para limite LCP", () => {
    expect(validate('<img src="/images/exemplo-loja/hero.jpg" loading="eager" decoding="async" />')
      .join(" ")).toContain('fetchPriority="high"');
    expect(validate(
      '<img src="/images/exemplo-loja/hero.jpg" loading="eager" fetchPriority="high" />'
      + '<PortfolioImage src="/images/_generated/exemplo-loja/hero.webp" priority />',
    ).join(" ")).toContain("maximo permitido 1");
  });

  test("imagens normais lazy sem widths nao recebem obrigacao artificial", () => {
    expect(validate('<PortfolioImage src={imagemRemota} alt="Foto" />')).toEqual([]);
    expect(validate('<PortfolioImage src="/images/_generated/exemplo-loja/logo.webp" widths={[128, 256]} />')).toEqual([]);
  });

  test("gate ativado no prebuild somente para manifestos v4+", () => {
    const validator = readFileSync("scripts/validate-portfolio-performance.mjs", "utf8");
    const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
    expect(validator).toContain("checkNewPortfolioImagePerformance");
    expect(validator).toContain("Number(manifests[client.slug]?.contractVersion ?? 0) >= 4");
    expect(scripts.prebuild.indexOf("generate:portfolio-perf-images"))
      .toBeLessThan(scripts.prebuild.indexOf("validate-portfolio-performance.mjs"));
  });
});
