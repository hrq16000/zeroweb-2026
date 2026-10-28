import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { InstagramEmbedOnDemand } from "./InstagramEmbedOnDemand";

describe("Instagram do portfólio sob solicitação explícita", () => {
  test("SSR inicial não inclui iframe ou requisição incorporada do Instagram", () => {
    const html = renderToStaticMarkup(createElement(InstagramEmbedOnDemand, {
      embedUrl: "https://www.instagram.com/emporiolelecute/embed/",
      profileUrl: "https://www.instagram.com/emporiolelecute/",
      title: "Instagram oficial do Empório LeleCute",
    }));

    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("https://www.instagram.com/emporiolelecute/embed/");
    expect(html).toContain("Carregar publicações do Instagram");
    expect(html).toContain('type="button"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("https://www.instagram.com/emporiolelecute/");
  });
});
