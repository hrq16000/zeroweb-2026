import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";
import { CAPITAIS } from "./capitais";
import {
  institutionalCapitalHasEvidence,
  institutionalProjectsForCapital,
} from "./institutional-capital-evidence";

describe("gate de capitais para criação de site institucional", () => {
  it("indexa somente capitais com projeto institutional publicado", () => {
    const indexable = CAPITAIS
      .filter((capital) => institutionalCapitalHasEvidence(capital))
      .map((capital) => capital.slug)
      .sort();

    expect(CAPITAIS).toHaveLength(27);
    expect(indexable).toEqual(["curitiba", "sao-paulo"]);
  });

  it("usa somente projectType institutional como prova específica", () => {
    for (const capital of CAPITAIS.filter((item) => institutionalCapitalHasEvidence(item))) {
      const projects = institutionalProjectsForCapital(capital);
      expect(projects.length).toBeGreaterThan(0);
    }

    const beloHorizonte = CAPITAIS.find((capital) => capital.slug === "belo-horizonte");
    const manaus = CAPITAIS.find((capital) => capital.slug === "manaus");
    expect(beloHorizonte && institutionalCapitalHasEvidence(beloHorizonte)).toBe(false);
    expect(manaus && institutionalCapitalHasEvidence(manaus)).toBe(false);
  });

  it("não representa a 0WEB como empresa física em cada capital", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/routes/criacao-de-site-institucional.$cidade.tsx"),
      "utf8",
    );

    expect(source).not.toContain('"@type": "ProfessionalService"');
    expect(source).not.toContain('"@type": "LocalBusiness"');
    expect(source).not.toContain('"@type": "PostalAddress"');
    expect(source).toContain('indexable ? "index,follow,max-image-preview:large" : "noindex,follow"');
  });

  it("referencia a Organization global da 0WEB sem duplicar entidade", () => {
    const hub = readFileSync(
      resolve(process.cwd(), "src/routes/criacao-de-site-institucional.index.tsx"),
      "utf8",
    );
    const detail = readFileSync(
      resolve(process.cwd(), "src/routes/criacao-de-site-institucional.$cidade.tsx"),
      "utf8",
    );

    expect(hub).toContain('provider: { "@id": "https://0web.com.br/#org" }');
    expect(detail).toContain('provider: { "@id": "https://0web.com.br/#org" }');
    expect(hub).not.toContain('provider: { "@type": "Organization"');
    expect(detail).not.toContain('provider: {\n              "@type": "Organization"');
  });

  it("alinha hub e sitemap ao mesmo gate de evidência", () => {
    const hub = readFileSync(
      resolve(process.cwd(), "src/routes/criacao-de-site-institucional.index.tsx"),
      "utf8",
    );
    const sitemap = readFileSync(
      resolve(process.cwd(), "src/routes/sitemap-institucional[.]xml.ts"),
      "utf8",
    );

    expect(hub).toContain("visibleCapitalSlugs");
    expect(sitemap).toContain("institutionalCapitalHasEvidence");
    expect(sitemap).toContain("localPageIsPublished");
  });
});
