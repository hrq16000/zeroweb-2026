import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

describe("portfolio admin seed build environment", () => {
  it("regenerates the derived seed in CI and Vercel builds", () => {
    const script = readFileSync("scripts/build-portfolio-admin-seed.mjs", "utf8");
    expect(script).toContain(
      'process.env.VERCEL === "1" || process.env.CI === "true"',
    );
  });
});
