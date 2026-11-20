import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const source = readFileSync("src/components/site/CantinhoTiaMariPage.tsx", "utf8");

describe("Cantinho da Tia Mari — navegação móvel", () => {
  test("preserva navegação própria e âncoras sem alterar o funil", () => {
    expect(source).toContain('aria-label="Navegação móvel"');
    for (const section of ['#cuidados', '#ambientes', '#horarios', '#localizacao']) {
      expect(source).toContain(section);
    }
    expect(source).toContain('const FORM = "https://form.jotform.com/263096736127059"');
    expect(source).toContain('window.dispatchEvent(new CustomEvent("0web:portfolio-funnel-open"))');
  });

  test("associa botão e painel, mantém menu realmente oculto quando fechado", () => {
    expect(source).toContain('aria-controls="tm-mobile-navigation"');
    expect(source).toContain('id="tm-mobile-navigation"');
    expect(source).toContain('aria-expanded={navOpen}');
    expect(source).toContain('(navOpen ? "flex " : "hidden ")');
    expect(source).toContain('lg:hidden');
  });

  test("Escape fecha menu e devolve foco ao gatilho sem tocar no modal", () => {
    expect(source).toContain('if (!navOpen) return;');
    expect(source).toContain('if (event.key !== "Escape") return;');
    expect(source).toContain('setNavOpen(false);');
    expect(source).toContain('menuButtonRef.current?.focus()');
    expect(source).toContain('removeEventListener("keydown", closeOnEscape)');
  });

  test("links móveis possuem alvo de toque de 44 px e foco visível", () => {
    expect(source).toContain('className="flex min-h-11 items-center rounded-lg px-2 focus-visible:outline');
    expect(source).toContain('className="min-h-11 rounded-full bg-[#6b408d]');
    expect(source).toContain('focus-visible:outline-offset-2');
  });
});
