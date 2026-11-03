/**
 * SEO individual planejado para Dona Garimpeira.
 *
 * Falha de forma segura: indexação e schema somente quando os gates de
 * publicação, funil e autorização estiverem aprovados.
 * Imagens são opcionais; não inventar horários, mídia nem dados comerciais.
 */
export const DONA_GARIMPEIRA_SEO = {
  slug: "dona-garimpeira-brecho",
  canonical: "https://0web.com.br/portfolio/dona-garimpeira-brecho",
  title: "Dona Garimpeira | Brechó no Boneca do Iguaçu, São José dos Pinhais",
  description:
    "Conheça a Dona Garimpeira, brechó em São José dos Pinhais. Roupas e acessórios de segunda mão. Visite a loja, consulte peças, venda ou doe roupas.",
  instagram: "https://www.instagram.com/donagarimpeirasjp/",
  business: "Dona Garimpeira",
  street: "Rua Loanda",
  number: "60",
  neighborhood: "Boneca do Iguaçu",
  city: "São José dos Pinhais",
  state: "PR",
  postalCode: "83040-170",
} as const;

export type DonaGarimpeiraSeoState = Readonly<{
  published: boolean;
  /** Caminho local existente e aprovado. Não usar foto de terceiros. */
  approvedSocialImage?: string | null;
  mediaApproved: boolean;
  /** Opt-in editorial: publicar sem fotos externas, sem fingir imagem aprovada. */
  approvedWithoutSocialImage?: boolean;
  funnelVerified: boolean;
  ownerApproved: boolean;
}>;

const SOCIAL_IMAGE_RE = /^\/images\/dona-garimpeira-brecho\/[a-z0-9][a-z0-9_-]*\.(?:webp|avif|jpg|jpeg|png|svg)$/;

export function donaGarimpeiraSeoReady(
  state: DonaGarimpeiraSeoState,
): boolean {
  const hasImage = typeof state.approvedSocialImage === "string";
  const mediaReady = hasImage
    ? state.mediaApproved && SOCIAL_IMAGE_RE.test(state.approvedSocialImage!)
    : state.approvedWithoutSocialImage === true && state.approvedSocialImage == null;
  return state.published &&
    state.funnelVerified &&
    state.ownerApproved &&
    mediaReady;
}

/**
 * Gera apenas os dados; o registro no head da rota exige gate aprovado.
 * Ausência de qualquer requisito devolve noindex/no social image por padrão.
 */
export function createDonaGarimpeiraSeo(state: DonaGarimpeiraSeoState) {
  const s = DONA_GARIMPEIRA_SEO;
  const ready = donaGarimpeiraSeoReady(state);
  const robots = ready
    ? "index,follow,max-image-preview:large,max-snippet:-1"
    : "noindex,nofollow,noarchive";
  const baseMeta = [
    { title: s.title },
    { name: "description", content: s.description },
    { name: "robots", content: robots },
  ];
  if (!ready) {
    return { ready: false as const, meta: baseMeta, links: [], scripts: [] };
  }

  // Sem imagens oficiais, não produzir OG:image nem afirmar mídia inexistente.
  const image = typeof state.approvedSocialImage === "string"
    ? new URL(state.approvedSocialImage, s.canonical).href
    : null;
  const storeId = s.canonical + "#store";
  const seoGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ClothingStore",
        "@id": storeId,
        name: s.business,
        url: s.canonical,
        description: s.description,
        ...(image ? { image } : {}),
        sameAs: [s.instagram],
        address: {
          "@type": "PostalAddress",
          streetAddress: s.street + ", " + s.number,
          addressLocality: s.city,
          addressRegion: s.state,
          postalCode: s.postalCode,
          addressCountry: "BR",
        },
        // Horário declarado no briefing autorizado; feriados podem variar.
        openingHoursSpecification: [{
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday", "Tuesday", "Wednesday", "Thursday",
            "Friday", "Saturday", "Sunday",
          ],
          opens: "09:00",
          closes: "18:00",
        }],
      },
      {
        "@type": "WebPage",
        "@id": s.canonical + "#webpage",
        url: s.canonical,
        name: s.title,
        description: s.description,
        mainEntity: { "@id": storeId },
        inLanguage: "pt-BR",
      },
      {
        "@type": "BreadcrumbList",
        "@id": s.canonical + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "0WEB", item: "https://0web.com.br/" },
          { "@type": "ListItem", position: 2, name: "Portfólio", item: "https://0web.com.br/portfolio" },
          { "@type": "ListItem", position: 3, name: s.business, item: s.canonical },
        ],
      },
    ],
  };
  return {
    ready: true as const,
    meta: [
      ...baseMeta,
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: s.business },
      { property: "og:title", content: s.title },
      { property: "og:description", content: s.description },
      { property: "og:url", content: s.canonical },
      ...(image ? [
        { property: "og:image", content: image },
        { property: "og:image:alt", content: "Identidade visual aprovada da Dona Garimpeira" },
      ] : []),
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: s.title },
      { name: "twitter:description", content: s.description },
      ...(image ? [{ name: "twitter:image", content: image }] : []),
    ],
    links: [{ rel: "canonical", href: s.canonical }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(seoGraph) }],
  };
}
