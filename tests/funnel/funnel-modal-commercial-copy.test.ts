import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

const wrapperSrc = readFileSync(
  resolve(process.cwd(), "src/components/funnel/FunnelModalWrapper.tsx"),
  "utf8",
);

describe("FunnelModalWrapper commercial copy", () => {
  test("não injeta preço ou prazo global sobre ofertas diferentes", () => {
    expect(wrapperSrc).not.toContain("A partir de R$ 99,99/mês");
    expect(wrapperSrc).not.toContain("Entrega do site em até 72 horas");
  });

  test("continua repassando contexto factual da origem ao FunnelRunner", () => {
    expect(wrapperSrc).toContain("context={context}");
    expect(wrapperSrc).toContain("prefill={prefill}");
  });
});
