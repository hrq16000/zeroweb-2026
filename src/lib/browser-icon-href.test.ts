import { describe, expect, it } from "bun:test";
import { browserIconHref } from "./browser-icon-href";

describe("favicon próprio nos portfólios", () => {
  it("resolve ícone público da 0WEB localmente, evitando cookie de terceiros no preview", () => {
    expect(browserIconHref("https://0web.com.br/images/dyzpromo/logo-dyz-promo.webp"))
      .toBe("/images/dyzpromo/logo-dyz-promo.webp");
    expect(browserIconHref("https://0web.com.br/images/foo/logo.webp?v=1#icon"))
      .toBe("/images/foo/logo.webp?v=1#icon");
  });
  it("não reescreve favicon externo autorizado ou domínio parecido", () => {
    expect(browserIconHref("https://arildomadeiras.guiapinhais.com.br/favicon.ico"))
      .toBe("https://arildomadeiras.guiapinhais.com.br/favicon.ico");
    expect(browserIconHref("https://0web.com.br.evil.example/icon.png"))
      .toBe("https://0web.com.br.evil.example/icon.png");
  });
  it("não altera URLs locais, data URLs ou entradas vazias", () => {
    expect(browserIconHref("/favicon.svg")).toBe("/favicon.svg");
    expect(browserIconHref("data:image/png;base64,abcd")).toBe("data:image/png;base64,abcd");
    expect(browserIconHref("")).toBe("");
  });
});
