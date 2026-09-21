export type CentroMegaProductSource =
  | "FACEBOOK_PUBLIC_POST"
  | "INSTAGRAM_PROFILE"
  | "MAGALU_SELLER"
  | "OWNER_INPUT";

export type CentroMegaProduct = {
  id: string;
  name: string;
  category: "Celulares" | "Gaming" | "Tech" | "Outlet" | "Perfumes" | "Achados";
  subtitle: string;
  description: string;
  source: CentroMegaProductSource;
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate?: string;
  historicalPrice?: string;
  historicalCompareAt?: string;
  badge?: string;
  accent: "cyan" | "violet" | "lime" | "amber" | "rose" | "blue";
  visual: "phone" | "shoe" | "tvbox" | "gamepad" | "harddrive" | "bike" | "battery" | "perfume" | "cap";
  evidenceNote: string;
};

export const CENTRO_MEGA_STORE_PRODUCTS: CentroMegaProduct[] = [
  {
    id: "poco-x5-pro-8-256",
    name: "POCO X5 Pro · 8 GB / 256 GB",
    category: "Celulares",
    subtitle: "Smartphone destacado em publicação da Centro Mega",
    description:
      "Produto identificado em publicação pública associada à Centro Mega. Preço exibido na amostra é histórico e não representa estoque ou oferta atual.",
    source: "FACEBOOK_PUBLIC_POST",
    sourceLabel: "Facebook · publicação pública indexada",
    sourceUrl:
      "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    sourceDate: "2024-01-25",
    historicalPrice: "R$ 1.899,00",
    historicalCompareAt: "R$ 2.399,00",
    badge: "Social drop",
    accent: "cyan",
    visual: "phone",
    evidenceNote:
      "Post público indexado: POCO X5 Pro, 8 GB RAM, 256 GB; preço publicado em 25/01/2024. Confirmar valor e estoque atuais antes de vender.",
  },
  {
    id: "dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "Outlet",
    subtitle: "Modelo divulgado no outlet da Centro Mega",
    description:
      "Tênis identificado em publicações públicas da Centro Mega. Numeração e disponibilidade variam; a amostra não presume estoque atual.",
    source: "FACEBOOK_PUBLIC_POST",
    sourceLabel: "Facebook · publicação pública indexada",
    sourceUrl:
      "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    sourceDate: "2023-11-08",
    badge: "Outlet social",
    accent: "violet",
    visual: "shoe",
    evidenceNote:
      "Postagens públicas de 08/11/2023 divulgam Tênis Dunk Low Pro e numerações variadas. Preço atual não foi publicado na fonte consultada.",
  },
  {
    id: "mi-box-s-xiaomi",
    name: "Xiaomi Mi Box S",
    category: "Tech",
    subtitle: "Streaming box Android",
    description:
      "Item encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl: "https://www.magazineluiza.com.br/mi-box-s-xiaomi-com-entrada-hdmi/p/ag2jg12eeb/in/plcr/",
    badge: "Catálogo verificado",
    accent: "blue",
    visual: "tvbox",
    evidenceNote:
      "Listagem pública do marketplace identifica Centro Mega como vendedor. Oferta, preço e estoque precisam ser revalidados antes de compra fora do Magalu.",
  },
  {
    id: "controle-ps4-original",
    name: "Controle PlayStation 4 · Sony",
    category: "Gaming",
    subtitle: "Controle original listado pelo seller",
    description:
      "Produto encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/controle-play-station-4-original-sony/p/edb5ac0gd4/in/dcks/?seller_id=centromega",
    badge: "Gaming",
    accent: "violet",
    visual: "gamepad",
    evidenceNote:
      "Listagem pública recente identifica Centro Mega como vendedor. Não replicar preço/estoque sem revalidação.",
  },
  {
    id: "case-hd-exbom",
    name: "Case para HD externo 2,5 · Exbom",
    category: "Tech",
    subtitle: "Acessório para armazenamento",
    description:
      "Produto encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/case-de-gaveta-para-hd-externo-2-5-cghd-10-preto-exbom/p/cfj0h7eg0k/in/armt/?seller_id=centromega",
    badge: "Tech",
    accent: "lime",
    visual: "harddrive",
    evidenceNote:
      "Listagem pública do marketplace. Preço e estoque não são tratados como dados permanentes nesta amostra.",
  },
  {
    id: "suporte-moto-bike-renux",
    name: "Suporte de celular para Moto & Bike · Renux",
    category: "Achados",
    subtitle: "Acessório para mobilidade",
    description:
      "Produto encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/suporte-de-celular-para-moto-e-bike-renux-5203/p/ea29ebff4b/te/spcl/",
    badge: "Achado",
    accent: "amber",
    visual: "bike",
    evidenceNote:
      "Listagem pública do marketplace. A amostra usa o item como referência de variedade do catálogo.",
  },
  {
    id: "pilha-aaa-mox",
    name: "Pilha AAA recarregável Mox 3000 mAh",
    category: "Tech",
    subtitle: "Energia para acessórios",
    description:
      "Produto encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/pilha-aaa-recarregavel-mox-3000-mah/p/fj06fe3a72/me/ilha/?seller_id=centromega",
    badge: "Utilidade",
    accent: "lime",
    visual: "battery",
    evidenceNote:
      "Listagem pública do marketplace. Valor exibido no marketplace pode mudar e não é reproduzido na amostra.",
  },
  {
    id: "lattafa-yara",
    name: "Lattafa Yara · Eau de Parfum 100 ml",
    category: "Perfumes",
    subtitle: "Perfume feminino listado pelo seller",
    description:
      "Produto encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/perfume-feminino-lattafa-yara-eau-de-parfum-100ml/p/ak776c7g23/pf/ppfm/?seller_id=centromega",
    badge: "Beauty drop",
    accent: "rose",
    visual: "perfume",
    evidenceNote:
      "Listagem pública do marketplace identifica Centro Mega como vendedor. Estoque e condições atuais precisam de confirmação.",
  },
  {
    id: "lattafa-asad-zanzibar",
    name: "Lattafa Asad Zanzibar · EDP 100 ml",
    category: "Perfumes",
    subtitle: "Perfume masculino listado pelo seller",
    description:
      "Produto encontrado em listagem pública do seller Centro Mega no Magazine Luiza.",
    source: "MAGALU_SELLER",
    sourceLabel: "Magalu · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/lattafa-asad-zanzibar-edp-100ml-perfume-masculino-arabe/p/ee2g77k670/pf/ppms/?seller_id=centromega",
    badge: "Beauty drop",
    accent: "amber",
    visual: "perfume",
    evidenceNote:
      "Listagem pública do marketplace identifica Centro Mega como vendedor. Estoque e condições atuais precisam de confirmação.",
  },
  {
    id: "bones-outlet",
    name: "Bonés · seleção de outlet",
    category: "Outlet",
    subtitle: "Categoria rotativa da loja",
    description:
      "Categoria informada pelo responsável como parte do mix de outlet da Centro Mega. Modelos e estoque são rotativos.",
    source: "OWNER_INPUT",
    sourceLabel: "Informação fornecida pelo responsável",
    badge: "Outlet rotativo",
    accent: "rose",
    visual: "cap",
    evidenceNote:
      "Categoria confirmada pelo responsável nesta solicitação; nenhum modelo específico é apresentado como estoque atual.",
  },
];

export const CENTRO_MEGA_SOCIAL_POSTS = [
  { label: "Instagram · Reel", href: "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/" },
  { label: "Instagram · Reel", href: "https://www.instagram.com/centro.mega/reel/DHzjkeutEKu/" },
  { label: "Instagram · Post", href: "https://www.instagram.com/centro.mega/p/DDPCypWxVZZ/" },
  { label: "Instagram · Reel", href: "https://www.instagram.com/centro.mega/reel/DHmlQd6tCNi/" },
  { label: "Instagram · Post", href: "https://www.instagram.com/centro.mega/p/DGjBSGIPSKO/" },
  { label: "Instagram · Post", href: "https://www.instagram.com/centro.mega/p/DCt4G0HxLRu/" },
] as const;

export const CENTRO_MEGA_STORE_CATEGORIES = [
  "Todos",
  "Celulares",
  "Gaming",
  "Tech",
  "Outlet",
  "Perfumes",
  "Achados",
] as const;
