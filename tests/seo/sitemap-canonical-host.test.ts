import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { isCanonicalSitemapsOnly } from "../../scripts/classify-sitemap-only-diff.mjs";

const paths = [
  "src/routes/sitemap-editorial[.]xml.ts",
  "src/routes/sitemap-skyscraper[.]xml.ts",
];
const after = paths.map((path) => readFileSync(path, "utf8").trimEnd());
const importNew = 'import { resolveBaseUrl } from "@/lib/sitemap-utils";';
const oldBlock = [
  '        const host = request.headers.get("host") ?? "0web.com.br";',
  '        const proto = request.headers.get("x-forwarded-proto") ?? "https";',
  '        const base = ' + String.fromCharCode(96) +
    "$" + "{proto}://$" + "{host}" + String.fromCharCode(96) + ";",
].join("\n");
const newBlock = [
  "        // Publicar somente URLs canônicas, nunca o hostname de preview.",
  "        const base = resolveBaseUrl(request);",
].join("\n");
const before = after.map((code) =>
  code.replace(importNew + "\n", "").replace(newBlock, oldBlock),
);
const files = [
  ...paths,
  "scripts/classify-sitemap-only-diff.mjs",
  "scripts/check-sitemap-canonical-host.mjs",
  "tests/seo/sitemap-canonical-host.test.ts",
  ".github/workflows/portfolio-gates.yml",
];

describe("sitemaps editoriais exclusivamente canonicos", () => {
  test("aceita somente substituicao exata do host, sem mudar URLs", () => {
    expect(isCanonicalSitemapsOnly(files, before[0], after[0], before[1], after[1])).toBe(true);
  });
  test("rejeita alteracao adicional de conteudo ou rota", () => {
    expect(isCanonicalSitemapsOnly(files, before[0], after[0].replace("/blog/mapa", "/blog/novo"), before[1], after[1])).toBe(false);
    expect(isCanonicalSitemapsOnly(files, before[0], after[0], before[1], after[1] + "\nconst hidden = true;")).toBe(false);
  });
  test("rejeita componente, CSS ou funil fora do diff XML", () => {
    expect(isCanonicalSitemapsOnly([...files, "src/components/portfolio/PortfolioStandardShell.tsx"], before[0], after[0], before[1], after[1])).toBe(false);
    expect(isCanonicalSitemapsOnly([...files, "src/lib/whatsapp-redirect.ts"], before[0], after[0], before[1], after[1])).toBe(false);
    expect(isCanonicalSitemapsOnly([...files, "src/styles/index.css"], before[0], after[0], before[1], after[1])).toBe(false);
  });
  test("exige os dois sitemaps originais", () => {
    expect(isCanonicalSitemapsOnly(files.slice(1), before[0], after[0], before[1], after[1])).toBe(false);
  });
  test("CI executa smoke HTTP dos hosts canonicos", () => {
    const workflow = readFileSync(".github/workflows/portfolio-gates.yml", "utf8");
    expect(workflow).toContain("scripts/check-sitemap-canonical-host.mjs");
  });
});
