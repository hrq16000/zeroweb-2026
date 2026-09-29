import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("aprovação visual criptográfica", () => {
  const approvals = JSON.parse(readFileSync("tests/visual/approved-hashes.json", "utf8"));
  const source = readFileSync("scripts/playwright-visual-regression.mjs", "utf8");
  const item = approvals["ag-electrical-services"];

  test("aceitação exige hash exato de pixels, sem alterar o threshold", () => {
    expect(source).toContain('const threshold = Number(process.env.VISUAL_THRESHOLD ?? 0.02)');
    expect(source).toContain("approvedPixelReference");
    expect(source).toContain('createHash("sha256")');
  });

  test("evidência A&G é rastreável ao run revisado", () => {
    expect(item.evidence.runId).toBe(36505601849);
    expect(item.evidence.artifactId).toBe(11009260617);
    expect(item.evidence.headSha).toBe("f4fb77e3383a0fd44befa01c34b1f7ee2709ca51");
  });

  test("desktop, tablet e mobile usam somente hashes SHA-256 completos", () => {
    expect(Object.keys(item.viewports).sort()).toEqual(["desktop", "mobile", "tablet"]);
    for (const viewport of Object.values(item.viewports) as Array<{ pixelSha256: string; width: number; height: number }>) {
      expect(viewport.pixelSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(viewport.width).toBeGreaterThan(0);
      expect(viewport.height).toBeGreaterThan(0);
    }
  });
});
