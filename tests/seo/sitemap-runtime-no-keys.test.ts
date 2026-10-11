import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { selectInstitutionalCapitals } from "../../src/lib/sitemap-publication-policy";
import { isSitemapRuntimeResilienceOnly } from "../../scripts/classify-sitemap-only-diff.mjs";

const capitals = [{ slug: "curitiba" }, { slug: "recife" }, { slug: "salvador" }];

describe("publicação de sitemaps sem fonte administrativa", () => {
  test("se a consulta de exclusões falhar, não anuncia capital não confirmada", () => {
    expect(selectInstitutionalCapitals(capitals, new Set(), null)).toEqual([]);
    expect(selectInstitutionalCapitals(capitals, new Set(["curitiba"]), null)).toEqual([
      { slug: "curitiba" },
    ]);
  });

  test("com consulta disponível, exclui somente as explicitamente despublicadas", () => {
    expect(selectInstitutionalCapitals(capitals, new Set(), new Set(["salvador"]))).toEqual([
      { slug: "curitiba" },
      { slug: "recife" },
    ]);
    expect(selectInstitutionalCapitals(capitals, new Set(), new Set())).toHaveLength(3);
  });

  test("não remove os URLs estáveis nem altera os outros 96 portfólios", () => {
    const a = readFileSync("src/routes/sitemap-institucional[.]xml.ts", "utf8");
    const b = readFileSync("src/routes/sitemap-marketplace[.]xml.ts", "utf8");
    expect(a).toContain('path: "/criacao-de-site-institucional"');
    expect(a).toContain("selectInstitutionalCapitals");
    expect(b).toContain("${ORIGIN}/solicitar-orcamento");
    expect(b).toContain("${ORIGIN}/marketplace");
    expect(b).toContain("catch (error)");
  });

  test("classifica como XML apenas o conjunto de arquivos permitido", () => {
    const changed = [
      "src/routes/sitemap-institucional[.]xml.ts",
      "src/routes/sitemap-marketplace[.]xml.ts",
      "src/lib/sitemap-publication-policy.ts",
      "scripts/check-sitemap-runtime-no-keys.mjs",
      "tests/seo/sitemap-runtime-no-keys.test.ts",
      "scripts/classify-sitemap-only-diff.mjs",
      ".github/workflows/portfolio-gates.yml",
    ];
    expect(isSitemapRuntimeResilienceOnly(changed)).toBe(true);
    expect(isSitemapRuntimeResilienceOnly([...changed, "src/routes/portfolio.$slug.tsx"])).toBe(false);
    expect(isSitemapRuntimeResilienceOnly([...changed, "src/lib/whatsapp-redirect.ts"])).toBe(false);
    expect(isSitemapRuntimeResilienceOnly([...changed, "src/styles/index.css"])).toBe(false);
    expect(isSitemapRuntimeResilienceOnly(changed.slice(1))).toBe(false);
  });

  test("CI verifica HTTP efetivo sem service-role key", () => {
    const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
    expect(workflow).toContain("scripts/check-sitemap-runtime-no-keys.mjs");
    expect(workflow).toContain('SUPABASE_SERVICE_ROLE_KEY: ""');
  });
});
