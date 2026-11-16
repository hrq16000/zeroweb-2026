import { describe, expect, test } from "bun:test";
// @ts-expect-error — módulo .mjs sem tipos
import { checkPage } from "../../scripts/lib/structured-data-check.mjs";

const URL = "https://0web.com.br/portfolio/exemplo";
const page = (head: string, ld: unknown[]) =>
  `<html><head>${head}${ld.map((d) => `<script type="application/ld+json">${typeof d === "string" ? d : JSON.stringify(d)}</script>`).join("")}</head></html>`;
const goodHead = `<title>Exemplo | Cidade</title><meta name="description" content="Descrição"/><meta property="og:title" content="Exemplo"/><link rel="canonical" href="${URL}"/>`;
const crumbs = {
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "0WEB", item: "https://0web.com.br/" },
    { "@type": "ListItem", position: 2, name: "Exemplo", item: URL },
  ],
};
const good = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", url: URL }, crumbs] };

describe("checkPage", () => {
  test("página válida passa", () => {
    const r = checkPage(page(goodHead, [good]), URL);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  });
  test("JSON-LD quebrado é erro", () => {
    expect(checkPage(page(goodHead, ["{nope"]), URL).errors.join()).toContain("não parseia");
  });
  test("sem JSON-LD é erro", () => {
    expect(checkPage(page(goodHead, []), URL).ok).toBe(false);
  });
  test("noindex, canonical errado e duplicado são erros", () => {
    const head = goodHead.replace(URL, "https://0web.com.br/") + `<link rel="canonical" href="x"/><meta name="robots" content="noindex"/>`;
    const e = checkPage(page(head, [good]), URL).errors.join("|");
    expect(e).toContain("noindex");
    expect(e).toContain("canonical aponta");
    expect(e).toContain("2 canonicals");
  });
  test("title e description ausentes são erros", () => {
    const e = checkPage(page(`<link rel="canonical" href="${URL}"/>`, [good]), URL).errors.join("|");
    expect(e).toContain("title ausente");
    expect(e).toContain("description ausente");
  });
  test("breadcrumb fora de ordem e FAQ incompleta são erros", () => {
    const bad = { "@context": "https://schema.org", "@graph": [
      { ...crumbs, itemListElement: [{ ...crumbs.itemListElement[0], position: 2 }, crumbs.itemListElement[1]] },
      { "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "?" }] },
    ] };
    const e = checkPage(page(goodHead, [bad]), URL).errors.join("|");
    expect(e).toContain("fora de ordem");
    expect(e).toContain("FAQPage pergunta 1 incompleta");
  });
  test("rating sem contagem é erro", () => {
    const bad = { "@context": "https://schema.org", "@graph": [crumbs, { "@type": "LocalBusiness", name: "X", aggregateRating: { ratingValue: 5 } }] };
    expect(checkPage(page(goodHead, [bad]), URL).errors.join()).toContain("AggregateRating");
  });
});
