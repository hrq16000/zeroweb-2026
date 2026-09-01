#!/usr/bin/env node
/**
 * Completa identidades visuais para itens publicados que ainda não tinham
 * diretório próprio de assets. Os SVGs são conceitos exclusivos por slug e
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

function sourceSvg(item, dark, accent) {
  const name = escapeXml(item.title);
  const mark = escapeXml(initials(item.title));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/><circle cx="1020" cy="90" r="250" fill="#fff" opacity=".08"/><circle cx="180" cy="610" r="330" fill="#fff" opacity=".06"/>
  <rect x="70" y="68" width="108" height="108" rx="28" fill="#fff" opacity=".96"/><text x="124" y="141" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="800" fill="${dark}">${mark}</text>
  <text x="70" y="258" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#fff" opacity=".8">CONCEITO DE PRESENÇA DIGITAL</text>
  <text x="70" y="350" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#fff">${name}</text>
  <text x="70" y="414" font-family="Arial,sans-serif" font-size="25" fill="#fff" opacity=".92">${escapeXml(item.tags.slice(0, 4).join(" · ").replace(/-/g, " "))}</text>
  <text x="70" y="530" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff" opacity=".8">${escapeXml(`${item.city} — ${item.state}`)}</text>
  </svg>`;
}

function logoSvg(item, dark, accent) {
  const name = escapeXml(item.title);
  const mark = escapeXml(initials(item.title));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300">
  <rect width="900" height="300" rx="52" fill="${dark}"/><circle cx="150" cy="150" r="94" fill="${accent}"/><text x="150" y="174" text-anchor="middle" font-family="Arial,sans-serif" font-size="64" font-weight="900" fill="${dark}">${mark}</text>
  <text x="290" y="142" font-family="Arial,sans-serif" font-size="42" font-weight="800" fill="#fff">${name}</text><text x="294" y="192" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="3" fill="${accent}">PRESENÇA LOCAL</text>
  </svg>`;
}

for (const item of catalog) {
  if (assets.clients?.[item.slug]?.icon && assets.clients?.[item.slug]?.socialImage) continue;
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
