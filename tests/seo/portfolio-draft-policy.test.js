import { describe, expect, it } from "vitest";
import draftPolicy from "../../scripts/lib/portfolio-draft-policy.cjs";

const { isUnpublishedDraftPortfolio } = draftPolicy;

describe("portfolio draft indexability policy", () => {
  it("recognizes a reviewable draft whose route is reachable but explicitly noindex", () => {
    expect(isUnpublishedDraftPortfolio({
      slug: "infinito-spa",
      status: "draft",
      live: true,
      indexable: false,
    })).toBe(true);
  });

  it("recognizes a withheld draft even when it is not live", () => {
    expect(isUnpublishedDraftPortfolio({
      slug: "doce-coracao",
      status: "draft",
      live: false,
    })).toBe(true);
  });

  it("never classifies published or indexable entries as draft", () => {
    expect(isUnpublishedDraftPortfolio({
      status: "published",
      live: false,
      indexable: false,
    })).toBe(false);
    expect(isUnpublishedDraftPortfolio({
      status: "draft",
      live: true,
      indexable: true,
    })).toBe(false);
  });
});
