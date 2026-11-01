import { describe, expect, test } from "bun:test";
import { isVerifiedMarketplaceXmlOnly } from "../../scripts/classify-sitemap-only-diff.mjs";

const trustedFiles = [
  "src/routes/sitemap-marketplace[.]xml.ts",
  "scripts/check-sitemap-runtime-no-keys.mjs",
  "scripts/sitemap-inventory-diff-policy.mjs",
  "tests/seo/sitemap-marketplace-canonical.test.ts",
  "tests/seo/sitemap-marketplace-redirect-policy.test.ts",
  "tests/seo/sitemap-runtime-no-keys.test.ts",
  "tests/seo/marketplace-xml-only-scope.test.ts",
  "scripts/classify-sitemap-only-diff.mjs",
];
const trustedBlobs = {
  "src/routes/sitemap-marketplace[.]xml.ts": "1df200b03171a98a463b1b1b71d177078f3cf1a0",
  "scripts/check-sitemap-runtime-no-keys.mjs": "8dd44ab7d9b6dc38c6f7702f162d5112323147e4",
  "scripts/sitemap-inventory-diff-policy.mjs": "3bba5c39cf7f71510f772f954778bb93f1396a40",
};

describe("sitemap marketplace: classificação comprovadamente não visual", () => {
  test("aceita apenas fontes XML com SHA auditado e testes", () => {
    expect(isVerifiedMarketplaceXmlOnly(trustedFiles, trustedBlobs)).toBe(true);
  });

  test("recusa arquivos alterados de interface, funil, workflow e CSS", () => {
    for (const file of [
      "src/routes/portfolio.$slug.tsx",
      "src/components/site/Header.tsx",
      "src/lib/whatsapp-redirect.ts",
      "src/styles/index.css",
      "public/images/logo.png",
      ".github/workflows/lighthouse.yml",
    ]) {
      expect(isVerifiedMarketplaceXmlOnly([...trustedFiles, file], trustedBlobs)).toBe(false);
    }
  });

  test("recusa arquivo XML alterado e assinatura ausente", () => {
    expect(isVerifiedMarketplaceXmlOnly(trustedFiles, { ...trustedBlobs, "src/routes/sitemap-marketplace[.]xml.ts": "0000" })).toBe(false);
    expect(isVerifiedMarketplaceXmlOnly(trustedFiles, {})).toBe(false);
    expect(isVerifiedMarketplaceXmlOnly(trustedFiles, null)).toBe(false);
  });

  test("recusa revisão sem a rota XML ou o inventário", () => {
    expect(isVerifiedMarketplaceXmlOnly(trustedFiles.filter((file) => file !== "src/routes/sitemap-marketplace[.]xml.ts"), trustedBlobs)).toBe(false);
    expect(isVerifiedMarketplaceXmlOnly(trustedFiles.filter((file) => file !== "scripts/sitemap-inventory-diff-policy.mjs"), trustedBlobs)).toBe(false);
  });
});
