import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const src = readFileSync(
  resolve(process.cwd(), "src/components/funnel/FloatingFunnelCTA.tsx"),
  "utf8",
);

describe("FloatingFunnelCTA funnel contract", () => {
  test("resolve o slug pelo useFunnel/ContactIntent central", () => {
    expect(src).toContain('useFunnel(');
    expect(src).toContain('"common"');
    expect(src).toContain('purpose: "diagnosis"');
    expect(src).toContain('funnelSlug={funnelSlug}');
  });

  test("não hardcoda um slug diferente do resolver no modal", () => {
    expect(src).not.toContain('funnelSlug="diagnostico-0web"');
    expect(src).not.toContain('funnelSlug="funnel-common"');
  });

  test("telemetria usa o mesmo slug efetivamente aberto", () => {
    expect(src).toContain('funnel: funnelSlug');
    expect(src).toContain('openFunnel()');
    expect(src).toContain('onClose={closeFunnel}');
  });
});
