export type GeoServiceProof = {
  slug: string;
  title: string;
};

export type GeoServiceEvidence = {
  citySlug: string;
  serviceSlug: string;
  proofSummary: string;
  projects: readonly GeoServiceProof[];
};

/**
 * Evidência editorial explícita para páginas cidade × serviço.
 *
 * Regra: não inferir um serviço entregue pela 0WEB a partir das tags do negócio
 * do cliente. Um projeto publicado comprova criação de presença/site; somente
 * projectType=landing foi usado como prova para landing pages.
 *
 * As combinações ausentes continuam acessíveis para atendimento remoto, mas
 * devem permanecer noindex e fora do sitemap até receberem prova própria.
 */
const GEO_SERVICE_EVIDENCE: readonly GeoServiceEvidence[] = [
  {
    citySlug: "curitiba",
    serviceSlug: "criacao-de-sites",
    proofSummary:
      "A 0WEB possui dezenas de projetos publicados em Curitiba. Estes exemplos documentam presença digital entregue para negócios locais em segmentos diferentes.",
    projects: [
      { slug: "clinica-integrada", title: "Clínica Integrada de Saúde" },
      { slug: "rj-servicos-drywall", title: "RJ Serviços de Drywall" },
      { slug: "renata-beauty", title: "Renata Beauty Studio" },
    ],
  },
  {
    citySlug: "curitiba",
    serviceSlug: "landing-pages",
    proofSummary:
      "Há landing pages reais publicadas para clientes de Curitiba, com jornadas e objetivos próprios em vez de páginas geográficas geradas apenas por template.",
    projects: [
      { slug: "rj-servicos-drywall", title: "RJ Serviços de Drywall" },
      { slug: "renata-beauty", title: "Renata Beauty Studio" },
      { slug: "studio-de-cilios", title: "Studio de Cílios" },
    ],
  },
  {
    citySlug: "sao-paulo",
    serviceSlug: "criacao-de-sites",
    proofSummary:
      "A página é sustentada por um projeto institucional real publicado para um cliente de São Paulo; outros serviços permanecem noindex até existir evidência equivalente.",
    projects: [{ slug: "almeida-torres", title: "Almeida Torres Advocacia" }],
  },
  {
    citySlug: "belo-horizonte",
    serviceSlug: "criacao-de-sites",
    proofSummary:
      "A 0WEB possui projetos reais publicados em Belo Horizonte, suficientes para sustentar a página de criação de sites sem afirmar presença física local.",
    projects: [
      { slug: "casa-nativa", title: "Casa Nativa Bistrô" },
      { slug: "bh-barreiro-marmitas", title: "Marmitas do Barreiro" },
    ],
  },
] as const;

const evidenceByKey = new Map(
  GEO_SERVICE_EVIDENCE.map((item) => [`${item.citySlug}/${item.serviceSlug}`, item]),
);

export function getGeoServiceEvidence(citySlug: string, serviceSlug: string): GeoServiceEvidence | undefined {
  return evidenceByKey.get(`${citySlug}/${serviceSlug}`);
}

export function isGeoServiceIndexable(citySlug: string, serviceSlug: string): boolean {
  return Boolean(getGeoServiceEvidence(citySlug, serviceSlug));
}

export function listIndexableGeoServicePairs(): readonly GeoServiceEvidence[] {
  return GEO_SERVICE_EVIDENCE;
}
