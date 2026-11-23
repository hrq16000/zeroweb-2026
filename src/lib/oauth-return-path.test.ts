import { describe, expect, test } from "bun:test";
import { oauthReturnPath } from "./oauth-return-path";

describe("OAuth return boundaries", () => {
  test("preserves the consent authorization and fragment", () => {
    expect(oauthReturnPath("/.lovable/oauth/consent?authorization_id=example#decision")).toBe("/.lovable/oauth/consent?authorization_id=example#decision");
  });
  test("rejects external network paths", () => { expect(oauthReturnPath("//outside.invalid")).toBe("/"); });
  test("rejects backslash redirects", () => { expect(oauthReturnPath("/\\outside.invalid")).toBe("/"); });
  test("rejects control characters", () => { expect(oauthReturnPath("/auth\nnext")).toBe("/"); });
});