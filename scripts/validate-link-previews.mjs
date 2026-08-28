#!/usr/bin/env node
/**
 * Validador headless de prévia de link + ícones.
 *
 * Para cada rota /portfolio/:slug (e para a home), busca o HTML servido,
 * extrai `og:image`, `twitter:image`, `apple-touch-icon` e os favicons
 * declarados no <head>, e verifica por HTTP:
 *   - status 200
 *   - Content-Type coerente (image/*)
 *   - dimensões reais (largura x altura) via cabeçalho dos bytes
 *
 * Resultado gravado em seo-reports/link-preview-report.json — consumido pelo
 * painel interno /painel-metadados e pelo CI.
 *
 * Uso:
 *   node scripts/validate-link-previews.mjs [baseUrl]
 *   BASE_URL=https://0web.com.br node scripts/validate-link-previews.mjs
 */
import fs from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || process.env.BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const OUT = path.join("seo-reports", "link-preview-report.json");

const clients = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));
const routes = ["/", "/portfolio", ...clients.map((c) => `/portfolio/${c.slug}`)];

/** Dimensões mínimas exigidas por tipo de recurso. */
const MIN_SOCIAL = { width: 600, height: 315 };

function metaContent(html, attr, value) {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*${attr}=["']${value}["']`,
    "i",
  );
  return (html.match(re) || html.match(alt) || [])[1] || null;
}

function linkHrefs(html, rel) {
  const out = [];
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*>`, "gi");
  for (const tag of html.match(re) || []) {
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (href) out.push(href);
  }
  return out;
}

/** Lê dimensões de PNG, JPEG, GIF, WebP ou SVG a partir dos bytes iniciais. */
function imageSize(buf, contentType) {
  try {
    if (buf.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) { i += 1; continue; }
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
    if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") {
      const fmt = buf.slice(12, 16).toString("ascii");
      if (fmt === "VP8X") return { width: (buf.readUIntLE(24, 3) & 0xffffff) + 1, height: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
    }
    if (buf.slice(0, 3).toString("ascii") === "GIF") {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    }
    if ((contentType || "").includes("svg") || buf.slice(0, 5).toString("ascii").includes("<svg")) {
      return { width: null, height: null, vector: true };
    }
    if (buf.slice(0, 4).toString("hex") === "00000100") {
      return { width: buf[6] || 256, height: buf[7] || 256, icon: true };
    }
  } catch {
    /* dimensões desconhecidas */
  }
  return { width: null, height: null };
}

function absolute(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function checkAsset(rawUrl, { kind, minSize }) {
  const url = absolute(rawUrl);
  const record = { kind, url: rawUrl, resolved: url, ok: false, status: 0, contentType: null, width: null, height: null, errors: [] };
  if (!url) {
    record.errors.push("ausente no <head>");
    return record;
  }
  try {
    const res = await fetch(url, { redirect: "follow" });
    record.status = res.status;
    record.contentType = res.headers.get("content-type");
    if (!res.ok) record.errors.push(`status ${res.status}`);
    if (record.contentType && !/^image\//i.test(record.contentType)) {
      record.errors.push(`content-type inesperado: ${record.contentType}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const size = imageSize(buf, record.contentType);
    record.width = size.width;
    record.height = size.height;
    if (minSize && size.width && size.height) {
      if (size.width < minSize.width || size.height < minSize.height) {
        record.errors.push(`dimensões abaixo do mínimo (${size.width}x${size.height} < ${minSize.width}x${minSize.height})`);
      }
    }
  } catch (err) {
    record.errors.push(`falha de rede: ${err.message}`);
  }
  record.ok = record.errors.length === 0;
  return record;
}

const report = { base: BASE, generatedAt: new Date().toISOString(), routes: [] };
let failures = 0;

for (const route of routes) {
  const entry = { route, ok: true, assets: [], errors: [] };
  let html = "";
  try {
    const res = await fetch(`${BASE}${route}`, { redirect: "follow" });
    if (!res.ok) entry.errors.push(`HTML status ${res.status}`);
    html = await res.text();
  } catch (err) {
    entry.errors.push(`falha ao buscar HTML: ${err.message}`);
  }

  if (html) {
    const og = metaContent(html, "property", "og:image") || metaContent(html, "name", "og:image");
    const tw = metaContent(html, "name", "twitter:image") || metaContent(html, "property", "twitter:image");
    const apple = linkHrefs(html, "apple-touch-icon")[0] || null;
    const icons = linkHrefs(html, "icon");

    entry.assets.push(await checkAsset(og, { kind: "og:image", minSize: MIN_SOCIAL }));
    entry.assets.push(await checkAsset(tw, { kind: "twitter:image", minSize: MIN_SOCIAL }));
    entry.assets.push(await checkAsset(apple, { kind: "apple-touch-icon" }));
    for (const icon of icons.slice(0, 4)) {
      entry.assets.push(await checkAsset(icon, { kind: "icon" }));
    }
    if (!og) entry.errors.push("og:image ausente");
    if (!tw) entry.errors.push("twitter:image ausente");
    if (!apple) entry.errors.push("apple-touch-icon ausente");
    if (icons.length === 0) entry.errors.push("favicon ausente");
  }

  entry.ok = entry.errors.length === 0 && entry.assets.every((a) => a.ok);
  if (!entry.ok) failures += 1;
  report.routes.push(entry);
  console.log(`${entry.ok ? "[ok]  " : "[fail]"} ${route}${entry.errors.length ? ` — ${entry.errors.join("; ")}` : ""}`);
  for (const a of entry.assets.filter((x) => !x.ok)) {
    console.log(`         ↳ ${a.kind}: ${a.errors.join("; ")}`);
  }
}

fs.mkdirSync("seo-reports", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(`[link-preview] report → ${OUT}`);

if (failures > 0) {
  console.error(`[link-preview] FAIL — ${failures} rota(s) com prévia ou ícone inválido`);
  process.exit(1);
}
console.log(`[link-preview] OK — ${report.routes.length} rota(s) validada(s)`);
