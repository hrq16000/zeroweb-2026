import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import catalog from "../../src/config/portfolio-catalog.json";
import {
  HOME_SHOWCASE_SIZE,
  homeProjectPage,
  orderHomeProjects,
  type HomeProject,
} from "../../src/lib/home-project-selection";

describe("institutional home showcase", () => {
  test("SSR order is stable and contains only distinct published, live catalog entries", () => {
    const ordered = orderHomeProjects(catalog as HomeProject[]);
    expect(ordered).toEqual(orderHomeProjects(catalog as HomeProject[]));
    expect(new Set(ordered.map((project) => project.slug)).size).toBe(ordered.length);
    expect(ordered.every((project) => project.status === "published" && project.live !== false)).toBe(true);
    expect(homeProjectPage(ordered, 0)).toHaveLength(HOME_SHOWCASE_SIZE);
    expect(homeProjectPage(ordered, 0).map(({ slug }) => slug)).toEqual([
      "garagem-girassol", "rj-servicos-drywall", "sos-presentes-cosmeticos", "renata-beauty", "dyzpromo", "rm-fretes",
    ]);
    expect(homeProjectPage(ordered, 0).every((project) => !!project.image)).toBe(true);
  });

  test("skips unpublished or duplicate entries, and all live projects remain reachable", () => {
    const ordered = orderHomeProjects([
      { slug: "garagem-girassol", title: "Draft", status: "draft" },
      { slug: "rj-servicos-drywall", title: "Offline", status: "published", live: false },
      { slug: "one", title: "One", status: "published" },
      { slug: "one", title: "Duplicate", status: "published" },
      { slug: "two", title: "Two", status: "published" },
    ]);
    expect(ordered.map(({ slug }) => slug)).toEqual(["one", "two"]);
    const real = orderHomeProjects(catalog as HomeProject[]);
    expect(Array.from({ length: Math.ceil(real.length / HOME_SHOWCASE_SIZE) }, (_, page) => homeProjectPage(real, page)).flat()).toEqual(real);
  });

  test("root stops arming whole section reveals and the gallery has an explicit control", () => {
    const root = readFileSync("src/routes/index.tsx", "utf8");
    const gallery = readFileSync("src/components/site/ProjetosNoAr.tsx", "utf8");
    const css = readFileSync("src/components/site/HomeExperienceV2.css", "utf8");
    expect(root).not.toContain("<MotionChoreo");
    expect(gallery).not.toContain("Math.random");
    expect(gallery).not.toContain("useEffect");
    expect(gallery).toContain('aria-controls="home-project-selection"');
    expect(css).toContain("prefers-reduced-motion: no-preference");
    expect(css).not.toContain("opacity: 0");
  });
});
