import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { isKnownLegacyServiceImage } from "../../src/lib/service-legacy-image-recovery";
import broken from "../../src/config/service-legacy-image-recovery.json";

describe("correção estrita da capa histórica Google Meu Negócio", () => {
  const path = broken["google-meu-negocio"].brokenPath;

  test("somente URL legada comprovadamente quebrada ativa fallback", () => {
    expect(isKnownLegacyServiceImage("google-meu-negocio", path)).toBe(true);
    expect(isKnownLegacyServiceImage("google-meu-negocio", "services/novo-upload.webp")).toBe(false);
    expect(isKnownLegacyServiceImage("outro-servico", path)).toBe(false);
    expect(isKnownLegacyServiceImage("google-meu-negocio", null)).toBe(false);
  });

  test("capa principal, OG e vitrine descartam exclusivamente a URL legada", () => {
    const src = readFileSync("src/lib/services-public.functions.ts", "utf8");
    expect(src).toContain("image_path: isKnownLegacyServiceImage(row.slug, row.image_path) ? null : row.image_path");
    expect(src).toContain("og_image_path: isKnownLegacyServiceImage(row.slug, row.og_image_path) ? null : row.og_image_path");
    expect(src).toContain('"google-meu-negocio": coverLocal');
  });

  test("navegação e validador continuam usando fallback seguro com aviso explícito", () => {
    const nav = readFileSync("src/lib/services-nav.functions.ts", "utf8");
    const check = readFileSync("scripts/validate-catalog-images.mjs", "utf8");
    expect(nav).toContain("isKnownLegacyServiceImage(r.slug, r.image_path)");
    expect(check).toContain("runtimeHasRecovery");
    expect(check).toContain("recoveredLegacy.push(s.slug)");
    expect(check).toContain("broken.push({ slug: s.slug, url: target.url");
  });
});
