#!/usr/bin/env node
/**
 * Identidade da Careca's Infotec — normalização fiel da marca real.
 *
 * Procedência: todos os pixels de marca saem de `banner.webp`, foto da faixa
 * oficial enviada pelo próprio negócio. O script NÃO reinterpreta a marca:
 * recorta o bloco do logotipo, corrige ruído da lona e reduz a arte às três
 * tintas reais (amarelo, carvão e o descritor claro). O restante da capa é
 * composição gráfica original da 0WEB — nenhuma fotografia de terceiros,
 * nenhum equipamento apresentado como sendo do cliente.
 *
 * Saídas:
 *  - public/images/carecas-infotec/logo.png   (marca normalizada)
 *  - public/images/carecas-infotec/capa.jpg   (capa do card /portfolio + OG)
 *
 * Uso: node scripts/build-carecas-identity.mjs
 */
import { resolve } from "node:path";
import sharp from "sharp";

const dir = resolve("public/images/carecas-infotec");
const BANNER = resolve(dir, "banner.webp");

const YELLOW = [242, 196, 74];
const CHARCOAL = [36, 28, 44];
const LIGHT = [240, 240, 245];

/** Reduz o recorte fotográfico da faixa às tintas reais da marca. */
async function normalizedLogo() {
  const source = sharp(BANNER)
    .extract({ left: 26, top: 16, width: 504, height: 172 })
    .resize({ width: 1512, kernel: "lanczos3" })
    .median(3);
  const { data, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, p = 0; i < width * height; i++, p += channels) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const yellowness = (r + g) / 2 - b;
    let y = Math.max(0, Math.min(1, (yellowness - 20) / 45)) * Math.max(0, Math.min(1, (lum - 0.22) / 0.28));
    y = y < 0.12 ? 0 : y > 0.88 ? 1 : y;
    let w = Math.max(0, Math.min(1, (lum - 0.6) / 0.15)) * Math.max(0, Math.min(1, (8 - yellowness) / 14));
    if (w < 0.15) w = 0;
    const ink = y >= w ? YELLOW : LIGHT;
    const k = Math.max(y, w);
    const o = i * 4;
    out[o] = Math.round(CHARCOAL[0] + (ink[0] - CHARCOAL[0]) * k);
    out[o + 1] = Math.round(CHARCOAL[1] + (ink[1] - CHARCOAL[1]) * k);
    out[o + 2] = Math.round(CHARCOAL[2] + (ink[2] - CHARCOAL[2]) * k);
    out[o + 3] = 255;
  }
  return sharp(out, { raw: { width, height, channels: 4 } });
}

/** Fundo autoral: tintas da marca + arte de linha própria de bancada técnica. */
function coverBackground() {
  const stroke = `stroke="#f2c44a" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#241c2c"/><stop offset="0.55" stop-color="#1b1522"/><stop offset="1" stop-color="#120e18"/>
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#f2c44a" stroke-width="1" opacity=".08"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <path d="M0 546h1200v84H0z" fill="#f2c44a" opacity=".1"/>
  <path d="M980 0h220v630H900c66-92 96-206 96-322S1046 88 980 0Z" fill="#f2c44a" opacity=".06"/>
  <rect x="56" y="80" width="676" height="252" rx="30" fill="#241c2c" stroke="#f2c44a" stroke-opacity=".22" stroke-width="2"/>
  <g opacity=".95">
    <g transform="translate(812 150)" ${stroke}>
      <path d="M40 26h230v148H40z"/><path d="M10 174h290l-22 40H32z"/><path d="M126 190h58"/>
    </g>
    <g transform="translate(818 372)" ${stroke}>
      <rect x="8" y="8" width="96" height="164" rx="16"/><path d="M44 32h24"/><path d="M40 148h32"/>
    </g>
    <g transform="translate(980 386)" ${stroke}>
      <path d="M28 62h188v76H28z"/><path d="M60 62V16h124v46"/><path d="M64 138h116v52H64z"/><path d="M186 88h14"/>
    </g>
    <g transform="translate(648 402)" ${stroke} opacity=".8">
      <rect x="6" y="6" width="120" height="120" rx="12"/><rect x="42" y="42" width="48" height="48" rx="8"/>
      <path d="M42 6V-12M66 6V-12M90 6V-12M42 126v18M66 126v18M90 126v18M6 42H-12M6 66H-12M6 90H-12M126 42h18M126 66h18M126 90h18"/>
    </g>
  </g>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="76" y="392" font-size="24" font-weight="700" letter-spacing="6" fill="#f2c44a">CONSERTO · MANUTENÇÃO · RECARGA</text>
    <text x="76" y="452" font-size="34" font-weight="800" fill="#ffffff">Celular · Computador · Notebook</text>
    <text x="76" y="500" font-size="34" font-weight="800" fill="#ffffff">Impressora · Monitor · Tablet · Videogame</text>
    <text x="76" y="586" font-size="26" font-weight="700" letter-spacing="3" fill="#ffffff" opacity=".82">SÃO JOSÉ DOS PINHAIS — PR</text>
  </g>
</svg>`);
}

const logo = await normalizedLogo();
await logo.clone().resize({ width: 1016 }).png({ compressionLevel: 9 }).toFile(resolve(dir, "logo.png"));

const logoOnCover = await logo.clone().resize({ width: 640 }).png().toBuffer();
await sharp(coverBackground())
  .composite([{ input: logoOnCover, left: 72, top: 96 }])
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile(resolve(dir, "capa.jpg"));

console.log("[carecas-identity] OK — logo normalizada e capa autoral geradas");
