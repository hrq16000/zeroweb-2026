import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const routeSource = readFileSync("src/components/site/AdhonepCuritibaPage.tsx", "utf8");
const localHero = "/images/adhonep-curitiba/hero-reuniao-executiva.svg";

describe("ADHONEP Curitiba — recuperação isolada do hero", () => {
  test("usa uma ilustração autoral versionada e existente no deploy", () => {
    expect(existsSync(`public${localHero}`)).toBe(true);
    expect(routeSource).toContain(`src="${localHero}"`);
  });

  test("não renderiza mais o asset Lovable legado confirmado como 404", () => {
    expect(routeSource).not.toContain("adhonepHeroEditorial.url");
    expect(routeSource).not.toContain("adhonep-curitiba-hero-editorial-v2.png.asset.json");
    expect(routeSource).toContain('managedField="heroImageUrl"');
    expect(routeSource).toContain('formSlug="funnel-adhonep-curitiba"');
  });
});
