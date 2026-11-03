#!/usr/bin/env node
/**
 * Preparação de vários portfólios em DRAFT, reutilizando o scaffold oficial.
 * Não faz scraping, não compõe sites, não inventa dados, não publica.
 * Sem --execute é sempre dry run. Tamanho padrão por rodada: 10, máximo 25.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const MAX_BATCH = 25;
const MAX_QUEUE = 1000;
const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,80}$/;
const FUNNEL_TYPES = new Set(["orcamento", "pedido", "agendamento", "diagnostico", "reserva", "solicitacao", "contato"]);
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

function slugify(name) {
  return String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function validNumber(value, fallback, min, max) {
  if (value == null) return fallback;
  if (!/^\d+$/.test(String(value))) throw new Error("Valor numérico inválido: " + value);
  const n = Number(value);
  if (n < min || n > max) throw new Error("Valor fora do intervalo " + min + ".." + max + ": " + n);
  return n;
}

/** Não cria arquivos: valida a fila inteira antes de qualquer execução. */
export function prepareBatch(raw, { offset = 0, limit = 10 } = {}) {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > MAX_QUEUE) {
    throw new Error("Fila deve ter de 1 a " + MAX_QUEUE + " negócios.");
  }
  const seen = new Set();
  const records = raw.map((item, i) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Registro " + (i + 1) + ": exige objeto {name, location, slug?}.");
    }
    const name = typeof item.name === "string" ? item.name.trim() : "";
    const location = typeof item.location === "string" ? item.location.replace(/\\s+/g, " ").trim() : "";
    const slug = typeof item.slug === "string" && item.slug.trim() ? item.slug.trim() : slugify(name);
    const funnelType = item.funnelType ?? "contato";
    const segment = typeof item.segment === "string" ? item.segment.trim() : "";
    if (!name || name.length < 3 || name.length > 120 || !location || location.length < 5 || location.length > 200) {
      throw new Error("Registro " + (i + 1) + ": nome (3..120) e localização (5..200) factual obrigatórios.");
    }
    // Scaffold original interpola o nome em JSX/SQL: não permitir entrada que
    // quebre strings, insira código, tags ou linhas extras. Revisar casos rejeitados.
    if (!/^[\\p{L}\\p{M}\\p{N} .,&()\\/+°ºª-]+$/u.test(name)) {
      throw new Error("Registro " + (i + 1) + ": nome contém caracteres inseguros para o scaffold.");
    }
    if (!SLUG_RE.test(slug) || !FUNNEL_TYPES.has(funnelType) ||
        (segment && !/^[a-z0-9-]{1,48}$/.test(segment))) {
      throw new Error("Registro " + (i + 1) + ": slug, segmento ou funnelType inválido.");
    }
    if (seen.has(slug)) {
      throw new Error("Slug duplicado na fila: " + slug + ". Diferencie filiais com slug explícito.");
    }
    seen.add(slug);
    return {
      slug, name, location, funnelType,
      segment,
    };
  });
  if (!Number.isInteger(offset) || offset < 0 || offset >= raw.length) throw new Error("offset inválido.");
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_BATCH) throw new Error("limit deve ser 1.." + MAX_BATCH);
  return { total: records.length, offset, count: Math.min(limit, records.length - offset), records: records.slice(offset, offset + limit) };
}

async function main(argv) {
  const get = (flag) => {
    const pos = argv.indexOf(flag);
    return pos < 0 ? null : argv[pos + 1];
  };
  const file = get("--input");
  if (!file) throw new Error("Uso: --input /caminho/empresas.json [--offset 0] [--limit 10] [--execute] [--json]");
  const raw = JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8"));
  const offset = validNumber(get("--offset"), 0, 0, MAX_QUEUE);
  const limit = validNumber(get("--limit"), 10, 1, MAX_BATCH);
  const plan = prepareBatch(raw, { offset, limit });
  const existing = new Set(
    JSON.parse(readFileSync(resolve(ROOT, "src/config/portfolio-clients.json"), "utf8")).map((x) => x.slug),
  );
  const results = plan.records.map((x) => ({
    ...x,
    stage: existing.has(x.slug) ? "EXISTING_UNCHANGED" : "DRAFT_PLANNED",
  }));
  const execute = argv.includes("--execute");
  const created = [];
  if (execute) {
    // O gerador escreve apenas DRAFT e workbench não-publicável. Nunca envia prompts.
    // Falha de um registro interrompe o lote sem tentar os seguintes.
    for (const item of results) {
      if (item.stage === "EXISTING_UNCHANGED") continue;
      const args = [
        "scripts/scaffold-portfolio-client.mjs",
        "--slug", item.slug,
        "--name", item.name,
        "--funnel-type", item.funnelType,
        ...(item.segment ? ["--segment", item.segment] : []),
      ];
      const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: "utf8", timeout: 60000, maxBuffer: 2 * 1024 * 1024 });
      if (r.status !== 0) {
        throw new Error("Scaffold falhou em " + item.slug + ": " + (r.stderr || r.stdout || r.error?.message || ""));
      }
      const briefPath = resolve(ROOT, "docs/portfolio/briefs/" + item.slug + ".md");
      if (existsSync(briefPath)) {
        appendFileSync(briefPath,
          "\n## Intake inicial — informado, ainda não verificado\n\n" +
          "- Empresa: " + item.name + "\n" +
          "- Localização fornecida para pesquisa R1: " + item.location + "\n" +
          "- Status: PENDENTE_VERIFICACAO_EXTERNA\n",
          "utf8");
      }
      item.stage = "DRAFT_CREATED";
      created.push(item.slug);
    }
  }
  const summary = { totalQueue: plan.total, offset: plan.offset, processed: plan.count, created: created.length, execute };
  if (argv.includes("--json")) console.log(JSON.stringify({ summary, results }, null, 2));
  else {
    console.log("[portfolio-batch-scaffold] " + JSON.stringify(summary));
    for (const x of results) console.log("  " + x.slug + " — " + x.stage + " — " + x.location);
    console.log("Próximo: R1 pesquisa e identidade -> brief/arte autoral -> mídia/QA -> gates -> publicação em lote.");
    if (!execute) console.log("Nenhum arquivo alterado. Use --execute apenas após revisar a fila.");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error("[portfolio-batch-scaffold] " + error.message);
    process.exitCode = 2;
  });
}
