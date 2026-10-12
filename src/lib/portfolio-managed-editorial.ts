/**
 * Quality floor for NEW Managed portfolio sites only.
 *
 * Historical Managed/legacy pages are excluded by their existing forward-only
 * authorial_composition.required policy. This guard never invents facts or
 * automatically transforms editorial content.
 *
 * Comparable to the v4 catalog editorial checks, without importing build
 * scripts or introducing a separate publishing pipeline.
 */
export type ManagedEditorialReadinessInput = Readonly<{
  summary: string;
  about: string;
  seoTitle: string;
  seoDescription: string;
}>;

export type ManagedEditorialReadinessIssue = {
  code: string;
  message: string;
};

const PLACEHOLDER =
  /(?:lorem\s+ipsum|texto\s+(?:de\s+)?exemplo|descri(?:ç|c)(?:ã|a)o\s+aqui|nome\s+da\s+empresa|sua\s+empresa\s+aqui|em\s+constru(?:ç|c)(?:ã|a)o|preencher\s+aqui|teste\s+de\s+portf[oó]lio)/i;
const TOKEN = /\[(?:PREENCHER|TODO|INSERIR|NOME|DESCRICAO|DESCRIÇÃO)\]/i;
// The autonomous draft is intentionally safe but not yet a client-specific
// narrative. Keeping its stock "about" text is not sufficient to publish.
const AUTONOMOUS_DRAFT_BOILERPLATE =
  /esta\s+página\s+reúne\s+somente\s+informações\s+sustentadas/i;

function normalizeCopy(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function evaluateNewManagedEditorialReadiness(
  input: ManagedEditorialReadinessInput,
): ManagedEditorialReadinessIssue[] {
  const issues: ManagedEditorialReadinessIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });
  const summary = input.summary.trim();
  const about = input.about.trim();
  const title = input.seoTitle.trim();
  const description = input.seoDescription.trim();

  if (summary.length < 80) {
    add("PORTFOLIO_EDITORIAL_SUMMARY_THIN", "Novo projeto exige resumo próprio com pelo menos 80 caracteres factuais.");
  }
  if (about.length < 100) {
    add("PORTFOLIO_EDITORIAL_ABOUT_THIN", "Novo projeto exige apresentação institucional específica com pelo menos 100 caracteres.");
  }
  if (description.length < 80) {
    add("PORTFOLIO_EDITORIAL_SEO_DESCRIPTION_THIN", "Novo projeto exige descrição SEO útil e específica com pelo menos 80 caracteres.");
  }

  if ([summary, about, title, description].some((value) => TOKEN.test(value) || PLACEHOLDER.test(value))) {
    add("PORTFOLIO_EDITORIAL_PLACEHOLDER", "Remova textos provisórios ou campos de preenchimento antes de publicar.");
  }
  if (AUTONOMOUS_DRAFT_BOILERPLATE.test(about)) {
    add(
      "PORTFOLIO_EDITORIAL_RESEARCH_SCAFFOLD",
      "O resumo automático de pesquisa é rascunho; produza uma apresentação autoral baseada em evidências.",
    );
  }
  if (summary && description && normalizeCopy(summary) === normalizeCopy(description)) {
    add(
      "PORTFOLIO_EDITORIAL_DUPLICATED_META",
      "A meta description deve ser específica e não uma cópia do resumo editorial.",
    );
  }
  return issues;
}
