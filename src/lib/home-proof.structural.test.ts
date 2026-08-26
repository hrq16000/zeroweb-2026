import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("home proof containment", () => {
  test("does not render unverified social-proof sections on the home route", () => {
    const home = read("src/routes/index.tsx");

    for (const component of [
      "@/components/site/Cases",
      "@/components/site/StatsStrip",
      "@/components/site/Testimonials",
      "@/components/site/SocialProofSection",
    ]) {
      expect(home).not.toContain(component);
    }

    expect(home).not.toContain("<SocialProof />");
  });

  test("removes headline metrics that have no audit trail", () => {
    const hero = read("src/components/site/Hero.tsx");
    const trustBar = read("src/components/site/SocialProof.tsx");
    const trustStrip = read("src/components/site/TrustStrip.tsx");

    for (const claim of ["+500", "95%", "312%", "2.8k"]) {
      expect(hero).not.toContain(claim);
    }
    for (const claim of ["4.9/5", "+180 avaliações", "+500 empresas", "20 anos de mercado"]) {
      expect(trustBar).not.toContain(claim);
    }
    expect(trustStrip).not.toContain("100% de uptime");
  });

  test("keeps unverified case pages out of search indexes", () => {
    expect(read("src/routes/cases.index.tsx")).toContain("noindex,follow,noarchive");
    expect(read("src/routes/cases.$slug.tsx")).toContain("noindex,follow,noarchive");
    expect(read("src/routes/sitemap[.]xml.ts")).not.toContain('"sitemap-cases.xml"');
  });
});
