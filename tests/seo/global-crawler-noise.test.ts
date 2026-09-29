import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const hydration = readFileSync("src/lib/hydration-guard.ts", "utf8");
const loader = readFileSync("src/components/site/RouteLoader.tsx", "utf8");

describe("ruído global que afeta auditorias de todas as páginas", () => {
  test("fallback de hidratação não injeta um segundo H1 no HTML-fonte", () => {
    expect(hydration).not.toContain("<h1");
    expect(hydration).not.toContain("</h1>");
    expect(hydration).toContain('role="heading" aria-level="2"');
  });

  test("logo do loader global nunca nasce com alt vazio", () => {
    expect(loader).not.toContain('alt=""');
    expect(loader).toContain('alt="0WEB — carregando página"');
  });
});
