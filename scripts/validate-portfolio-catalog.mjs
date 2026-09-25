import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync(path.join(root, "src/config/portfolio-catalog.json"), "utf8"));
const clients = JSON.parse(fs.readFileSync(path.join(root, "src/config/portfolio-clients.json"), "utf8"));
const shareCopy = JSON.parse(fs.readFileSync(path.join(root, "src/config/portfolio-share-copy.json"), "utf8"));
const presenceKitSource = fs.readFileSync(path.join(root, "src/components/portfolio/PortfolioPresenceKit.tsx"), "utf8");
const required = ["slug", "clientKey", "title", "segment", "projectType", "status", "tags"];
const errors = []; const seen = new Set();
for (const item of catalog) {
  for (const key of required) if (item[key] === undefined || item[key] === "") errors.push(`${item.slug ?? "<sem slug>"}: campo ${key} ausente`);
  if (!/^[a-z0-9][a-z0-9_-]{0,80}$/.test(item.slug ?? "")) errors.push(`${item.slug}: slug inválido`);
  if (seen.has(item.slug)) errors.push(`${item.slug}: slug duplicado`); seen.add(item.slug);
  if (!Array.isArray(item.tags) || item.tags.length === 0) errors.push(`${item.slug}: tags obrigatórias`);
  const copy = shareCopy[item.slug];
  const canonicalUrl = `https://0web.com.br/portfolio/${item.slug}`;
  if (typeof copy !== "string" || copy.trim().length < 120) {
    errors.push(`${item.slug}: divulgação individual ausente ou curta`);
  }
  if (typeof copy === "string") {
    const urls = copy.match(/https?:\/\/[^\s]+/g) ?? [];
    const hashtags = copy.match(/#[A-Za-z0-9_]+/g) ?? [];
    const canonicalOnOwnLine = copy
      .split(/\r?\n/)
      .some((line) => line.trim() === canonicalUrl);

    if (copy.includes("\\n")) errors.push(`${item.slug}: divulgação contém \\n literal`);
    if (!copy.includes("\n\n")) errors.push(`${item.slug}: divulgação sem separação de parágrafos`);
    if (urls.length !== 1 || urls[0] !== canonicalUrl || !canonicalOnOwnLine) {
      errors.push(`${item.slug}: divulgação com URL canônica mal formatada`);
    }
    if (hashtags.length === 0 || hashtags.at(-1) !== "#0WEB") {
      errors.push(`${item.slug}: divulgação deve terminar com #0WEB como última hashtag`);
    }
    if (/\[[^\]]+\]\(https?:\/\//.test(copy)) {
      errors.push(`${item.slug}: divulgação não pode conter link em markdown`);
    }
  }
}
for (const copySlug of Object.keys(shareCopy)) if (!seen.has(copySlug)) errors.push(`${copySlug}: divulgação órfã sem item no catálogo`);
for (const client of clients) if (!seen.has(client.slug)) errors.push(`${client.slug}: cliente registrado sem item no catálogo`);
if (!/getPortfolioPresenceKit/.test(presenceKitSource) || !/printMockup/.test(presenceKitSource) || !/brandBrief/.test(presenceKitSource)) {
  errors.push("contrato de kit de presença (brandBrief/printMockup) ausente");
}
if (errors.length) { console.error(`[portfolio-catalog] ${errors.length} erro(s)`); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log(`[portfolio-catalog] OK — ${catalog.length} itens canônicos, ${clients.length} clientes registrados.`);
