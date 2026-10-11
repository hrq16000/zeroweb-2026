#!/usr/bin/env node
/**
 * Smoke HTTP real em preview de produção sem SUPABASE_SERVICE_ROLE_KEY.
 * Não confunde código que compila com XML efetivamente entregue.
 */
const base = (process.env.E2E_BASE_URL || "http://127.0.0.1:8080").replace(/\/$/, "");
const cases = [
  ["/sitemap-institucional.xml", "https://0web.com.br/criacao-de-site-institucional"],
  ["/sitemap-marketplace.xml", "https://0web.com.br/solicitar-orcamento"],
];
for (const [path, requiredUrl] of cases) {
  const response = await fetch(base + path, { redirect: "manual" });
  const body = await response.text();
  if (response.status !== 200) {
    throw new Error(`${path} retornou HTTP ${response.status}, não 200`);
  }
  if (!/xml/i.test(response.headers.get("content-type") || "")) {
    throw new Error(`${path} não respondeu como XML`);
  }
  if (!/<urlset\b/i.test(body) || !body.includes(`<loc>${requiredUrl}</loc>`)) {
    throw new Error(`${path} não preservou seu URL público permanente`);
  }
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length !== new Set(urls).size) {
    throw new Error(`${path} possui entradas duplicadas`);
  }
  if (path === "/sitemap-institucional.xml" && urls.length !== 1) {
    throw new Error("Sem fonte de publicação, capitais sem prova não podem ser indexadas");
  }
  if (path === "/sitemap-marketplace.xml" && urls.length !== 2) {
    throw new Error("Sem fonte do marketplace, prestadores e categorias não podem ser inventados");
  }
  console.log(`[sitemap-no-keys] ${path}: HTTP 200 · ${urls.length} URL(s) · XML válido`);
}
