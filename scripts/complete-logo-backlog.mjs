#!/usr/bin/env node
/** Replaces photo-as-logo fallbacks with dedicated, client-scoped marks. */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const catalog = JSON.parse(await readFile(resolve(root, "src/config/portfolio-catalog.json"), "utf8"));
const assetsPath = resolve(root, "src/config/portfolio-assets.json");
const contractsPath = resolve(root, "src/config/portfolio-identity-contracts.json");
const assets = JSON.parse(await readFile(assetsPath, "utf8"));
const contracts = JSON.parse(await readFile(contractsPath, "utf8"));

const art = {
  "sos-presentes-cosmeticos": ["#642c59", "#f1b7c8", "SP", `<path d="M52 94h140l-12 88H64L52 94Zm0 0 70 48 70-48M92 94c-20-36 24-52 30 0 6-52 50-36 30 0"/>`],
  "rm-fretes": ["#162d4b", "#ffbb3e", "RF", `<path d="M38 74h112v104H38zM150 110h42l30 34v34h-72M72 178a20 20 0 1 0 40 0 20 20 0 1 0-40 0Zm106 0a20 20 0 1 0 40 0 20 20 0 1 0-40 0Z"/>`],
  "rj-servicos-drywall": ["#183b47", "#f59e59", "RJ", `<path d="M48 174h148M60 174V66h124v108M84 66v108M144 66v108M60 108h124"/>`],
  "studio-de-cilios": ["#3b2036", "#eeb1cf", "SC", `<path d="M38 124c42-54 126-54 168 0-42 54-126 54-168 0Zm38 0c18-26 74-26 92 0-18 26-74 26-92 0ZM62 56c28 18 48 22 60 22s32-4 60-22"/>`],
  "vila-da-capivara": ["#284c47", "#e3b65d", "VC", `<path d="M50 148c18-44 44-66 72-66s54 22 72 66c-28 24-116 24-144 0Z"/><circle cx="98" cy="126" r="5"/><circle cx="146" cy="126" r="5"/><path d="M112 144h20"/>`],
  "lk-alvenaria": ["#263541", "#e9a63b", "LK", `<path d="M44 92h156M44 128h156M44 164h156M74 60v140M126 60v140M178 60v140"/>`],
  "salao-da-marcia": ["#4c213e", "#ee9eae", "SM", `<path d="M62 62v104M94 62v104M126 62v104M158 62v104M46 174h142M64 62h92"/>`],
  "espaco-cih-luh": ["#1c3745", "#e4b25c", "CL", `<path d="M56 76h132v116H56zM56 112h132M92 76v116M144 76v116"/>`],
  "eletrovale-eletromecanica": ["#1b3046", "#62c7da", "EV", `<path d="m130 30-64 100h48l-22 72 72-112h-50l16-60ZM42 206h160"/>`],
  "eletro-solucoes-eficazes": ["#112f3e", "#f6c944", "EE", `<circle cx="122" cy="120" r="74"/><path d="m132 42-48 82h36l-12 72 54-94h-38l8-60Z"/>`],
  "mary-diarista": ["#244237", "#edc46a", "MD", `<path d="M60 56h124v28H60zM78 84v108M166 84v108M48 192h148M100 120h44"/>`],
  "jkl-marcenaria": ["#3c261e", "#d79a54", "JK", `<path d="M46 168h152M62 168V80h120v88M62 116h120M92 80v88M152 80v88"/>`],
  "santos-montador-de-moveis": ["#203746", "#6ed0d2", "SA", `<path d="M52 178h140M64 178V72h116v106M64 112h116M96 72v106M148 72v106"/>`],
  "popys-conservacao-limpeza": ["#30253f", "#ee86b4", "PC", `<path d="M54 74h136M72 74v116M172 74v116M54 190h136M100 106h44M100 136h44"/>`],
  "bruna-diarista": ["#21324b", "#e65e9c", "BD", `<path d="M62 58h120v136H62zM86 88h72M86 122h72M86 156h48"/>`],
  "btb-construcao": ["#161c27", "#f4b928", "BT", `<path d="m48 162 74-110 74 110M78 162h88M122 52v110M92 104h60"/>`],
  "easy-clean": ["#16435e", "#91d53d", "EC", `<path d="M72 56h100v136H72zM98 88h48M98 122h48M98 156h30"/>`],
  "simone-lacerda-vaz": ["#4a1d26", "#d5a15b", "SL", `<path d="M72 174c0-76 100-76 100 0M96 96c16-28 36-28 52 0M72 174h100"/>`],
  "denise-gomes-psicologa": ["#263b46", "#b2d6c2", "DG", `<path d="M122 46c-36 0-62 28-62 62 0 38 30 76 62 88 32-12 62-50 62-88 0-34-26-62-62-62Z"/><path d="M90 112h64M122 80v64"/>`],
  "raphael-construcoes": ["#28313b", "#f08c36", "RC", `<path d="m46 110 76-66 76 66M66 110v78h112v-78M102 188v-52h40v52"/>`],
  "ton-e-cor": ["#362745", "#e3a34a", "TC", `<path d="M54 76h136M74 76v116M170 76v116M54 192h136M98 110h48M98 146h48"/>`],
};

function esc(v) { return String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c])); }
function logo(item, m) { return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300" role="img" aria-label="${esc(item.title)}"><rect width="900" height="300" rx="44" fill="${m[0]}"/><circle cx="150" cy="150" r="98" fill="${m[1]}"/><g transform="translate(28 28)" fill="none" stroke="${m[0]}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">${m[3]}</g><text x="150" y="166" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="900" fill="${m[0]}">${m[2]}</text><text x="292" y="132" font-family="Arial,sans-serif" font-size="38" font-weight="800" fill="#fff">${esc(item.title)}</text><text x="294" y="184" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" fill="${m[1]}">${esc(item.segment.replace(/-/g, " ").toUpperCase())}</text><text x="294" y="226" font-family="Arial,sans-serif" font-size="17" fill="#fff" opacity=".76">Marca dedicada · presença digital 0WEB</text></svg>`; }
function social(item, m) { const summary = String(item.summary || `Presença digital em ${item.city} — ${item.state}.`).replace(/\s+/g, " ").slice(0, 64); return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${m[0]}"/><circle cx="1040" cy="70" r="260" fill="${m[1]}" opacity=".17"/><rect x="76" y="74" width="148" height="148" rx="36" fill="${m[1]}"/><text x="150" y="166" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="900" fill="${m[0]}">${m[2]}</text><text x="76" y="326" font-family="Arial,sans-serif" font-size="50" font-weight="800" fill="#fff">${esc(item.title)}</text><text x="78" y="382" font-family="Arial,sans-serif" font-size="21" fill="#fff" opacity=".85">${esc(summary)}${summary.length >= 64 ? "…" : ""}</text><g transform="translate(790 130) scale(1.8)" fill="none" stroke="${m[1]}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">${m[3]}</g><text x="78" y="520" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" font-weight="700" fill="${m[1]}">${esc(item.segment.replace(/-/g, " ").toUpperCase())}</text></svg>`; }

for (const [slug, m] of Object.entries(art)) {
  const item = catalog.find((x) => x.slug === slug);
  if (!item) continue;
  const dir = resolve(root, "public/images", slug); await mkdir(dir, { recursive: true });
  const logoSvg = logo(item, m); const socialSvg = social(item, m);
  await writeFile(resolve(dir, "logo.svg"), `${logoSvg}\n`); await writeFile(resolve(dir, "social-source.svg"), `${socialSvg}\n`);
  await sharp(Buffer.from(socialSvg)).jpeg({ quality: 86, progressive: true }).toFile(resolve(dir, "hero-og.jpg"));
  const entry = assets.clients[slug] ?? {}; entry.icon = `/images/${slug}/logo.svg`; entry.socialImage = `/images/${slug}/hero-og.jpg`; entry.socialVersion = createHash("sha1").update(socialSvg).digest("hex").slice(0, 8); assets.clients[slug] = entry;
  const contract = contracts.contracts[slug] ?? {}; contract.logoStatus = "GENERATED_BY_0WEB"; contract.coverStatus = "BRAND_COMPOSITION"; contract.identityStatus = "DELIVERED_FOR_PORTFOLIO"; contract.logoFile = entry.icon; contract.socialFile = entry.socialImage; contract.identityNote = "Marca dedicada criada para substituir foto/capa usada indevidamente como logo; aguarda troca apenas se o cliente fornecer marca oficial."; contracts.contracts[slug] = contract;
}
await writeFile(assetsPath, `${JSON.stringify(assets, null, 2)}\n`); await writeFile(contractsPath, `${JSON.stringify(contracts, null, 2)}\n`);
console.log(`[logo-backlog] OK — ${Object.keys(art).length} logos dedicadas e capas sociais refeitas`);
