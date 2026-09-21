export type CentroMegaDemoProduct = {
  id: string;
  name: string;
  category: "Celulares" | "Outlet" | "Tênis" | "Bonés" | "Calçados" | "Acessórios";
  short: string;
  badge: string;
  sourceKind: "SOCIAL_POST_VERIFIED" | "OWNER_CONFIRMED_CATEGORY" | "OFFICIAL_STORE_CONTEXT";
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate?: string;
  historicalPrice?: string;
  previousHistoricalPrice?: string;
  sizes?: string;
  availabilityNote: string;
  visual: "phone" | "sneaker" | "cap" | "shoe" | "accessory" | "outlet";
  accent: "cyan" | "violet" | "gold" | "pink" | "lime";
};

export const centroMegaDemoProducts: CentroMegaDemoProduct[] = [
  {
    id: "poco-x5-pro-8-256",
    name: "Poco X5 Pro 8GB / 256GB",
    category: "Celulares",
    short: "Smartphone publicado pela Centro Mega com 8 GB de RAM e 256 GB de armazenamento.",
    badge: "Visto nas redes",
    sourceKind: "SOCIAL_POST_VERIFIED",
    sourceLabel: "Post público indexado da Centro Mega",
    sourceUrl: "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    sourceDate: "25/01/2024",
    historicalPrice: "R$ 1.899,00",
    previousHistoricalPrice: "R$ 2.399,00",
    availabilityNote: "Preço reproduzido apenas como histórico da publicação. Consulte valor e estoque atuais.",
    visual: "phone",
    accent: "cyan",
  },
  {
    id: "tenis-dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "Tênis",
    short: "Modelo divulgado nas redes da Centro Mega em postagens de outlet.",
    badge: "Visto nas redes",
    sourceKind: "SOCIAL_POST_VERIFIED",
    sourceLabel: "Post público indexado da Centro Mega",
    sourceUrl: "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    sourceDate: "08/11/2023",
    sizes: "Grades publicadas: 34–39 e 34–43 em posts distintos",
    availabilityNote: "Numeração, preço e estoque atuais precisam ser confirmados pela loja.",
    visual: "sneaker",
    accent: "violet",
  },
  {
    id: "smartphones-ofertas",
    name: "Smartphones em oferta",
    category: "Celulares",
    short: "Vitrine de aparelhos e oportunidades rotativas da operação de tecnologia da Centro Mega.",
    badge: "Amostra de categoria",
    sourceKind: "OFFICIAL_STORE_CONTEXT",
    sourceLabel: "Categoria coerente com a presença pública da Centro Mega como loja de telemóveis",
    availabilityNote: "Modelos e condições variam. A seleção serve como demonstração de e-commerce.",
    visual: "phone",
    accent: "gold",
  },
  {
    id: "bones-outlet",
    name: "Bonés · seleção outlet",
    category: "Bonés",
    short: "Categoria informada pelo responsável como parte das ofertas e achadinhos publicados pela loja.",
    badge: "Categoria da loja",
    sourceKind: "OWNER_CONFIRMED_CATEGORY",
    sourceLabel: "Informação fornecida pelo responsável da 0WEB sobre o mix Centro Mega",
    availabilityNote: "Itens específicos, marcas, cores e valores dependem do estoque atual.",
    visual: "cap",
    accent: "pink",
  },
  {
    id: "calcados-outlet",
    name: "Calçados · outlet",
    category: "Calçados",
    short: "Espaço para calçados e oportunidades de giro rápido dentro da vitrine outlet.",
    badge: "Categoria da loja",
    sourceKind: "OWNER_CONFIRMED_CATEGORY",
    sourceLabel: "Informação fornecida pelo responsável da 0WEB sobre o mix Centro Mega",
    availabilityNote: "Amostra de categoria; consulte modelos, tamanhos e estoque atuais.",
    visual: "shoe",
    accent: "lime",
  },
  {
    id: "acessorios-tech",
    name: "Acessórios para tecnologia",
    category: "Acessórios",
    short: "Área de demonstração para acessórios e complementos do universo de celulares.",
    badge: "Amostra de categoria",
    sourceKind: "OFFICIAL_STORE_CONTEXT",
    sourceLabel: "Presença pública e portfolio atual da Centro Mega",
    availabilityNote: "Amostra funcional; itens e preços específicos devem ser confirmados.",
    visual: "accessory",
    accent: "cyan",
  },
  {
    id: "mega-outlet",
    name: "Mega Outlet · achadinhos",
    category: "Outlet",
    short: "Vitrine flexível para produtos de oportunidade que aparecem nas redes e mudam com frequência.",
    badge: "Outlet SJP",
    sourceKind: "OFFICIAL_STORE_CONTEXT",
    sourceLabel: "Linktree oficial lista Centro Mega Outlet — São José dos Pinhais",
    sourceUrl: "https://linktr.ee/centro.mega",
    availabilityNote: "A seleção muda conforme as publicações e o estoque da loja.",
    visual: "outlet",
    accent: "gold",
  },
];

export const centroMegaSocialFeed = [
  {
    platform: "Facebook",
    title: "Poco X5 Pro 8GB / 256GB",
    description: "Oferta pública indexada: de R$ 2.399,00 por R$ 1.899,00 na publicação de 25/01/2024.",
    date: "25/01/2024",
    href: "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    status: "POST_INDEXADO",
  },
  {
    platform: "Facebook",
    title: "Tênis Dunk Low Pro",
    description: "Postagens públicas indexadas com grades 34–39 e 34–43 e menção a cartões.",
    date: "08/11/2023",
    href: "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    status: "POST_INDEXADO",
  },
  {
    platform: "Instagram",
    title: "Feed oficial Centro Mega",
    description: "Amostra conecta o visitante às publicações oficiais já cadastradas no portfolio.",
    href: "https://www.instagram.com/centro.mega/",
    date: undefined,
    status: "CANAL_OFICIAL",
  },
  {
    platform: "Instagram",
    title: "Publicações e Reels",
    description: "Links oficiais existentes continuam acessíveis como fonte viva de novidades e oportunidades.",
    href: "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/",
    date: undefined,
    status: "LINK_OFICIAL",
  },
] as const;

export const centroMegaStoreSources = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  linktree: "https://linktr.ee/centro.mega",
  currentStore: "https://www.vhsys.net/centromega/contato/",
  indexedSocialMirror:
    "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
} as const;
