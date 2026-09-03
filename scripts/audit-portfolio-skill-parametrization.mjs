#!/usr/bin/env node
// ============================================================================
// Auditoria de parametrização por skill dos projetos /portfolio/<slug>.
//
// Regra: todo projeto publicado precisa estar parametrizado nas seis
// categorias obrigatórias do documentacional (docs/PORTFOLIO_SKILL_PARAMETRIZATION.md).
// A parametrização vem SEMPRE dos arquivos canônicos de configuração — nunca
// de ajuste manual dentro do componente — para que projetos futuros herdem o
// padrão automaticamente.
//
// Uso: node scripts/audit-portfolio-skill-parametrization.mjs [--json]
// Saída: seo-reports/portfolio-skill-parametrization.json
// ============================================================================
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

const catalog = read("src/config/portfolio-catalog.json");
const clients = read("src/config/portfolio-clients.json");
const assets = read("src/config/portfolio-assets.json");
const globalConfig = read("src/config/portfolio-global-config.json");
const quizSource = fs.readFileSync(
  path.join(root, "src/config/portfolio-quiz-configs.generated.ts"),
  "utf8",
);

const clientByKey = new Map(clients.map((c) => [c.clientKey, c]));
const clientBySlug = new Map(clients.map((c) => [c.slug, c]));
const assetsByKey = assets.clients ?? {};
const overrides = globalConfig.overrides ?? {};
const quizKeys = new Set(
  [...quizSource.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]),
);
const registrySlugs = new Set(
  [
    ...fs
      .readFileSync(path.join(root, "src/lib/portfolio-site-registry.ts"), "utf8")
      .matchAll(/slug:\s*"([a-z0-9-]+)"/g),
  ].map((m) => m[1]),
);

/** Categorias obrigatórias -> verificação objetiva sobre a configuração canônica. */
function auditItem(item) {
  const key = item.clientKey ?? item.slug;
  const client = clientByKey.get(key) ?? clientBySlug.get(item.slug);
  const asset = assetsByKey[key] ?? {};
  const override = overrides[key] ?? {};
  const issues = [];
  const skills = {};

  // 1. Business / Marketing — proposta e enquadramento comercial do cliente.
  skills["business-marketing"] = Boolean(
    item.segment && item.projectType && item.subtitle && item.summary,
  );
  if (!skills["business-marketing"])
    issues.push("business-marketing: faltam segment/projectType/subtitle/summary no catálogo");

  // 2. Lead Capture / CRM — funil individual do cliente, sem funil universal.
  //    Resolução: override > registro gerado > padrão por segmento do catálogo
  //    (src/lib/portfolio-funnel-defaults.ts). Sem segmento não há funil coerente.
  const hasExplicitFunnel = quizKeys.has(key) || Boolean(override?.contactFloating?.quizConfig);
  const hasSegmentFunnel = Boolean(item.segment);
  skills["lead-capture-crm"] = hasSegmentFunnel;
  skills["lead-capture-crm-explicit"] = hasExplicitFunnel;
  if (!hasSegmentFunnel)
    issues.push("lead-capture-crm: item sem segment — funil não pode ser derivado");
  const isRegistered = Boolean(client) || registrySlugs.has(item.slug);
  if (!isRegistered)
    issues.push("lead-capture-crm: projeto ausente em portfolio-clients.json e no site-registry");


  // 3. Design / UI Automation — casca padrão + capa resolvível.
  const hasCover = Boolean(item.image || item.fallbackImage || asset.socialImage || asset.icon);
  const shellIntact =
    override?.footer?.enabled !== false && override?.hostCapturePopup?.enabled !== false;
  skills["design-ui"] = hasCover && shellIntact;
  if (!hasCover) issues.push("design-ui: nenhuma capa resolvível (image/fallbackImage/social/icon)");
  if (!shellIntact) issues.push("design-ui: override desliga rodapé ou captação da casca padrão");

  // 4. AI Copywriting — texto próprio, específico e sem placeholder.
  const summary = String(item.summary ?? "");
  const placeholder = /lorem|placeholder|em breve|texto padr/i.test(summary);
  skills["ai-copywriting"] = summary.length >= 60 && !placeholder;
  if (summary.length < 60) issues.push("ai-copywriting: summary curto demais (<60 caracteres)");
  if (placeholder) issues.push("ai-copywriting: summary contém texto placeholder");

  // 5. Local SEO — cidade, estado, termos e imagem social própria.
  skills["local-seo"] = Boolean(
    item.city && item.state && Array.isArray(item.tags) && item.tags.length >= 2 && asset.socialImage,
  );
  if (!item.city || !item.state) issues.push("local-seo: cidade/estado ausentes no catálogo");
  if (!Array.isArray(item.tags) || item.tags.length < 2)
    issues.push("local-seo: menos de 2 termos em tags");
  if (!asset.socialImage) issues.push("local-seo: sem imagem social própria");

  // 6. Engagement / Extras — prova social e crédito de hospedagem obrigatórios.
  const hasProof = Boolean(asset.proof?.title) || client?.socialProofRequired === false;
  skills["engagement-extras"] = hasProof && client?.hostCaptureRequired !== false;
  if (!hasProof) issues.push("engagement-extras: prova social do cliente não configurada");
  if (client && client.hostCaptureRequired === false)
    issues.push("engagement-extras: captação da hospedagem desligada");

  return { slug: item.slug, clientKey: key, status: item.status, skills, issues };
}

const published = catalog.filter((i) => i.status === "published");
const results = published.map(auditItem);
const failing = results.filter((r) => r.issues.length > 0);

const report = {
  generatedAt: new Date().toISOString(),
  doc: "docs/PORTFOLIO_SKILL_PARAMETRIZATION.md",
  total: results.length,
  conforming: results.length - failing.length,
  failing: failing.length,
  projects: results,
};

fs.mkdirSync(path.join(root, "seo-reports"), { recursive: true });
fs.writeFileSync(
  path.join(root, "seo-reports/portfolio-skill-parametrization.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const r of failing) {
    console.log(`\n[skills] ${r.slug}`);
    for (const issue of r.issues) console.log(`  - ${issue}`);
  }
}

if (failing.length) {
  console.error(
    `\n[portfolio-skills] FAIL — ${failing.length}/${results.length} projeto(s) fora da parametrização obrigatória`,
  );
  process.exit(1);
}
console.log(`[portfolio-skills] OK — ${results.length} projeto(s) conformes`);
