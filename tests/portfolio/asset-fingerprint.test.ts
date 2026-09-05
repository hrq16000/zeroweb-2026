import { afterAll, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  ASSET_REASONS,
  classifyAssetPair,
  compareAssetSets,
  describeAsset,
  normalizeAssetRef,
  // @ts-expect-error -- contrato em JS puro, consumido por scripts e testes
} from "../../scripts/portfolio-asset-fingerprint.mjs";
import {
  compareFingerprints,
  analyzePortfolio,
  ORIGINALITY_METRIC_VERSION,
  // @ts-expect-error -- contrato em JS puro, consumido por scripts e testes
} from "../../scripts/portfolio-originality.mjs";

const root = path.resolve(import.meta.dir, "../..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asset-fp-"));
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

function writeAsset(rel: string, bytes: string) {
  const abs = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, bytes);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return describeAsset({ ref: `/${rel}`, absPath: abs, role: "LIBRARY" }) as any;
}

describe("assinatura de assets v2", () => {
  it("CASO 1 — mesmo basename, conteúdo diferente, não é asset idêntico", () => {
    const a = writeAsset("cliente-a/hero.jpg", "foto-do-cliente-a");
    const b = writeAsset("cliente-b/hero.jpg", "foto-completamente-diferente-do-cliente-b");
    expect(a.contentHash).not.toBe(b.contentHash);
    expect(classifyAssetPair(a, b)).toBe(ASSET_REASONS.SAME_BASENAME_ONLY);
    expect(compareAssetSets([a], [b]).identity).toBe(0);
  });

  it("CASO 2 — paths diferentes com os mesmos bytes são duplicação real", () => {
    const a = writeAsset("cliente-c/banner.jpg", "bytes-identicos");
    const b = writeAsset("cliente-d/capa.jpg", "bytes-identicos");
    expect(classifyAssetPair(a, b)).toBe(ASSET_REASONS.IDENTICAL_ASSET_CONTENT);
    const cmp = compareAssetSets([a], [b]);
    expect(cmp.identity).toBe(1);
    expect(cmp.reasons).toContain(ASSET_REASONS.IDENTICAL_ASSET_CONTENT);
  });

  it("CASO 3 — mesma URL de asset em dois projetos é referência compartilhada", () => {
    const a = describeAsset({ ref: "https://cdn.exemplo.com/Foto.jpg?v=2", role: "COVER" });
    const b = describeAsset({ ref: "https://cdn.exemplo.com/foto.jpg", role: "COVER" });
    expect(normalizeAssetRef("https://cdn.exemplo.com/Foto.jpg?v=2"))
      .toBe(normalizeAssetRef("https://cdn.exemplo.com/foto.jpg"));
    expect(classifyAssetPair(a, b)).toBe(ASSET_REASONS.SHARED_ASSET_REFERENCE);
    expect(compareAssetSets([a], [b]).reasons).toContain(ASSET_REASONS.SHARED_ASSET_REFERENCE);
  });

  it("CASO 4 — logo.svg com conteúdo diferente não é identidade compartilhada", () => {
    const a = writeAsset("cliente-e/logo.svg", "<svg><title>E</title></svg>");
    const b = writeAsset("cliente-f/logo.svg", "<svg><title>F totalmente outra marca</title></svg>");
    expect(classifyAssetPair(a, b)).toBe(ASSET_REASONS.SAME_BASENAME_ONLY);
    expect(compareAssetSets([a], [b]).similarity).toBeLessThan(0.2);
  });

  it("CASO 5 — mesmo placeholder SVG reutilizado é detectado", () => {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10'/></svg>";
    const a = writeAsset("cliente-g/logo.svg", svg);
    const b = writeAsset("cliente-h/marca.svg", svg);
    const cmp = compareAssetSets([a], [b]);
    expect(cmp.reasons).toContain(ASSET_REASONS.IDENTICAL_ASSET_CONTENT);
    expect(cmp.similarity).toBeGreaterThan(0.8);
  });

  it("CASO 6 — ausência de asset não vira identidade compartilhada", () => {
    const cmp = compareAssetSets([], []);
    expect(cmp.identity).toBe(0);
    expect(cmp.similarity).toBe(0);
    expect(cmp.reasons).toContain(ASSET_REASONS.NO_ASSET);
  });

  it("CASO 7 — v1 dava 100 só pelos nomes; v2 corrige", () => {
    const a = [writeAsset("p1/hero.jpg", "a1"), writeAsset("p1/logo.png", "a2"), writeAsset("p1/servicos.webp", "a3")];
    const b = [writeAsset("p2/hero.jpg", "b1"), writeAsset("p2/logo.png", "b2"), writeAsset("p2/servicos.webp", "b3")];
    const names = ["hero.jpg", "logo.png", "servicos.webp"];
    const fpA = { structureNgrams: [], sectionNgrams: [], components: [], style: [], copy: [], colors: [], icons: [], assetPattern: names, assetDescriptors: a, identityTokens: [] };
    const fpB = { ...fpA, assetDescriptors: b };
    expect(compareFingerprints(fpA, fpB, { version: 1 }).dimensions.ASSET_PATTERN_SIMILARITY).toBe(100);
    expect(compareFingerprints(fpA, fpB, { version: 2 }).dimensions.ASSET_PATTERN_SIMILARITY).toBeLessThan(20);
  });

  it("CASO 8 — duplicação real continua detectada com sensibilidade máxima", () => {
    const shared = [writeAsset("p3/hero.jpg", "MESMA-FOTO"), writeAsset("p3/logo.png", "MESMA-MARCA")];
    const copy = [writeAsset("p4/imagem.jpg", "MESMA-FOTO"), writeAsset("p4/marca.png", "MESMA-MARCA")];
    const fpA = { structureNgrams: [], sectionNgrams: [], components: [], style: [], copy: [], colors: [], icons: [], assetPattern: [], assetDescriptors: shared, identityTokens: [] };
    const fpB = { ...fpA, assetDescriptors: copy };
    const cmp = compareFingerprints(fpA, fpB, { version: 2 });
    expect(cmp.dimensions.ASSET_PATTERN_SIMILARITY).toBeGreaterThan(90);
    expect(cmp.assetReasons).toContain(ASSET_REASONS.IDENTICAL_ASSET_CONTENT);
  });
});

describe("métrica versionada do portfólio", () => {
  it("expõe v2 como versão corrente e mantém v1 computável", () => {
    expect(ORIGINALITY_METRIC_VERSION).toBe(2);
    const v1 = analyzePortfolio(root, { metricVersion: 1 });
    const v2 = analyzePortfolio(root, { metricVersion: 2 });
    expect(v1.metricVersion).toBe(1);
    expect(v2.metricVersion).toBe(2);
    expect(v2.projects.length).toBe(v1.projects.length);
    expect(v2.weights).toEqual(v1.weights);
  });

  it("não perde sensibilidade: sem clones novos e sem falso 100 por nome de arquivo", () => {
    const v2 = analyzePortfolio(root, { metricVersion: 2 });
    expect(v2.summary.clone).toBe(0);
    expect(v2.summary.sharedFallback).toBe(0);
    const falseMatches = v2.topPairs.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.dimensions.ASSET_PATTERN_SIMILARITY === 100 && !(p.sharedAssets ?? []).length,
    );
    expect(falseMatches.length).toBe(0);
  });
});
