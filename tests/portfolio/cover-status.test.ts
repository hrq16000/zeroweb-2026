import { describe, expect, it } from "vitest";
import {
  COVER_STATUS,
  PENDING_STATUSES,
  classifyImageRole,
  resolveCoverStatus,
  summarizeCoverStatus,
  // @ts-expect-error módulo .mjs compartilhado com os scripts de build
} from "../../src/lib/portfolio-cover-status.mjs";
import coverStatus from "../../src/config/portfolio-cover-status.json";
import catalog from "../../src/config/portfolio-catalog.json";

const base = { slug: "demo", fileExists: () => true };

describe("contrato canônico de capa", () => {
  it("classifica papéis de imagem", () => {
    expect(classifyImageRole("/images/x/hero-og.png")).toBe("SOCIAL");
    expect(classifyImageRole("/images/x/logo.png")).toBe("LOGO");
    expect(classifyImageRole("/images/x/capa.png")).toBe("EDITORIAL");
    expect(classifyImageRole(null)).toBe("NONE");
  });

  it("capa real aprovada é VALID", () => {
    const r = resolveCoverStatus({
      ...base,
      review: { coverReview: "APPROVED", coverSource: "public/images/demo/capa.png" },
    });
    expect(r.status).toBe(COVER_STATUS.VALID);
    expect(r.cardValid).toBe(true);
  });

  it("imagem social aprovada não vira capa", () => {
    const r = resolveCoverStatus({
      ...base,
      review: { coverReview: "APPROVED", coverSource: "public/images/demo/hero-og.png" },
    });
    expect(r.status).toBe(COVER_STATUS.NEEDS_CROP);
  });

  it("logo aprovada não vira capa", () => {
    const r = resolveCoverStatus({
      ...base,
      review: { coverReview: "APPROVED", coverSource: "public/images/demo/logo.png" },
    });
    expect(r.status).toBe(COVER_STATUS.LOGO_ONLY);
  });

  it("aprovada com arquivo inexistente é NO_REAL_ASSET", () => {
    const r = resolveCoverStatus({
      ...base,
      fileExists: () => false,
      review: { coverReview: "APPROVED", coverSource: "public/images/demo/capa.png" },
    });
    expect(r.status).toBe(COVER_STATUS.NO_REAL_ASSET);
  });

  it("panfleto com telefone ou endereço é CONTACT_OR_PII", () => {
    for (const block of ["BLOCKED_CONTACT", "BLOCKED_ADDRESS"]) {
      const r = resolveCoverStatus({
        ...base,
        review: { coverReview: "NEEDS_REVIEW", coverBlockReason: block },
      });
      expect(r.status).toBe(COVER_STATUS.CONTACT_OR_PII);
    }
  });

  it("peça com preço promocional é PROMOTIONAL_MATERIAL", () => {
    const r = resolveCoverStatus({
      ...base,
      review: { coverReview: "NEEDS_REVIEW", coverBlockReason: "BLOCKED_PROMOTIONAL_PRICE" },
    });
    expect(r.status).toBe(COVER_STATUS.PROMOTIONAL_MATERIAL);
  });

  it("material seguro bloqueado por qualidade é NEEDS_CROP", () => {
    const r = resolveCoverStatus({
      ...base,
      review: {
        coverReview: "NEEDS_REVIEW",
        coverBlockReason: "BLOCKED_QUALITY",
        coverMaterial: "HAS_SAFE_REAL_MATERIAL",
      },
    });
    expect(r.status).toBe(COVER_STATUS.NEEDS_CROP);
  });

  it("sem material real é NO_REAL_ASSET e só-logo é LOGO_ONLY", () => {
    expect(
      resolveCoverStatus({
        ...base,
        review: { coverReview: "NEEDS_REVIEW", coverMaterial: "MATERIAL_INSUFFICIENT" },
      }).status,
    ).toBe(COVER_STATUS.NO_REAL_ASSET);

    expect(
      resolveCoverStatus({
        ...base,
        review: { coverReview: "NEEDS_REVIEW", coverMaterial: "NO_SAFE_REAL_MATERIAL" },
        assets: { icon: "/images/demo/logo.png" },
        projectFiles: ["logo.png", "hero-og.png"],
      }).status,
    ).toBe(COVER_STATUS.LOGO_ONLY);
  });

  it("sem julgamento humano é UNCERTAIN_ORIGIN", () => {
    expect(resolveCoverStatus({ ...base }).status).toBe(COVER_STATUS.UNCERTAIN_ORIGIN);
  });
});

describe("inventário gerado", () => {
  const rows = coverStatus.projects as { slug: string; status: string }[];

  it("cobre exatamente os projetos do catálogo", () => {
    const catalogSlugs = (catalog as { slug: string }[]).map((c) => c.slug).sort();
    expect(rows.map((r) => r.slug).sort()).toEqual(catalogSlugs);
    expect(rows).toHaveLength(68);
  });

  it("pendências fecham com a soma dos reason codes", () => {
    const s = summarizeCoverStatus(rows);
    expect(s.total).toBe(coverStatus.summary.total);
    expect(s.valid + s.pending).toBe(s.total);
    expect(s.pending).toBe(
      (PENDING_STATUSES as string[]).reduce((acc, k) => acc + s.byStatus[k], 0),
    );
  });

  it("as três capas geradas na Rodada 9 estão válidas", () => {
    for (const slug of ["paraiso-do-hot-dog", "rm-fretes", "heloa-gas"]) {
      expect(rows.find((r) => r.slug === slug)?.status).toBe("VALID");
    }
  });
});
