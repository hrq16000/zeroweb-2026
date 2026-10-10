/**
 * Bloqueio de metadados copiados/placeholder antes da primeira publicação
 * dos NOVOS portfólios (contrato v4+).
 *
 * Não altera texto nem infere serviços, endereços ou sinais locais:
 * exige evidência editorial mínima e copy distintiva no catálogo versionado.
 */
const PUBLIC_STATES = new Set(["approved", "published"]);
const PLACEHOLDER = /\b(?:lorem ipsum|texto exemplo|texto de exemplo|descri(?:ç|c)(?:ã|a)o aqui|nome da empresa|sua empresa aqui|em constru(?:ç|c)(?:ã|a)o|preencher aqui|teste de portfolio)\b/i;
const TOKEN = /\[(?:PREENCHER|TODO|INSERIR|NOME|DESCRICAO|DESCRIÇÃO)\]/i;

export function normalizedSeoCopy(value) {
  if (typeof value !== "string") return "";
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export function checkNewPortfolioSeoCopy(slug, manifest, project, catalog) {
  if (Number(manifest?.contractVersion ?? 0) < 4 || manifest?.stage !== "published") return [];
  const errors = [];
  const label = `[${slug}] PORTFOLIO_SEO_ORIGINALITY_GATE`;
  const title = typeof project?.title === "string" ? project.title.trim() : "";
  const summary = typeof project?.summary === "string" ? project.summary.trim() : "";
  const titleKey = normalizedSeoCopy(title);
  const summaryKey = normalizedSeoCopy(summary);
  if (titleKey.length < 2 || TOKEN.test(title) || PLACEHOLDER.test(title)) {
    errors.push(`${label}: título editorial ausente, genérico ou placeholder`);
  }
  if (summary.length < 80 || TOKEN.test(summary) || PLACEHOLDER.test(summary)) {
    errors.push(`${label}: resumo original com 80+ caracteres sem placeholders obrigatório`);
  }

  // Mesmo título ou resumo exato de outro negócio indica copy reutilizada.
  // Não faz juízo subjetivo sobre semelhança de setores e não cria fatos.
  for (const peer of Array.isArray(catalog) ? catalog : []) {
    if (!peer || peer.slug === slug || !PUBLIC_STATES.has(peer.status) || peer.live === false) continue;
    if (titleKey && titleKey === normalizedSeoCopy(peer.title)) {
      errors.push(`${label}: título duplicado do portfolio ${peer.slug}`);
    }
    if (summaryKey && summaryKey === normalizedSeoCopy(peer.summary)) {
      errors.push(`${label}: resumo duplicado do portfolio ${peer.slug}`);
    }
  }
  return errors;
}
