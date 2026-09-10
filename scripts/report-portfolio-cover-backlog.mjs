#!/usr/bin/env node
/**
 * Plano de capas: para cada cliente sem capa publicada, lista o motivo,
 * o material que já existe (foto, logo, variantes) e o que precisa chegar.
 * Saída: docs/PORTFOLIO_COVER_BACKLOG.md
 */
import fs from "node:fs";
import path from "node:path";

const status = JSON.parse(fs.readFileSync("src/config/portfolio-cover-status.json", "utf8"));
const ACTION = {
  NEEDS_CROP: "Recorte 16:10 com ponto focal + aprovação humana",
  CONTACT_OR_PII: "Mesma foto sem telefone, endereço, e-mail ou QR",
  PROMOTIONAL_MATERIAL: "Foto do produto/espaço, sem preço nem campanha",
  LOGO_ONLY: "Foto real do trabalho, produto ou fachada",
  NO_REAL_ASSET: "Material fotográfico oficial do cliente",
  UNCERTAIN_ORIGIN: "Confirmar origem do arquivo e registrar decisão",
};

const rows = status.projects.filter((p) => p.status !== "VALID");
const lines = [];
lines.push("# Plano de capas pendentes do /portfolio", "");
lines.push(`Gerado por \`scripts/report-portfolio-cover-backlog.mjs\` em ${new Date().toISOString().slice(0, 10)}.`);
lines.push(`Total: ${status.projects.length} projetos · ${status.summary.valid} com capa publicada · ${rows.length} pendentes.`, "");
lines.push("Nenhuma capa é publicada sem material real e autorizado do cliente.", "");
lines.push("| Cliente | Slug | Motivo | Tem foto? | Tem logo? | Variantes existentes | O que falta |");
lines.push("|---|---|---|---|---|---|---|");

for (const r of rows.sort((a, b) => a.status.localeCompare(b.status) || a.slug.localeCompare(b.slug))) {
  const dir = path.join("public/images", r.slug);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const photos = files.filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f) && !/logo|icon|icone|marca/i.test(f));
  const logos = files.filter((f) => /logo|icon|icone|marca/i.test(f));
  lines.push(
    `| ${r.businessName ?? r.slug} | \`${r.slug}\` | ${r.status} — ${r.reason ?? ""} | ${photos.length ? `sim (${photos.length})` : "não"} | ${logos.length ? "sim" : "não"} | ${files.length ? files.join(", ") : "—"} | ${ACTION[r.status] ?? "Revisar"} |`,
  );
}
lines.push("");
fs.writeFileSync("docs/PORTFOLIO_COVER_BACKLOG.md", `${lines.join("\n")}\n`);
console.log(`[cover-backlog] ${rows.length} pendências documentadas em docs/PORTFOLIO_COVER_BACKLOG.md`);
