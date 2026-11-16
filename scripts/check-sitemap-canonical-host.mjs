#!/usr/bin/env node
/** As URLs editoriais devem ser canonicas inclusive no preview local. */
const base = (process.env.E2E_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
const cases = [
  { path: "/sitemap-editorial.xml", required: "/blog/mapa" },
  { path: "/sitemap-skyscraper.xml", required: "/blog-skyscraper" },
];
for (const { path, required } of cases) {
  const result = await fetch(base + path, { redirect: "manual" });
  const xml = await result.text();
  if (result.status !== 200 || !/xml/i.test(result.headers.get("content-type") || "")) {
    throw new Error(path + ": resposta nao e HTTP 200 XML");
  }
  if (!/<urlset\b/.test(xml)) throw new Error(path + ": faltando urlset");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length < 2 || !urls.includes("https://0web.com.br" + required)) {
    throw new Error(path + ": entradas editoriais permanentes ausentes");
  }
  if (urls.some((url) => !url.startsWith("https://0web.com.br/"))) {
    throw new Error(path + ": URL nao canonica detectada no sitemap");
  }
  if (new Set(urls).size !== urls.length) throw new Error(path + ": URLs duplicadas");
  console.log("[canonical-sitemap] " + path + ": HTTP 200 · " + urls.length + " URLs canonicas");
}
