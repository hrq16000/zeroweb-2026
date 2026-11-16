import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "bun:test";

describe("Renata Beauty — LCP e acessibilidade", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/components/site/RenataBeautyView.tsx"),
    "utf8",
  );

  it("não esconde o hero/H1 atrás de animação de entrada", () => {
    expect(source).not.toContain("initial={{ opacity: 0, y: 25 }}");
    expect(source).not.toContain("initial={{ opacity: 0, scale: 0.95 }}");
  });

  it("usa CTA verde com contraste suficiente para texto branco", () => {
    expect(source).not.toContain('bg-[#25D366]');
    expect(source).toContain('bg-[#137A3E]');
  });

  it("não salta do H2 para H4 no bloco de diferenciais", () => {
    expect(source).not.toContain('<h4 className="text-sm font-bold text-white">');
    expect(source.match(/<h3 className="text-sm font-bold text-white">/g)?.length).toBe(3);
  });
});
