import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";
import { CWB_NEIGHBORHOODS } from "./curitiba-neighborhoods";
import { BH_NEIGHBORHOODS } from "./bh-neighborhoods";
import {
  localPlaceHasEvidence,
  localPublishedProjectsAtPlace,
} from "./local-page-enrichment";

const bhPlaces = BH_NEIGHBORHOODS.map((place) => ({ ...place, city: "Belo Horizonte" }));
const allPlaces = [...CWB_NEIGHBORHOODS, ...bhPlaces];

describe("gate de indexacao das landings de bairro", () => {
  it("mantem somente localidades com projeto publicado e location correspondente", () => {
    const indexable = allPlaces
      .filter((place) => localPlaceHasEvidence(place))
      .map((place) => place.slug)
      .sort();

    expect(allPlaces).toHaveLength(61);
    expect(indexable).toEqual([
      "barreiro",
      "campo-comprido",
      "jardim-italia-sjp",
      "novo-mundo",
      "sao-jose-dos-pinhais-centro",
      "uberaba",
    ]);
  });

  it("usa apenas projetos publicados na localidade como prova", () => {
    for (const place of allPlaces.filter((item) => localPlaceHasEvidence(item))) {
      const projects = localPublishedProjectsAtPlace(place);
      expect(projects.length).toBeGreaterThan(0);
      for (const project of projects) {
        expect(project.location).toBeTruthy();
      }
    }
  });

  it("não publica presença física fictícia nem index universal nas rotas", () => {
    const paths = [
      "src/routes/bairros-cwb.$slug.tsx",
      "src/routes/bairros-bh.$slug.tsx",
    ];

    for (const path of paths) {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");
      expect(source).not.toContain('"@type": "LocalBusiness"');
      expect(source).not.toContain('name: "geo.position"');
      expect(source).not.toContain('name: "geo.placename"');
      expect(source).not.toContain('streetAddress: `Bairro');
      expect(source).toContain('hasEvidence ? "index,follow,max-image-preview:large" : "noindex,follow"');
    }
  });

  it("hubs promovem somente localidades comprovadas", () => {
    const cwbIndexable = CWB_NEIGHBORHOODS.filter((place) => localPlaceHasEvidence(place));
    const bhIndexable = bhPlaces.filter((place) => localPlaceHasEvidence(place));

    expect(cwbIndexable.map((place) => place.slug).sort()).toEqual([
      "campo-comprido",
      "jardim-italia-sjp",
      "novo-mundo",
      "sao-jose-dos-pinhais-centro",
      "uberaba",
    ]);
    expect(bhIndexable.map((place) => place.slug)).toEqual(["barreiro"]);

    for (const path of [
      "src/routes/bairros-cwb.index.tsx",
      "src/routes/bairros-bh.index.tsx",
    ]) {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");
      expect(source).toContain("localPlaceHasEvidence");
      expect(source).not.toContain("25+ bairros");
      expect(source).not.toContain("30+ bairros");
      expect(source).not.toContain("mais de 30 bairros");
      expect(source).not.toContain('name: "geo.placename"');
      expect(source).not.toContain('name: "geo.region"');
    }
  });

  it("hub de áreas promove somente localidades comprovadas", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/routes/areas-de-atendimento.tsx"),
      "utf8",
    );

    expect(source).toContain("localPlaceHasEvidence");
    expect(source).not.toContain("30 bairros");
    expect(source).not.toContain("atendimento presencial");
    expect(source).not.toContain("Em 24h");
    expect(source).not.toContain("dominar as buscas");
    expect(source).not.toContain("Silo completo de landing pages");
  });

  it("não mantém promessas absolutas de posição ou resultado", () => {
    const paths = [
      "src/routes/bairros-cwb.$slug.tsx",
      "src/routes/bairros-bh.$slug.tsx",
      "src/lib/local-page-enrichment.ts",
    ];
    const banned = [
      "topo do Google",
      "vendas reais",
      "dominar o Google",
      "previsibilidade de leads",
      "primeira escolha do bairro",
      "em 24h você recebe",
    ];

    for (const path of paths) {
      const source = readFileSync(resolve(process.cwd(), path), "utf8").toLowerCase();
      for (const phrase of banned) {
        expect(source).not.toContain(phrase.toLowerCase());
      }
    }
  });
});
