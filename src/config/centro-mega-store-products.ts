export type CentroMegaStoreCategory = "celulares" | "outlet" | "acessorios" | "novidades";

export type CentroMegaStoreProduct = {
  id: string;
  name: string;
  category: CentroMegaStoreCategory;
  kicker: string;
  description: string;
  visual: "phone" | "sneaker" | "cap" | "footwear" | "accessory" | "drop";
  sourceKind: "PUBLIC_POST" | "OWNER_CONTEXT" | "OFFICIAL_PROFILE";
  sourceLabel: string;
  sourceUrl: string;
  sourceDate?: string;
  sourceNote: string;
  historicalPrice?: {
    from?: number;
    to: number;
    currency: "BRL";
    label: string;
  };
  badges?: string[];
  sampleOnly?: boolean;
};

export const centroMegaOfficialLinks = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  linktree: "https://linktr.ee/centro.mega",
  store: "https://www.vhsys.net/centromega/contato/",
} as const;

export const centroMegaInstagramPosts = [
  "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/",
  "https://www.instagram.com/centro.mega/reel/DHzjkeutEKu/",
  "https://www.instagram.com/centro.mega/p/DDPCypWxVZZ/",
  "https://www.instagram.com/centro.mega/reel/DHmlQd6tCNi/",
  "https://www.instagram.com/centro.mega/p/DGjBSGIPSKO/",
  "https://www.instagram.com/centro.mega/p/DCt4G0HxLRu/",
] as const;

export const centroMegaStoreProducts: CentroMegaStoreProduct[] = [
  {
    id: "poco-x5-pro-8-256",
    name: "Poco X5 Pro · 8 GB / 256 GB",
    category: "celulares",
    kicker: "Produto encontrado em publicação pública",
    description:
      "Smartphone citado pela Centro Mega em postagem pública indexada. A amostra preserva o modelo e a configuração publicados, sem afirmar estoque atual.",
    visual: "phone",
    sourceKind: "PUBLIC_POST",
    sourceLabel: "Facebook Centro Mega · publicação indexada de 25/01/2024",
    sourceUrl: centroMegaOfficialLinks.facebook,
    sourceDate: "2024-01-25",
    sourceNote:
      "A publicação indexada registrava preço de R$ 2.399,00 por R$ 1.899,00. Valor é histórico e precisa ser confirmado antes de qualquer compra.",
    historicalPrice: {
      from: 2399,
      to: 1899,
      currency: "BRL",
      label: "Preço da publicação de 25/01/2024",
    },
    badges: ["8 GB RAM", "256 GB", "Preço histórico"],
  },
  {
    id: "dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "outlet",
    kicker: "Produto encontrado em publicações públicas",
    description:
      "Tênis divulgado pela Centro Mega no outlet. Publicações indexadas do mesmo dia mostravam numerações 34–39 e 34–43.",
    visual: "sneaker",
    sourceKind: "PUBLIC_POST",
    sourceLabel: "Facebook Centro Mega · publicações indexadas de 08/11/2023",
    sourceUrl: centroMegaOfficialLinks.facebook,
    sourceDate: "2023-11-08",
    sourceNote:
      "Numeração e disponibilidade são históricas. A loja deve confirmar modelo, grade e estoque atual antes de fechar o pedido.",
    badges: ["Outlet", "Numeração publicada 34–43", "Consultar estoque"],
  },
  {
    id: "bones-outlet",
    name: "Bonés · seleção outlet",
    category: "outlet",
    kicker: "Categoria da amostra",
    description:
      "Categoria informada pelo responsável da 0WEB como parte do mix de itens que a Centro Mega divulga nas redes.",
    visual: "cap",
    sourceKind: "OWNER_CONTEXT",
    sourceLabel: "Contexto fornecido pelo responsável",
    sourceUrl: centroMegaOfficialLinks.instagram,
    sourceNote:
      "A amostra não inventa marcas, modelos, tamanhos ou preços. O card existe para demonstrar como a categoria entraria na loja.",
    badges: ["Outlet", "Giro rápido", "Consultar novidades"],
    sampleOnly: true,
  },
  {
    id: "calcados-outlet",
    name: "Calçados · oportunidades",
    category: "outlet",
    kicker: "Categoria da amostra",
    description:
      "Espaço de vitrine para calçados e oportunidades de giro rápido divulgados pela operação da Centro Mega.",
    visual: "footwear",
    sourceKind: "OWNER_CONTEXT",
    sourceLabel: "Contexto fornecido pelo responsável",
    sourceUrl: centroMegaOfficialLinks.instagram,
    sourceNote:
      "Produto genérico de demonstração: estoque, marca, tamanho e preço entram somente quando houver postagem/fonte específica.",
    badges: ["Outlet", "Novidades", "Sob consulta"],
    sampleOnly: true,
  },
  {
    id: "acessorios-mobile",
    name: "Acessórios para celular",
    category: "acessorios",
    kicker: "Categoria oficial da presença Centro Mega",
    description:
      "A página atual e os canais públicos da marca sustentam acessórios como parte do mix tecnológico da Centro Mega.",
    visual: "accessory",
    sourceKind: "OFFICIAL_PROFILE",
    sourceLabel: "Presença oficial Centro Mega",
    sourceUrl: centroMegaOfficialLinks.store,
    sourceNote:
      "A amostra demonstra a categoria sem publicar SKU, preço ou disponibilidade não verificados.",
    badges: ["Tech", "Acessórios", "Consultar"],
    sampleOnly: true,
  },
  {
    id: "drop-redes",
    name: "Drops das redes",
    category: "novidades",
    kicker: "Vitrine dinâmica de publicações",
    description:
      "Espaço preparado para transformar novas postagens verificadas do Instagram/Facebook em produtos de vitrine com origem e data.",
    visual: "drop",
    sourceKind: "OFFICIAL_PROFILE",
    sourceLabel: "@centro.mega",
    sourceUrl: centroMegaOfficialLinks.instagram,
    sourceNote:
      "Os links públicos do Instagram são preservados como fontes. Conteúdo não acessível ao crawler não é inventado.",
    badges: ["Instagram", "Facebook", "Novidades"],
    sampleOnly: true,
  },
];

export const centroMegaStoreCategories: Array<{
  id: "todos" | CentroMegaStoreCategory;
  label: string;
  short: string;
}> = [
  { id: "todos", label: "Tudo", short: "Toda a vitrine" },
  { id: "celulares", label: "Celulares", short: "Smartphones publicados" },
  { id: "outlet", label: "Outlet", short: "Tênis, bonés e calçados" },
  { id: "acessorios", label: "Acessórios", short: "Tech para o dia a dia" },
  { id: "novidades", label: "Novidades", short: "Drops das redes" },
];
