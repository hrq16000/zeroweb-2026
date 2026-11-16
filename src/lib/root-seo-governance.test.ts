import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";

describe("governança SEO global da 0WEB", () => {
  const source = readFileSync(resolve(process.cwd(), "src/routes/__root.tsx"), "utf8");

  it("não injeta presença física local em todas as páginas", () => {
    expect(source).not.toContain('name: "geo.region"');
    expect(source).not.toContain('name: "geo.placename"');
    expect(source).not.toContain('name: "geo.position"');
    expect(source).not.toContain('name: "ICBM"');
    expect(source).not.toContain('"@type": "ProfessionalService"');
    expect(source).not.toContain('"@type": "LocalBusiness"');
    expect(source).not.toContain('"@type": "PostalAddress"');
    expect(source).not.toContain('"@type": "GeoCoordinates"');
  });

  it("mantém Organization e cobertura nacional como identidade global", () => {
    expect(source).toContain('"@type": "Organization"');
    expect(source).toContain('areaServed: { "@type": "Country", name: "Brasil" }');
    expect(source).toContain('"@type": "WebSite"');
  });
});
