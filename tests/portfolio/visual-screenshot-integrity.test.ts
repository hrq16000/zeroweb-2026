import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { repeatedTopStripRows } from "../../scripts/visual-screenshot-integrity.mjs";

function fakePng(width: number, height: number) {
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      data[i] = (x * 17 + y * 3) % 251;
      data[i + 1] = (x * 5 + y * 11) % 251;
      data[i + 2] = (x * 13 + y * 7) % 251;
      data[i + 3] = 255;
    }
  }
  return { width, height, data };
}

function duplicateTopAtBottom(png: ReturnType<typeof fakePng>, rows: number) {
  const bytesPerRow = png.width * 4;
  png.data.copyWithin((png.height - rows) * bytesPerRow, 0, rows * bytesPerRow);
  return png;
}

describe("integridade de screenshot visual", () => {
  test("detecta faixa grande do topo duplicada exatamente no rodapé", () => {
    const png = duplicateTopAtBottom(fakePng(12, 220), 87);
    expect(repeatedTopStripRows(png)).toBe(87);
  });

  test("não sinaliza imagem normal", () => {
    expect(repeatedTopStripRows(fakePng(12, 220))).toBe(0);
  });

  test("ignora coincidência pequena abaixo do piso de segurança", () => {
    const png = duplicateTopAtBottom(fakePng(12, 220), 24);
    expect(repeatedTopStripRows(png)).toBe(0);
  });

  test("estabiliza sticky sem afrouxar o threshold visual", () => {
    const source = readFileSync("scripts/playwright-visual-regression.mjs", "utf8");
    expect(source).toContain("pos === 'sticky'");
    expect(source).toContain("setProperty('position', 'static', 'important')");
    expect(source).toContain('Page.captureScreenshot');
    expect(source).toContain("fromSurface: false");
    expect(source).toContain("captureBeyondViewport: false");
    expect(source).toContain("VISUAL_THRESHOLD ?? 0.02");
    expect(source).toContain("if (ratio > threshold)");
  });
});
