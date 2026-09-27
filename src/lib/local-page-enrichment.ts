/**
 * Conteúdo local honesto para as landings de bairro (/bairros-bh, /bairros-cwb).
 *
 * Regra: nada de métrica, depoimento ou resultado inventado. Todo texto é
 * derivado de dados reais do bairro (nome, cidade, região, perfil de comércio)
 * e do catálogo versionado do portfólio. O objetivo é dar a cada URL conteúdo
 * único e útil — pré-requisito para o Google rastrear e indexar.
 */
import portfolioCatalog from "@/config/portfolio-catalog.json";

export type LocalPlace = {
  slug: string;
  name: string;
  city: string;
  region: string;
  vibe: string;
  typicalBusinesses: string[];
};

export type LocalDeliverable = { title: string; body: string };

/** O que a 0WEB entrega para os segmentos típicos daquele bairro. */
export function localDeliverables(place: LocalPlace): LocalDeliverable[] {
  const [first, second, third] = place.typicalBusinesses;
  const items: LocalDeliverable[] = [];

  if (first) {
    items.push({
      title: `Página de captação para ${first} em ${place.name}`,
      body: `Estrutura com oferta clara, prova visual do próprio negócio, endereço e rota no mapa, além de botão de contato direto. O texto é escrito para quem busca ${first} perto de ${place.name}, não para um público genérico.`,
    });
  }
  if (second) {
    items.push({
      title: `Presença no mapa para ${second}`,
      body: `Perfil do Google Meu Negócio organizado com categorias corretas, horários, fotos reais e área de atendimento cobrindo ${place.name} e o entorno em ${place.city}. A configuração é feita com dados reais do próprio negócio e da área que ele atende.`,
    });
  }
  if (third) {
    items.push({
      title: `Conteúdo e busca local para ${third}`,
      body: `Páginas de serviço organizadas por intenção de busca, com links internos entre serviço, bairro e portfólio e validação técnica de carregamento.`,
    });
  }
  items.push({
    title: `Medição do que vira contato`,
    body: `A medição pode registrar eventos de contato e navegação quando o projeto inclui analytics, permitindo revisar páginas com base em dados observados.`,
  });
  return items;
}

/** Como o trabalho acontece — mesmo método, texto ancorado no lugar. */
export function localProcessSteps(place: LocalPlace) {
  return [
    {
      step: "1. Diagnóstico do bairro",
      body: `O diagnóstico pode considerar concorrentes e resultados públicos relevantes para ${place.name}, além das informações fornecidas pelo próprio negócio.`,
    },
    {
      step: "2. Estrutura e conteúdo",
      body: `Definimos as páginas necessárias, a oferta de cada uma e o caminho até o contato. Fotos e informações vêm do próprio negócio — nada de banco de imagens fingindo ser a sua equipe.`,
    },
    {
      step: "3. Publicação e busca local",
      body: `Quando fizer parte do escopo, o site recebe dados estruturados e mapa do site; o perfil empresarial usa apenas endereço e área de atendimento reais do próprio cliente.`,
    },
    {
      step: "4. Acompanhamento",
      body: `Quando houver acompanhamento contratado, as revisões usam os dados disponíveis do projeto para orientar ajustes.`,
    },
  ];
}

/** Perguntas frequentes específicas do lugar. */
export function localFaq(place: LocalPlace) {
  const main = place.typicalBusinesses[0] ?? "empresas locais";
  return [
    {
      q: `Quanto custa contratar marketing digital em ${place.name}?`,
      a: `Depende do escopo. Site e página de captação são orçados por entrega; busca local, anúncios e redes sociais funcionam em mensalidade. Para negócios de ${place.name} o orçamento sai depois do diagnóstico, sem pacote fechado imposto.`,
    },
    {
      q: `Em quanto tempo minha empresa em ${place.name} começa a aparecer?`,
      a: `Não há prazo garantido para resultado em busca ou anúncios. O tempo depende de concorrência, orçamento, qualidade da página, configuração da conta e histórico do negócio.`,
    },
    {
      q: `Vocês atendem ${main} em ${place.name}?`,
      a: `A 0WEB pode atender remotamente negócios desse perfil em ${place.name}. O escopo é definido a partir das informações reais do cliente e, quando necessário, de pesquisa específica do mercado.`,
    },
    {
      q: `Preciso ter endereço em ${place.name} para ranquear no bairro?`,
      a: `Regras de exibição em mapas e busca local dependem da plataforma e do tipo de negócio. Endereço e área de serviço devem refletir a operação real do cliente; não devem ser inventados para fins de posicionamento.`,
    },
    {
      q: `O atendimento é presencial em ${place.city}?`,
      a: `O atendimento descrito nesta página é remoto. Qualquer atividade presencial só pode ser considerada quando combinada expressamente no escopo.`,
    },
  ];
}

type CatalogItem = {
  slug: string;
  title: string;
  summary?: string;
  segment?: string;
  city?: string;
  state?: string;
  status?: string;
  live?: boolean;
  location?: string;
  projectType?: string;
};

function normalizeLocation(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[—·,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function evidencePlaceName(place: LocalPlace) {
  return place.name.split("—")[0]?.trim() || place.name;
}

/** Projetos publicados na mesma cidade, preservado para hubs de cidade. */
export function localPortfolioProjects(city: string, limit = 6) {
  const target = city.trim().toLowerCase();
  return (portfolioCatalog as CatalogItem[])
    .filter((item) => (item.city ?? "").trim().toLowerCase() === target)
    .filter((item) => item.live !== false && item.status !== "draft")
    .slice(0, limit)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      segment: item.segment,
    }));
}

/**
 * Prova geográfica estrita para uma landing de bairro/localidade.
 * Título e summary nunca contam como evidência: apenas o campo location
 * versionado do projeto publicado.
 */
export function localPublishedProjectsAtPlace(place: LocalPlace, limit = 6) {
  const targetCity = place.city.trim().toLowerCase();
  const targetPlace = normalizeLocation(evidencePlaceName(place));

  return (portfolioCatalog as CatalogItem[])
    .filter((item) => item.live !== false && item.status === "published")
    .filter((item) => (item.city ?? "").trim().toLowerCase() === targetCity)
    .filter((item) => normalizeLocation(item.location ?? "").includes(targetPlace))
    .slice(0, limit)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      segment: item.segment,
      projectType: item.projectType,
      location: item.location,
    }));
}

export function localPlaceHasEvidence(place: LocalPlace) {
  return localPublishedProjectsAtPlace(place, 1).length > 0;
}
