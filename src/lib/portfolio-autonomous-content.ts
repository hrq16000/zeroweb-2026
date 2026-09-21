import type { AutonomousResearchResult } from "@/lib/portfolio-autonomous-research.server";

export type AutonomousContentStatus =
  | "content_composed"
  | "content_partial"
  | "blocked_identity"
  | "blocked_provider";

export type AutonomousContentPlan = {
  contract: 1;
  status: AutonomousContentStatus;
  segment: string;
  funnelIntent: AutonomousResearchResult["funnelIntentHint"];
  summary: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  shareCopy: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  services: Array<{ title: string; description: string }>;
  content: {
    about: string;
    differentials: string[];
    steps: Array<{ title: string; description: string }>;
    faq: Array<{ q: string; a: string }>;
  };
  briefing: {
    objective: string;
    factualFields: string[];
    editorialInferences: string[];
    missing: string[];
    claimsPolicy: string;
  };
  discovery: {
    aliases: string[];
    categories: string[];
    services: string[];
    locality: string[];
    keywords: string[];
  };
  schemaDraft: {
    name: string;
    description: string;
    addressLocality: string | null;
    addressRegion: string | null;
    serviceTypes: string[];
    evidenceOnly: true;
  };
  missing: string[];
};

function unique(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))];
}

function clean(value: string, max: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= max ? normalized : `${normalized.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function fact(
  research: AutonomousResearchResult,
  field: string,
  minConfidence = 70,
): AutonomousResearchResult["facts"][number] | null {
  return (
    research.facts.find(
      (entry) => entry.field.toLowerCase() === field.toLowerCase() && entry.confidence >= minConfidence,
    ) ?? null
  );
}

function evidenceList(
  research: AutonomousResearchResult,
  prefix: "service" | "differential",
): string[] {
  const normalizedPrefix = `${prefix.toLowerCase()}:`;
  return unique(
    research.facts
      .filter((entry) => {
        const field = entry.field.toLowerCase();
        return entry.confidence >= 70 && (field === prefix || field.startsWith(normalizedPrefix));
      })
      .map((entry) => entry.value),
  );
}

function ctaFor(intent: AutonomousResearchResult["funnelIntentHint"]): string {
  switch (intent) {
    case "pedido":
      return "Consultar opções";
    case "agendamento":
      return "Solicitar horário";
    case "orcamento":
      return "Pedir orçamento";
    case "reserva":
      return "Solicitar reserva";
    case "diagnostico":
      return "Descrever necessidade";
    default:
      return "Falar com a empresa";
  }
}

/**
 * R2 do pipeline autônomo: transforma a evidência da R1 em conteúdo editável.
 *
 * Regra de segurança editorial:
 * - fatos comprovados podem virar afirmações;
 * - inferências ficam registradas como inferências e servem apenas à direção;
 * - ausência de evidência não vira serviço, diferencial, avaliação, preço ou promessa.
 */
export function buildAutonomousContentPlan(
  research: AutonomousResearchResult,
): AutonomousContentPlan {
  const name = research.input.name.trim();
  const locationLabel =
    [research.locality.city, research.locality.state].filter(Boolean).join(" - ") ||
    research.input.locationText.trim();

  const category = fact(research, "category");
  const services = evidenceList(research, "service");
  const differentials = evidenceList(research, "differential");

  const serviceRows = services.map((title) => ({
    title,
    description:
      "Serviço identificado em evidência pública ou fornecida e sujeito à confirmação no atendimento.",
  }));

  const summary = category
    ? clean(`${name}: ${category.value} em ${locationLabel}.`, 300)
    : clean(
        `${name} em ${locationLabel}. Informações reunidas a partir de evidências confirmadas.`,
        300,
      );

  const heroSubheadline = category
    ? clean(
        `${category.value} em ${locationLabel}. Envie sua solicitação pelo formulário para organizar o próximo passo.`,
        300,
      )
    : clean(
        `Informações confirmadas sobre ${name} em ${locationLabel}, com solicitação organizada pelo formulário.`,
        300,
      );

  const about = category
    ? clean(
        `${name} aparece nas fontes confirmadas como ${category.value} em ${locationLabel}. Esta página reúne somente informações sustentadas pelas evidências da pesquisa e organiza o contato pelo funil individual.`,
        1200,
      )
    : clean(
        `${name} foi informado em ${locationLabel}. Esta página reúne somente informações sustentadas pelas evidências disponíveis e organiza o contato pelo funil individual.`,
        1200,
      );

  const ctaLabel = ctaFor(research.funnelIntentHint);
  const seoTitle = clean(
    research.locality.city ? `${name} em ${research.locality.city}` : name,
    160,
  );
  const seoDescription = clean(
    category
      ? `${name} em ${locationLabel}: ${category.value}. Consulte informações confirmadas e envie sua solicitação pelo formulário.`
      : `${name} em ${locationLabel}. Consulte informações confirmadas e envie sua solicitação pelo formulário.`,
    400,
  );
  const seoKeywords = unique([
    name,
    research.locality.city,
    research.locality.state,
    category?.value,
    ...services,
  ]).join(", ");

  const faq: AutonomousContentPlan["content"]["faq"] = [
    {
      q: "Como iniciar o atendimento?",
      a: `Use o formulário desta página para informar o que procura. A solicitação fica vinculada somente a ${name}.`,
    },
    {
      q: "Como confirmar disponibilidade?",
      a: "Envie sua solicitação pelo formulário. Disponibilidade, prazo e condições são confirmados diretamente no atendimento.",
    },
  ];
  if (services.length) {
    faq.unshift({
      q: "Quais serviços foram identificados?",
      a: `As evidências confirmadas listam: ${services.join(", ")}. Consulte o atendimento para disponibilidade e detalhes.`,
    });
  }

  const missing = unique([
    ...research.missing,
    services.length ? null : "verified_services",
    differentials.length ? null : "verified_differentials",
  ]);

  const status: AutonomousContentStatus =
    research.resolution.status === "CONFLICT"
      ? "blocked_identity"
      : research.resolution.status === "PROVIDER_BLOCKED"
        ? "blocked_provider"
        : services.length
          ? "content_composed"
          : "content_partial";

  const keywords = unique([
    name,
    locationLabel,
    research.locality.city,
    category?.value,
    ...services,
  ]);

  return {
    contract: 1,
    status,
    segment: research.segmentHint,
    funnelIntent: research.funnelIntentHint,
    summary,
    heroHeadline: name,
    heroSubheadline,
    ctaLabel,
    shareCopy: clean(`${name} em ${locationLabel}. ${ctaLabel} pela página.`, 2000),
    seo: {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords,
    },
    services: serviceRows,
    content: {
      about,
      differentials,
      steps: [
        {
          title: "Conte o que procura",
          description: "Use o formulário individual desta página para descrever sua necessidade.",
        },
        {
          title: "Informe sua preferência",
          description: "Acrescente período, contexto ou observações úteis para o atendimento.",
        },
        {
          title: "Confirme no atendimento",
          description:
            "Disponibilidade, valores, prazos e demais condições são confirmados no contato final.",
        },
      ],
      faq,
    },
    briefing: {
      objective: `Apresentar ${name} sem extrapolar as evidências e conduzir a pessoa ao funil individual.`,
      factualFields: unique(research.facts.map((entry) => entry.field)),
      editorialInferences: unique([
        `segment:${research.segmentHint}`,
        `category_hint:${research.categoryHint}`,
        `funnel_intent:${research.funnelIntentHint}`,
      ]),
      missing,
      claimsPolicy:
        "Somente evidência confirmada vira afirmação factual. Inferências editoriais não podem ser publicadas como fatos. Informação ausente permanece ausente.",
    },
    discovery: {
      aliases: [name],
      categories: category ? [category.value] : [],
      services,
      locality: unique([
        research.input.locationText,
        research.locality.city,
        research.locality.state,
      ]),
      keywords,
    },
    schemaDraft: {
      name,
      description: seoDescription,
      addressLocality: research.locality.city || null,
      addressRegion: research.locality.state || null,
      serviceTypes: services,
      evidenceOnly: true,
    },
    missing,
  };
}
