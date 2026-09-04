#!/usr/bin/env node
/**
 * Completa identidades visuais para itens publicados que ainda não tinham
 * diretório próprio de assets. Os SVGs são identidades exclusivas por slug e
 * os OGs são JPEGs 1200x630 para previews sociais.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const catalogPath = resolve("src/config/portfolio-catalog.json");
const assetsPath = resolve("src/config/portfolio-assets.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const assets = JSON.parse(await readFile(assetsPath, "utf8"));
// Marcas autorais (Q2) nunca podem ser sobrescritas pelo gerador genérico.
const brandReview = JSON.parse(await readFile(resolve("src/config/portfolio-brand-review.json"), "utf8"));
const authoredBrands = new Set(
  Object.entries(brandReview.projects ?? {})
    .filter(([, v]) => v?.authored)
    .map(([slug]) => slug),
);

const palettes = [
  ["#0f172a", "#38bdf8"],
  ["#24122f", "#e879f9"],
  ["#173b35", "#a3e635"],
  ["#3a1f12", "#fb923c"],
  ["#20204a", "#facc15"],
];

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}

function initials(title) {
  const words = title.replace(/[·—–]/g, " ").trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 3).map((word) => word[0]).join("").toUpperCase().slice(0, 3) || "0W";
}

function segmentArt(segment, accent) {
  const stroke = escapeXml(accent);
  if (segment === "saude") {
    return `<g transform="translate(930 188)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><circle cx="90" cy="90" r="78"/><path d="M90 42v96M42 90h96"/></g>`;
  }
  if (segment === "juridico") {
    return `<g transform="translate(900 170)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M120 28v168M62 196h116M54 50h132M42 54 8 126h68L42 54Zm156 0-34 72h68l-34-72Z"/><path d="M82 126h-68m172 0h-68"/></g>`;
  }
  if (segment === "restaurantes") {
    return `<g transform="translate(910 170)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><circle cx="100" cy="112" r="72"/><path d="M28 112h144M100 40c24 30 24 114 0 144M100 40c-24 30-24 114 0 144M32 30v42m-18-42v42m36-42v42M32 72v124M190 30c-18 34-18 64 0 88v74"/></g>`;
  }
  if (segment === "beleza") {
    return `<g transform="translate(920 172)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M42 42 174 174M174 42 42 174M30 30l34 34M186 30l-34 34M30 186l34-34M186 186l-34-34"/><circle cx="56" cy="56" r="22"/><circle cx="160" cy="56" r="22"/><circle cx="56" cy="160" r="22"/><circle cx="160" cy="160" r="22"/></g>`;
  }
  if (segment === "comercios") {
    return `<g transform="translate(920 170)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M38 76h124l-10 110H48L38 76Zm0 0 18-42h88l18 42M72 76v110m56-110v110M80 34v-16m40 16v-16"/><path d="M68 116h64"/></g>`;
  }
  if (segment === "construcao" || segment === "prestadores-de-servicos" || segment === "servicos") {
    return `<g transform="translate(910 170)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="m28 102 72-64 72 64v82H28v-82Zm48 82v-54h48v54M142 74l28-28 24 24-28 28-24-24Z"/><path d="m152 48 20-20m-2 40 20-20"/></g>`;
  }
  return `<g transform="translate(930 180)" fill="none" stroke="${stroke}" stroke-width="12" stroke-linecap="round" opacity=".92"><circle cx="90" cy="90" r="70"/><path d="M90 42v96M42 90h96"/></g>`;
}

function sourceSvg(item, dark, accent) {
  const name = escapeXml(item.title);
  const mark = escapeXml(initials(item.title));
  const art = segmentArt(item.segment, accent);
  const segment = escapeXml(item.segment.replace(/-/g, " ").toUpperCase());
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/><circle cx="1020" cy="90" r="250" fill="#fff" opacity=".08"/><circle cx="180" cy="610" r="330" fill="#fff" opacity=".06"/>
  <path d="M760 0h440v630H720c76-84 112-193 112-315S836 84 760 0Z" fill="#000" opacity=".12"/>${art}
  <rect x="70" y="68" width="108" height="108" rx="28" fill="#fff" opacity=".96"/><text x="124" y="141" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="800" fill="${dark}">${mark}</text>
  <text x="70" y="258" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#fff" opacity=".8">PRESENÇA DIGITAL</text>
  <text x="70" y="350" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#fff">${name}</text>
  <text x="70" y="414" font-family="Arial,sans-serif" font-size="25" fill="#fff" opacity=".92">${escapeXml(item.tags.slice(0, 4).join(" · ").replace(/-/g, " "))}</text>
  <text x="70" y="470" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="3" fill="#fff" opacity=".7">${segment}</text>
  <text x="70" y="530" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff" opacity=".8">${escapeXml(`${item.city} — ${item.state}`)}</text>
  </svg>`;
}

function logoSvg(item, dark, accent) {
  const name = escapeXml(item.title);
  const mark = escapeXml(initials(item.title));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300">
  <rect width="900" height="300" rx="52" fill="${dark}"/><circle cx="150" cy="150" r="94" fill="${accent}"/><text x="150" y="174" text-anchor="middle" font-family="Arial,sans-serif" font-size="64" font-weight="900" fill="${dark}">${mark}</text>
  <text x="290" y="142" font-family="Arial,sans-serif" font-size="42" font-weight="800" fill="#fff">${name}</text><text x="294" y="192" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="3" fill="${accent}">${escapeXml(item.segment.replace(/-/g, " ").toUpperCase())}</text>
  </svg>`;
}

for (const item of catalog) {
  if (authoredBrands.has(item.slug)) continue;
  const existing = assets.clients?.[item.slug] ?? assets.clients?.[item.clientKey];
  const generatedIdentity = existing?.icon?.endsWith(`/${item.slug}/logo.svg`) && existing?.socialImage?.endsWith(`/${item.slug}/hero-og.jpg`);
  if (existing?.icon && existing?.socialImage && !generatedIdentity) continue;
  const [dark, accent] = palettes[Math.abs([...item.slug].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % palettes.length];
  const dir = resolve("public", "images", item.slug);
  await mkdir(dir, { recursive: true });
  const logoPath = resolve(dir, "logo.svg");
  const sourcePath = resolve(dir, "social-source.svg");
  const ogPath = resolve(dir, "hero-og.jpg");
  await writeFile(logoPath, logoSvg(item, dark, accent));
  await writeFile(sourcePath, sourceSvg(item, dark, accent));
  await sharp(sourcePath).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 84, progressive: true }).toFile(ogPath);
  assets.clients[item.slug] = {
    icon: `/images/${item.slug}/logo.svg`,
    socialImage: `/images/${item.slug}/hero-og.jpg`,
    proof: {
      eyebrow: item.title,
      title: `${item.title} com uma presença que explica o que faz.`,
      description: item.summary || `Conheça os serviços de ${item.title} em ${item.city} — ${item.state}.`,
      ctaLabel: "Conhecer a presença",
      ctaHref: "#presenca",
    },
  };
}

await writeFile(assetsPath, `${JSON.stringify(assets, null, 2)}\n`);
console.log("[identity-assets] OK — identidades exclusivas e OGs geradas para itens sem assets");
