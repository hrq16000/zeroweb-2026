#!/usr/bin/env node
/**
 * Closes the identity backlog for projects whose contract was still pending.
 * Each mark is intentionally art-directed to the client's visual metaphor;
 * this is not the generic initials fallback used by the legacy seed script.
 */
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

const marks = {
  "almeida-torres": { dark: "#182d3d", accent: "#c79b58", label: "AT", art: `<path d="M122 56v18M72 86h100M78 86l-28 64h56L78 86Zm88 0-28 64h56l-28-64ZM48 166h112"/><circle cx="122" cy="42" r="10"/>` },
  "bh-barreiro-marmitas": { dark: "#21473d", accent: "#f2a73b", label: "MB", art: `<path d="M52 96h140l-12 72H64L52 96Zm22 0V74h96v22M86 122h72M96 146h52"/>` },
  "casa-nativa": { dark: "#241f27", accent: "#c67b43", label: "CN", art: `<path d="m48 112 74-62 74 62v72H48v-72Zm38 72v-55h72v55M122 50v-22M78 112h88"/><path d="M62 52c15-20 32-24 48-10"/>` },
  "clinica-integrada": { dark: "#173a46", accent: "#7bd6b2", label: "CI", art: `<path d="M122 44v148M48 118h148M78 72h88M78 164h88"/><circle cx="122" cy="118" r="46"/>` },
  "guaratuba-atelie-presentes": { dark: "#493044", accent: "#f3b17c", label: "AE", art: `<path d="M48 90h148v94H48zM48 90l74 46 74-46M122 136v48M80 90c-20-36 24-52 42 0 18-52 62-36 42 0"/>` },
  "guaratuba-oficina-nautica": { dark: "#0d344c", accent: "#f09b42", label: "ON", art: `<path d="M42 150h160l-32 34H74l-32-34Zm22-18 58-58 58 58M122 74V46M88 132h68"/><path d="M42 202c28-14 54-14 80 0 26-14 52-14 80 0"/>` },
  "guaratuba-reparos-residenciais": { dark: "#273347", accent: "#f3c84b", label: "RR", art: `<path d="m44 108 78-64 78 64v78H44v-78Zm48 78v-56h60v56M168 62l22 22-48 48-22-22 48-48ZM112 110l-22 22"/>` },
  "guaratuba-sabores-da-baia": { dark: "#124d59", accent: "#f28d62", label: "SB", art: `<path d="M42 150c27-23 54-23 80 0 27-23 54-23 80 0M42 178c27-23 54-23 80 0 27-23 54-23 80 0M122 52v70M96 82h52"/>` },
  "mirassol-conserta-celular": { dark: "#202b37", accent: "#96d34f", label: "MC", art: `<rect x="72" y="40" width="100" height="156" rx="18"/><path d="M96 70h52M96 166h52M122 92v44M100 114h44"/>` },
  "mirassol-delicias-caseiras": { dark: "#5a2f2b", accent: "#f1b47b", label: "DC", art: `<path d="M54 126h136l-14 58H68l-14-58Zm22 0c0-38 92-38 92 0M122 48v34M100 64h44M82 154h80"/>` },
  "uberlandia-eletrica-residencial": { dark: "#1b2530", accent: "#f6c744", label: "ER", art: `<path d="m132 32-54 96h42l-18 70 58-104h-42l14-62Z"/><path d="M46 202h152"/>` },
};

function esc(value) { return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c])); }
function svgLogo(item, mark) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300" role="img" aria-labelledby="title desc">
  <title id="title">${esc(item.title)}</title><desc id="desc">Identidade visual de ${esc(item.title)}</desc>
  <rect width="900" height="300" rx="44" fill="${mark.dark}"/><path d="M0 240C210 180 280 320 510 238S760 176 900 218V300H0Z" fill="${mark.accent}" opacity=".16"/>
  <circle cx="150" cy="150" r="98" fill="${mark.accent}"/><g transform="translate(28 28)" fill="none" stroke="${mark.dark}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">${mark.art}</g>
  <text x="150" y="166" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="900" fill="${mark.dark}">${esc(mark.label)}</text>
  <text x="292" y="132" font-family="Arial,sans-serif" font-size="40" font-weight="800" fill="#fff">${esc(item.title)}</text>
  <text x="294" y="184" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="3" fill="${mark.accent}">${esc(item.segment.replace(/-/g, " ").toUpperCase())}</text>
  <text x="294" y="226" font-family="Arial,sans-serif" font-size="17" fill="#fff" opacity=".78">Identidade 0WEB · direção visual exclusiva</text></svg>`;
}
function svgSocial(item, mark) {
  const summary = String(item.summary || `Presença digital em ${item.city} — ${item.state}.`).replace(/\s+/g, " ").slice(0, 65);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${mark.dark}"/><circle cx="1020" cy="70" r="280" fill="${mark.accent}" opacity=".18"/><circle cx="160" cy="600" r="270" fill="${mark.accent}" opacity=".12"/><g transform="translate(760 165) scale(1.7)" fill="none" stroke="${mark.accent}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">${mark.art}</g><rect x="76" y="74" width="148" height="148" rx="36" fill="${mark.accent}"/><text x="150" y="166" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="900" fill="${mark.dark}">${esc(mark.label)}</text><text x="76" y="326" font-family="Arial,sans-serif" font-size="54" font-weight="800" fill="#fff">${esc(item.title)}</text><text x="78" y="382" font-family="Arial,sans-serif" font-size="21" fill="#fff" opacity=".85">${esc(summary)}${summary.length >= 65 ? "…" : ""}</text><text x="78" y="520" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" font-weight="700" fill="${mark.accent}">${esc(item.segment.replace(/-/g, " ").toUpperCase())}</text></svg>`;
}

const pending = Object.entries(contracts.contracts ?? {}).filter(([slug, value]) => ["LOGO_PENDING", "CONCEPT_PENDING_APPROVAL"].includes(value.logoStatus) || (value.identityStatus === "DELIVERED_FOR_PORTFOLIO" && marks[slug]));
for (const [slug, contract] of pending) {
  const item = catalog.find((entry) => entry.slug === slug);
  if (!item) continue;
  if (contract.logoStatus === "CONCEPT_PENDING_APPROVAL") {
    contract.logoStatus = "CONCEPT_DELIVERED";
    contract.identityStatus = "DELIVERED_FOR_PORTFOLIO";
    continue;
  }
  const mark = marks[slug];
  if (!mark) throw new Error(`Missing art direction for ${slug}`);
  const dir = resolve(root, "public/images", slug);
  await mkdir(dir, { recursive: true });
  const logo = svgLogo(item, mark);
  const social = svgSocial(item, mark);
  await writeFile(resolve(dir, "logo.svg"), `${logo}\n`);
  await writeFile(resolve(dir, "social-source.svg"), `${social}\n`);
  await sharp(Buffer.from(social)).jpeg({ quality: 86, progressive: true }).toFile(resolve(dir, "hero-og.jpg"));
  const entry = assets.clients[slug] ?? {};
  entry.icon = `/images/${slug}/logo.svg`;
  entry.socialImage = `/images/${slug}/hero-og.jpg`;
  entry.socialVersion = createHash("sha1").update(social).digest("hex").slice(0, 8);
  assets.clients[slug] = entry;
  contract.logoStatus = "GENERATED_BY_0WEB";
  contract.identityStatus = "DELIVERED_FOR_PORTFOLIO";
  contract.logoFile = entry.icon;
  contract.socialFile = entry.socialImage;
  contract.identityNote = "Marca conceitual criada para a presença digital; aguarda eventual substituição por arquivo oficial do cliente.";
}

await writeFile(assetsPath, `${JSON.stringify(assets, null, 2)}\n`);
await writeFile(contractsPath, `${JSON.stringify(contracts, null, 2)}\n`);
console.log(`[identity-backlog] OK — ${pending.length} contratos concluídos (${pending.filter(([, c]) => c.logoStatus === "GENERATED_BY_0WEB").length} logos redesenhadas e ${pending.filter(([, c]) => c.logoStatus === "CONCEPT_DELIVERED").length} conceitos entregues)`);
