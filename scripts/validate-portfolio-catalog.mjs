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
  if (typeof copy !== "string" || copy.trim().length < 120) errors.push(`${item.slug}: divulgação individual ausente ou curta`);
  if (typeof copy === "string" && !copy.includes(`https://0web.com.br/portfolio/${item.slug}`)) errors.push(`${item.slug}: divulgação sem URL canônica`);
}
for (const client of clients) if (!seen.has(client.slug)) errors.push(`${client.slug}: cliente registrado sem item no catálogo`);
if (!/getPortfolioPresenceKit/.test(presenceKitSource) || !/printMockup/.test(presenceKitSource) || !/brandBrief/.test(presenceKitSource)) {
  errors.push("contrato de kit de presença (brandBrief/printMockup) ausente");
}
if (errors.length) { console.error(`[portfolio-catalog] ${errors.length} erro(s)`); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log(`[portfolio-catalog] OK — ${catalog.length} itens canônicos, ${clients.length} clientes registrados.`);
