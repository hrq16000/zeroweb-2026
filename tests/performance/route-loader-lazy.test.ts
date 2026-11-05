import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const loader = readFileSync(new URL("../../src/components/site/RouteLoader.tsx", import.meta.url), "utf8");

describe("RouteLoader — evita logo invisível na carga inicial", () => {
  test("não monta BrandLogo até transição durar mais de 120ms", () => {
    expect(loader).toContain("const [hasShownLoader, setHasShownLoader] = useState(false)");
    expect(loader).toContain("setTimeout(() => {");
    expect(loader).toContain("setHasShownLoader(true)");
    expect(loader).toContain("setVisible(true)");
    expect(loader).toContain("}, 120)");
    expect(loader).toContain("{hasShownLoader && (");
  });

  test("mantém o fade-out, carregador e acessibilidade após a primeira exibição", () => {
    expect(loader).toContain("setVisible(false)");
    expect(loader).toContain('role="status"');
    expect(loader).toContain('aria-label="Carregando página"');
    expect(loader).toContain('alt=""');
    expect(loader).toContain("animate-logo-pulse");
    expect(loader).toContain("prefers-reduced-motion: reduce");
    expect(loader).toContain("return () => clearTimeout(t)");
  });

  test("não altera navegação, importações institucionais nem o funil", () => {
    expect(loader).toContain("useRouterState");
    expect(loader).toContain("select: (s) => s.isLoading");
    expect(loader).toContain('from "@/components/site/BrandLogo"');
    expect(loader).not.toContain("0web-logo.png");
    expect(loader).not.toContain("window.location");
    expect(loader).not.toContain("wa.me");
  });
});
