import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("404-only institutional header and footer stay out of the shared entry imports", () => {
  const root = readFileSync("src/routes/__root.tsx", "utf8");
  expect(root).not.toContain('import { Header } from "../components/site/Header"');
  expect(root).not.toContain('import { Footer } from "../components/site/Footer"');
  expect(root).toContain('import("../components/site/Header")');
  expect(root).toContain('import("../components/site/Footer")');
  expect(root).toContain("<Suspense fallback={null}><Header /></Suspense>");
  expect(root).toContain("<Suspense fallback={null}><Footer /></Suspense>");
});
