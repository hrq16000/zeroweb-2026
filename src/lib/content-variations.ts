// ============================================================================
// Sprint 5 — Deterministic content variation engine.
// Same (city, service) input → same output every render. No randomness.
// Picks among curated templates so each programmatic page reads differently
// even with the same data. Designed to avoid thin/duplicate content penalties.
// ============================================================================

import type { CityInfo } from "./geo-data";
import type { ServiceData } from "./services-data";

function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h;
}

export function pick<T>(seed: string, options: readonly T[]): T {
  return options[hash(seed) % options.length];
}

// ----- Hero subtitle templates -----
const HERO_SUBTITLES = [
  "Atendimento remoto de {serviceLower} para empresas em {city}, {state}. O escopo e a entrega são definidos conforme a necessidade real do projeto.",
  "{Service} para empresas de {city}, com processo remoto e proposta definida a partir do briefing do negócio.",
  "Negócios em {city} podem contratar a 0WEB para {serviceLower} sem depender de uma filial local. O atendimento é remoto.",
  "Soluções de {serviceLower} para negócios {gentilico_pl}, com atendimento remoto do briefing à entrega.",
] as const;

// ----- Local-context paragraph templates -----
const LOCAL_CONTEXT = [
  "O atendimento da 0WEB para {City} é remoto. A estratégia parte das informações reais do negócio e do escopo contratado, sem presumir presença física da agência na cidade.",
  "Esta página descreve atendimento remoto de {serviceLower} para empresas de {City} ({stateCode}). Ela não representa escritório, filial ou equipe local da 0WEB.",
  "{City} faz parte da área de atendimento remoto da 0WEB. Quando existem projetos publicados na cidade que comprovam esta oferta, eles são apresentados como evidência na própria página.",
  "A localização em {City} não exige uma unidade física da 0WEB. O serviço é prestado remotamente e os detalhes de prazo, canais e entregáveis são definidos na proposta.",
] as const;

// ----- City-specific FAQ items (added on top of service FAQ) -----
const CITY_FAQ_BANKS: { q: string; a: string }[][] = [
  [
    { q: "Vocês atendem empresas em {city}?", a: "Sim. A 0WEB oferece atendimento remoto para empresas de {city} ({stateCode}); esta página não indica uma filial física na cidade." },
    { q: "Precisa visita presencial?", a: "Para estes serviços digitais, o processo pode ser conduzido remotamente. Qualquer necessidade excepcional é definida antes da contratação." },
    { q: "Qual o prazo para um projeto em {city}?", a: "O prazo depende do escopo e dos entregáveis. A estimativa é definida na proposta, sem variar apenas por causa da cidade." },
  ],
  [
    { q: "0WEB atende {city}?", a: "Sim, de forma remota. A disponibilidade do serviço não significa que exista escritório ou equipe física da 0WEB em {city}." },
    { q: "Como funciona a comunicação?", a: "A comunicação é feita por canais digitais combinados no início do projeto, conforme a necessidade do cliente e do escopo." },
    { q: "O atendimento muda por estar em {state}?", a: "Não por si só. Escopo, prazo e entregáveis são definidos pelo projeto; a localização é considerada quando ela realmente afeta a estratégia." },
  ],
  [
    { q: "A 0WEB é uma agência local de {city}?", a: "Não necessariamente. O atendimento descrito aqui é remoto e não deve ser interpretado como presença física, filial ou equipe local." },
    { q: "Como a cidade entra na estratégia?", a: "Quando a localização é relevante, usamos informações verificáveis do negócio e do mercado atendido. Não tratamos uma cidade como prova de experiência sem projetos ou evidências correspondentes." },
    { q: "Há projetos reais em {city}?", a: "Quando existem projetos publicados que sustentam esta combinação de cidade e serviço, eles são exibidos nesta página como evidência." },
  ],
];

// ----- Helpers -----

function gentilicoPlural(g: string): string {
  // simple PT-BR pluralizer for gentílicos used in templates
  if (g.endsWith("ão")) return g.slice(0, -2) + "ões";
  if (g.endsWith("s")) return g;
  return g + "s";
}

function fill(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function buildVars(city: CityInfo, service: ServiceData): Record<string, string> {
  return {
    city: city.name,
    City: city.name,
    state: city.state,
    State: city.state,
    stateCode: city.stateCode,
    region: city.region,
    flavor: city.flavor,
    gentilico: city.gentilico,
    gentilico_pl: gentilicoPlural(city.gentilico),
    ddd: city.ddd,
    service: service.name,
    Service: service.name,
    serviceLower: service.name.toLowerCase(),
  };
}

// ----- Public API -----

export function heroSubtitle(city: CityInfo, service: ServiceData): string {
  const tpl = pick(`hero:${city.slug}:${service.slug}`, HERO_SUBTITLES);
  return fill(tpl, buildVars(city, service));
}

export function localContext(city: CityInfo, service: ServiceData): string {
  const tpl = pick(`ctx:${city.slug}:${service.slug}`, LOCAL_CONTEXT);
  return fill(tpl, buildVars(city, service));
}

export function cityFaq(city: CityInfo, service: ServiceData): { q: string; a: string }[] {
  const bank = pick(`faq:${city.slug}:${service.slug}`, CITY_FAQ_BANKS);
  const vars = buildVars(city, service);
  return bank.map((it) => ({ q: fill(it.q, vars), a: fill(it.a, vars) }));
}

/** FAQ geográfico: evita herdar prazos, garantias ou condições comerciais do catálogo global. */
export function combinedFaq(city: CityInfo, service: ServiceData) {
  return [
    {
      q: `O que está incluído em ${service.name.toLowerCase()} para ${city.name}?`,
      a: "O conteúdo da entrega depende do escopo aprovado. A proposta documenta entregáveis, integrações, responsabilidades e condições antes do início do projeto.",
    },
    {
      q: `Existe prazo fixo para ${service.name.toLowerCase()}?`,
      a: "Não há um prazo universal por cidade. O cronograma depende do escopo, das integrações e dos materiais necessários e é definido na proposta.",
    },
    ...cityFaq(city, service),
  ];
}

/** Page title variations — different from the canonical service title. */
const TITLE_TEMPLATES = [
  "{Service} para empresas em {City} ({stateCode}) · 0WEB",
  "{Service} remoto para {City} · 0WEB",
  "0WEB | {Service} para negócios em {City}",
  "{Service} em {City}: atendimento remoto · 0WEB",
] as const;

export function pageTitle(city: CityInfo, service: ServiceData): string {
  return fill(pick(`title:${city.slug}:${service.slug}`, TITLE_TEMPLATES), buildVars(city, service));
}

const DESCRIPTION_TEMPLATES = [
  "{Service} para empresas em {City} ({stateCode}), com atendimento remoto e escopo definido conforme o projeto. Consulte disponibilidade e proposta.",
  "Atendimento remoto de {serviceLower} para negócios de {City}. Escopo, prazo e entregáveis são definidos antes da contratação.",
  "Precisa de {serviceLower} em {City}? A 0WEB atende remotamente, sem alegar filial ou equipe física local. Conheça o processo e as evidências publicadas.",
  "{Service} para {City} com atendimento remoto da 0WEB. Veja como funciona e, quando houver, os projetos reais que sustentam esta página.",
] as const;

export function pageDescription(city: CityInfo, service: ServiceData): string {
  return fill(pick(`desc:${city.slug}:${service.slug}`, DESCRIPTION_TEMPLATES), buildVars(city, service));
}
