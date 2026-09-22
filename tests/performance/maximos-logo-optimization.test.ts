import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const page = readFileSync(
  resolve(__dirname, "../../src/components/site/MaximosCabeleireirosPage.tsx"),
  "utf8",
);
const assets = JSON.parse(
  readFileSync(resolve(__dirname, "../../src/config/portfolio-assets.json"), "utf8"),
);

describe("Maximos Cabeleireiros — logo otimizado", () => {
  test("landing não carrega o PNG de 1.55 MB", () => {
    expect(page).not.toContain("/images/maximos-cabeleireiros/logo.png");
    expect(page).toContain("maximos-cabeleireiros-logo.webp");
    expect(page).toContain("c_limit,w_1024/f_webp/q_auto");
  });

  test("asset index usa a mesma versão WebP otimizada", () => {
    const icon = assets.clients["maximos-cabeleireiros"].icon;
    expect(icon).toContain("res.cloudinary.com/dqnwlodjs/");
    expect(icon).toContain("maximos-cabeleireiros-logo.webp");
  });
});
