import { describe, expect, test } from "bun:test";
import { shouldShowRouteLoaderOverlay } from "@/lib/route-loader-state";

describe("route loader overlay", () => {
  test("does not mount the branded overlay during the initial SSR navigation", () => {
    expect(shouldShowRouteLoaderOverlay(true, false)).toBe(false);
    expect(shouldShowRouteLoaderOverlay(false, false)).toBe(false);
  });

  test("retains the delayed overlay for subsequent client-side navigation", () => {
    expect(shouldShowRouteLoaderOverlay(true, true)).toBe(true);
    expect(shouldShowRouteLoaderOverlay(false, true)).toBe(false);
  });
});
