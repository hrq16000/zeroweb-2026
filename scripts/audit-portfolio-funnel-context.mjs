#!/usr/bin/env node
/**
 * Auditoria semântica do funil de cada projeto /portfolio/<slug>.
 *
 * Verifica se o bloco "próximo passo", o CTA e a mensagem encaminhada ao
 * WhatsApp do cliente têm a MESMA intenção comercial e se nenhum projeto
 * herdou texto de outro segmento.
 *
 * Fonte de verdade: src/config/portfolio-funnel-context.json (contrato) +
 * src/config/portfolio-catalog.json (segmento/negócio).
 *
 * Uso:
 *   node scripts/audit-portfolio-funnel-context.mjs            → relatório
 *   node scripts/audit-portfolio-funnel-context.mjs --check    → falha em FAIL
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const check = process.argv.includes("--check");
const read = (p) => JSON.parse(readFileSync(resolve(p), "utf8"));

const contracts = read("src/config/portfolio-funnel-context.json");
const catalog = read("src/config/portfolio-catalog.json");

const INTENTS = new Set([
  "orcamento", "agendamento", "pedido", "avaliacao",
  "visita", "contato", "reserva", "diagnostico", "solicitacao",
]);

const FORBIDDEN = {
  pedido: ["visita técnica", "vistoria", "diagnóstico técnico", "orçamento de obra", "manutenção elétrica", "reforma"],
  agendamento: ["cardápio", "orçamento de obra", "vistoria", "frete", "diagnóstico técnico"],
  orcamento: ["cardápio", "reserva de mesa", "agendamento estético", "encomenda de bolo"],
  diagnostico: ["cardápio", "reserva de mesa", "encomenda", "orçamento de obra"],
  reserva: ["orçamento de obra", "diagnóstico técnico", "manutenção elétrica", "vistoria"],
  avaliacao: ["cardápio", "reserva de mesa"],
  visita: ["cardápio", "reserva de mesa"],
  contato: [],
  solicitacao: ["cardápio", "reserva de mesa"],
};

const SEGMENT_INTENT = {
  restaurantes: "pedido", comercios: "pedido", beleza: "agendamento", saude: "agendamento",
  juridico: "contato", construcao: "orcamento", servicos: "orcamento",
  "prestadores-de-servicos": "orcamento", agencias: "contato",
};

const rows = [];
const seenCopy = new Map();

for (const item of catalog) {
  const contract = contracts[item.slug];
  const intent = contract?.intent ?? SEGMENT_INTENT[item.segment] ?? "contato";
  const source = contract ? "PROJECT_CONTRACT" : "SEGMENT_FALLBACK";
  const nextStepTitle = contract?.nextStepTitle ?? `Fale com ${item.title} sobre o que você precisa.`;
  const nextStepBody = contract?.nextStepBody ?? `Conte sua necessidade e os detalhes importantes para ${item.title}.`;
  const cta = contract?.primaryCtaLabel ?? "Fale com a empresa";
  const issues = [];

  if (!INTENTS.has(intent)) issues.push({ code: "PORTFOLIO_FUNNEL_INTENT_INVALID", detail: intent });

  const text = `${nextStepTitle} ${nextStepBody} ${cta}`.toLowerCase();
  for (const term of FORBIDDEN[intent] ?? []) {
    if (text.includes(term)) {
      issues.push({ code: "PORTFOLIO_FUNNEL_CONTEXT_MISMATCH", detail: `termo "${term}" incompatível com intenção ${intent}` });
    }
  }
  if (/\bo projeto\b|\bdo projeto\b|\bvitrine\b/.test(cta.toLowerCase())) {
    issues.push({ code: "PORTFOLIO_FUNNEL_GENERIC_CTA", detail: `CTA "${cta}" fala do projeto e não do negócio` });
  }
  if (source !== "PROJECT_CONTRACT") {
    issues.push({ code: "PORTFOLIO_FUNNEL_FALLBACK", detail: "sem contrato próprio — fallback neutro" });
  }

  // Isolamento: nenhum projeto pode compartilhar exatamente a mesma copy.
  const fingerprint = `${nextStepTitle}||${nextStepBody}||${cta}`.toLowerCase();
  if (seenCopy.has(fingerprint)) {
    issues.push({ code: "PORTFOLIO_FUNNEL_COPY_SHARED", detail: `copy idêntica à de ${seenCopy.get(fingerprint)}` });
  } else if (contract) {
    seenCopy.set(fingerprint, item.slug);
  }

  const status = issues.some((i) => i.code === "PORTFOLIO_FUNNEL_CONTEXT_MISMATCH" || i.code === "PORTFOLIO_FUNNEL_GENERIC_CTA" || i.code === "PORTFOLIO_FUNNEL_COPY_SHARED" || i.code === "PORTFOLIO_FUNNEL_INTENT_INVALID")
    ? "FAIL"
    : issues.length ? "WARNING" : "PASS";

  rows.push({
    slug: item.slug,
    businessName: item.title,
    segment: item.segment,
    intent,
    source,
    nextStepTitle,
    nextStepBody,
    primaryCtaLabel: cta,
    whatsappIntent: intent,
    status,
    issues,
  });
}

const summary = {
  generatedAt: new Date().toISOString(),
  audited: rows.length,
  pass: rows.filter((r) => r.status === "PASS").length,
  warning: rows.filter((r) => r.status === "WARNING").length,
  fail: rows.filter((r) => r.status === "FAIL").length,
  byIntent: rows.reduce((acc, r) => ({ ...acc, [r.intent]: (acc[r.intent] ?? 0) + 1 }), {}),
};

mkdirSync(resolve("reports"), { recursive: true });
writeFileSync(resolve("reports/portfolio-funnel-context.json"), `${JSON.stringify({ summary, projects: rows }, null, 2)}\n`);

const md = [
  "# Auditoria de coerência de funil — /portfolio/:slug",
  "",
  `Gerado em ${summary.generatedAt}`,
  "",
  `- Projetos auditados: **${summary.audited}**`,
  `- PASS: **${summary.pass}** · WARNING: **${summary.warning}** · FAIL: **${summary.fail}**`,
  `- Intenções: ${Object.entries(summary.byIntent).map(([k, v]) => `${k} (${v})`).join(" · ")}`,
  "",
  "| slug | segmento | intenção | próximo passo | CTA | origem | status | problema |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((r) => `| ${r.slug} | ${r.segment} | ${r.intent} | ${r.nextStepBody} | ${r.primaryCtaLabel} | ${r.source} | ${r.status} | ${r.issues.map((i) => i.code).join(", ") || "—"} |`),
  "",
].join("\n");
writeFileSync(resolve("reports/portfolio-funnel-context.md"), md);

console.log(`funnel-context: ${summary.audited} auditados · PASS ${summary.pass} · WARNING ${summary.warning} · FAIL ${summary.fail}`);
for (const row of rows.filter((r) => r.status !== "PASS")) {
  console.log(` - [${row.status}] ${row.slug}: ${row.issues.map((i) => `${i.code} (${i.detail})`).join("; ")}`);
}
if (check && summary.fail > 0) {
  console.error(`\nFalha: ${summary.fail} projeto(s) com funil incoerente.`);
  process.exit(1);
}
