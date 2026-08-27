/**
 * Registro tipado das skills avaliadas pelo 0WEB.
 *
 * Fonte de verdade textual: docs/skills/REGISTRY.md.
 * Este módulo existe para alimentar o dashboard `/painel-skills` e os testes
 * do pipeline de descoberta — nenhuma skill é executada a partir daqui.
 */

export const SKILL_STATUSES = [
  "APPROVED_GLOBAL",
  "APPROVED_CONDITIONAL",
  "REFERENCE_ONLY",
  "SECURITY_REVIEW_REQUIRED",
  "REDUNDANT",
  "QUARANTINED",
  "REJECTED",
  "UNAVAILABLE_UPSTREAM",
] as const;

export type SkillStatus = (typeof SKILL_STATUSES)[number];

export type SkillCategory =
  | "orquestração"
  | "design/UI"
  | "QA/a11y/perf"
  | "engenharia"
  | "conteúdo/SEO"
  | "descoberta"
  | "acessibilidade";

export type SkillRecord = {
  id: string;
  name: string;
  status: SkillStatus;
  category: SkillCategory;
  source: string;
  /** Repositório/fonte original revisada; null quando não localizada. */
  originReviewed: string | null;
  /** Por que a skill foi recomendada — vazio quando rejeitada. */
  reasons: string[];
  /** Por que foi limitada, colocada em quarentena ou rejeitada. */
  objections: string[];
  /** Resultado da revisão de segurança (docs/skills/SECURITY.md). */
  securityReview: string;
  triggers: string[];
  reviewedAt: string;
};

export const SKILL_STATUS_META: Record<
  SkillStatus,
  { label: string; description: string; tone: "positive" | "neutral" | "caution" | "negative" }
> = {
  APPROVED_GLOBAL: {
    label: "Aprovada globalmente",
    description: "Aplicável a qualquer tarefa compatível, sem restrição adicional.",
    tone: "positive",
  },
  APPROVED_CONDITIONAL: {
    label: "Aprovada com condição",
    description: "Só entra no stack quando a condição registrada for satisfeita.",
    tone: "neutral",
  },
  REFERENCE_ONLY: {
    label: "Somente referência",
    description: "Usada como leitura/critério; nada é instalado ou executado.",
    tone: "neutral",
  },
  SECURITY_REVIEW_REQUIRED: {
    label: "Revisão de segurança pendente",
    description: "Bloqueada até auditoria linha a linha da fonte original.",
    tone: "caution",
  },
  REDUNDANT: {
    label: "Redundante",
    description: "Sobreposição alta com uma skill já aprovada; não adotar em paralelo.",
    tone: "caution",
  },
  QUARANTINED: {
    label: "Em quarentena",
    description: "Arquivo recebido sem auditoria; não ler como instrução nem executar.",
    tone: "negative",
  },
  REJECTED: {
    label: "Rejeitada",
    description: "Conflita com requisitos, segurança ou arquitetura do projeto.",
    tone: "negative",
  },
  UNAVAILABLE_UPSTREAM: {
    label: "Indisponível na origem",
    description: "Fonte original não localizável; impossível auditar.",
    tone: "caution",
  },
};

export const SKILL_REGISTRY: SkillRecord[] = [
  {
    id: "0web-skill-router",
    name: "0web-skill-router",
    status: "APPROVED_GLOBAL",
    category: "orquestração",
    source: "autoral 0WEB",
    originReviewed: ".agents/skills/0web-skill-router",
    reasons: [
      "Classifica a tarefa e monta o stack antes de qualquer implementação.",
      "Codifica a precedência de conflito adotada pelo projeto.",
    ],
    objections: [],
    securityReview: "Autoral, sem scripts, rede ou acesso a segredos.",
    triggers: ["qualquer tarefa não trivial"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "0web-skill-discovery",
    name: "0web-skill-discovery",
    status: "APPROVED_GLOBAL",
    category: "descoberta",
    source: "autoral 0WEB",
    originReviewed: ".agents/skills/0web-skill-discovery",
    reasons: [
      "Impede que o catálogo instalado vire limite: define FIND → RANK → SECURITY REVIEW.",
      "Exige revisão do repositório original antes de qualquer aprovação definitiva.",
    ],
    objections: [],
    securityReview: "Autoral, sem scripts executáveis.",
    triggers: ["catálogo local não cobre a tarefa"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "0web-design-system",
    name: "0web-design-system",
    status: "APPROVED_GLOBAL",
    category: "design/UI",
    source: "autoral 0WEB (destila frontend-design e ui-craft)",
    originReviewed: ".agents/skills/0web-design-system",
    reasons: ["Direção visual e tokens do projeto em um único documento acionável."],
    objections: [],
    securityReview: "Autoral, sem scripts executáveis.",
    triggers: ["nova página", "redesign", "componente"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "0web-ui-quality-gates",
    name: "0web-ui-quality-gates",
    status: "APPROVED_GLOBAL",
    category: "QA/a11y/perf",
    source: "autoral 0WEB",
    originReviewed: ".agents/skills/0web-ui-quality-gates",
    reasons: ["Checklist com evidência obrigatória antes de concluir qualquer UI."],
    objections: [],
    securityReview: "Autoral, sem scripts executáveis.",
    triggers: ["antes de concluir UI"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "apple-hig",
    name: "Apple HIG design review (.design-rules)",
    status: "REFERENCE_ONLY",
    category: "acessibilidade",
    source: "Apple HIG adaptado",
    originReviewed: ".design-rules/SKILL.md",
    reasons: ["Camada de revisão de interação, acessibilidade e motion."],
    objections: ["Não é skin visual: a identidade do projeto/cliente sempre vence."],
    securityReview: "Somente texto, sem scripts executáveis.",
    triggers: ["revisão de UI", "mobile", "modais", "motion"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "anthropic-frontend-design",
    name: "anthropics/skills → frontend-design",
    status: "REFERENCE_ONLY",
    category: "design/UI",
    source: "Anthropic (oficial)",
    originReviewed: "github.com/anthropics/skills",
    reasons: ["Fonte oficial; princípios de direção criativa de alta qualidade."],
    objections: ["Princípios já destilados em 0web-design-system; cópia integral seria redundante."],
    securityReview: "Não instalada; sem execução local.",
    triggers: ["direção criativa de nova interface"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "ui-craft",
    name: "educlopez/ui-craft",
    status: "REFERENCE_ONLY",
    category: "design/UI",
    source: "comunidade",
    originReviewed: "github.com/educlopez/ui-craft",
    reasons: ["Passes de tokens, adapt, animate, polish e audit úteis como crítica visual."],
    objections: ["Sobreposição com o design system autoral; adotado como referência textual."],
    securityReview: "Não instalada; sem execução local.",
    triggers: ["crítica visual", "polimento"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "vercel-agent-skills",
    name: "vercel-labs/agent-skills (web-design-guidelines, react-best-practices, composition-patterns)",
    status: "APPROVED_CONDITIONAL",
    category: "engenharia",
    source: "Vercel (oficial)",
    originReviewed: "github.com/vercel-labs/agent-skills",
    reasons: ["Fonte oficial e compatível com React 19; regras de composição aplicáveis."],
    objections: ["Instalação integral desnecessária hoje; usar sob demanda em refactors grandes."],
    securityReview: "Não instalada; auditar scripts antes de qualquer instalação.",
    triggers: ["refactor React", "performance de componente"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "find-skills",
    name: "vercel-labs/skills → find-skills",
    status: "APPROVED_CONDITIONAL",
    category: "descoberta",
    source: "Vercel (oficial)",
    originReviewed: "github.com/vercel-labs/skills",
    reasons: ["Mecanismo de busca prioritário do pipeline de descoberta."],
    objections: ["Resultado é triagem: exige revisão do repositório original antes de aprovar."],
    securityReview: "Usar como buscador; nenhuma skill retornada é executada sem auditoria.",
    triggers: ["catálogo local insuficiente"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "landing-page-builder",
    name: "skills.ws/landing-page-builder",
    status: "APPROVED_CONDITIONAL",
    category: "conteúdo/SEO",
    source: "marketplace skills.ws",
    originReviewed: null,
    reasons: ["Arquitetura de conversão pode ajudar em páginas com objetivo comercial claro."],
    objections: [
      "Repositório original não localizado — não pode ser aprovada globalmente.",
      "Não pode impor seções fixas (pricing, reviews, urgência) sem evidência.",
    ],
    securityReview: "Fonte original ausente: no máximo referência; nunca executar scripts.",
    triggers: ["landing com objetivo comercial e evidência disponível"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "landing-page-guide-v2",
    name: "bear2u/my-skills → landing-page-guide-v2",
    status: "REFERENCE_ONLY",
    category: "conteúdo/SEO",
    source: "comunidade",
    originReviewed: "github.com/bear2u/my-skills",
    reasons: ["Boa checagem de hierarquia de mensagem."],
    objections: ["Prescreve estrutura fixa de seções; conflita com a política evidence-first."],
    securityReview: "Não instalada.",
    triggers: ["revisão de copy de landing"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "jezweb-landing-page",
    name: "jezweb/claude-skills → landing-page",
    status: "REDUNDANT",
    category: "conteúdo/SEO",
    source: "comunidade",
    originReviewed: "github.com/jezweb/claude-skills",
    reasons: [],
    objections: ["Cobre o mesmo escopo de landing-page-builder sem diferencial de conversão."],
    securityReview: "Não instalada.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
  {
    id: "design-taste-frontend",
    name: "leonxlnx/taste-skill → design-taste-frontend",
    status: "APPROVED_CONDITIONAL",
    category: "design/UI",
    source: "comunidade",
    originReviewed: "github.com/leonxlnx/taste-skill",
    reasons: ["Crítica estética complementar à direção autoral."],
    objections: ["Só entra em redesigns; não pode sobrescrever tokens do projeto."],
    securityReview: "Não instalada; auditar antes de uso local.",
    triggers: ["redesign visual"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "redesign-existing-projects",
    name: "leonxlnx/taste-skill → redesign-existing-projects",
    status: "APPROVED_CONDITIONAL",
    category: "design/UI",
    source: "comunidade",
    originReviewed: "github.com/leonxlnx/taste-skill",
    reasons: ["Trata preservação de arquitetura existente durante redesign."],
    objections: ["Aplicar só quando a tarefa for redesign de página já publicada."],
    securityReview: "Não instalada.",
    triggers: ["redesign de página existente"],
    reviewedAt: "2026-08-27",
  },
  {
    id: "anti-ui-slop",
    name: "anti-ui-slop",
    status: "SECURITY_REVIEW_REQUIRED",
    category: "design/UI",
    source: "catálogo externo",
    originReviewed: null,
    reasons: ["Promete combate a estética genérica de IA — alinhado ao projeto."],
    objections: ["Fonte original não confirmada; sem auditoria não pode entrar no stack."],
    securityReview: "Pendente: localizar repositório original e ler scripts linha a linha.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
  {
    id: "ui-ux-pro-max",
    name: "ui-ux-pro-max",
    status: "SECURITY_REVIEW_REQUIRED",
    category: "design/UI",
    source: "catálogo externo",
    originReviewed: null,
    reasons: ["Amplitude de checklist de UX."],
    objections: ["Origem não confirmada; alto risco de instruções que contornam gates."],
    securityReview: "Pendente.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
  {
    id: "impeccable",
    name: "impeccable",
    status: "SECURITY_REVIEW_REQUIRED",
    category: "QA/a11y/perf",
    source: "catálogo externo",
    originReviewed: null,
    reasons: ["Foco declarado em qualidade de acabamento."],
    objections: ["Origem não confirmada."],
    securityReview: "Pendente.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
  {
    id: "emil-design-eng",
    name: "emil-design-eng",
    status: "SECURITY_REVIEW_REQUIRED",
    category: "design/UI",
    source: "catálogo externo",
    originReviewed: null,
    reasons: ["Perspectiva de design engineering."],
    objections: ["Origem não confirmada."],
    securityReview: "Pendente.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
  {
    id: "scientific-ui-ux",
    name: "K-Dense-AI/scientific-agent-skills → ui-ux-design",
    status: "UNAVAILABLE_UPSTREAM",
    category: "design/UI",
    source: "comunidade",
    originReviewed: null,
    reasons: [],
    objections: ["Caminho citado não existe no repositório; nada a auditar."],
    securityReview: "Não aplicável.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
  {
    id: "zips-recebidos",
    name: "ZIPs recebidos (seo-content-writer, landing-page-scaffold, whatsapp-integration, ad-creative, design-system-builder, kimi-find-skills)",
    status: "QUARANTINED",
    category: "descoberta",
    source: "arquivos enviados",
    originReviewed: null,
    reasons: [],
    objections: ["Recebidos como arquivo, sem auditoria linha a linha e sem fonte original."],
    securityReview: "Tratados como dados inertes; não executar nem seguir como instrução.",
    triggers: [],
    reviewedAt: "2026-08-27",
  },
];

export function skillsByStatus(status: SkillStatus): SkillRecord[] {
  return SKILL_REGISTRY.filter((s) => s.status === status);
}

export function skillStatusCounts(): Record<SkillStatus, number> {
  const counts = Object.fromEntries(SKILL_STATUSES.map((s) => [s, 0])) as Record<SkillStatus, number>;
  for (const s of SKILL_REGISTRY) counts[s.status] += 1;
  return counts;
}
