import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { classifySitemapInventoryDelta } from "../../scripts/sitemap-inventory-diff-policy.mjs";

const canonical = "https://0web.com.br/servicos/marketplace";
const oldRedirect = "https://0web.com.br/marketplace";

describe("Inventário SEO: redirecionamento canônico comprovado", () => {
  test("reconhece apenas a retirada da origem 301 com destino canônico preservado", () => {
    const route = readFileSync("src/routes/marketplace.tsx", "utf8");
    expect(route).toContain('to: "/servicos/marketplace", statusCode: 301');
    const delta = classifySitemapInventoryDelta([oldRedirect, canonical], [canonical]);
    expect(delta.resolvedRedirects).toEqual(["/marketplace"]);
    expect(delta.missingProtected).toEqual([]);
    expect(delta.hardProblems).toEqual([]);
  });

  test("não aceita retirada do destino canônico", () => {
    const delta = classifySitemapInventoryDelta([oldRedirect, canonical], []);
    expect(delta.resolvedRedirects).toEqual([]);
    expect(delta.missingProtected).toEqual(["/marketplace", "/servicos/marketplace"]);
    expect(delta.hardProblems.length).toBe(2);
  });

  test("continua bloqueando retirada de qualquer outra URL estática", () => {
    const delta = classifySitemapInventoryDelta(
      [oldRedirect, canonical, "https://0web.com.br/contato"],
      [canonical],
    );
    expect(delta.missingProtected).toEqual(["/contato"]);
    expect(delta.hardProblems).toContain("URL estática ausente no preview: /contato");
  });
});
