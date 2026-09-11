#!/usr/bin/env node
/**
 * Capa definitiva da Careca's Infotec (BRAND_LED + SERVICE_LED).
 *
 * Composição original 0WEB:
 *  - fundo: GENERATED_CONTEXTUAL_MEDIA (notebook + placa, carvão/amarelo);
 *  - marca: logotipo real normalizado (`logo.png`, derivado da faixa oficial),
 *    recortado do fundo carvão para composição;
 *  - selo de segmento em texto gráfico, sem telefone e sem endereço.
 *
 * Saída: public/images/carecas-infotec/capa.jpg (1200x630, card + OG).
 * Uso: node scripts/build-carecas-cover.mjs
 */
import { resolve } from "node:path";
import sharp from "sharp";

const dir = resolve("public/images/carecas-infotec");
const BG = resolve("assets-source/carecas-infotec/cover-bg-source-v2.jpg");
const LOGO = resolve(dir, "logo.png");
const OUT = resolve(dir, "capa.jpg");

const W = 1200;
const H = 630;

/** Remove o fundo carvão do logotipo normalizado, preservando as tintas. */
async function logoWithAlpha() {
  const { data, info } = await sharp(LOGO)
    .resize({ width: 660, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const alpha = Math.max(0, Math.min(1, (lum - 0.16) / 0.24));
    out[p] = r;
    out[p + 1] = g;
    out[p + 2] = b;
    out[p + 3] = Math.round(255 * alpha);
  }
  return { buffer: await sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer(), width, height };
}

const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#0d0b10" opacity="0.34"/>
  <rect x="0" y="0" width="470" height="${H}" fill="#0d0b10" opacity="0.5"/>
  <rect x="72" y="392" width="14" height="60" rx="7" fill="#f2c44a"/>
  <text x="104" y="418" font-family="Arial Black, Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff" letter-spacing="1">ASSISTÊNCIA TÉCNICA</text>
  <text x="104" y="452" font-family="Arial Black, Arial, sans-serif" font-size="30" font-weight="900" fill="#f2c44a" letter-spacing="1">DE INFORMÁTICA</text>
  <text x="74" y="512" font-family="Arial, sans-serif" font-size="21" fill="#d9d5e0" letter-spacing="2">CELULAR · NOTEBOOK · IMPRESSORA</text>
</svg>`);

const logo = await logoWithAlpha();

await sharp(BG)
  .resize(W, H, { fit: "cover", position: "right" })
  .composite([
    { input: label, top: 0, left: 0 },
    { input: logo.buffer, top: 128, left: 72 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT);

console.log(`capa gerada: ${OUT} (${W}x${H})`);
