import { describe, expect, it } from "vitest";
import { applySecurityHeaders } from "../../src/lib/security-headers";
import registry from "../../src/config/portfolio-hosted-form-registry.json";

describe("hosted form CSP", () => {
  it("permite navegar o iframe verificado sem liberar outros hosts nem form-action", () => {
    const response = applySecurityHeaders(new Response("<!doctype html><html></html>", {
      headers: { "content-type": "text/html" },
    }));
    const directives = Object.fromEntries(
      response.headers.get("content-security-policy")!.split(";").map((value) => {
        const [name, ...sources] = value.trim().split(/\s+/);
        return [name, sources];
      }),
    );
    const form = registry.forms["agropet-filt"];
    expect(form.status).toBe("verified");
    expect(directives["frame-src"]).toContain(new URL(form.url).origin);
    expect(directives["frame-src"]).not.toContain("https:");
    expect(directives["frame-src"].some((source: string) => source.includes("*"))).toBe(false);
    expect(directives["form-action"]).toEqual(["'self'"]);
    expect(directives["object-src"]).toEqual(["'none'"]);
  });
});
