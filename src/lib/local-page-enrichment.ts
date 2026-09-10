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
      body: `Perfil do Google Meu Negócio organizado com categorias corretas, horários, fotos reais e área de atendimento cobrindo ${place.name} e o entorno em ${place.city}. É o que decide quem aparece quando a busca acontece na rua.`,
    });
  }
  if (third) {
    items.push({
      title: `Conteúdo e busca local para ${third}`,
      body: `Páginas de serviço com as palavras que o cliente de ${place.city} realmente digita, links internos entre serviço, bairro e portfólio, e velocidade de carregamento medida no celular.`,
    });
  }
  items.push({
    title: `Medição do que vira contato`,
    body: `Cada clique de contato feito a partir da página de ${place.name} é registrado, então dá para saber quais páginas geram conversa e quais só geram visita. Sem número estimado: só o que foi contado.`,
  });
  return items;
}

/** Como o trabalho acontece — mesmo método, texto ancorado no lugar. */
export function localProcessSteps(place: LocalPlace) {
  return [
    {
      step: "1. Diagnóstico do bairro",
      body: `Levantamos quem já aparece no Google para os serviços buscados em ${place.name} e o que essas páginas entregam. O ponto de partida é a concorrência real, não uma média de mercado.`,
    },
    {
      step: "2. Estrutura e conteúdo",
      body: `Definimos as páginas necessárias, a oferta de cada uma e o caminho até o contato. Fotos e informações vêm do próprio negócio — nada de banco de imagens fingindo ser a sua equipe.`,
    },
    {
      step: "3. Publicação e busca local",
      body: `Site no ar com dados estruturados, mapa do site enviado aos buscadores e o perfil do Google Meu Negócio alinhado ao endereço e à área atendida em ${place.city}.`,
    },
    {
      step: "4. Acompanhamento",
      body: `Revisões periódicas com base no que foi medido: páginas visitadas, contatos abertos e buscas que trouxeram gente. Ajustes são feitos onde há sinal, não por palpite.`,
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
      a: `Anúncios com raio no bairro geram contato nos primeiros dias após a aprovação. Busca orgânica e Google Meu Negócio costumam dar os primeiros sinais entre 30 e 60 dias, com consolidação a partir do terceiro mês. Prazos variam com a concorrência do segmento.`,
    },
    {
      q: `Vocês atendem ${main} em ${place.name}?`,
      a: `Sim. ${place.name} é ${place.vibe}, e esse é o perfil com que trabalhamos: ${place.typicalBusinesses.join(", ")}. A pesquisa de palavras-chave é refeita para o seu segmento e para a concorrência do bairro.`,
    },
    {
      q: `Preciso ter endereço em ${place.name} para ranquear no bairro?`,
      a: `Para busca orgânica e anúncios com raio geográfico, não. Para disputar o mapa do Google, ter endereço ou declarar ${place.name} como área de serviço no Google Meu Negócio pesa bastante.`,
    },
    {
      q: `O atendimento é presencial em ${place.city}?`,
      a: `Reuniões presenciais em ${place.city} são possíveis com agendamento. A operação do dia a dia é remota, com acompanhamento periódico — custo previsível sem perder proximidade.`,
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
};

/** Projetos reais do catálogo publicados na mesma cidade. */
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
