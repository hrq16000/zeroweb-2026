import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("shared funnel shell keeps its runner deferred and preserves tenant context", () => {
  const shell = readFileSync("src/components/funnel/FunnelModalWrapper.tsx", "utf8");
  expect(shell).toContain('lazy(() => import("./FunnelRunner")');
  expect(shell).not.toContain('import { FunnelRunner } from "./FunnelRunner"');
  expect(shell).toContain("!loading && !error && funnel && !completed");
  expect(shell).toContain("<Suspense fallback=");
  expect(shell).toContain('role="status"');
  expect(shell).toContain("clientKey={intent?.companySlug}");
  expect(shell).toContain("context={context}");
  expect(shell).toContain("prefill={prefill}");
  expect(shell).toContain("onComplete={() => setCompleted(true)}");
});
