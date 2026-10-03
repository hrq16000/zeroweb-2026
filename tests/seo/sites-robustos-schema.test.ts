import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const index = readFileSync("src/routes/sites-robustos.index.tsx", "utf8");
const detail = readFileSync("src/routes/sites-robustos.$slug.tsx", "utf8");

describe("schema evergreen de sites robustos", () => {
  test("não inventa datas editoriais usando Article", () => {
    expect(index).not.toContain('"@type": "Article"');
    expect(detail).not.toContain('"@type": "Article"');
  });

  test("usa WebPage com imagem real do cluster", () => {
    expect(index).toContain('"@type": "WebPage"');
    expect(detail).toContain('"@type": "WebPage"');
    expect(index).toContain("primaryImageOfPage");
    expect(detail).toContain("primaryImageOfPage");
    expect(index).toContain("CLUSTER_OG_IMAGE");
    expect(detail).toContain("CLUSTER_OG_IMAGE");
  });
});
