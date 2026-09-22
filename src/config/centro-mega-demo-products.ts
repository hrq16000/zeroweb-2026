export type CentroMegaDemoProduct = {
  id: string;
  name: string;
  category: "Celulares" | "Tênis" | "Bonés" | "Calçados" | "Acessórios" | "Outlet";
  eyebrow: string;
  description: string;
  badge: string;
  sourceType:
    | "PUBLIC_SOCIAL_POST"
    | "OWNER_SUPPLIED_ASSORTMENT"
    | "OFFICIAL_STORE_CONTEXT"
    | "MARKETPLACE_SELLER";
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageSourceUrl?: string;
  imageSourceLabel?: string;
  gallery?: Array<{
    url: string;
    alt: string;
    sourceUrl: string;
  }>;
  historicalPrice?: {
    before?: string;
    after: string;
    label: string;
  };
  detail?: string;
  availabilityNote: string;
  visual: "phone" | "sneaker" | "cap" | "shoe" | "accessory" | "outlet";
  accent: "cyan" | "violet" | "lime" | "amber" | "pink" | "blue";
};

export const CENTRO_MEGA_DEMO_PRODUCTS: CentroMegaDemoProduct[] = [
  {
    id: "mi-box-s-xiaomi",
    name: "Xiaomi Mi Box S",
    category: "Acessórios",
    eyebrow: "Catálogo público do seller Centro Mega",
    description:
      "Streaming box Xiaomi identificado em listagem pública do Magazine Luiza como vendido pela Centro Mega.",
    badge: "Catálogo público",
    sourceType: "MARKETPLACE_SELLER",
    sourceLabel: "Magazine Luiza · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/mi-box-s-xiaomi-com-entrada-hdmi/p/ag2jg12eeb/in/plcr/",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790058183/centro-mega-mi-box-s.jpg",
    imageAlt: "Xiaomi Mi Box S anunciada pelo seller Centro Mega no Magazine Luiza",
    imageSourceUrl:
      "https://www.magazineluiza.com.br/mi-box-s-xiaomi-com-entrada-hdmi/p/ag2jg12eeb/in/plcr/",
    imageSourceLabel: "Foto do catálogo público · Centro Mega no Magalu",
    detail: "Mi Box S · entrada HDMI · item listado pelo seller Centro Mega",
    availabilityNote: "Preço e estoque podem mudar no marketplace; consulte as condições atuais.",
    visual: "accessory",
    accent: "blue",
  },
  {
    id: "xiaomi-earbuds-basic-2",
    name: "Xiaomi Mi True Wireless Earbuds Basic 2",
    category: "Acessórios",
    eyebrow: "Catálogo público do seller Centro Mega",
    description:
      "Fone Bluetooth Xiaomi identificado no Magazine Luiza como vendido pela Centro Mega. A foto real do anúncio foi versionada com a origem preservada.",
    badge: "Foto real de catálogo",
    sourceType: "MARKETPLACE_SELLER",
    sourceLabel: "Magazine Luiza · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/fone-de-ouvido-bluetooth-xiaomi-mi-true-wirelles-earbuds-basic-2-preto/p/aka3d82998/ea/fobt/?seller_id=centromega",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790058494/centro-mega-earbuds-basic-2.jpg",
    imageAlt: "Xiaomi Mi True Wireless Earbuds Basic 2 anunciado pelo seller Centro Mega",
    imageSourceUrl:
      "https://www.magazineluiza.com.br/fone-de-ouvido-bluetooth-xiaomi-mi-true-wirelles-earbuds-basic-2-preto/p/aka3d82998/ea/fobt/?seller_id=centromega",
    imageSourceLabel: "Foto do catálogo público · Centro Mega no Magalu",
    detail: "Bluetooth 5.0 · estojo de carregamento · item listado pelo seller Centro Mega",
    availabilityNote: "Preço e estoque são temporais e devem ser confirmados na oferta atual ou com a loja.",
    visual: "accessory",
    accent: "cyan",
  },
  {
    id: "suporte-celular-moto-bike-renux",
    name: "Suporte de celular para Moto & Bike · Renux",
    category: "Acessórios",
    eyebrow: "Catálogo público do seller Centro Mega",
    description:
      "Suporte para smartphone identificado em listagem pública do Magazine Luiza como vendido pela Centro Mega.",
    badge: "Achado tech",
    sourceType: "MARKETPLACE_SELLER",
    sourceLabel: "Magazine Luiza · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/suporte-de-celular-para-moto-e-bike-renux-5203/p/ea29ebff4b/te/spcl/",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790058263/centro-mega-suporte-renux-01.jpg",
    imageAlt: "Suporte de celular Renux 5203 anunciado pelo seller Centro Mega",
    imageSourceUrl:
      "https://www.magazineluiza.com.br/suporte-de-celular-para-moto-e-bike-renux-5203/p/ea29ebff4b/te/spcl/",
    imageSourceLabel: "Foto do catálogo público · Centro Mega no Magalu",
    gallery: [
      {
        url: "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790058263/centro-mega-suporte-renux-01.jpg",
        alt: "Suporte de celular Renux 5203",
        sourceUrl: "https://www.magazineluiza.com.br/suporte-de-celular-para-moto-e-bike-renux-5203/p/ea29ebff4b/te/spcl/",
      },
      {
        url: "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790058268/centro-mega-suporte-renux-02.jpg",
        alt: "Detalhe do suporte de celular Renux 5203",
        sourceUrl: "https://www.magazineluiza.com.br/suporte-de-celular-para-moto-e-bike-renux-5203/p/ea29ebff4b/te/spcl/",
      },
      {
        url: "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790058273/centro-mega-suporte-renux-03.jpg",
        alt: "Outro ângulo do suporte de celular Renux 5203",
        sourceUrl: "https://www.magazineluiza.com.br/suporte-de-celular-para-moto-e-bike-renux-5203/p/ea29ebff4b/te/spcl/",
      },
    ],
    detail: "Suporte para celular · Moto & Bike · Renux 5203",
    availabilityNote: "Preço e estoque são temporais e precisam ser conferidos na oferta atual.",
    visual: "accessory",
    accent: "amber",
  },
  {
    id: "poco-x5-pro-8-256",
    name: "Poco X5 Pro · 8GB / 256GB",
    category: "Celulares",
    eyebrow: "Oferta publicada pela Centro Mega",
    description:
      "Smartphone apresentado em publicação pública indexada da Centro Mega. Na loja virtual, o item funciona como produto real de referência da vitrine digital.",
    badge: "Post social verificado",
    sourceType: "PUBLIC_SOCIAL_POST",
    sourceLabel: "Publicação pública indexada da Centro Mega",
    sourceUrl:
      "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    sourceDate: "2024-01-25",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062389/centro-mega-poco-x5-pro-reference.jpg",
    imageAlt: "POCO X5 Pro 5G usado como referência visual do modelo publicado pela Centro Mega",
    imageSourceUrl:
      "https://www.olx.ro/electronice-si-electrocasnice/q-poco-x5/",
    imageSourceLabel: "Referência visual externa · produto publicado pela Centro Mega",
    historicalPrice: {
      before: "R$ 2.399,00",
      after: "R$ 1.899,00",
      label: "Preço exibido na postagem de 25/01/2024 — confirmar valor e estoque atuais",
    },
    detail: "8 GB de RAM · 256 GB de memória interna",
    availabilityNote: "Preço reproduzido apenas como histórico da publicação. Consulte valor e estoque atuais.",
    visual: "phone",
    accent: "cyan",
  },
  {
    id: "dunk-low-pro",
    name: "Tênis Dunk Low Pro",
    category: "Tênis",
    eyebrow: "Produto publicado pela Centro Mega",
    description:
      "Modelo de tênis divulgado em publicação pública indexada da marca. As postagens espelhadas mostram numerações diferentes, por isso a loja pede confirmação da grade atual.",
    badge: "Post social verificado",
    sourceType: "PUBLIC_SOCIAL_POST",
    sourceLabel: "Publicação pública indexada da Centro Mega",
    sourceUrl:
      "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
    sourceDate: "2023-11-08",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062368/centro-mega-dunk-low-pro-reference.png",
    imageAlt: "Nike SB Dunk Low Pro usado como referência visual do modelo publicado pela Centro Mega",
    imageSourceUrl:
      "https://chilangoskate.com/products/tenis-nike-sb-dunk-low-pro-white-and-black",
    imageSourceLabel: "Referência visual externa · modelo publicado pela Centro Mega",
    detail: "Numeração da postagem variava entre 34–39 e 34–43 · confirmar disponibilidade atual",
    availabilityNote: "Numeração, preço e estoque atuais precisam ser confirmados pela loja.",
    visual: "sneaker",
    accent: "violet",
  },
  {
    id: "controle-ps4-original-sony",
    name: "Controle PlayStation 4 · Sony",
    category: "Acessórios",
    eyebrow: "Catálogo público do seller Centro Mega",
    description:
      "Controle PlayStation 4 identificado em listagem pública do Magazine Luiza como vendido pela Centro Mega.",
    badge: "Gaming",
    sourceType: "MARKETPLACE_SELLER",
    sourceLabel: "Magazine Luiza · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/controle-play-station-4-original-sony/p/edb5ac0gd4/in/dcks/?seller_id=centromega",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062373/centro-mega-ps4-controller-reference.jpg",
    imageAlt: "Controle Sony DualShock 4 usado como referência visual do item vendido pela Centro Mega",
    imageSourceUrl:
      "https://www.zeusgames.com.br/manete-ps4-preta",
    imageSourceLabel: "Referência visual externa · item confirmado no seller Centro Mega",
    detail: "Controle PS4 Original Sony · listagem pública do seller Centro Mega",
    availabilityNote: "Preço, cor, garantia e estoque devem ser confirmados na oferta atual do marketplace ou com a loja.",
    visual: "accessory",
    accent: "violet",
  },
  {
    id: "bones-outlet",
    name: "Bonés · seleção Outlet",
    category: "Bonés",
    eyebrow: "Categoria da loja",
    description:
      "Categoria incluída a partir do mix informado pelo responsável da 0WEB para organizar novidades de giro rápido da Centro Mega.",
    badge: "Categoria dinâmica",
    sourceType: "OWNER_SUPPLIED_ASSORTMENT",
    sourceLabel: "Mix informado pelo responsável da 0WEB",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062624/centro-mega-bone-category-reference.webp",
    imageAlt: "Boné preto usado como referência visual da categoria Bonés da Centro Mega",
    imageSourceUrl:
      "https://www.tlaco.com.br/produtos/bone-dad-hat-preto-classico-1xmol/",
    imageSourceLabel: "Referência visual externa da categoria · não representa estoque atual",
    detail: "Modelos e cores entram conforme as postagens atuais da loja",
    availabilityNote: "Itens específicos, marcas, cores e valores dependem do estoque atual.",
    visual: "cap",
    accent: "lime",
  },
  {
    id: "calcados-outlet",
    name: "Calçados · oportunidades",
    category: "Calçados",
    eyebrow: "Categoria da loja",
    description:
      "Vitrine preparada para calçados e oportunidades de outlet que podem ser abastecidas conforme a publicação social da loja.",
    badge: "Categoria dinâmica",
    sourceType: "OWNER_SUPPLIED_ASSORTMENT",
    sourceLabel: "Mix informado pelo responsável da 0WEB",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062643/centro-mega-calcados-category-reference.jpg",
    imageAlt: "Tênis casual usado como referência visual da categoria Calçados da Centro Mega",
    imageSourceUrl:
      "https://www.lojasrenner.com.br/p/tenis-old-urban-star-os21-090-/-/A-7010704185132-br.lr",
    imageSourceLabel: "Referência visual externa da categoria · não representa estoque atual",
    detail: "Disponibilidade, tamanhos e preço sempre confirmados no atendimento",
    availabilityNote: "Categoria dinâmica; consulte modelos, tamanhos e estoque atuais.",
    visual: "shoe",
    accent: "amber",
  },
  {
    id: "bateria-controle-xbox-360",
    name: "Bateria + cabo para controle Xbox 360",
    category: "Acessórios",
    eyebrow: "Catálogo público do seller Centro Mega",
    description:
      "Bateria recarregável com cabo de 1,4 m identificada em listagem pública do Magazine Luiza como vendida pela Centro Mega.",
    badge: "Gaming",
    sourceType: "MARKETPLACE_SELLER",
    sourceLabel: "Magazine Luiza · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/bateria-para-controle-360-com-carregador-e-cabo-1-4m-lehmox/p/edbf2239e0/ga/otga/?seller_id=centromega",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062669/centro-mega-xbox360-battery-reference.jpg",
    imageAlt: "Bateria e cabo para controle Xbox 360 usados como referência visual do item vendido pela Centro Mega",
    imageSourceUrl:
      "https://www.rihappy.com.br/bateria-recarregavel---cabo-carregador-para-controle-wireless-de-xbox-360-12000mah-1002800430/p",
    imageSourceLabel: "Referência visual externa · item confirmado no seller Centro Mega",
    detail: "Bateria para controle Xbox 360 · cabo 1,4 m · item listado pelo seller Centro Mega",
    availabilityNote: "Preço, marca exata e estoque devem ser confirmados na oferta atual ou com a loja.",
    visual: "accessory",
    accent: "blue",
  },
  {
    id: "pilha-philips-2450mah-4",
    name: "Pilha recarregável Philips · 4x 2450mAh",
    category: "Outlet",
    eyebrow: "Achadinho do seller Centro Mega",
    description:
      "Kit com quatro pilhas recarregáveis Philips 2450mAh identificado em listagem pública do Magazine Luiza como vendido pela Centro Mega.",
    badge: "Achadinho tech",
    sourceType: "MARKETPLACE_SELLER",
    sourceLabel: "Magazine Luiza · seller Centro Mega",
    sourceUrl:
      "https://www.magazineluiza.com.br/pilha-recarregavel-philips-c-4-2450-mah/p/fd8k1dkaj6/me/ilha/?seller_id=centromega",
    imageUrl:
      "https://res.cloudinary.com/dqnwlodjs/image/upload/v1790062652/centro-mega-philips-aa-2450-reference.jpg",
    imageAlt: "Kit Philips MultiLife AA 2450mAh usado como referência visual do item vendido pela Centro Mega",
    imageSourceUrl:
      "https://itekcanada.com/products/philips_multilife_nimh_rechargeable_aa_batteries_2450mah_4pk_clamshell",
    imageSourceLabel: "Referência visual externa · item confirmado no seller Centro Mega",
    detail: "4 unidades · 2450mAh · item listado pelo seller Centro Mega",
    availabilityNote: "Preço e estoque devem ser confirmados na oferta atual ou com a loja.",
    visual: "outlet",
    accent: "pink",
  },
];

export const CENTRO_MEGA_SOCIAL_SOURCES = [
  {
    kind: "Instagram",
    label: "Perfil oficial @centro.mega",
    href: "https://www.instagram.com/centro.mega/",
  },
  {
    kind: "Instagram",
    label: "Reel público 01",
    href: "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/",
  },
  {
    kind: "Instagram",
    label: "Reel público 02",
    href: "https://www.instagram.com/centro.mega/reel/DHzjkeutEKu/",
  },
  {
    kind: "Instagram",
    label: "Post público 01",
    href: "https://www.instagram.com/centro.mega/p/DDPCypWxVZZ/",
  },
  {
    kind: "Instagram",
    label: "Post público 02",
    href: "https://www.instagram.com/centro.mega/p/DGjBSGIPSKO/",
  },
  {
    kind: "Instagram",
    label: "Post público 03",
    href: "https://www.instagram.com/centro.mega/p/DCt4G0HxLRu/",
  },
  {
    kind: "Facebook",
    label: "Página Centro Mega",
    href: "https://www.facebook.com/CentroMega.com.br/",
  },
] as const;


export const CENTRO_MEGA_SOCIAL_FEED = [
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
    description: "Canal oficial usado como fonte viva de novidades; produtos individuais só viram SKU quando o conteúdo puder ser validado.",
    href: "https://www.instagram.com/centro.mega/",
    date: undefined,
    status: "CANAL_OFICIAL",
  },
  {
    platform: "Instagram",
    title: "Publicações e Reels",
    description: "Links oficiais existentes continuam acessíveis como descoberta, sem inferir produto quando o post não pôde ser lido.",
    href: "https://www.instagram.com/centro.mega/reel/DV8haszkdOy/",
    date: undefined,
    status: "LINK_OFICIAL",
  },
] as const;

export const CENTRO_MEGA_STORE_SOURCES = {
  instagram: "https://www.instagram.com/centro.mega/",
  facebook: "https://www.facebook.com/CentroMega.com.br/",
  linktree: "https://linktr.ee/centro.mega",
  currentStore: "https://www.vhsys.net/centromega/contato/",
  indexedSocialMirror:
    "https://www.findglocal.com/BR/S%C3%A3o-Jos%C3%A9-dos-Pinhais/148646501973380/Centro-Mega",
  marketplaceSeller: "https://www.magazineluiza.com.br/lojista/centromega/",
} as const;
