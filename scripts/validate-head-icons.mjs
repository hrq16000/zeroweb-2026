#!/usr/bin/env node
/**
 * Portão de CI para os ícones declarados no <head>.
 *
 * Para cada rota pública (home, /portfolio e cada /portfolio/<slug>) busca o
 * HTML servido, extrai todos os <link rel="icon|shortcut icon|apple-touch-icon|
 * mask-icon"> e valida por HTTP:
 *   - status 200
 *   - Content-Type coerente com a extensão (image/png, image/svg+xml, ...)
 *   - dimensões esperadas por tipo (apple-touch-icon 180x180, favicon PNG >= 32,
 *     sizes="NxN" deve bater com os bytes reais)
 *
 * Relatório: seo-reports/head-icons-report.json
 * Uso: node scripts/validate-head-icons.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || process.env.BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const OUT = path.join("seo-reports", "head-icons-report.json");

const clients = JSON.parse(fs.readFileSync("src/config/portfolio-clients.json", "utf8"));
const routes = ["/", "/portfolio", ...clients.map((c) => `/portfolio/${c.slug}`)];

const CONTENT_TYPES = {
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  webp: ["image/webp"],
  svg: ["image/svg+xml"],
  ico: ["image/x-icon", "image/vnd.microsoft.icon", "image/ico"],
};

function iconLinks(html) {
  const out = [];
  for (const tag of html.match(/<link[^>]*>/gi) || []) {
    const rel = (tag.match(/rel=["']([^"']+)["']/i) || [])[1]?.toLowerCase();
    if (!rel) continue;
    if (!/(^|\s)(icon|shortcut icon|apple-touch-icon|mask-icon)(\s|$)/.test(rel)) continue;
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (!href) continue;
    const sizes = (tag.match(/sizes=["']([^"']+)["']/i) || [])[1] || null;
    out.push({ rel, href, sizes });
  }
  return out;
}

/** Dimensões a partir dos bytes (PNG, JPEG, GIF, WebP, ICO, SVG). */
function imageSize(buf, ext) {
  try {
    if (buf.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
    if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") {
      if (buf.slice(12, 16).toString("ascii") === "VP8X") {
        return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      }
    }
    if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01) {
      return { width: buf[6] || 256, height: buf[7] || 256 };
    }
    if (ext === "svg") {
      const text = buf.toString("utf8").slice(0, 800);
      const vb = text.match(/viewBox=["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i);
      if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
      const w = text.match(/width=["'](\d+)/i);
      const h = text.match(/height=["'](\d+)/i);
      if (w && h) return { width: +w[1], height: +h[1] };
      return { width: 0, height: 0, vector: true };
    }
  } catch {
    /* formato não reconhecido */
  }
  return null;
}

/** Assets absolutos do domínio do projeto são testados na BASE atual (preview/CI). */
const PROJECT_HOSTS = ["0web.com.br", "www.0web.com.br", "zeroweb.lovable.app"];
function resolveAsset(href) {
  if (!href.startsWith("http")) return `${BASE}${href}`;
  try {
    const parsed = new URL(href);
    if (PROJECT_HOSTS.includes(parsed.hostname)) return `${BASE}${parsed.pathname}${parsed.search}`;
  } catch {
    /* href inválido — mantém como veio */
  }
  return href;
}

const errors = [];
const warnings = [];
const report = { base: BASE, generatedAt: new Date().toISOString(), routes: [] };

for (const route of routes) {
  const entry = { route, icons: [], problems: [] };
  let html;
  try {
    const res = await fetch(`${BASE}${route}`, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (error) {
    entry.problems.push(`falha ao carregar rota: ${error.message}`);
    errors.push(`${route}: ${error.message}`);
    report.routes.push(entry);
    continue;
  }

  const links = iconLinks(html);
  if (!links.some((l) => l.rel.includes("apple-touch-icon"))) {
    entry.problems.push("sem apple-touch-icon");
    errors.push(`${route}: sem apple-touch-icon no <head>`);
  }
  if (!links.some((l) => l.rel.includes("icon") && !l.rel.includes("apple"))) {
    entry.problems.push("sem favicon");
    errors.push(`${route}: sem <link rel="icon">`);
  }

  for (const link of links) {
    const url = resolveAsset(link.href);
    const ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
    const record = { ...link, url, status: null, contentType: null, width: null, height: null, ok: true };
    try {
      const res = await fetch(url, { redirect: "follow" });
      record.status = res.status;
      record.contentType = (res.headers.get("content-type") || "").split(";")[0].trim();
      const buf = Buffer.from(await res.arrayBuffer());
      const size = imageSize(buf, ext);
      if (size) { record.width = size.width; record.height = size.height; }

      if (res.status !== 200) {
        record.ok = false;
        errors.push(`${route}: ${link.rel} → HTTP ${res.status} (${url})`);
      }
      const expected = CONTENT_TYPES[ext];
      if (expected && record.contentType && !expected.includes(record.contentType)) {
        record.ok = false;
        errors.push(`${route}: ${link.rel} Content-Type ${record.contentType} ≠ ${expected[0]} (${url})`);
      }
      if (link.sizes && /^\d+x\d+$/.test(link.sizes) && size && !size.vector) {
        const [w, h] = link.sizes.split("x").map(Number);
        if (size.width !== w || size.height !== h) {
          record.ok = false;
          errors.push(`${route}: ${link.rel} sizes=${link.sizes} mas arquivo é ${size.width}x${size.height}`);
        }
      }
      if (link.rel.includes("apple-touch-icon") && size && !size.vector) {
        if (size.width < 180 || size.height < 180) {
          record.ok = false;
          errors.push(`${route}: apple-touch-icon ${size.width}x${size.height} < 180x180 (${url})`);
        }
        if (["webp", "svg"].includes(ext)) {
          record.ok = false;
          errors.push(`${route}: apple-touch-icon em ${ext} não é suportado pelo iOS (${url})`);
        }
      }
      if (!link.rel.includes("apple") && ext === "png" && size && (size.width < 32 || size.height < 32)) {
        warnings.push(`${route}: favicon PNG pequeno (${size.width}x${size.height}) — ${url}`);
      }
    } catch (error) {
      record.ok = false;
      errors.push(`${route}: ${link.rel} falhou (${error.message}) — ${url}`);
    }
    if (!record.ok) entry.problems.push(`${link.rel}: ${record.status ?? "erro"}`);
    entry.icons.push(record);
  }
  report.routes.push(entry);
}

report.errors = errors;
report.warnings = warnings;
fs.mkdirSync("seo-reports", { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`);

for (const w of warnings) console.warn(`[head-icons] AVISO ${w}`);
if (errors.length) {
  console.error(`\n[head-icons] FAIL — ${errors.length} problema(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`[head-icons] relatório → ${OUT}`);
  process.exit(1);
}
console.log(`[head-icons] OK — ${routes.length} rota(s), ${report.routes.reduce((n, r) => n + r.icons.length, 0)} ícone(s) validados`);
console.log(`[head-icons] relatório → ${OUT}`);
